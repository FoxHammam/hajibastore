# Convert Render Static Site to Web Service

## Why?
Render Static Sites don't support SPA routing out of the box. Web Services can run our server.js which handles all routes correctly.

## Steps to Convert:

### Step 1: Create New Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your repository (same one as your Static Site)
4. Configure:
   - **Name**: `ayoub-store-frantend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `master` (or your main branch)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine

### Step 2: Add Environment Variables (if needed)
- Add any environment variables your app needs (like `VITE_API_URL`)

### Step 3: Delete Old Static Site (Optional)
- Once the Web Service works, you can delete the old Static Site

### Step 4: Update Custom Domain (if you have one)
- If you had a custom domain on Static Site, update DNS to point to new Web Service

---

## Alternative: Keep Static Site but Use Different Approach

If you want to keep Static Site, we need to ensure the `_redirects` file works, but Render doesn't guarantee support for it.

