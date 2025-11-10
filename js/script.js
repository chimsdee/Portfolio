// Portfolio JavaScript - Professional Implementation

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  initializePortfolio();
});

// Portfolio Initialization
function initializePortfolio() {
  initializeTheme();
  initializeSmoothScroll();
  initializeFormHandling();
  initializeAnimations();
  initializeNavigation();
}

// Theme Management - FIXED VERSION
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Function to set theme
  function setTheme(theme) {
    // Remove both classes first
    body.classList.remove('light-mode', 'dark-mode');

    // Add the selected theme
    body.classList.add(theme);

    // Update toggle state
    themeToggle.checked = theme === 'dark-mode';

    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);
  }

  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Default to light mode
    setTheme('light-mode');
  }

  // Theme toggle event
  themeToggle.addEventListener('change', function () {
    if (this.checked) {
      setTheme('dark-mode');
    } else {
      setTheme('light-mode');
    }
  });
}

// Smooth Scrolling
function initializeSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Update active nav link
        updateActiveNavLink(targetId);
      }
    });
  });
}

// Update Active Navigation Link
function updateActiveNavLink(activeId) {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === activeId) {
      link.classList.add('active');
    }
  });
}

// Form Handling
function initializeFormHandling() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmission(this);
    });
  }
}

// Form Submission Handler
function handleFormSubmission(form) {
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Simulate form submission
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  // In a real application, you would send this to a server
  setTimeout(() => {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    form.reset();
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

  // Add styles for notification
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // Close button event
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => removeNotification(notification));
}

function removeNotification(notification) {
  notification.style.animation = 'slideOutRight 0.3s ease';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
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
  const animateElements = document.querySelectorAll('.skill-item, .project-card, .blog-card');
  animateElements.forEach(el => {
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
        .skill-item, .project-card, .blog-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
}

// Navigation Management
function initializeNavigation() {
  window.addEventListener('scroll', throttle(updateNavigationOnScroll, 100));

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}


function updateNavigationOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      updateActiveNavLink('#' + sectionId);
    }
  });
}


function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializePortfolio,
    initializeTheme,
    initializeSmoothScroll,
    handleFormSubmission
  };
}