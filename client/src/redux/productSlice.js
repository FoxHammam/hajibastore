import { createSlice } from '@reduxjs/toolkit';
import { products } from './products';

const initialState = {
  products: products,
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: Date.now(), // Simple ID generation
      };
      state.products.push(newProduct);
    },
    removeProductByName: (state, action) => {
      state.products = state.products.filter(
        product => product.name !== action.payload
      );
    },
    updateProductByName: (state, action) => {
      const { name, updates } = action.payload;
      const productIndex = state.products.findIndex(
        product => product.name === name
      );
      if (productIndex !== -1) {
        state.products[productIndex] = {
          ...state.products[productIndex],
          ...updates
        };
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  addProduct, 
  removeProductByName, 
  updateProductByName, 
  setLoading, 
  setError 
} = productSlice.actions;

export default productSlice.reducer;
