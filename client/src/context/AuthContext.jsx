import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const response = await axios.get(`${apiUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('adminToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('adminToken', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // More specific error messages
      if (!error.response) {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend server is running on port 8000.'
        };
      }
      
      if (error.response.status === 401 || error.response.status === 403) {
        return {
          success: false,
          message: error.response.data?.message || 'Invalid username or password.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || `Login failed: ${error.message}`
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getAuthToken,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

