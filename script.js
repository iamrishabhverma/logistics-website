// Initialize AOS animations
AOS.init({
    duration: 1000,
    once: true
});

// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// --- DIMENSION & DENSITY CALCULATION LOGIC ---

const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const cubeInput = document.getElementById('cube');
const densityInput = document.getElementById('density');

/**
 * Calculates Cube (Volume) and Density based on L, W, H, and Weight inputs.
 */
function calculateMetrics() {
    const L = parseFloat(lengthInput.value);
    const W = parseFloat(widthInput.value);
    const H = parseFloat(heightInput.value);
    const Wt = parseFloat(weightInput.value);

    // 1. Calculate Cube (Volume in ft³)
    if (L > 0 && W > 0 && H > 0) {
        const cube = L * W * H;
        cubeInput.value = cube.toFixed(2);

        // 2. Calculate Density (lbs/ft³)
        if (Wt > 0) {
            const density = Wt / cube;
            densityInput.value = density.toFixed(2);
        } else {
            densityInput.value = '';
        }
    } else {
        cubeInput.value = '';
        densityInput.value = '';
    }
}

// Add event listeners to trigger calculation on input change for all relevant fields
[lengthInput, widthInput, heightInput, weightInput].forEach(input => {
    if (input) {
        input.addEventListener('input', calculateMetrics);
    }
});


// --- FREIGHT RATE CALCULATION LOGIC (from rates.csv) ---

// 1. Data structure from rates.csv
const rateData = [
    { origin_province: 'ON', destination_province: 'QC', base_rate: 150, per_km: 1.25, fuel_surcharge: 0.12 },
    { origin_province: 'ON', destination_province: 'AB', base_rate: 300, per_km: 2.1, fuel_surcharge: 0.15 },
    { origin_province: 'QC', destination_province: 'ON', base_rate: 150, per_km: 1.3, fuel_surcharge: 0.12 },
    { origin_province: 'BC', destination_province: 'ON', base_rate: 400, per_km: 2.25, fuel_surcharge: 0.16 },
];

const calculateBtn = document.getElementById('calculate-btn');
const quoteResultDiv = document.getElementById('quote-result');
const totalCostSpan = document.getElementById('total-cost');
const quoteDetailsP = document.getElementById('quote-details');
const quoteForm = document.getElementById('quote-form');

if (calculateBtn) {
    calculateBtn.addEventListener('click', function(e) {
        
        // 1. Get Required Inputs for Calculation
        const originProvince = document.getElementById('origin_province').value.toUpperCase().trim();
        const destinationProvince = document.getElementById('destination_province').value.toUpperCase().trim();
        const distanceKm = parseFloat(document.getElementById('distance_km').value);

        // Simple validation check for calculation inputs
        if (isNaN(distanceKm) || distanceKm <= 0 || !originProvince || !destinationProvince) {
            alert('Please fill in Origin/Destination Province and a positive Distance (km) to get an estimate.');
            quoteResultDiv.style.display = 'none';
            return;
        }

        // 2. Find the matching rate
        const routeRate = rateData.find(route => 
            route.origin_province === originProvince && 
            route.destination_province === destinationProvince
        );

        if (routeRate) {
            const { base_rate, per_km, fuel_surcharge } = routeRate;

            // Calculation: Total Rate = Base Rate + (Distance * Per KM) * (1 + Fuel Surcharge)
            const variableCost = distanceKm * per_km;
            const subtotal = base_rate + variableCost;
            const fuelSurchargeAmount = subtotal * fuel_surcharge;
            const finalRate = subtotal + fuelSurchargeAmount;

            // 3. Display the result
            quoteResultDiv.style.display = 'block';
            totalCostSpan.textContent = finalRate.toFixed(2);
            quoteDetailsP.innerHTML = `
                Route: ${originProvince} to ${destinationProvince} (Distance: ${distanceKm} km)<br>
                Base Charge: \$${base_rate.toFixed(2)} | Fuel Surcharge (${(fuel_surcharge * 100).toFixed(0)}%): \$${fuelSurchargeAmount.toFixed(2)}
            `;
            
            // Highlight the result
            quoteResultDiv.style.border = '2px solid #28a745'; // Green border for success

        } else {
            // Display error if route is not found
            quoteResultDiv.style.display = 'block';
            totalCostSpan.textContent = 'N/A';
            quoteDetailsP.innerHTML = `
                Error: No published rate found for the route **${originProvince} to ${destinationProvince}**. Please contact us for a custom quote.
            `;
            quoteResultDiv.style.border = '2px solid #dc3545'; // Red border for error
        }
    });
}