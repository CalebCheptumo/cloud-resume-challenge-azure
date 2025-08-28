// Main JavaScript functionality for Cloud Resume Challenge
document.addEventListener("DOMContentLoaded", function () {
  // Initialize smooth scrolling
  initSmoothScrolling();
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
