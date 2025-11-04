# 🛍️ Hammam E-commerce Platform

A full-stack e-commerce application built with React and Node.js, featuring product management, order processing, and an admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Hammam Ecom"
   ```

2. **Set up Backend**
   ```bash
   cd Server
   npm install
   # Create .env file (see Server/.env.example)
   npm run seed:admin  # Create admin user
   npm run dev         # Start server
   ```

3. **Set up Frontend**
   ```bash
   cd ../client
   npm install
   # Create .env file (see client/.env.example)
   npm run dev         # Start development server
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Login: http://localhost:5173/admin/login

## 📚 Documentation

- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed local setup guide
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete production deployment instructions

## 🏗️ Project Structure

```
Hammam Ecom/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts
│   │   ├── services/    # API services
│   │   └── redux/       # State management
│   └── package.json
├── Server/              # Node.js backend (Express)
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── config/         # Database config
│   └── package.json
└── package.json         # Root package.json
```

## ✨ Features

### Customer Features
- ✅ Product browsing and search
- ✅ Product details with image gallery
- ✅ Pack/Bundle deals
- ✅ Order placement
- ✅ Contact form with image upload
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Features
- ✅ Secure admin authentication
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Customer management
- ✅ Message management
- ✅ Analytics and reporting
- ✅ Marketing tools
- ✅ Settings management

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/filter/bestsellers` - Get best sellers

### Packs
- `GET /api/packs` - Get all packs
- `GET /api/packs/:id` - Get pack by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID

### Messages
- `POST /api/messages` - Create new message
- `GET /api/messages` - Get all messages (admin)

### Auth
- `POST /api/auth/login` - Admin login

## 🔐 Environment Variables

### Server (.env)
```env
MONGO_URL=mongodb://localhost:27017/hammam-ecom
PORT=8000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Summary

1. **Backend:** Deploy to Render/Railway
   - Set root directory: `Server`
   - Add environment variables
   - Start command: `npm start`

2. **Frontend:** Deploy to Vercel/Netlify
   - Set root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add `VITE_API_URL` environment variable

3. **Database:** Use MongoDB Atlas (free tier available)

## 📝 Scripts

### Server
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run seed` - Seed products and packs
- `npm run seed:admin` - Create admin user

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify `.env` file exists in Server folder
- Check MongoDB is running (local) or connection string (Atlas)
- Verify network connectivity

**CORS Errors**
- Ensure `FRONTEND_URL` matches your frontend domain
- Check backend CORS configuration

**Build Errors**
- Clear `node_modules` and reinstall
- Check Node.js version (16+)
- Verify all dependencies are installed

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please check:
1. [Setup Instructions](SETUP_INSTRUCTIONS.md)
2. [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. Check server logs for errors
4. Verify environment variables

---

**Built with ❤️ for Hammam E-commerce**

