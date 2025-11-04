import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  CreditCard,
  Truck,
  Shield,
  Headphones
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1f2937] text-[#9ca3af]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Ayoub Store</h3>
            <p className="mb-4">
              Your trusted destination for premium quality products. We bring you the best selection of curated items at unbeatable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#9ca3af] hover:text-[#4ade80] transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#9ca3af] hover:text-[#4ade80] transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#9ca3af] hover:text-[#4ade80] transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#9ca3af] hover:text-[#4ade80] transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#4ade80] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#4ade80] transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/pack" className="hover:text-[#4ade80] transition-colors duration-200">
                  Pack Deals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#4ade80] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4ade80] transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-[#4ade80] transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[#4ade80] transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#4ade80] transition-colors duration-200">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#4ade80] transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#4ade80] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Shopping Street, City Center, Country</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-[#4ade80] transition-colors duration-200">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <a href="mailto:info@ayoubstore.com" className="hover:text-[#4ade80] transition-colors duration-200">
                  info@ayoubstore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 py-8 border-t border-gray-700">
          <div className="flex items-center">
            <div className="bg-[#4ade80]/10 p-3 rounded-lg mr-4">
              <Truck size={24} className="text-[#4ade80]" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Free Shipping</h4>
              <p className="text-sm">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#4ade80]/10 p-3 rounded-lg mr-4">
              <Shield size={24} className="text-[#4ade80]" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Secure Payment</h4>
              <p className="text-sm">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#4ade80]/10 p-3 rounded-lg mr-4">
              <Headphones size={24} className="text-[#4ade80]" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">24/7 Support</h4>
              <p className="text-sm">Dedicated support team</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#4ade80]/10 p-3 rounded-lg mr-4">
              <CreditCard size={24} className="text-[#4ade80]" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Easy Returns</h4>
              <p className="text-sm">30-day return policy</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-[#0f1419] rounded-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-[#9ca3af] mb-6">
              Get special offers and updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-[#1f2937] border border-gray-700 text-white focus:outline-none focus:border-[#4ade80] transition-colors duration-200"
              />
              <button className="bg-[#4ade80] hover:bg-[#3dd16d] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © 2024 Ayoub Store. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms" className="hover:text-[#4ade80] transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-[#4ade80] transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-[#4ade80] transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;