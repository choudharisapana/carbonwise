// frontend/src/pages/auth/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaCheckCircle, 
  FaRocket, 
  FaChartLine, 
  FaFileAlt,
  FaGithub,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope
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
  const [success, setSuccess] = useState(false); // ✅ Track success state
  const [registeredEmail, setRegisteredEmail] = useState(''); // ✅ Store email for display
  
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
      
      // ✅ Show success message instead of redirecting to dashboard
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
      // Backend sends a detailed `errors` array for validation failures —
      // show the specific reason instead of a generic message.
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

  // ✅ Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
        <div className="w-full max-w-md bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-4xl text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email! 📧</h2>
          <p className="text-dark-400 mb-2">
            We've sent a verification email to:
          </p>
          <p className="text-white font-medium mb-4">
            {registeredEmail}
          </p>
          <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 mb-6">
            <p className="text-sm text-dark-300">
              Please click the verification link in the email to activate your account.
            </p>
            <p className="text-xs text-dark-500 mt-2">
               The link will expire in 24 hours
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-4">
           <p className="text-yellow-400">
        Waiting for email verification...
      </p>

     <p className="text-dark-400 text-sm mt-2">
        Please open your email and click the verification link.
    </p>
</div>
          <Link to="/login" className="text-primary-500 hover:text-primary-400 text-sm mt-2 inline-block">
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-stretch bg-dark-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="flex items-center gap-3 mb-6">
            <FaLeaf className="text-5xl text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">CodeCarbon AI</h1>
              <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white mt-1">
                Green DevOps
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl font-light text-white/90 mb-8">
            Sustainable Software Development Platform
          </h2>
          
          <ul className="space-y-4">
            {[
              { icon: FaCheckCircle, text: 'Carbon Footprint Analysis' },
              { icon: FaRocket, text: 'AI-Powered Optimizations' },
              { icon: FaChartLine, text: 'Repository Analytics' },
              { icon: FaFileAlt, text: 'Sustainability Reports' }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-white/90 text-lg">
                <item.icon className="text-2xl text-white" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <FaLeaf className="text-5xl text-primary-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white">CodeCarbon AI</h1>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="text-dark-400 mt-2">Start your green software journey today</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-primary"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-primary"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="input-primary pr-12"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-dark-400 mt-1">At least 8 characters, with 1 uppercase letter and 1 number</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="input-primary pr-12"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 mt-1"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm text-dark-400 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-500 hover:text-primary-400 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-500 hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                variant="primary"
                className="w-full"
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-dark-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;