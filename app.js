// Navigation and Page Management
class WebsiteApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupFormValidation();
        this.showPage('home');
    }

    // Navigation Setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('[data-page]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
                this.closeMobileMenu();
            });
        });
    }

    // Show specific page
    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation active state
        this.updateNavActiveState(pageId);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update navigation active state
    updateNavActiveState(activePageId) {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePageId) {
                link.classList.add('active');
            }
        });
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

        // Form Validation Setup
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                // Validate form first
                const isValid = this.validateFormBeforeSubmit(form);
                
                // Only prevent submission if validation fails
                if (!isValid) {
                    e.preventDefault();
                }
                // If valid, let the form submit naturally to FormSubmit
            });
    
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
    }
    
    // Validate form before submission (returns true/false)
    validateFormBeforeSubmit(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
    
        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
    
        // Focus on first error field if validation fails
        if (!isValid) {
            const firstError = form.querySelector('.form__error:not(:empty)');
            if (firstError) {
                const errorField = firstError.id.replace('Error', '');
                const field = document.getElementById(errorField);
                if (field) {
                    field.focus();
                }
            }
        }
    
        return isValid;
    }
    
    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let errorMessage = '';
    
        // Clear previous error
        this.clearFieldError(field);
    
        // Required field validation
        if (field.required && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        } else if (value) {
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                case 'phone':
                    if (!this.isValidPhone(value)) {
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Please provide more details (at least 10 characters).';
                    }
                    break;
            }
        }
    
        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        }
        return true;
    }
    
    // Show field error
    showFieldError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            field.style.borderColor = '#dc3545';
        }
    }
    
    // Clear field error
    clearFieldError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            field.style.borderColor = '';
        }
    }
    
    // Get field label
    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Full Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'service': 'Service Type',
            'message': 'Project Details'
        };
        return labels[fieldName] || fieldName;
    }
    
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }


    // Handle form submission
    handleFormSubmission(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.submitForm(form);
        } else {
            // Focus on first error field
            const firstError = form.querySelector('.form__error:not(:empty)');
            if (firstError) {
                const errorField = firstError.id.replace('Error', '');
                const field = document.getElementById(errorField);
                if (field) {
                    field.focus();
                }
            }
        }
    }

    // Submit form (simulation)
    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.classList.add('btn--loading');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            const successElement = document.getElementById('formSuccess');
            if (successElement) {
                successElement.style.display = 'block';
            }

            // Reset form after a delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                if (successElement) {
                    successElement.style.display = 'none';
                }
                
                // Reset button state
                submitBtn.classList.remove('btn--loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 5000);
        }, 2000);
    }
}

// Initialize the website app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteApp();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service__card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add click effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Simple click effect - could be expanded to show modal
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        });
    });
});
