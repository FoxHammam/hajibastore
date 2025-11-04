import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const BestSeller = () => {
  const { bestSellers: bestSellerProducts, loading } = useProducts();
  
  // Filter out packs - only show products with productType === 'product' or undefined
  const filteredBestSellers = bestSellerProducts.filter(
    (product) => !product.productType || product.productType === 'product'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ade80]"></div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="text-[#4ade80] mr-3" size={28} />
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1f2937]">
                Best Sellers
              </h2>
            </div>
            <p className="text-base text-[#4b5563]">
              Our most popular and top-rated products
            </p>
          </div>

          {/* View All link */}
          <Link
            to="/products"
            className="text-[#4ade80] hover:text-[#3dd16d] font-medium transition-colors duration-200 text-base mt-4 lg:mt-0"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBestSellers.map((product, index) => {
            const discountPercentage = product.oldPrice
              ? Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                )
              : 0;

            return (
              <ProductCardWithAnimation
                key={product._id}
                product={product}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductCardWithAnimation = ({ product, index }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Determine route based on product type
  const detailRoute = product.productType === 'pack' ? `/pack/${product._id}` : `/product/${product._id}`;

  return (
    <Link
      ref={ref}
      to={detailRoute}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
        isVisible 
          ? 'animate-fade-in-up opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{
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

export default BestSeller;
