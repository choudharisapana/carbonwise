// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import RepositoryAnalysis from './pages/repository/RepositoryAnalysis';
import AnalysisDetails from "./pages/repository/AnalysisDetails";

import Reports from './pages/reports/Reports';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import VerifyEmail from './pages/auth/VerifyEmail';


// Styles
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Verify Email should be PUBLIC */}
    <Route
    path="/verify-email/:token"
    element={<VerifyEmail />}
    />
          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Navigate to="/dashboard" /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/repository" element={<Layout><RepositoryAnalysis /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route
    path="/analysis/:id"
    element={<AnalysisDetails />}
/>
          </Route>
         
          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;