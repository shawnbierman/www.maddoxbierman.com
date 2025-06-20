# Dynamic Gallery System

The website now features a dynamic gallery that automatically loads images from the `i/gallery/` directory.

## How to Add New Images

### Method 1: Simple (Manual Index Update)
1. Add your `.jpg` images to the `i/gallery/` directory
2. Run the update script: `./update-gallery-index.sh`
3. Commit and push the changes

### Method 2: Direct (Manual JSON Edit)
1. Add your `.jpg` images to the `i/gallery/` directory  
2. Edit `i/gallery/index.json` to include the new filenames
3. Commit and push the changes

## Gallery Features

- **Automatic Loading**: Images are loaded dynamically via JavaScript
- **Mosaic Layout**: Images are automatically assigned varied sizes (large, medium, small, wide, tall)
- **PhotoSwipe Integration**: Click any image to open the lightbox gallery
- **Multiple Fallbacks**: 
  - Primary: JSON index file (`i/gallery/index.json`)
  - Secondary: Directory listing (if server supports it)
  - Tertiary: Hardcoded fallback list with existence verification

## File Structure

```
i/
├── gallery/
│   ├── index.json          # Image list (auto-generated)
│   ├── maddoxbierman1.jpg  # Gallery images
│   ├── maddoxbierman2.jpg
│   └── ...
├── maddox_transparentbg.png # Hero image
└── MaddoxBiermanHeadshot.jpg # Headshot
```

## Technical Details

- Gallery images are loaded by the `loadGalleryImages()` function in `j/site.js`
- The system automatically creates a mosaic layout with varied item sizes
- PhotoSwipe is initialized after images are loaded
- All images must be in `.jpg` format
- Images are loaded with lazy loading for performance

## Benefits

- **No HTML Editing**: Just add images to the folder
- **Automatic Updates**: Gallery updates when new images are added
- **Reliable Loading**: Multiple fallback methods ensure images always load
- **Performance**: Lazy loading and optimized image handling
