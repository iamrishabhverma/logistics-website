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
// Basic form validation feedback (optional)
document.querySelector('.quote-form').addEventListener('submit', function(e) {
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545'; // Red border for errors
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
    }
});