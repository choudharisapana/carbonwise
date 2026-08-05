// frontend/src/pages/auth/ForgotPassword.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaEnvelope, FaArrowRight, FaCheck } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071021] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl"></div>
            <FaLeaf className="text-5xl text-emerald-400 mx-auto mb-3 relative" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Code<span className="text-emerald-400">Carbon</span> AI
          </h1>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-[20px] border border-emerald-500/15 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h2>
                <p className="text-emerald-300/50 mt-2 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-emerald-300/60 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-[#071021]/80 border border-emerald-500/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full group" loading={loading}>
                  <span className="flex items-center justify-center gap-2">
                    Send Reset Link
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <FaEnvelope className="text-2xl text-emerald-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email!</h2>
              <p className="text-emerald-300/50 text-sm mb-2">We've sent a password reset link to:</p>
              <p className="text-white font-medium mb-6">{email}</p>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl flex items-start gap-2 text-left">
                <FaCheck className="mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Click the link in the email to reset your password. The link will expire in 15 minutes.
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-emerald-300/30 mt-6 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
              Back to Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
