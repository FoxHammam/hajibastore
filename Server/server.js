const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDb = require("./config/db");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const packRoutes = require("./routes/packRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

// Verify required environment variables on startup
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET environment variable is required!');
  console.error('   Please add JWT_SECRET to your Server/.env file');
  console.error('   Example: JWT_SECRET=your-secret-key-here');
  process.exit(1);
}

if (!process.env.MONGO_URL) {
  console.error('❌ ERROR: MONGO_URL environment variable is required!');
  console.error('   Please add MONGO_URL to your Server/.env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded:');
console.log('   PORT:', process.env.PORT || 8000);
console.log('   MONGO_URL:', process.env.MONGO_URL ? '✅ Set' : '❌ Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

ConnectDb();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/packs", packRoutes);
app.use("/api/messages", messageRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});