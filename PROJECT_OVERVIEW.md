# Hammam Ecom - Full Project Overview

## Project Structure

```
Hammam Ecom/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── App.jsx           # Main App component with routing
│   │   ├── main.jsx          # Entry point
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context providers
│   │   ├── services/         # API services
│   │   └── styles/           # CSS files
│   └── package.json
│
└── Server/                    # Express Backend
    ├── server.js             # Express server setup
    ├── models/               # Mongoose models
    ├── routes/               # API routes
    ├── middleware/           # Auth middleware
    └── package.json
```

## Technology Stack

### Frontend (Client)
- **React 19.1.1** - UI framework
- **React Router DOM 7.9.4** - Routing
- **Redux Toolkit 2.9.2** - State management
- **Axios 1.12.2** - HTTP client
- **Tailwind CSS 4.1.16** - Styling
- **Lucide React 0.546.0** - Icons
- **React Toastify 11.0.5** - Notifications
- **Vite 7.1.7** - Build tool

### Backend (Server)
- **Express 5.1.0** - Web framework
- **Mongoose 8.19.1** - MongoDB ODM
- **bcryptjs 3.0.2** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.3** - Environment variables

## Key Features

### Public Features
1. **Home Page** - Hero section, featured products, best sellers
2. **Products Page** - Browse all products with filters
3. **Packs Page** - Browse all pack products
4. **Product Details** - Individual product/pack details with order form
5. **Contact Us** - Contact form with image uploads
6. **About Us** - About page
7. **Responsive Navbar** - Mobile bottom nav, desktop top nav

### Admin Features
1. **Dashboard** - Overview with KPIs, recent orders, analytics
2. **Products Management** - Create, edit, delete products/packs
3. **Orders Management** - View, update status, delete orders
4. **Customers** - View customer information and statistics
5. **Messages** - Manage contact form submissions
6. **Analytics** - Revenue charts, order statistics
7. **Settings** - Admin settings
8. **Marketing** - Marketing tools

## API Endpoints

### Products
- `GET /api/products` - Get all products (excludes packs)
- `GET /api/products/:id` - Get single product
- `GET /api/products/filter/bestsellers` - Get best sellers
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Packs
- `GET /api/packs` - Get all packs
- `GET /api/packs/:id` - Get single pack
- `POST /api/packs` - Create pack (admin)
- `PUT /api/packs/:id` - Update pack (admin)
- `DELETE /api/packs/:id` - Delete pack (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order (admin)
- `POST /api/orders` - Create order (public)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### Messages
- `GET /api/messages` - Get all messages (admin)
- `GET /api/messages/:id` - Get single message (admin)
- `POST /api/messages` - Create message (public)
- `PUT /api/messages/:id/status` - Update message status (admin)
- `DELETE /api/messages/:id` - Delete message (admin)

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin register

## Data Models

### Product Model
```javascript
{
  name: String (required),
  image: String (required),
  multipleImages: [String],
  price: Number (required),
  oldPrice: Number,
  category: String (required),
  size: [String],
  bestSeller: Boolean,
  productType: String (enum: 'product', 'pack'),
  inStock: Boolean,
  contentSections: [{
    image: String,
    description: String
  }],
  timestamps: true
}
```

### Order Model
```javascript
{
  fullName: String (required),
  phone: String (required),
  city: String (required),
  address: String (required),
  productId: ObjectId (ref: Product),
  productName: String (required),
  productPrice: Number (required),
  status: String (enum: pending, confirmed, processing, shipped, delivered, cancelled),
  totalAmount: Number (required),
  notes: String,
  timestamps: true
}
```

### Message Model
```javascript
{
  name: String (required),
  email: String (required),
  subject: String,
  message: String (required),
  images: [String],
  status: String (enum: unread, read, replied, archived),
  adminNotes: String,
  timestamps: true
}
```

## Environment Variables

### Server (.env)
```
PORT=8000
MONGO_URL=mongodb://localhost:27017/hammam-ecom
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Current Issues & Solutions Applied

1. ✅ **Payload Too Large Error** - Increased body parser limit to 50mb
2. ✅ **Product/Pack Separation** - Separate endpoints and filtering
3. ✅ **Image Compression** - Client-side compression for large images
4. ✅ **Toast Notifications** - Replaced all alerts with react-toastify
5. ✅ **Admin Pack Display** - Fixed to fetch both products and packs
6. ✅ **Scroll Animations** - Added scroll-triggered animations
7. ✅ **Responsive Design** - Mobile-first approach with bottom nav

## Running the Project

### Backend
```bash
cd Server
npm install
npm run dev  # Development with nodemon
# or
npm start    # Production
```

### Frontend
```bash
cd client
npm install
npm run dev  # Development server (Vite)
# or
npm run build  # Production build
npm run preview  # Preview production build
```

## Notes

- Server runs on port **8000** by default
- Frontend runs on port **5173** by default (Vite)
- MongoDB connection required
- JWT authentication for admin routes
- All images stored as Base64 strings in database

