import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AuthContext = createContext(null);

/**
 * Custom hook to use the AuthContext
 * @throws {Error} if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Check if user is authenticated on mount
   * Calls /auth/me to verify JWT cookie
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (error) {
        // User is not authenticated or token is invalid
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   */
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      setUser(response.data.data);
      toast.success('Registration successful! Welcome aboard.');
      navigate('/');
    } catch (error) {
      // Error handling is done by axios interceptor
      throw error;
    }
  };

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setUser(response.data.data);
      toast.success(`Welcome back, ${response.data.data.name}!`);
      navigate('/');
    } catch (error) {
      // Error handling is done by axios interceptor
      throw error;
    }
  };

  /**
   * Logout user
   * Calls /auth/logout to clear the HTTP-only cookie
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      // Even if the API call fails, clear local state
      setUser(null);
      navigate('/login');
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - { name, email }
   */
  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      setUser(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   */
  const changePassword = async (passwords) => {
    try {
      await api.put('/auth/password', passwords);
      toast.success('Password changed successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete account
   */
  const deleteAccount = async () => {
    try {
      await api.delete('/auth/account');
      setUser(null);
      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
