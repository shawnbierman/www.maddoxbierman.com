/**
 * Maddox Bierman Website - Custom JavaScript Library
 * Handles all custom functionality including gallery, theme toggle, and other interactions
 */

(function () {
  "use strict";

  /**
   * Dynamic Gallery Loading
   * Automatically discovers and loads all .jpg images from i/gallery directory
   */
  async function loadGalleryImages() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) return;

    let imageFiles = [];

    try {
      // Try to load from gallery index first (most reliable)
      const indexResponse = await fetch('i/gallery/index.json');
      if (indexResponse.ok) {
        imageFiles = await indexResponse.json();
        console.log('Loaded gallery images from index.json');
      }
    } catch (error) {
      console.log('No gallery index found, trying directory listing...');
      
      try {
        // Try to fetch the gallery directory listing
        const response = await fetch('i/gallery/');
        const html = await response.text();
        
        // Parse HTML to find .jpg files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href$=".jpg"]');
        
        // Extract filenames from the links
        imageFiles = Array.from(links)
          .map(link => link.getAttribute('href'))
          .filter(href => href.endsWith('.jpg'))
          .sort(); // Sort alphabetically

        console.log('Loaded gallery images from directory listing');
      } catch (dirError) {
        console.log('Directory listing failed, using fallback...');
      }
    }

    // If no images found yet, use fallback list
    if (imageFiles.length === 0) {
      console.log('Using fallback image list');
      const fallbackImages = [
        'maddoxbierman1.jpg',
        'maddoxbierman2.jpg', 
        'maddoxbierman3.jpg',
        'maddoxbierman4.jpg',
        'maddoxbierman5.jpg',
        'maddoxbierman7.jpg',
        'maddoxbierman8.jpg',
        'maddoxbierman9.jpg'
      ];
      
      // Verify which images actually exist
      for (const filename of fallbackImages) {
        try {
          const testResponse = await fetch(`i/gallery/${filename}`, { method: 'HEAD' });
          if (testResponse.ok) {
            imageFiles.push(filename);
          }
        } catch (e) {
          // Image doesn't exist, skip it
        }
      }
    }

    // Create gallery items with varied sizes for mosaic layout
    const sizeClasses = ['large', 'medium', 'small', 'wide', 'tall'];
    
    imageFiles.forEach((filename, index) => {
      const galleryItem = document.createElement('div');
      const sizeClass = sizeClasses[index % sizeClasses.length];
      galleryItem.className = `gallery-item ${sizeClass}`;
      
      galleryItem.innerHTML = `
        <a href="i/gallery/${filename}" data-pswp-width="800" data-pswp-height="1200" target="_blank">
          <img src="i/gallery/${filename}" alt="Maddox Bierman Performance" loading="lazy">
        </a>
      `;
      
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
  async function init() {
    await loadGalleryImages(); // Load gallery images first
    initPhotoSwipeGallery();   // Then initialize PhotoSwipe
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
