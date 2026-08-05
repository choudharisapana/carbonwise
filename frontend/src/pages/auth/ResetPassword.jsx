// frontend/src/pages/auth/ResetPassword.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLeaf, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(formData.newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, formData.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
                <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
                <p className="text-emerald-300/50 mt-2 text-sm">Enter your new password below</p>
              </div>

              {!token && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-3 rounded-xl mb-4">
                  <p className="text-sm">
                    No reset token found in this link. Please use the link from your email, or request a new one.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-emerald-300/60 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-4 py-3 bg-[#071021]/80 border border-emerald-500/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 pr-12"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/40 hover:text-emerald-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-300/30 mt-1">At least 8 characters, with 1 uppercase letter and 1 number</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald-300/60 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-4 py-3 bg-[#071021]/80 border border-emerald-500/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full group" loading={loading}>
                  <span className="flex items-center justify-center gap-2">
                    Reset Password
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-2xl text-emerald-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
              <p className="text-emerald-300/50 text-sm">
                Your password has been changed successfully. Redirecting you to login...
              </p>
            </div>
          )}

          <p className="text-center text-emerald-300/30 mt-6 text-sm">
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
