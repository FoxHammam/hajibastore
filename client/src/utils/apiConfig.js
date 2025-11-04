// Centralized API configuration
// Use environment variable or default for development
export const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  if (envURL) {
    // Ensure it ends with /api
    if (envURL.endsWith('/api')) {
      return envURL;
    }
    return envURL.endsWith('/') ? `${envURL}api` : `${envURL}/api`;
  }
  
  // Default for development
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = getAPIBaseURL();

