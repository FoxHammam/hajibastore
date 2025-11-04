import React from "react";
import { Routes, Route } from "react-router-dom";
import ToastProvider from "./components/ToastProvider.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Product.jsx";
import Pack from "./pages/Pack.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import PackDetails from "./pages/PackDetails.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminMarketing from "./pages/admin/AdminMarketing.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

// Layout component for public routes
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/pack" element={<Pack />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pack/:id" element={<PackDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastProvider />
      <Routes>
      {/* Admin Login - Public */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Routes - Protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/customers" 
        element={
          <ProtectedRoute>
            <AdminCustomers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/messages" 
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute>
            <AdminAnalytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/marketing" 
        element={
          <ProtectedRoute>
            <AdminMarketing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } 
      />
      
      {/* Public Routes - With Navbar/Footer */}
      <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  );
}
export default App