// Main navigation function
function redirectToForm(studentType) {
    switch(studentType) {
        case 'new':
            window.location.href = 'new-student.html';
            break;
        case 'old':
            window.location.href = 'old-student.html';
            break;
        case 'transferee':
            window.location.href = 'transferee-student.html';
            break;
        default:
            console.error('Invalid student type');
    }
}

// Form validation and submission
function submitForm(formType) {
    const form = document.getElementById(formType + 'Form');
    const formData = new FormData(form);
    
    // Validate required fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#FF5252';
            isValid = false;
        } else {
            field.style.borderColor = '#E0E0E0';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Store form data in localStorage
    const studentData = {};
    for (let [key, value] of formData.entries()) {
        studentData[key] = value;
    }
    studentData.studentType = formType;
    
    localStorage.setItem('studentData', JSON.stringify(studentData));
    
    // Redirect to result page
    window.location.href = 'result.html';
}

// Display result data
function displayResult() {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    if (!studentData) {
        window.location.href = 'index.html';
        return;
    }
    
    const infoContainer = document.getElementById('studentInfo');
    const studentTypeTitle = document.getElementById('studentType');
    
    // Set student type title
    const typeMap = {
        'new': 'New Student',
        'old': 'Returning Student',
        'transferee': 'Transfer Student'
    };
    studentTypeTitle.textContent = typeMap[studentData.studentType] || 'Student';
    
    // Clear existing content
    infoContainer.innerHTML = '';
    
    // Display data based on student type
    const fieldsToDisplay = getFieldsForType(studentData.studentType);
    
    fieldsToDisplay.forEach(field => {
        if (studentData[field.key]) {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.innerHTML = `
                <span class="info-label">${field.label}:</span>
                <span class="info-value">${studentData[field.key]}</span>
            `;
            infoContainer.appendChild(infoItem);
        }
    });
}

// Get fields to display based on student type
function getFieldsForType(studentType) {
    const fieldMaps = {
        'new': [
            { key: 'name', label: 'Full Name' },
            { key: 'age', label: 'Age' },
            { key: 'address', label: 'Address' },
            { key: 'birthday', label: 'Birthday' },
            { key: 'nationality', label: 'Nationality' }
        ],
        'old': [
            { key: 'name', label: 'Full Name' },
            { key: 'studentId', label: 'Student ID' }
        ],
        'transferee': [
            { key: 'name', label: 'Full Name' },
            { key: 'age', label: 'Age' },
            { key: 'address', label: 'Address' },
            { key: 'birthday', label: 'Birthday' },
            { key: 'nationality', label: 'Nationality' },
            { key: 'lastSchool', label: 'Last School Attended' }
        ]
    };
    
    return fieldMaps[studentType] || [];
}

// Clear stored data and go back to home
function goHome() {
    localStorage.removeItem('studentData');
    window.location.href = 'index.html';
}

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', function() {
    // If on result page, display the results
    if (window.location.pathname.includes('result.html')) {
        displayResult();
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link to the same page or to index.html sections
            if (href.startsWith('#') || href.includes('index.html#')) {
                e.preventDefault();
                const targetId = href.substring(href.indexOf('#') + 1);
                
                // If on a different page, navigate and then scroll
                if (!window.location.pathname.endsWith('index.html') && href.includes('index.html#')){
                    window.location.href = href;
                    // Scrolling will be handled by the DOMContentLoaded on the target page if needed
                    // Or, if we want to ensure scrolling after redirect, it might need a more complex solution
                    // like passing a parameter or using localStorage to trigger scroll on load.
                } else if (document.getElementById(targetId)) { // If on the same page
                    document.getElementById(targetId).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                 // Close mobile menu if open
                const menu = document.querySelector('.nav-menu');
                if (menu.classList.contains('nav-menu-mobile-active')) {
                    menu.classList.remove('nav-menu-mobile-active');
                }
            }
        });
    });
    
    // Add form validation on input
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.borderColor = '#E0E0E0';
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }
});

// Handle contact form submission
function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const contactData = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }
    
    // Validate required fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#FF5252';
            field.style.boxShadow = '0 0 0 3px rgba(255, 82, 82, 0.2)';
            isValid = false;
        } else {
            field.style.borderColor = '#328363';
            field.style.boxShadow = '0 0 0 3px rgba(50, 131, 99, 0.2)';
        }
    });
    
    if (!isValid) {
        // Show error message
        showContactMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('.contact-submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Show success message
        showContactMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset field styles
        requiredFields.forEach(field => {
            field.style.borderColor = '#D0D0D0';
            field.style.boxShadow = 'none';
        });
        
        console.log('Contact form submitted:', contactData);
    }, 2000);
}

// Show contact form messages
function showContactMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message contact-message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        ${type === 'success' ? 'background: linear-gradient(45deg, #4CAF50, #45a049);' : 'background: linear-gradient(45deg, #f44336, #d32f2f);'}
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Add smooth scroll handling for hash navigation after page load
window.addEventListener('load', function() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Small delay to ensure page is fully rendered
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// Add scroll animations for about and contact sections
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-card, .feature-card, .contact-card, .about-story, .about-mission');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    addScrollAnimations();
});

// Toggle mobile navigation menu
function toggleMobileMenu() {
    const menu = document.querySelector('.nav-menu');
    const hamburgerIcon = document.querySelector('.hamburger-menu');
    menu.classList.toggle('nav-menu-mobile-active');
    hamburgerIcon.classList.toggle('active'); // For X shape toggle
}

// Handle key press for hamburger menu accessibility
function handleHamburgerKeyPress(event) {
    // Check if the pressed key is Enter (key code 13) or Space (key code 32)
    if (event.keyCode === 13 || event.keyCode === 32) {
        toggleMobileMenu();
    }
}