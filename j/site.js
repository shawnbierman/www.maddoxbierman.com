/**
 * Maddox Bierman Website - Custom JavaScript Library
 * Handles all custom functionality including gallery, theme toggle, and other interactions
 */

(function () {
  "use strict";

  /**
   * Static Gallery Loading
   * Hard-coded gallery images for reliable loading across all browsers
   */
  function loadGalleryImages() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) {
      console.error("Gallery grid element not found");
      return;
    }

    // Hard-coded image list
    const imageFiles = [
      "maddoxbierman1.jpg",
      "maddoxbierman2.jpg",
      "maddoxbierman3.jpg",
      "maddoxbierman4.jpg",
      "maddoxbierman5.jpg",
      "maddoxbierman6.jpg",
      "maddoxbierman7.jpg",
      "maddoxbierman8.jpg",
      "maddoxbierman9.jpg",
    ];

    // Create gallery items with varied sizes for mosaic layout
    const sizeClasses = ["large", "medium", "small", "wide", "tall"];

    imageFiles.forEach((filename, index) => {
      const galleryItem = document.createElement("div");
      const sizeClass = sizeClasses[index % sizeClasses.length];
      galleryItem.className = `gallery-item ${sizeClass}`;

      const img = document.createElement("img");
      img.src = `i/${filename}`;
      img.alt = "Maddox Bierman Performance";
      img.loading = "lazy";

      const link = document.createElement("a");
      link.href = `i/${filename}`;
      link.setAttribute("data-pswp-width", "800");
      link.setAttribute("data-pswp-height", "1200");
      link.setAttribute("target", "_blank");
      link.appendChild(img);

      galleryItem.appendChild(link);
      galleryGrid.appendChild(galleryItem);
    });

    console.log(`Loaded ${imageFiles.length} images into gallery`);
  }

  /**
   * PhotoSwipe Gallery Functionality
   * Initializes lightbox gallery for performance images
   */
  function initPhotoSwipeGallery() {
    const galleryGrid = document.getElementById("gallery-grid");

    if (galleryGrid && window.PhotoSwipe) {
      galleryGrid.addEventListener("click", (e) => {
        e.preventDefault();

        const clickedLink = e.target.closest("a");
        if (!clickedLink) return;

        const allLinks = Array.from(galleryGrid.querySelectorAll("a"));
        const index = allLinks.indexOf(clickedLink);

        const dataSource = allLinks.map((link) => ({
          src: link.href,
          width: parseInt(link.dataset.pswpWidth) || 800,
          height: parseInt(link.dataset.pswpHeight) || 1200,
          alt: link.querySelector("img").alt,
        }));

        const lightbox = new window.PhotoSwipe({
          dataSource,
          index,
          showHideAnimationType: "zoom",
          bgOpacity: 0.9,
          padding: { top: 20, bottom: 40, left: 100, right: 100 },
        });

        lightbox.init();
      });
    } else if (galleryGrid) {
      // Retry after a short delay if PhotoSwipe isn't loaded yet
      setTimeout(() => initPhotoSwipeGallery(), 100);
    }
  }

  /**
   * Theme Toggle Functionality
   * Handles light/dark mode switching
   */
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    function setTheme(theme) {
      root.setAttribute("data-bs-theme", theme);
    }

    // Set initial theme based on user preference
    setTheme(prefersDark.matches ? "dark" : "light");

    // Handle manual theme toggle
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const current = root.getAttribute("data-bs-theme");
        const next = current === "light" ? "dark" : "light";
        setTheme(next);
      });
    }

    // Handle system theme changes
    prefersDark.addEventListener("change", (e) => {
      setTheme(e.matches ? "dark" : "light");
    });
  }

  /**
   * Smooth Scrolling for Navigation Links
   * Enhances navigation experience between sections
   */
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    loadGalleryImages(); // Load gallery images first
    initPhotoSwipeGallery(); // Then initialize PhotoSwipe
    initThemeToggle();
    initSmoothScrolling();
  }

  // Initialize when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
