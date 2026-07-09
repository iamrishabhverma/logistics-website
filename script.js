// --- DIMENSION & DENSITY CALCULATION (unit-aware, quantity-aware) ---

const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const dimUnitInput = document.getElementById('dim_unit');
const quantityInput = document.getElementById('quantity');
const cubeInput = document.getElementById('cube');
const densityDisplayInput = document.getElementById('density_display');
const densityHiddenInput = document.getElementById('density'); // raw lb/ft³, read by quote pricing logic

const IN3_TO_FT3 = 1 / 1728;       // 12³ = 1728 in³ per ft³
const FT3_TO_M3 = 0.0283168;       // 1 ft³ = 0.0283168 m³
const LBFT3_TO_KGM3 = 16.018463;   // 1 lb/ft³ = 16.018463 kg/m³

function calculateMetrics() {
    const L = parseFloat(lengthInput.value);
    const W = parseFloat(widthInput.value);
    const H = parseFloat(heightInput.value);
    const Wt = parseFloat(weightInput.value);
    const unit = dimUnitInput ? dimUnitInput.value : 'ft';
    const qty = parseFloat(quantityInput ? quantityInput.value : 1) || 1;

    if (!(L > 0 && W > 0 && H > 0)) {
        cubeInput.value = '';
        densityDisplayInput.value = '';
        densityHiddenInput.value = '';
        return;
    }

    // Single-piece cube in ft³, converting from inches if needed
    const unitCubeFt3 = unit === 'in' ? (L * W * H) * IN3_TO_FT3 : (L * W * H);
    const totalCubeFt3 = unitCubeFt3 * qty;
    const totalCubeM3 = totalCubeFt3 * FT3_TO_M3;

    cubeInput.value = `${totalCubeFt3.toFixed(3)} ft³ | ${totalCubeM3.toFixed(3)} m³`;

    if (Wt > 0 && totalCubeFt3 > 0) {
        const densityLbFt3 = Wt / totalCubeFt3;
        const densityKgM3 = densityLbFt3 * LBFT3_TO_KGM3;

        densityDisplayInput.value = `${densityLbFt3.toFixed(2)} lb/ft³ | ${densityKgM3.toFixed(2)} kg/m³`;
        densityHiddenInput.value = densityLbFt3.toFixed(2); // consumed by quote pricing logic below
    } else {
        densityDisplayInput.value = '';
        densityHiddenInput.value = '';
    }
}

[lengthInput, widthInput, heightInput, weightInput, dimUnitInput, quantityInput].forEach(input => {
    if (input) {
        input.addEventListener('input', calculateMetrics);
        input.addEventListener('change', calculateMetrics); // covers the <select> dropdown
    }
});

// --- FREIGHT RATE CALCULATION LOGIC (loaded from rates.csv via fetch) ---

let rateData = [];
let rateDataLoaded = false;

/**
 * Fetches and parses rates.csv on page load.
 * Runs once; cached in memory for the session (no repeated network calls per quote).
 */
async function loadRateData() {
    try {
        const response = await fetch('rates.csv', { cache: 'no-store' });
        // cache: 'no-store' avoids stale CloudFront edge cache issues during rate updates;
        // remove this if you set up proper cache invalidation on deploy (see notes)

        if (!response.ok) {
            throw new Error(`Failed to fetch rates.csv: ${response.status}`);
        }

        const csvText = await response.text();
        rateData = parseCSV(csvText);
        rateDataLoaded = true;
    } catch (err) {
        console.error('Rate data failed to load:', err);
        rateDataLoaded = false;
        showRateLoadError();
    }
}

/**
 * Minimal, dependency-free CSV parser.
 * Sufficient for this simple, comma-only, no-quoted-fields rate file.
 * If rates.csv ever needs quoted fields, switch to PapaParse via CDN instead.
 */
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const numericFields = ['base_rate', 'per_km', 'fuel_surcharge'];

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, i) => {
            const raw = values[i];
            row[header] = numericFields.includes(header) ? parseFloat(raw) : raw.toUpperCase();
        });
        return row;
    });
}

function showRateLoadError() {
    const quoteResultDiv = document.getElementById('quote-result');
    if (quoteResultDiv) {
        quoteResultDiv.style.display = 'block';
        quoteResultDiv.style.border = '2px solid #dc3545';
        quoteResultDiv.innerHTML = '<p>Rate data is temporarily unavailable. Please try again shortly or contact us directly for a quote.</p>';
    }
}

loadRateData();

// --- PRICING FACTORS ---
// Based on standard NMFC freight classification principles: density, stowability
// (stackability), handling (trailer/load type), and liability (commodity risk).
// These are demo-reasonable multipliers, not a live carrier tariff.

// Freight class multiplier: lower class = denser = cheaper to ship (NMFC convention).
// Class 50 (very dense) is baseline; class 100 (least dense) costs the most per unit.
const CLASS_MULTIPLIERS = {
    '50': 1.00, '55': 1.04, '60': 1.08, '65': 1.12, '70': 1.16,
    '77.5': 1.21, '85': 1.27, '92.5': 1.33, '100': 1.40
};

// Density surcharge: freight below ~6 lbs/ft³ is considered low-density in LTL
// pricing — it takes up trailer space disproportionate to its weight.
const LOW_DENSITY_THRESHOLD = 6; // lbs/ft³
const LOW_DENSITY_SURCHARGE = 0.15; // +15%

// Non-stackable freight can't share vertical trailer space with other shipments.
const NON_STACKABLE_SURCHARGE = 0.10; // +10%

