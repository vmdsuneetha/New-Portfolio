// Form handling for contact form

// Formspree integration
// Replace 'your-form-id' with your actual Formspree form ID
const FORMSPREE_URL = 'https://formspree.io/f/mnngzzek';

// Alternative: EmailJS integration (uncomment if using EmailJS)
// const EMAILJS_SERVICE_ID = 'your_service_id';
// const EMAILJS_TEMPLATE_ID = 'your_template_id';
// const EMAILJS_PUBLIC_KEY = 'your_public_key';

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        // Option 1: Formspree (recommended)
        await submitToFormspree(formData);
        
        // Option 2: EmailJS (uncomment if using EmailJS)
        // await submitToEmailJS(formData);
        
        // Option 3: Fallback to mailto (if both above fail)
        // fallbackToMailto(formData);
        
        showMessage('Message sent successfully!', 'success');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
        
        // Fallback to mailto
        fallbackToMailto(formData);
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Formspree submission
async function submitToFormspree(formData) {
    const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Formspree submission failed');
    }
    
    return response.json();
}

// EmailJS submission (alternative)
async function submitToEmailJS(formData) {
    // Ensure EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not loaded');
    }
    
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    return await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
    );
}

// Fallback to mailto
function fallbackToMailto(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    const mailtoLink = `mailto:suneethavinjamuri00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`)}`;
    
    // Show suggestion to use mailto
    showMessage('Form submission failed. You can <a href="' + mailtoLink + '" style="color: inherit; text-decoration: underline;">click here</a> to send an email directly.', 'info');
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.innerHTML = message;
    
    // Style the message
    messageElement.style.padding = '1rem';
    messageElement.style.borderRadius = 'var(--border-radius)';
    messageElement.style.marginTop = '1rem';
    messageElement.style.textAlign = 'center';
    messageElement.style.fontWeight = 'var(--font-medium)';
    
    switch (type) {
        case 'success':
            messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            messageElement.style.color = '#4caf50';
            messageElement.style.border = '1px solid #4caf50';
            break;
        case 'error':
            messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
            messageElement.style.color = '#f44336';
            messageElement.style.border = '1px solid #f44336';
            break;
        case 'info':
            messageElement.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
            messageElement.style.color = '#2196f3';
            messageElement.style.border = '1px solid #2196f3';
            break;
    }
    
    // Add to form
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(messageElement);
    
    // Remove message after 5 seconds (except for info messages)
    if (type !== 'info') {
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}