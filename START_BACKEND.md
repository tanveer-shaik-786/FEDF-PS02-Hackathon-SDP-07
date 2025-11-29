# How to Start the Backend Server

## Quick Start

1. **Open a NEW PowerShell terminal** (separate from VS Code)
2. Run these commands:

```powershell
cd D:\Front-End\FEDF_PROJECT-02\fedf-backend
node server.js
```

3. **Keep this terminal open** - Do NOT close it!
4. You should see:
   ```
   🚀 Server running on http://localhost:3001
   ✅ Connected to MongoDB
   ```

5. Now your frontend can connect to the backend!

## Alternative: Use VS Code Terminal

1. In VS Code, click Terminal → New Terminal
2. Run:
   ```powershell
   cd fedf-backend
   node server.js
   ```
3. Leave this terminal running

## Verify It's Working

Open another terminal and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/"
```

You should see: `{"message":"Backend API is running!"}`

## Troubleshooting

### "Failed to fetch" error in frontend?
- Check if backend terminal is still running
- Make sure you see "Connected to MongoDB"
- Verify with: `netstat -ano | findstr :3001`

### Server stops immediately?
- Don't run other commands in the same terminal
- Keep the server terminal dedicated to running the backend

---

## Your Backend is Ready!

Once the server is running:
- ✅ Login/Register will save to MongoDB
- ✅ Items load from database
- ✅ Orders save to database
- ✅ All user data persisted

**Keep the backend terminal open while using your app!**
