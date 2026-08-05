// frontend/src/pages/auth/VerifyEmail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaLeaf,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa';
import axios from 'axios';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
      setError('No verification token provided');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`
      );

      if (response.data.success) {
        setSuccess(true);
        setError('');

        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      }
    } catch (err) {
      setSuccess(false);
      setError(
        err.response?.data?.message ||
        'Verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mx-auto" />
          <p className="text-dark-400 mt-4">
            Verifying your email...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">

          <div className="flex items-center justify-center gap-2 mb-6">
            <FaLeaf className="text-primary-500 text-3xl" />
            <h1 className="text-2xl font-bold text-white">
              CodeCarbon AI
            </h1>
          </div>

          {success ? (
            <div>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Email Verified! 🎉
              </h2>

              <p className="text-dark-400 mb-4">
                Your email has been successfully verified.
              </p>

              <Link to="/login?verified=true">
                <Button variant="primary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <FaExclamationCircle className="text-5xl text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Verification Failed
              </h2>

              <p className="text-dark-400 mb-6">
                {error}
              </p>

              <div className="space-y-3">
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Back to Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button variant="secondary" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;