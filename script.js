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




// Form handling for the Quote Form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quote-form');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Clear previous errors
        clearErrors();

        // Validate form
        if (!validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Prepare form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            // Send to Formspree (replace with your actual endpoint)
            const response = await fetch('https://formspree.io/f/your-form-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Quote request submitted successfully! We\'ll get back to you soon.');
                form.reset(); // Reset form
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            alert('Error submitting form. Please try again or contact us directly.');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Request Quote';
        }
    });

    // Validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        const radioGroups = ['trailer_type', 'commodity_type', 'stackable', 'load_type'];

        // Check text/number/select fields
        requiredFields.forEach(field => {
            if (!field.value.trim() || (field.type === 'number' && parseFloat(field.value) <= 0)) {
                highlightError(field);
                isValid = false;
            }
        });

        // Check radio groups (at least one selected)
        radioGroups.forEach(groupName => {
            const radios = form.querySelectorAll(`input[name="${groupName}"]`);
            const isChecked = Array.from(radios).some(radio => radio.checked);
            if (!isChecked) {
                // Highlight the first radio in the group
                highlightError(radios[0]);
                isValid = false;
            }
        });

        return isValid;
    }

    // Highlight error (red border)
    function highlightError(element) {
        element.style.borderColor = '#dc3545';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear all errors
    function clearErrors() {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '#ddd';
        });
    }

    // Optional: Clear errors on input change for better UX
    form.addEventListener('input', function(e) {
        if (e.target.style.borderColor === 'rgb(220, 53, 69)') { // Red
            e.target.style.borderColor = '#ddd';
        }
    });
});