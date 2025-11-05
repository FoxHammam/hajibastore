# Create Frontend Web Service on Render

## Important: You Need TWO Separate Services

1. **Backend Web Service** ✅ (You already have this)
2. **Frontend Web Service** ⬅️ (You need to create this)

---

## Step-by-Step: Create Frontend Web Service

### Step 1: Go to Render Dashboard
- Visit: https://dashboard.render.com
- Make sure you're logged in

### Step 2: Create New Web Service
1. Click the **"New +"** button (top right)
2. Select **"Web Service"**

### Step 3: Connect Your Repository
- Choose the same repository where your code is stored
- If you haven't connected it yet, click "Connect account" and authorize Render

### Step 4: Configure the Frontend Service

**Basic Settings:**
```
Name: ayoub-store-frantend (or frontend, or your-app-frontend)
Environment: Node
Region: Choose closest to you (or default)
Branch: master (or your main branch)
```

**Build & Deploy Settings:**
```
Root Directory: client
Build Command: npm install && npm run build
Start Command: npm start
```

**Plan:**
- Choose **Free** (or paid if you prefer)

### Step 5: Environment Variables (Optional)
If your frontend needs environment variables (like API URL):
- Click **"Add Environment Variable"**
- Add: `VITE_API_URL` = your backend URL (e.g., `https://your-backend.onrender.com`)

### Step 6: Create the Service
- Click **"Create Web Service"**
- Render will start building automatically

### Step 7: Wait for Deployment
- Wait 2-3 minutes
- Check the **Logs** tab to see build progress
- You'll see a URL like: `https://ayoub-store-frantend.onrender.com`

---

## Summary

You'll have:
- **Backend Service**: `https://your-backend.onrender.com` (API)
- **Frontend Service**: `https://ayoub-store-frantend.onrender.com` (Website)

Both are separate Web Services, but they work together!

---

## After Deployment

1. Test your frontend URL
2. Routes like `/admin/login` and `/product/1` should work now
3. If you need to update the backend URL in frontend, add it as `VITE_API_URL` environment variable

