// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await authService.verifyToken(token);

if (response.success) {
  setUser(response.user);
  setIsAuthenticated(true);
}
        }
      } catch (error) {
        console.error('Auth load error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ Register - No auto-login
  const register = async (
    name,
    email,
    password
) => {

    try {

        const response =
            await authService.register(
                name,
                email,
                password
            );

        return response;

    } catch(error){

        throw error;
    }
};

  // ✅ Login - Check verification
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
  
     const { token, user } = response;
localStorage.setItem('token', token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

setUser(user);      // ✅
setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.needsVerification) {
        return { 
          success: false, 
          needsVerification: true, 
          email: error.response?.data?.email 
        };
      }
      
      throw error;
    }
  };

  // ✅ Resend verification
  const resendVerification = async (email) => {
    try {
        const response =
            await authService.resendVerification(email);

        return response;     // ✅
    } catch(error){
        throw error;
    }
};

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    resendVerification,
    forgotPassword,
    resetPassword,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;