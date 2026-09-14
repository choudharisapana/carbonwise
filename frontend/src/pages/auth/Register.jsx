// frontend/src/pages/auth/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaCheckCircle, 
  FaRocket, 
  FaChartLine, 
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaCloud
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);

  // Same pattern as Login.jsx — reused, not duplicated logic
  const BACKEND_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  const handleGithubLogin = () => {
    setGithubLoading(true);
    setError('');
    window.location.href = `${BACKEND_URL}/api/auth/github/login`;
  };
  
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !success) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, success, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData.name, formData.email, formData.password);
      
      setSuccess(true);
      setRegisteredEmail(formData.email);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors?.length) {
        setError(validationErrors.map((e) => e.message).join(' '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 border border-emerald-100/50 p-8 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <FaEnvelope className="text-4xl text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email! 📧</h2>
          <p className="text-gray-500 mb-2">
            We've sent a verification email to:
          </p>
          <p className="text-emerald-700 font-semibold text-lg mb-6">
            {registeredEmail}
          </p>
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-100/50 mb-6">
            <p className="text-sm text-gray-600">
              Please click the verification link in the email to activate your account.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              ⏰ The link will expire in 24 hours
            </p>
          </div>
          <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 mt-4">
            <p className="text-amber-700 font-medium">
              ⏳ Waiting for email verification...
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Please open your email and click the verification link.
            </p>
          </div>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-4 transition-colors duration-200"
          >
            Go to Login Now <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Subtle Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl shadow-emerald-900/20">
                <FaLeaf className="text-3xl text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Code<span className="text-emerald-200">Wise</span>
              </h1>
              <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/90 border border-white/20 mt-1">
                Green DevOps Platform
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-light text-white/90 mb-8 leading-relaxed">
            Sustainable Software Development <br />
            <span className="text-emerald-200 font-medium">Platform</span>
          </h2>
          
          <ul className="space-y-4">
            {[
              { icon: FaCheckCircle, text: 'Carbon Footprint Analysis' },
              { icon: FaRocket, text: 'AI-Powered Optimizations' },
              { icon: FaChartLine, text: 'Repository Analytics' },
              { icon: FaFileAlt, text: 'Sustainability Reports' }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-white/80 text-base group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <item.icon className="text-emerald-200 text-sm group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
              </li>
            ))}
          </ul>

          {/* Trust Badges */}
          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <FaShieldAlt className="text-emerald-200" />
              <span>Secure</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <FaUsers className="text-emerald-200" />
              <span>Community</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <FaCloud className="text-emerald-200" />
              <span>Cloud Native</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-2xl"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto">
                <FaLeaf className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              Carbon<span className="text-emerald-600">Wise</span>
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h2>
              <p className="text-gray-500 mt-2 text-sm">Start your green software journey today</p>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-xl mb-6 animate-fade-in text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 pr-12"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">At least 8 characters, with 1 uppercase letter and 1 number</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 pr-12"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  className="w-4 h-4 mt-1 rounded border-gray-300 bg-gray-50 text-emerald-600 focus:ring-emerald-400 focus:ring-offset-0 transition-colors"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                variant="primary"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Sign In →
              </Link>
            </p>

            {/* Social Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/70"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={githubLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50/50 border border-gray-200/70 rounded-xl text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {githubLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;