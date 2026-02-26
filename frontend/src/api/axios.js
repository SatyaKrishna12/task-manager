import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Axios instance with default configuration
 * - Base URL from environment variable
 * - Credentials included for HTTP-only cookies
 * - JSON content type
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Logs outgoing requests in development
 */
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles global error responses
 * - Automatically shows toast notifications for errors
 * - Redirects to login on 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response || error);
    }

    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request - validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => toast.error(err.message || err.msg));
          } else {
            toast.error(data.message || 'Invalid request');
          }
          break;

        case 401:
          // Unauthorized - don't redirect automatically
          // Let the AuthContext and ProtectedRoute handle this
          if (!error.config.url?.includes('/auth/me')) {
            toast.error('Session expired. Please login again.');
          }
          break;

        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;

        case 404:
          // Not Found
          toast.error(data.message || 'Resource not found');
          break;

        case 429:
          // Too Many Requests
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
          // Internal Server Error
          toast.error('Server error. Please try again later.');
          break;

        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error - no response received
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Other errors
      toast.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;
