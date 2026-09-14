import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import GitHubSuccess from './pages/auth/GitHubSuccess';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import RepositoryAnalysis from './pages/repository/RepositoryAnalysis';
import AnalysisDetails from './pages/repository/AnalysisDetails';

import Reports from './pages/reports/Reports';
import ReportDetails from './pages/reports/ReportDetails';

import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';

// Styles
import './index.css';


function App() {

  return (

    <Router>

      <AuthProvider>

        <ThemeProvider>

          <Routes>


            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route
              path="/privacy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/terms"
              element={<TermsOfService />}
            />


            {/* Email Verification */}

            <Route
              path="/verify-email/:token"
              element={<VerifyEmail />}
            />


            {/* GitHub OAuth Success */}

            <Route
  path="/auth/github-success"
  element={<GitHubSuccess />}
/>
            {/* =========================
                PROTECTED ROUTES
            ========================= */}

            <Route element={<ProtectedRoute />}>


              <Route
                path="/"
                element={
                  <Layout>
                    <Navigate to="/dashboard" />
                  </Layout>
                }
              />


              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />


              <Route
                path="/repository"
                element={
                  <Layout>
                    <RepositoryAnalysis />
                  </Layout>
                }
              />


              <Route
                path="/analysis/:id"
                element={
                  <Layout>
                    <AnalysisDetails />
                  </Layout>
                }
              />


              <Route
                path="/reports"
                element={
                  <Layout>
                    <Reports />
                  </Layout>
                }
              />


              <Route
                path="/reports/:id"
                element={
                  <Layout>
                    <ReportDetails />
                  </Layout>
                }
              />


              <Route
                path="/analytics"
                element={
                  <Layout>
                    <Analytics />
                  </Layout>
                }
              />


              <Route
                path="/settings"
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                }
              />


            </Route>


            {/* =========================
                404 REDIRECT
            ========================= */}

            <Route
              path="*"
              element={<Navigate to="/login" />}
            />


          </Routes>

        </ThemeProvider>

      </AuthProvider>

    </Router>

  );

}


export default App;