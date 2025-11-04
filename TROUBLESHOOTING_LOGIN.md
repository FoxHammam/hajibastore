# 🔧 Troubleshooting Login 500 Error

## Issue
Login returns 500 error with `localhost:8000` URL

## Quick Fixes

### 1. Restart Both Servers
```bash
# Stop both servers (Ctrl+C), then:

# Terminal 1 - Backend
cd Server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 2. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open in Incognito/Private window

### 3. Verify Server .env File

Check that `Server/.env` exists and has:
```env
MONGO_URL=mongodb://localhost:27017/hammam-ecom
PORT=5000
JWT_SECRET=your-temporary-secret-for-development
NODE_ENV=development
```

**To set JWT_SECRET temporarily for development:**
```bash
# In Server/.env
JWT_SECRET=dev-secret-key-change-in-production-12345
```

### 4. Verify jsonwebtoken is Installed
```bash
cd Server
npm list jsonwebtoken
# Should show: jsonwebtoken@9.x.x
```

If not installed:
```bash
cd Server
npm install jsonwebtoken
```

### 5. Check Server Console
Look for error messages in the server terminal. Common errors:
- `JWT_SECRET environment variable is required`
- `Cannot find module 'jsonwebtoken'`
- MongoDB connection errors

### 6. Verify Server is Running on Port 5000
Check server terminal for:
```
Server connected on port 5000
connected sucsesfuly to MongoDB
```

---

## Why This Happened

1. **jsonwebtoken was missing** - Just installed ✅
2. **Server needs restart** - After installing dependencies
3. **JWT_SECRET may be missing** - Server requires it
4. **Browser cache** - Old code still using localhost:8000

---

## Testing After Fix

1. Open browser DevTools (F12)
2. Check Network tab
3. Try login again
4. Verify request goes to `http://localhost:5000/api/auth/login`

---

## If Still Not Working

Check server terminal for the actual error message and share it.

