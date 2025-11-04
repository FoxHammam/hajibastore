# 🚀 Deployment Guide - Hammam E-commerce

Complete guide to deploy your e-commerce application to production.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- Accounts on hosting platforms:
  - **Backend:** Render, Railway, or Heroku
  - **Frontend:** Vercel, Netlify, or Render
- Git repository (GitHub, GitLab, or Bitbucket)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (choose free tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/hammam-ecom`

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Set username and strong password
   - Save credentials securely

---

## 🔐 Step 2: Generate JWT Secret

Generate a strong secret key for JWT authentication:

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Save this secret** - you'll need it for the backend environment variables.

---

## 🖥️ Step 3: Deploy Backend Server

### Option A: Deploy to Render (Recommended - Free Tier Available)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your Git repository

2. **Configure Build Settings**
   - **Name:** `hammam-ecom-api` (or your choice)
   - **Root Directory:** `Server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

3. **Add Environment Variables**
   Click "Environment" and add:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/hammam-ecom
   JWT_SECRET=your-generated-secret-here
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://hammam-ecom-api.onrender.com`)

### Option B: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `Server`
5. Add environment variables (same as above)
6. Deploy

---

## 🌐 Step 4: Deploy Frontend

### Option A: Deploy to Vercel (Recommended - Free Tier Available)

1. **Create New Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your Git repository

2. **Configure Build Settings**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend-api.onrender.com
   ```
   (Use your actual backend URL from Step 3)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy your frontend URL (e.g., `https://hammam-ecom.vercel.app`)

### Option B: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
5. Add environment variable `VITE_API_URL`
6. Deploy

### Option C: Deploy to Render (Static Site)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your repository
4. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Add environment variable `VITE_API_URL`
6. Deploy

---

## 🔄 Step 5: Update CORS and Frontend URL

After deploying both services:

1. **Update Backend CORS**
   - Go to your backend hosting dashboard
   - Update `FRONTEND_URL` environment variable with your actual frontend URL
   - Restart/redeploy the backend

2. **Verify Frontend API URL**
   - Ensure `VITE_API_URL` in frontend points to your backend URL
   - Rebuild and redeploy frontend if needed

---

## 🌱 Step 6: Seed Database

After backend is deployed, seed the database with initial data:

1. **SSH into your backend** (if available) or use a one-time script
2. Run seed commands:

```bash
# Seed admin user
npm run seed:admin

# Seed products and packs (optional)
npm run seed
```

**Alternative:** Use MongoDB Atlas web shell or create a one-time deployment script.

---

## ✅ Step 7: Verify Deployment

1. **Test Backend Health**
   ```
   GET https://your-backend-api.com/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Check if products load
   - Test navigation

3. **Test Admin Login**
   - Go to `/admin/login`
   - Use admin credentials (created during seed)

4. **Test Order Submission**
   - Select a product
   - Fill order form
   - Submit order
   - Verify in admin dashboard

---

## 🔒 Security Checklist

Before going live:

- [ ] **JWT_SECRET** is a strong, random string (32+ characters)
- [ ] **MongoDB password** is strong and unique
- [ ] **CORS** is configured with your frontend domain only
- [ ] **NODE_ENV** is set to `production`
- [ ] **Environment variables** are not committed to Git
- [ ] **HTTPS** is enabled (most platforms do this automatically)
- [ ] **Database backups** are configured in MongoDB Atlas

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

- **Render:** Built-in logs and metrics
- **Railway:** Built-in logs and metrics
- **Health Check:** `GET /api/health` endpoint

### Frontend Monitoring

- **Vercel:** Built-in analytics
- **Netlify:** Built-in analytics
- **Error Tracking:** Consider adding Sentry

### Database Monitoring

- **MongoDB Atlas:** Built-in monitoring dashboard
- Set up alerts for:
  - High CPU usage
  - Storage approaching limits
  - Connection errors

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Server won't start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs for specific errors

**Problem:** CORS errors
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check for trailing slashes
- Ensure backend is using HTTPS in production

### Frontend Issues

**Problem:** API calls fail
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Problem:** Build fails
- Check Node.js version (should be 16+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors (if any)

### Database Issues

**Problem:** Can't connect to MongoDB
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for all IPs)
- Verify database user credentials

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

1. **Connect Git Repository** to your hosting platform
2. **Enable Auto-Deploy** on push to main/master branch
3. **Every push** will trigger a new deployment automatically

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend loads correctly
- [ ] Admin login works
- [ ] Products display correctly
- [ ] Order submission works
- [ ] Admin dashboard functions
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Database is seeded with initial data
- [ ] Custom domain is configured (optional)

---

## 🎉 You're Live!

Your e-commerce application is now deployed and accessible to users worldwide!

**Next Steps:**
- Monitor performance and errors
- Set up custom domain (optional)
- Configure SSL certificates (usually automatic)
- Set up email notifications (if needed)
- Add analytics tracking
- Schedule regular database backups

---

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting dashboard
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check MongoDB Atlas connection status

**Happy Deploying! 🚀**

