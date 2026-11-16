
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach JWT token to every API request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired or invalid JWT tokens
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestURL = error.config?.url;

    // Don't log out users for incorrect login or registration details
    const isAuthRequest =
      requestURL?.includes('/users/login') ||
      requestURL?.includes('/users/register');

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');

      // Return the user to the login screen
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default API;
