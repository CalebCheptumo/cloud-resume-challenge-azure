// Main JavaScript functionality for Cloud Resume Challenge
document.addEventListener("DOMContentLoaded", function () {
  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize contact form
  initContactForm();
});

/**
 * Smooth Scrolling for Navigation Links
 * Provides smooth scrolling behavior when clicking navigation buttons
 */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll("nav button[data-section]");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get section ID from the data-section attribute
      const sectionId = this.getAttribute("data-section");

      if (sectionId) {
        scrollToSection(sectionId);
      }
    });
  });
}

/**
 * Scroll to Section Function
 * Handles smooth scrolling to target sections
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Approximate header height
    const elementPosition = element.offsetTop - headerHeight;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
}

/**
 * Contact Form Functionality
 * Handles form submission, validation, and user feedback
 */
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    // Form state variables
    let isSubmitting = false;
    let isSubmitted = false;
    let error = "";

    // Handle form submission
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (isSubmitting) return; // Prevent double submission

      isSubmitting = true;
      error = "";

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Basic validation
      if (!name || !email || !message) {
        error = "Please fill in all fields.";
        showFormError(error);
        isSubmitting = false;
        return;
      }

      if (!isValidEmail(email)) {
        error = "Please enter a valid email address.";
        showFormError(error);
        isSubmitting = false;
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector(".submit-btn");
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Send email using EmailJS
      const templateParams = {
        name: name,
        email: email,
        message: message,
      };

      // Get EmailJS configuration from config file
      const EMAILJS_SERVICE_ID = window.EMAILJS_CONFIG.SERVICE_ID;
      const EMAILJS_TEMPLATE_ID = window.EMAILJS_CONFIG.TEMPLATE_ID;
      const EMAILJS_PUBLIC_KEY = window.EMAILJS_CONFIG.PUBLIC_KEY;

      // Check if EmailJS is configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        error =
          "Email service not configured. Please contact the administrator.";
        showFormError(error);
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
        isSubmitting = false;
        return;
      }

      try {
        // Send email using EmailJS
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        if (result.status === 200) {
          // Reset form
          this.reset();

          // Show success state
          showSuccessState();

          isSubmitting = false;
          isSubmitted = true;
        } else {
          throw new Error("Failed to send message");
        }
      } catch (err) {
        console.error("EmailJS Error:", err);
        error =
          "Failed to send message. Please try again or email directly at kibusia@calebcheptumo.com";
        showFormError(error);
      } finally {
        // Reset button
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
        isSubmitting = false;
      }
    });
  }
}

/**
 * Email Validation Helper
 * Checks if email format is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show Form Error
 * Displays error message above the form
 */
function showFormError(errorMessage) {
  // Remove existing error messages
  const existingError = document.querySelector(".form-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error element
  const errorDiv = document.createElement("div");
  errorDiv.className = "form-error";
  errorDiv.innerHTML = `
    <div class="p-4 bg-red-900 border border-red-700 rounded-lg">
      <p class="text-red-200 text-sm">${errorMessage}</p>
    </div>
  `;

  // Insert error before the form
  const contactForm = document.querySelector(".contact-form");
  contactForm.parentNode.insertBefore(errorDiv, contactForm);
}

/**
 * Show Success State
 * Displays success message with icon
 */
function showSuccessState() {
  const contactForm = document.querySelector(".contact-form");
  const formContainer = contactForm.closest(".contact-form-container");

  // Hide the form
  contactForm.style.display = "none";

  // Create success message
  const successDiv = document.createElement("div");
  successDiv.className = "text-center py-8";
  successDiv.innerHTML = `
    <div class="inline-flex items-center gap-3 p-6 bg-green-900 rounded-xl border border-green-700">
      <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <h4 class="text-lg font-semibold text-white mb-1">Message Sent Successfully!</h4>
        <p class="text-green-200">Thank you for reaching out. I'll get back to you within 24 hours.</p>
      </div>
    </div>
  `;

  // Insert success message
  formContainer.appendChild(successDiv);
}
