import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerView, setProductsPerView] = useState(4);
  const { products, loading } = useProducts();
  
  // Filter out packs - only show products with productType === 'product' or undefined
  const filteredProducts = products.filter(
    (product) => !product.productType || product.productType === 'product'
  );

  const updateProductsPerView = () => {
    if (window.innerWidth >= 1024) {
      setProductsPerView(4);
    } else {
      setProductsPerView(2);
    }
  };

  useEffect(() => {
    updateProductsPerView();
    window.addEventListener("resize", updateProductsPerView);
    return () => window.removeEventListener("resize", updateProductsPerView);
  }, []);

  // Get featured products (first 7) from filtered products (excluding packs)
  const featuredProducts = filteredProducts.slice(0, 7);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ade80]"></div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0
        ? prev - 1
        : Math.max(0, featuredProducts.length - productsPerView)
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev < featuredProducts.length - productsPerView ? prev + 1 : 0
    );
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <div className="flex items-center mb-2">
              <Award className="text-[#4ade80] mr-3" size={28} />
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1f2937]">
                Featured Products
              </h2>
            </div>
            <p className="text-base text-[#4b5563]">
              Discover our most popular and best-selling items
            </p>
          </div>

          {/* "View All" link with arrow */}
          <Link
            to="/products"
            className="text-[#4ade80] hover:text-[#3dd16d] font-medium transition-colors duration-200 text-base mt-4 lg:mt-0"
          >
            View All →
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 sm:-translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-2 sm:p-3 text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 sm:translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-2 sm:p-3 text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronRight size={20} />
          </button>

          {/* Products Slider */}
          <div className="overflow-hidden px-2 sm:px-6">
            {featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No featured products available.</p>
              </div>
            ) : (
              <div
                className="flex gap-3 sm:gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`,
                }}
              >
                {featuredProducts.map((product, index) => {
                const discountPercentage = Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                );
                return (
                  <FeaturedProductCard
                    key={product._id}
                    product={product}
                    index={index}
                    productsPerView={productsPerView}
                    discountPercentage={discountPercentage}
                  />
                );
              })}

              {/* View More card */}
              <Link
                to="/products"
                className="bg-[#f9fafb] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center text-[#1f2937] font-medium flex-shrink-0"
                style={{
                  width: `calc((100% - ${
                    (productsPerView - 1) * 1.5
                  }rem) / ${productsPerView})`,
                  minWidth: `calc((100% - ${
                    (productsPerView - 1) * 1.5
                  }rem) / ${productsPerView})`,
                }}
              >
                <div className="text-2xl mb-2">➕</div>
                <p>View More</p>
              </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedProductCard = ({ product, index, productsPerView, discountPercentage }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

  // Determine route based on product type
  const detailRoute = product.productType === 'pack' ? `/pack/${product._id}` : `/product/${product._id}`;

  return (
    <Link
      ref={ref}
      to={detailRoute}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex-shrink-0 cursor-pointer ${
        isVisible 
          ? 'animate-fade-in-up opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        width: `calc((100% - ${
          (productsPerView - 1) * 1.5
        }rem) / ${productsPerView})`,
        minWidth: `calc((100% - ${
          (productsPerView - 1) * 1.5
        }rem) / ${productsPerView})`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.oldPrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                          -{discountPercentage}%
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-3 sm:p-5">
                      <p className="text-xs sm:text-sm text-[#9ca3af] mb-1 sm:mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-base sm:text-xl font-semibold text-[#1f2937] mb-2 sm:mb-4 line-clamp-2 group-hover:text-[#4ade80] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm sm:text-base text-[#9ca3af] line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
    </Link>
  );
};

export default FeaturedProducts;
