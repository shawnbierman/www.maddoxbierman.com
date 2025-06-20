/**
 * Maddox Bierman Website - Custom JavaScript Library
 * Handles all custom functionality including gallery, theme toggle, and other interactions
 */

(function() {
  'use strict';

  /**
   * PhotoSwipe Gallery Functionality
   * Initializes lightbox gallery for performance images
   */
  function initPhotoSwipeGallery() {
    const galleryGrid = document.getElementById('gallery-grid');

    if (galleryGrid) {
      galleryGrid.addEventListener('click', (e) => {
        e.preventDefault();

        const clickedLink = e.target.closest('a');
        if (!clickedLink) return;

        const allLinks = Array.from(galleryGrid.querySelectorAll('a'));
        const index = allLinks.indexOf(clickedLink);

        const dataSource = allLinks.map(link => ({
          src: link.href,
          width: parseInt(link.dataset.pswpWidth) || 800,
          height: parseInt(link.dataset.pswpHeight) || 1200,
          alt: link.querySelector('img').alt
        }));

        const lightbox = new PhotoSwipe({
          dataSource,
          index,
          showHideAnimationType: 'zoom',
          bgOpacity: 0.9,
          padding: { top: 20, bottom: 40, left: 100, right: 100 }
        });

        lightbox.init();
      });
    }
  }

  /**
   * Theme Toggle Functionality
   * Handles light/dark mode switching
   */
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(theme) {
      root.setAttribute('data-bs-theme', theme);
    }

    // Set initial theme based on user preference
    setTheme(prefersDark.matches ? 'dark' : 'light');

    // Handle manual theme toggle
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = root.getAttribute('data-bs-theme');
        const next = current === 'light' ? 'dark' : 'light';
        setTheme(next);
      });
    }

    // Handle system theme changes
    prefersDark.addEventListener('change', (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    });
  }

  /**
   * Smooth Scrolling for Navigation Links
   * Enhances navigation experience between sections
   */
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    initPhotoSwipeGallery();
    initThemeToggle();
    initSmoothScrolling();
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
