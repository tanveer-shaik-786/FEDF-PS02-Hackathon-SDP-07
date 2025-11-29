# Fix Images Not Loading

The images aren't loading because the database has old Unsplash URLs. Here's how to fix it:

## Step 1: Re-seed the Database

Open a terminal and run:

```powershell
cd D:\Front-End\FEDF_PROJECT-02\fedf-backend
node seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing items
✅ Inserted 10 sample items
✅ Database seeded successfully!
```

## Step 2: Restart Backend (if running)

If your backend is already running:
1. Stop it (Ctrl+C in the backend terminal)
2. Start it again:
   ```powershell
   node server.js
   ```

## Step 3: Refresh Frontend

Refresh your browser - images will now load!

---

## What Changed?

Updated the seed.js file to use **placeholder images** that will always load:
- `https://via.placeholder.com/400x400/...`
- These are simple colored placeholders with text labels
- They load instantly and work offline

## Want Real Images?

You can add your own images by:
1. Adding image files to `fedf-ps02/src/assets/`
2. Updating items in the database to reference those images
3. Or using a different free image service like picsum.photos

---

**Quick Fix Command:**
```powershell
cd D:\Front-End\FEDF_PROJECT-02\fedf-backend
node seed.js
```
