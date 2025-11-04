import React, { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products
      const productsResponse = await productAPI.getAll();
      const allProducts = productsResponse.data || productsResponse || [];
      
      // Fetch best sellers
      const bestSellersResponse = await productAPI.getBestSellers();
      const bestSellerProducts = bestSellersResponse.data || bestSellersResponse || [];
      
      setProducts(allProducts);
      setBestSellers(bestSellerProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products. Please try again later.');
      setProducts([]);
      setBestSellers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Optional: Refresh products every 5 minutes
    const interval = setInterval(fetchProducts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    products,
    bestSellers,
    loading,
    error,
    refetch: fetchProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

