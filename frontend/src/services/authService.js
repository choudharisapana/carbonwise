// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
  // Register user - No token returned
  register: async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password
    });
    return response.data; // ✅ Only success message
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email - GET with token param
  verifyEmail: async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification
  resendVerification: async (email) => {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
    return response.data;
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Forgot password - request reset email
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  // Reset password - submit new password with token
  resetPassword: async (token, newPassword) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        return null;
      }
    }
    return null;
  }
};

export default authService;