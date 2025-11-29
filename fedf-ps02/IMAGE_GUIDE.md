How to Change Images in This Project

This project uses two common approaches to include images in a React + Vite app. Pick one depending on your needs:

1) Import images from `src/assets/` (recommended for bundling and hashed filenames)
   - Place your image file into `src/assets/`, for example `src/assets/my-vase.jpg`.
   - Open `src/data/sampleCraft.js` and import it:

```javascript
import myVase from '../assets/my-vase.jpg';

export const sampleCraftItems = [
  { id: 1, name: 'Handmade Vase', price: 499, image: myVase },
  // ...
];
```

   - The `HomePage` already uses `<img src={item.image} />` so no changes required.

2) Use public URLs or `public/` folder (recommended if images are large or changed frequently)
   - Put your image into the `public/` folder, e.g., `public/images/my-vase.jpg`.
   - In `src/data/sampleCraft.js`, reference the path as a string:

```javascript
export const sampleCraftItems = [
  { id: 1, name: 'Handmade Vase', price: 499, image: '/images/my-vase.jpg' },
  // ...
];
```

   - Because files in `public/` are served as-is, the leading slash is important.

Notes and troubleshooting
- After replacing images, restart the dev server if you added files to `public/`.
- If an image doesn't show:
  - Open the browser devtools Network tab to see the 404 path.
  - For `src/assets` imports, ensure the import path is correct relative to the file.
  - For `public/` references, ensure the leading `/` and correct subfolder.
- To replace the placeholder SVGs in `src/assets/`, simply overwrite `item1.svg`–`item4.svg` with your files (keep the same names or update `sampleCraft.js` imports).

If you want, I can replace the current placeholder images with images you provide. Upload the assets or tell me the public URLs you want to use and I'll patch `src/data/sampleCraft.js` for you.