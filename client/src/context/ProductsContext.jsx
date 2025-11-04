import React, { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchProducts = async (forceRefresh = false) => {
    // Check cache
    if (!forceRefresh && lastFetch && Date.now() - lastFetch < CACHE_DURATION && products.length > 0) {
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all products and best sellers in parallel
      const [allProductsRes, bestSellersRes] = await Promise.all([
        productAPI.getAll(),
        productAPI.getBestSellers()
      ]);

      const productsArray = Array.isArray(allProductsRes.data) ? allProductsRes.data : [];
      const bestSellersArray = Array.isArray(bestSellersRes.data) ? bestSellersRes.data : [];

      setProducts(productsArray);
      setBestSellers(bestSellersArray);
      setError(null);
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        bestSellers,
        loading,
        error,
        refetch: () => fetchProducts(true),
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

