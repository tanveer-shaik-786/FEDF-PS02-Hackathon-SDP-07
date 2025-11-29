# MongoDB Atlas Setup Guide

## Step 1: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in with your account (or create a new one)
3. Click on "Connect" button for your cluster
4. Select "Connect your application"
5. Copy the connection string

## Step 2: Update the .env File

Replace the `MONGODB_URI` in the `.env` file with your actual connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/craftDB?retryWrites=true&w=majority
```

**Important:** 
- Replace `<username>` with your MongoDB Atlas username
- Replace `<password>` with your MongoDB Atlas password (not your Atlas account password!)
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
- Keep `craftDB` as the database name

## Step 3: Whitelist Your IP Address

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Either:
   - Add your current IP address
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) for development

## Step 4: Create a Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password
5. Grant "Read and write to any database" permissions
6. Click "Add User"

## Step 5: Test the Connection

After updating the .env file, restart the server:

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

## Alternative: Use Local MongoDB

If you have MongoDB installed locally:

```
MONGODB_URI=mongodb://localhost:27017/craftDB
```

---

## Current Configuration

Your current connection attempt is using:
- Username: `tanveer_shaik`
- Cluster: `cluster0.lrucrc6.mongodb.net`

**Action Required:** 
1. Verify your MongoDB Atlas password
2. Update the `.env` file with the correct password
3. Make sure IP whitelist includes your current IP
4. Restart the server: `npm start`
