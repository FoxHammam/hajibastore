import axios from 'axios';

// Use environment variable or default to 8000 (server port)
// If VITE_API_URL is provided without /api, we append it
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
if (baseURL && !baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}
const API_URL = baseURL;

console.log('API Service initialized with URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (minimal logging for performance)
api.interceptors.request.use(
  (config) => {
    // Only log errors, not all requests
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor (minimal logging for performance)
api.interceptors.response.use(
  (response) => {
    // Only log errors, not all responses
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Products API
export const productAPI = {
  // Get all products
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get best sellers
  getBestSellers: async () => {
    try {
      const response = await api.get('/products/filter/bestsellers');
      return response.data;
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }
  },
};

// Packs API
export const packAPI = {
  // Get all packs
  getAll: async () => {
    try {
      const response = await api.get('/packs');
      // Backend returns: { success: true, count: number, data: packs[] }
      // Return the data directly for easier access
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching packs:', error);
      throw error;
    }
  },

  // Get pack by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/packs/${id}`);
      // Backend returns: { success: true, data: pack }
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching pack:', error);
      throw error;
    }
  },
};

// Orders API
export const orderAPI = {
  // Create new order
  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      console.log('Order API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Get order by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
};

// Messages API
export const messageAPI = {
  // Create new message
  create: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Get all messages
  getAll: async (status = 'all') => {
    try {
      const response = await api.get(`/messages${status !== 'all' ? `?status=${status}` : ''}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Get message by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  },

  // Update message status
  updateStatus: async (id, status, adminNotes) => {
    try {
      const response = await api.put(`/messages/${id}/status`, { status, adminNotes });
      return response.data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  },

  // Delete message
  delete: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};

export default api;

