/**
 * PhotoSwipe Gallery Initialization
 * Handles gallery lightbox functionality for Maddox Bierman website
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize PhotoSwipe
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
});
