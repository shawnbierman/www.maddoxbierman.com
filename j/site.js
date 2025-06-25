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

    // Hard-coded image list with actual dimensions
    const imageFiles = [
      {
        filename: "maddoxbierman1.jpg",
        width: 933,
        height: 1399,
        thumb: "maddoxbierman1-thumb.jpg",
      },
      {
        filename: "maddoxbierman2.jpg",
        width: 867,
        height: 1300,
        thumb: "maddoxbierman2-thumb.jpg",
      },
      {
        filename: "maddoxbierman3.jpg",
        width: 1500,
        height: 1000,
        thumb: "maddoxbierman3-thumb.jpg",
      },
      {
        filename: "maddoxbierman4.jpg",
        width: 867,
        height: 1300,
        thumb: "maddoxbierman4-thumb.jpg",
      },
      {
        filename: "maddoxbierman5.jpg",
        width: 795,
        height: 1300,
        thumb: "maddoxbierman5-thumb.jpg",
      },
      {
        filename: "maddoxbierman6.jpg",
        width: 800,
        height: 1200,
        thumb: "maddoxbierman6-thumb.jpg",
      },
      {
        filename: "maddoxbierman7.jpg",
        width: 667,
        height: 1000,
        thumb: "maddoxbierman7-thumb.jpg",
      },
      {
        filename: "maddoxbierman8.jpg",
        width: 1133,
        height: 1300,
        thumb: "maddoxbierman8-thumb.jpg",
      },
      {
        filename: "maddoxbierman9.jpg",
        width: 800,
        height: 1200,
        thumb: "maddoxbierman9-thumb.jpg",
      },
    ];

    // Create gallery items with varied sizes for mosaic layout
    const sizeClasses = ["large", "medium", "small", "wide", "tall"];

    imageFiles.forEach((imageData, index) => {
      const galleryItem = document.createElement("div");
      const sizeClass = sizeClasses[index % sizeClasses.length];
      galleryItem.className = `gallery-item ${sizeClass}`;

      const picture = document.createElement("picture");

      // Create WebP source with srcset
      const webpSource = document.createElement("source");
      webpSource.type = "image/webp";
      webpSource.srcset = `
        i/thumbnails/${imageData.thumb.replace(".jpg", ".webp")} 200w,
        i/${imageData.filename.replace(".jpg", "-small.webp")} 400w,
        i/${imageData.filename.replace(".jpg", "-medium.webp")} 800w,
        i/${imageData.filename.replace(".jpg", "-large.webp")} 1200w
      `;
      webpSource.sizes =
        "(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px";

      // Create fallback img element with JPEG srcset
      const img = document.createElement("img");
      img.src = `i/thumbnails/${imageData.thumb}`; // Fallback src
      img.srcset = `
        i/thumbnails/${imageData.thumb} 200w,
        i/${imageData.filename.replace(".jpg", "-small.jpg")} 400w,
        i/${imageData.filename.replace(".jpg", "-medium.jpg")} 800w,
        i/${imageData.filename.replace(".jpg", "-large.jpg")} 1200w
      `;
      img.sizes = "(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px";
      img.alt = "Maddox Bierman Performance";
      img.loading = "lazy";

      picture.appendChild(webpSource);
      picture.appendChild(img);

      const link = document.createElement("a");
      link.href = `i/${imageData.filename}`;
      link.setAttribute("data-pswp-width", imageData.width.toString());
      link.setAttribute("data-pswp-height", imageData.height.toString());
      link.setAttribute("data-pswp-msrc", `i/thumbnails/${imageData.thumb}`); // Thumbnail for PhotoSwipe opening animation
      link.setAttribute("target", "_blank");
      link.appendChild(picture);

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
          msrc: link.dataset.pswpMsrc, // Add msrc for PhotoSwipe's opening animation
          alt: link.querySelector("img").alt,
        }));

        const lightbox = new window.PhotoSwipe({
          dataSource,
          index,
          showHideAnimationType: "zoom",
          bgOpacity: 0.9,
          padding: { top: 20, bottom: 40, left: 100, right: 100 },
          imageClickAction: "close",
          tapAction: "close",
          doubleTapAction: "zoom",
          preloadFirstSlide: true,
          allowPanToNext: false,
          initialZoomLevel: "fit",
          secondaryZoomLevel: 1.5,
          maxZoomLevel: 2,
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