// HazMat requires special handling, documentation, and driver certification.
const HAZMAT_SURCHARGE = 0.20; // +20%

// LTL shares trailer space across multiple shippers — higher relative cost per unit
// than a Full Load, which uses the whole trailer for one shipment.
const LTL_SURCHARGE = 0.18; // +18%

// B-train pulls two trailers and requires specialized equipment/licensing vs a
// standard triaxle flatbed.
const TRAILER_TYPE_MULTIPLIER = { 'B-TRAIN': 1.12, 'TRIAXLE': 1.00 };

function getSelectedRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value.toUpperCase() : null;
}

const calculateBtn = document.getElementById('calculate-btn');
const quoteResultDiv = document.getElementById('quote-result');
const totalCostSpan = document.getElementById('total-cost');
const quoteDetailsP = document.getElementById('quote-details');

if (calculateBtn) {
    calculateBtn.addEventListener('click', function (e) {

        if (!rateDataLoaded) {
            alert('Rate data is still loading. Please wait a moment and try again.');
            return;
        }

        const originProvince = document.getElementById('origin_province').value.toUpperCase().trim();
        const destinationProvince = document.getElementById('destination_province').value.toUpperCase().trim();
        const distanceKm = parseFloat(document.getElementById('distance_km').value);
        const freightClass = document.getElementById('class').value;
        const density = parseFloat(document.getElementById('density').value);
        const commodityType = getSelectedRadioValue('commodity_type');
        const stackable = getSelectedRadioValue('stackable');
        const loadType = getSelectedRadioValue('load_type');
        const trailerType = getSelectedRadioValue('trailer_type');

        if (isNaN(distanceKm) || distanceKm <= 0 || !originProvince || !destinationProvince) {
            alert('Please fill in Origin/Destination Province and a positive Distance (km) to get an estimate.');
            quoteResultDiv.style.display = 'none';
            return;
        }
        if (!freightClass || isNaN(density)) {
            alert('Please provide dimensions/weight (to calculate density) and select a Freight Class.');
            quoteResultDiv.style.display = 'none';
            return;
        }

        const routeRate = rateData.find(route =>
            route.origin_province === originProvince &&
            route.destination_province === destinationProvince
        );

        if (!routeRate) {
            quoteResultDiv.style.display = 'block';
            totalCostSpan.textContent = 'N/A';
            quoteDetailsP.innerHTML = `No published rate found for the route <strong>${originProvince} to ${destinationProvince}</strong>. Please contact us for a custom quote.`;
            quoteResultDiv.style.border = '2px solid #dc3545';
            return;
        }

        const { base_rate, per_km, fuel_surcharge } = routeRate;

        // 1. Base distance-based cost
        const variableCost = distanceKm * per_km;
        let subtotal = base_rate + variableCost;

        // 2. Fuel surcharge (applied to base + distance cost)
        const fuelSurchargeAmount = subtotal * fuel_surcharge;
        subtotal += fuelSurchargeAmount;

        // 3. Freight class multiplier (density/handling classification)
        const classMultiplier = CLASS_MULTIPLIERS[freightClass] || 1.0;
        subtotal *= classMultiplier;

        // 4. Low-density surcharge (independent of class — penalizes wasted trailer space)
        let densitySurchargeAmount = 0;
        if (density > 0 && density < LOW_DENSITY_THRESHOLD) {
            densitySurchargeAmount = subtotal * LOW_DENSITY_SURCHARGE;
            subtotal += densitySurchargeAmount;
        }

        // 5. Stackability
        let stackSurchargeAmount = 0;
        if (stackable === 'NO') {
            stackSurchargeAmount = subtotal * NON_STACKABLE_SURCHARGE;
            subtotal += stackSurchargeAmount;
        }

        // 6. HazMat handling
        let hazmatSurchargeAmount = 0;
        if (commodityType === 'HAZMAT') {
            hazmatSurchargeAmount = subtotal * HAZMAT_SURCHARGE;
            subtotal += hazmatSurchargeAmount;
        }

        // 7. LTL vs Full Load
        let ltlSurchargeAmount = 0;
        if (loadType === 'LTL') {
            ltlSurchargeAmount = subtotal * LTL_SURCHARGE;
            subtotal += ltlSurchargeAmount;
        }

        // 8. Trailer type
        const trailerMultiplier = TRAILER_TYPE_MULTIPLIER[trailerType] || 1.0;
        subtotal *= trailerMultiplier;

        const finalRate = subtotal;

        quoteResultDiv.style.display = 'block';
        totalCostSpan.textContent = finalRate.toFixed(2);
        quoteDetailsP.innerHTML = `
            Route: ${originProvince} to ${destinationProvince} (${distanceKm} km) | Class ${freightClass} | Density: ${density.toFixed(2)} lbs/ft³<br>
            Base + Fuel: $${(base_rate + variableCost + fuelSurchargeAmount).toFixed(2)} → after Class ${classMultiplier}x
            ${densitySurchargeAmount ? ` | +Low-Density: $${densitySurchargeAmount.toFixed(2)}` : ''}
            ${stackSurchargeAmount ? ` | +Non-Stackable: $${stackSurchargeAmount.toFixed(2)}` : ''}
            ${hazmatSurchargeAmount ? ` | +HazMat: $${hazmatSurchargeAmount.toFixed(2)}` : ''}
            ${ltlSurchargeAmount ? ` | +LTL: $${ltlSurchargeAmount.toFixed(2)}` : ''}
            | Trailer (${trailerType}): ${trailerMultiplier}x
        `;
        quoteResultDiv.style.border = '2px solid #28a745';
    });
}