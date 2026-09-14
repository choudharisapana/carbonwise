import React, {
  createContext,
  useState,
  useEffect
} from "react";

import axios from "axios";
import authService from "../services/authService";


export const AuthContext =
  createContext();


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


const AuthProvider = ({ children }) => {


  const [user, setUser] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [isAuthenticated, setIsAuthenticated] =
    useState(false);



  // =================================
  // AXIOS CONFIGURATION
  // =================================

  axios.defaults.baseURL =
    API_URL;



  // =================================
  // LOAD EXISTING USER
  // Runs when application starts
  // =================================

  useEffect(() => {


    const loadUser =
      async () => {


        const token =
          localStorage.getItem("token");


        if (!token) {

          setLoading(false);

          return;

        }


        try {


          // Set Authorization Header

          axios.defaults.headers.common[
            "Authorization"
          ] =
            `Bearer ${token}`;


          // Verify Token

          const response =
            await authService.verifyToken(
              token
            );


          if (
            response.success &&
            response.user
          ) {


            setUser(
              response.user
            );


            setIsAuthenticated(
              true
            );

          }

          else {


            // Invalid response

            localStorage.removeItem(
              "token"
            );


            delete axios.defaults.headers.common[
              "Authorization"
            ];


            setUser(null);


            setIsAuthenticated(
              false
            );

          }


        } catch (error) {


          console.error(
            "Auth load error:",
            error.response?.data ||
            error.message
          );


          // Remove Invalid Token

          localStorage.removeItem(
            "token"
          );


          delete axios.defaults.headers.common[
            "Authorization"
          ];


          setUser(null);


          setIsAuthenticated(
            false
          );


        } finally {


          setLoading(false);

        }


      };


    loadUser();


  }, []);



  // =================================
  // REGISTER USER
  // =================================

  const register =
    async (
      name,
      email,
      password
    ) => {


      return await authService.register(
        name,
        email,
        password
      );


    };



  // =================================
  // NORMAL EMAIL LOGIN
  // =================================

  const login =
    async (
      email,
      password
    ) => {


      try {


        const response =
          await authService.login(
            email,
            password
          );


        // Validate Backend Response

        if (
          !response.success ||
          !response.token ||
          !response.user
        ) {

          throw new Error(
            response.message ||
            "Login failed"
          );

        }


        const {
          token,
          user
        } =
          response;


        // Save Token

        localStorage.setItem(
          "token",
          token
        );


        // Set Authorization Header

        axios.defaults.headers.common[
          "Authorization"
        ] =
          `Bearer ${token}`;


        // Update User

        setUser(
          user
        );


        // Update Authentication

        setIsAuthenticated(
          true
        );


        return response;


      } catch (error) {


        console.error(
          "Login error:",
          error.response?.data ||
          error.message
        );


        // Email Verification Required

        if (
          error.response?.data
            ?.needsVerification
        ) {

          return {

            success: false,

            needsVerification: true,

            email:
              error.response.data.email,

            message:
              error.response.data.message

          };

        }


        throw error;


      }


    };



  // =================================
  // GITHUB OAUTH LOGIN
  // =================================

  const githubLogin =
    async (token) => {


      try {


        if (!token) {

          throw new Error(
            "GitHub authentication token not received"
          );

        }


        // Save Token

        localStorage.setItem(
          "token",
          token
        );


        // Set Authorization Header

        axios.defaults.headers.common[
          "Authorization"
        ] =
          `Bearer ${token}`;


        // Verify Token & Get User

        const response =
          await authService.verifyToken(
            token
          );


        if (
          !response.success ||
          !response.user
        ) {

          throw new Error(
            response.message ||
            "Failed to authenticate with GitHub"
          );

        }


        // Update User

        setUser(
          response.user
        );


        // Update Authentication

        setIsAuthenticated(
          true
        );


        return {

          success: true,

          user:
            response.user

        };


      } catch (error) {


        console.error(
          "GitHub login error:",
          error.response?.data ||
          error.message
        );


        // Clean Invalid Authentication

        localStorage.removeItem(
          "token"
        );


        delete axios.defaults.headers.common[
          "Authorization"
        ];


        setUser(null);


        setIsAuthenticated(
          false
        );


        throw error;


      }


    };



  // =================================
  // RESEND VERIFICATION
  // =================================

  const resendVerification =
    async (email) => {


      return await authService
        .resendVerification(
          email
        );


    };



  // =================================
  // FORGOT PASSWORD
  // =================================

  const forgotPassword =
    async (email) => {


      return await authService
        .forgotPassword(
          email
        );


    };



  // =================================
  // RESET PASSWORD
  // =================================

  const resetPassword =
    async (
      token,
      newPassword
    ) => {


      return await authService
        .resetPassword(
          token,
          newPassword
        );


    };



  // =================================
  // LOGOUT
  // =================================

  const logout = () => {


    localStorage.removeItem(
      "token"
    );


    delete axios.defaults.headers.common[
      "Authorization"
    ];


    setUser(null);


    setIsAuthenticated(
      false
    );


  };



  // =================================
  // CONTEXT VALUE
  // =================================

  const value = {


    user,


    loading,


    isAuthenticated,


    // Authentication

    register,

    login,

    githubLogin,

    logout,


    // Email

    resendVerification,

    forgotPassword,

    resetPassword,


    // User

    setUser


  };



  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>

  );


};


export default AuthProvider;