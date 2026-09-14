import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const authService = {

  // ================================
  // Register User
  // ================================

  register: async (name, email, password) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/auth/register`,
          {
            name,
            email,
            password
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        'Register error:',
        error.response?.data || error.message
      );

      throw error;
    }
  },


  // ================================
  // Login User
  // ================================

  login: async (email, password) => {

    try {

      const response =
        await axios.post(
          `${API_URL}/auth/login`,
          {
            email,
            password
          }
        );

      return response.data;

    } catch (error) {

      // IMPORTANT:
      // This will show the REAL backend reason
      console.error(
        'Login backend response:',
        error.response?.data
      );

      console.error(
        'Login status:',
        error.response?.status
      );

      throw error;
    }
  },


  // ================================
  // Verify Email
  // ================================

  verifyEmail: async (token) => {

    const response =
      await axios.get(
        `${API_URL}/auth/verify-email/${token}`
      );

    return response.data;
  },


  // ================================
  // Resend Verification
  // ================================

  resendVerification: async (email) => {

    const response =
      await axios.post(
        `${API_URL}/auth/resend-verification`,
        { email }
      );

    return response.data;
  },


  // ================================
  // Verify JWT Token
  // ================================

  verifyToken: async (token) => {

    const response =
      await axios.get(
        `${API_URL}/auth/verify`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  },


  // ================================
  // Forgot Password
  // ================================

  forgotPassword: async (email) => {

    const response =
      await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

    return response.data;
  },


  // ================================
  // Reset Password
  // ================================

  resetPassword: async (
    token,
    newPassword
  ) => {

    const response =
      await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          token,
          newPassword
        }
      );

    return response.data;
  },


  // ================================
  // Logout
  // ================================

  logout: () => {

    localStorage.removeItem('token');

  },


  // ================================
  // Get Current User
  // ================================

  getCurrentUser: () => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {

      const payload =
        token.split('.')[1];

      return JSON.parse(
        atob(payload)
      );

    } catch (error) {

      console.error(
        'Invalid token:',
        error
      );

      return null;
    }
  }

};

export default authService;