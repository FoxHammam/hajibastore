import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Home,
  Package,
  Info,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4ade80] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-[#1f2937]">
              Ayoub Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200 font-medium"
            >
              Products
            </Link>
            <Link
              to="/pack"
              className="text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200 font-medium"
            >
              Pack
            </Link>
            <Link
              to="/about"
              className="text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200">
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              className="p-2 text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Right side) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-[#1f2937]">Menu</span>
            <button
              onClick={toggleMenu}
              className="text-[#4b5563] hover:text-[#4ade80]"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-2 flex-1">
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-3 p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package size={20} />
              <span>Products</span>
            </Link>
            <Link
              to="/pack"
              className="flex items-center space-x-3 p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package size={20} />
              <span>Pack</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-3 p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info size={20} />
              <span>About</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center space-x-3 p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail size={20} />
              <span>Contact</span>
            </Link>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 pt-4">
            <button className="p-3 text-[#1f2937] hover:bg-[#f3f4f6] rounded-lg transition">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
