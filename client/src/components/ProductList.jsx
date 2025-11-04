import React from 'react';
import ProductCard from './ProductCard';
import { Filter, Grid, List } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

const ProductList = () => {
  const { products, loading, error } = useProducts();

  // Filter out packs - only show products with productType === 'product' or undefined (for backward compatibility)
  const regularProducts = products.filter(
    (product) => !product.productType || product.productType === 'product'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ade80]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-[#3dd16d]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1f2937] mb-4">
            Our Products
          </h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Discover our carefully curated collection of premium products designed to enhance your lifestyle.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button className="flex items-center space-x-2 text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-[#4ade80] bg-[#dcfce7] rounded-lg">
                <Grid size={18} />
              </button>
              <button className="p-2 text-[#4b5563] hover:text-[#4ade80] transition-colors duration-200">
                <List size={18} />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-[#4b5563]">
            Showing {regularProducts.length} products
          </div>
        </div>

        {/* Products Grid */}
        {regularProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {regularProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-[#4ade80] hover:bg-[#3dd16d] text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
