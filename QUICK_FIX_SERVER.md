# 🔧 Quick Fix: Server Configuration Error

## The Problem
"Server configuration error" means `JWT_SECRET` is not being read by the server.

## ✅ Solution

### Step 1: Restart Your Server

**This is the most important step!** The server needs to restart to load the new `.env` file.

```bash
# In your server terminal:
# 1. Stop the server (Press Ctrl+C)
# 2. Start it again:
cd Server
npm run dev
```

You should now see:
```
✅ Environment variables loaded:
   PORT: 5000
   MONGO_URL: ✅ Set
   JWT_SECRET: ✅ Set
Server connected on port 5000
connected sucsesfuly to MongoDB
```

### Step 2: Verify .env File

Make sure `Server/.env` contains:
```env
PORT=5000
MONGO_URL=mongodb+srv://...
JWT_SECRET=dev-secret-key-change-this-in-production-b6870a1a
```

### Step 3: Test Login Again

After restarting, try logging in again. It should work now!

---

## Why This Happens

1. The `.env` file is only read when the server **starts**
2. Changes to `.env` require a server restart
3. The server now validates required variables on startup (you'll see an error if something is missing)

---

## If Still Not Working

Check the server console output. You should see:
- ✅ Environment variables loaded (if working)
- ❌ ERROR: JWT_SECRET... (if missing)

If you see the error, the `.env` file isn't being read. Make sure:
1. The file is named exactly `.env` (not `.env.txt` or `.env.example`)
2. The file is in the `Server/` folder
3. There are no spaces around the `=` sign: `JWT_SECRET=value` (not `JWT_SECRET = value`)

