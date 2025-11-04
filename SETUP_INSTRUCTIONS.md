# 🚀 Hammam Ecom - Setup Instructions

Complete guide to set up and run your e-commerce application.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## 🔧 Step 1: Create Environment File

1. Navigate to the `Server` folder
2. Create a `.env` file (copy from `.env.example`)
3. Add your MongoDB connection string:

```env
MONGO_URL=mongodb://localhost:27017/hammam-ecom
# For MongoDB Atlas use:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/hammam-ecom

PORT=8000
NODE_ENV=development

JWT_SECRET=your-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Step 2: Install Dependencies

### Install Server Dependencies
```bash
cd Server
npm install
```

### Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 🗄️ Step 3: Seed the Database

This will populate your database with sample products and packs:

```bash
cd Server
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing data
20 products seeded
7 packs seeded
✅ Database seeded successfully!
```

---

## 🚀 Step 4: Run the Application

### Start the Backend Server
Open terminal #1:
```bash
cd Server
npm run dev
```

Server will run on: `http://localhost:8000`

### Start the Frontend
Open terminal #2:
```bash
cd client
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## ✅ Verify Everything Works

1. **Test Backend Health:**
   Open browser: `http://localhost:8000/api/health`
   Should see: `{"success":true,"message":"Server is running"}`

2. **Test Products API:**
   `http://localhost:8000/api/products`
   Should return list of 20 products

3. **Test Frontend:**
   `http://localhost:5173`
   Should see homepage with products

4. **Test Order Submission:**
   - Click on any product
   - Fill out the order form
   - Submit - should see success message

---

## 📁 Project Structure

```
Hammam Ecom/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── redux/           # State management
│   │   └── data/            # Static data (deprecated)
│   └── package.json
│
└── Server/                  # Backend (Express + MongoDB)
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── config/              # Database configuration
    ├── seed.js              # Database seeding script
    ├── server.js            # Main server file
    └── package.json
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/filter/bestsellers` - Get best sellers

### Packs
- `GET /api/packs` - Get all packs
- `GET /api/packs/:id` - Get single pack

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order

---

## 🎯 Features Implemented

### ✅ Completed
- [x] Product listing with real-time API data
- [x] Product details page (dynamic based on ID)
- [x] Pack/Bundle deals page
- [x] Best Seller section
- [x] Featured Products carousel
- [x] Order submission form
- [x] Responsive design (mobile, tablet, desktop)
- [x] WhatsApp integration
- [x] MongoDB database with seeding
- [x] RESTful API backend

### ❌ Not Implemented (As Requested)
- [ ] User authentication (login/register)
- [ ] Shopping cart functionality
- [ ] Payment processing

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `MongooseError: Could not connect to MongoDB`

**Solution:**
1. Make sure MongoDB is running locally, or
2. Check your MongoDB Atlas connection string
3. Verify `.env` file exists in Server folder
4. Check network connectivity

### CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Backend is already configured with CORS
- Make sure backend is running on `localhost:5000`
- Make sure frontend is running on `localhost:5173`

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Kill process on port 5000 (Backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Frontend)
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### No Products Showing
**Solution:**
1. Run `npm run seed` in Server folder
2. Check if backend is running
3. Check browser console for API errors
4. Verify MongoDB connection

---

## 📊 Database Schema

### Product
```javascript
{
  name: String (required),
  image: String (required),
  price: Number (required),
  oldPrice: Number,
  category: String (required),
  size: [String],
  bestSeller: Boolean,
  inStock: Boolean,
  timestamps: true
}
```

### Order
```javascript
{
  fullName: String (required),
  phone: String (required),
  city: String (required),
  address: String (required),
  productId: ObjectId (required),
  productName: String (required),
  productPrice: Number (required),
  totalAmount: Number (required),
  status: String (enum),
  notes: String,
  timestamps: true
}
```

### Pack
```javascript
{
  name: String (required),
  image: String (required),
  price: Number (required),
  oldPrice: Number,
  category: String,
  itemsIncluded: [String] (required),
  bestSeller: Boolean,
  inStock: Boolean,
  timestamps: true
}
```

---

## 🎨 Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Redux Toolkit** - State Management
- **Axios** - HTTP Client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express 5** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **dotenv** - Environment Variables
- **CORS** - Cross-Origin Support

---

## 📝 Next Steps

### To Add Authentication (Optional)
1. Install `jsonwebtoken` and `bcryptjs`
2. Create User model
3. Add auth routes (register, login)
4. Add JWT middleware for protected routes

### To Add Cart (Optional)
1. Create Cart context or Redux slice
2. Add cart state management
3. Create CartPage component
4. Update OrderRoutes for multiple products

### To Deploy
1. **Backend:** Heroku, Railway, or Render
2. **Frontend:** Vercel or Netlify
3. **Database:** MongoDB Atlas

---

## 🆘 Need Help?

If you encounter any issues:
1. Check console errors (browser and terminal)
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check .env file configuration
5. Re-run seed script if no data shows

---

## 🎉 You're All Set!

Your e-commerce application is now ready to use. Visit `http://localhost:5173` and start exploring!

**Enjoy building! 🚀**

