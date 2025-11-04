import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productAPI, orderAPI } from "../services/api";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      console.log('Product fetched:', response.data);
      console.log('Product image URL:', response.data?.image);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Validate form fields
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const orderData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        productId: product._id,
        notes: "",
      };

      const response = await orderAPI.create(orderData);
      
      if (response && response.success) {
        toast.success("Your order has been submitted successfully!");
        // Reset form
        setFormData({
          fullName: "",
          phone: "",
          city: "",
          address: "",
        });
        // Reset form element
        const formElement = document.getElementById("order-form");
        if (formElement) {
          formElement.reset();
        }
      } else {
        toast.error(response?.message || "Failed to submit order. Please try again.");
      }
    } catch (err) {
      console.error('Failed to submit order - Full error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      console.error('Error message:', err.message);
      
      let errorMessage = "Failed to submit order. Please try again.";
      
      if (!err.response) {
        errorMessage = "Cannot connect to server. Please make sure the backend server is running.";
      } else if (err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      // Always reset submitting state to allow new submissions
      setSubmitting(false);
    }
  };

  const scrollToBuyForm = () => {
    const formElement = document.getElementById("order-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4ade80]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <p className="text-red-500 text-xl mb-4">{error || 'Product not found'}</p>
        <button 
          onClick={fetchProduct}
          className="px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-[#3dd16d]"
        >
          Retry
        </button>
      </div>
    );
  }

  const allImages = [
    product.image,
    ...(product.multipleImages || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white pt-10 pb-24">
      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 px-2 sm:px-4 lg:px-8">
        {/* LEFT: Fixed Image Gallery (PC View) */}
        <div className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] w-full flex flex-col gap-4 order-1">
          {/* Main Image with Navigation Arrows */}
          <div className="flex-1 w-full relative bg-gray-100 rounded-lg overflow-hidden min-h-[500px] group">
            <img
              src={allImages[selectedImage] || product.image || product.mainImage}
    alt={product.name}
    className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', allImages[selectedImage]);
                e.target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
              }}
            />
            
            {/* Left Arrow */}
            {allImages.length > 1 && selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(selectedImage - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
            )}
            
            {/* Right Arrow */}
            {allImages.length > 1 && selectedImage < allImages.length - 1 && (
              <button
                onClick={() => setSelectedImage(selectedImage + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </button>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-3 justify-center overflow-x-auto pb-2 hide-scrollbar">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-green-500 scale-110 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
</div>

        {/* RIGHT: Scrollable Content (Title, Order Form, Description, Sections) */}
        <div className="flex flex-col space-y-6 p-4 lg:p-8 order-2">
          {/* Product Title & Price */}
          <div className="mt-4 lg:mt-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl lg:text-3xl text-green-500 font-medium">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg lg:text-xl text-gray-400 line-through">
                  ${product.oldPrice}
              </span>
              )}
            </div>
          </div>

          {/* Order Form */}
          <form
            id="order-form"
            onSubmit={handleSubmit}
            className="bg-gray-50 border-2 border-green-400 rounded-xl p-6 space-y-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Complete Your Order
            </h2>

            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* City */}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Address */}
            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            ></textarea>

             <button
               type="submit"
               disabled={submitting || !product || (product && !product.inStock)}
               className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {submitting ? 'Submitting...' : product && !product.inStock ? 'Out of Stock' : 'Buy Now'}
             </button>
          </form>

          {/* Content Sections */}
          {product.contentSections && product.contentSections.length > 0 && (
            <div className="space-y-12 mt-6">
              {product.contentSections.map((section, index) => (
                <div key={index} className="space-y-4">
                  {/* Section Description (Before Image) */}
                  {section.description && (
                    <div>
                      <p className="text-black-900 leading-relaxed text-4xl whitespace-pre-line">
                  {section.description}
                </p>
                    </div>
                  )}
                  
                  {/* Section Image */}
                  {section.image && (
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={section.image}
                        alt={`Content section ${index + 1}`}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Fixed Buy Now Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-md mx-auto p-4">
          <button
             onClick={scrollToBuyForm}
             className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-xl"
           >
             Buy Now - ${product.price}
          </button>
        </div>
      </div>

      {/* Fixed WhatsApp Icon */}
    <a
  href="https://wa.me/212600000000"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-24 right-4 bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg z-50 animate-bounce transition-transform duration-300 hover:scale-110"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    className="w-8 h-8"
  />
</a>


    </div>
  );
}

export default ProductDetails;
