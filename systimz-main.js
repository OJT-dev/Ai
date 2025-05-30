// Systimz LLC - Main JavaScript File

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleFormSubmission);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-item, .solution-card, .case-card');
    animateElements.forEach(el => observer.observe(el));

    // Counter animation for stats
    animateCounters();
});

// Open consultation form modal
function openConsultationForm(service = '') {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll to demo section
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    try {
        // Collect form data
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            industry: formData.get('industry'),
            project_size: formData.get('project_size'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            source: 'systimz_website'
        };
        // Send to your email endpoint (you'll need to set this up)
        const response = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showSuccessMessage();
            form.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage();
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="background: #10B981; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
            <h4>Thank you for your interest!</h4>
            <p>We'll contact you within 24 hours to schedule your personalized AI demonstration.</p>
        </div>
    `;
    const form = document.getElementById('consultationForm');
    form.parentNode.insertBefore(successMessage, form);
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Show error message
function showErrorMessage() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <div style="background: #EF4444; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
            <h4>Oops! Something went wrong.</h4>
            <p>Please try again or email us directly at info@aisystimz.com</p>
        </div>
    `;
    const form = document.getElementById('consultationForm');
    form.parentNode.insertBefore(errorMessage, form);
    // Remove message after 5 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isCurrency = target.includes('$');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        if (isNaN(numericValue)) return;
        let current = 0;
        const increment = numericValue / 50; // 50 steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            let displayValue = Math.floor(current);
            if (isPercentage) {
                displayValue += '%';
            } else if (isCurrency) {
                displayValue = '$' + displayValue + 'B';
            }
            counter.textContent = displayValue;
        }, 50);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
