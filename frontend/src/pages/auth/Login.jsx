// // frontend/src/pages/auth/Login.jsx - Add verification handling
// import React, { useState, useContext, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   FaLeaf, 
//   FaCheckCircle, 
//   FaRocket, 
//   FaChartLine, 
//   FaFileAlt,
//   FaGithub,
//   FaGoogle,
//   FaEye,
//   FaEyeSlash,
//   FaCheck
// } from 'react-icons/fa';
// import { AuthContext } from '../../context/AuthContext';
// import Button from '../../components/common/Button';

// const Login = () => {
//   const [searchParams] = useSearchParams();
//   const verified = searchParams.get('verified') === 'true';
//   const registered = searchParams.get('registered') === 'true';
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [verificationMessage, setVerificationMessage] = useState('');
//   const [pendingEmail, setPendingEmail] = useState('');
  
//   const { login, isAuthenticated, resendVerification } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   // Show success message when verified
//   useEffect(() => {
//     if (verified) {
//       setVerificationMessage(' Email verified successfully! You can now login.');
//     }
//     if (registered) {
//       setVerificationMessage(' Registration successful! Please check your email to verify your account.');
//     }
//   }, [verified, registered]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleResendVerification = async () => {
//     if (!pendingEmail) {
//       setError('Please enter your email address');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await resendVerification(pendingEmail);
//       if (response.success) {
//         setError('');
//         setVerificationMessage('✅ Verification email resent! Please check your inbox.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to resend verification');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setVerificationMessage('');

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await login(formData.email, formData.password);
      
//       if (result.success) {
//         navigate('/dashboard');
//       } else if (result.needsVerification) {
//         setVerificationMessage('📧 Please verify your email before logging in.');
//         setPendingEmail(formData.email);
//         setError('');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-stretch bg-dark-950">
//       {/* Left Side - Branding */}
//       <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
//         </div>
        
//         <div className="relative z-10 flex flex-col justify-center px-16 py-12">
//           <div className="flex items-center gap-3 mb-6">
//             <FaLeaf className="text-5xl text-white" />
//             <div>
//               <h1 className="text-4xl font-bold text-white">CodeCarbon AI</h1>
//               <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white mt-1">
//                 Green DevOps
//               </span>
//             </div>
//           </div>
          
//           <h2 className="text-3xl font-light text-white/90 mb-8">
//             Sustainable Software Development Platform
//           </h2>
          
//           <ul className="space-y-4">
//             {[
//               { icon: FaCheckCircle, text: 'Carbon Footprint Analysis' },
//               { icon: FaRocket, text: 'AI-Powered Optimizations' },
//               { icon: FaChartLine, text: 'Repository Analytics' },
//               { icon: FaFileAlt, text: 'Sustainability Reports' }
//             ].map((item, index) => (
//               <li key={index} className="flex items-center gap-3 text-white/90 text-lg">
//                 <item.icon className="text-2xl text-white" />
//                 <span>{item.text}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden text-center mb-8">
//             <FaLeaf className="text-5xl text-primary-500 mx-auto mb-3" />
//             <h1 className="text-3xl font-bold text-white">CodeCarbon AI</h1>
//           </div>

//           <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
//               <p className="text-dark-400 mt-2">Sign in to your CodeCarbon AI account</p>
//             </div>

//           {/* ✅ Verification Success Message */}
//             {verificationMessage && (
//               <div className={`${
//                 verificationMessage.includes('✅') 
//                   ? 'bg-green-500/10 border-green-500/50 text-green-400' 
//                   : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
//               } px-4 py-3 rounded-xl mb-4 animate-fade-in flex items-start gap-2`}>
//                 <FaCheck className="mt-1 flex-shrink-0" />
//                 <div>
//                   <p>{verificationMessage}</p>
//                   {pendingEmail && (
//                     <button 
//                       onClick={handleResendVerification}
//                       className="text-sm text-primary-500 hover:text-primary-400 mt-1"
//                     >
//                       Resend verification email
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 animate-fade-in">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"            
//                   name="email"
//                   className="input-primary"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     className="input-primary pr-12"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="rememberMe"
//                     className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                   />
//                   <span className="text-sm text-dark-400">Remember me</span>
//                 </label>
//                 <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button 
//                 type="submit" 
//                 variant="primary"
//                 className="w-full"
//                 loading={loading}
//               >
//                 Sign In
//               </Button>
//             </form>

//             <p className="text-center text-dark-400 mt-6">
//               Don't have an account?{' '}
//               <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
//                 Create one
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// frontend/src/pages/auth/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaLeaf, 
  FaCheckCircle, 
  FaRocket, 
  FaChartLine, 
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  const registered = searchParams.get('registered') === 'true';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  
  const { login, isAuthenticated, resendVerification } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Show success message when verified
  useEffect(() => {
    if (verified) {
      setVerificationMessage('Email verified successfully! You can now login.');
    }
    if (registered) {
      setVerificationMessage('Registration successful! Please check your email to verify your account.');
    }
  }, [verified, registered]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResendVerification = async () => {
    if (!pendingEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await resendVerification(pendingEmail);
      if (response.success) {
        setError('');
        setVerificationMessage('✅ Verification email resent! Please check your inbox.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationMessage('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else if (result.needsVerification) {
        setVerificationMessage('📧 Please verify your email before logging in.');
        setPendingEmail(formData.email);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#071021]">
      {/* Left Side - Branding with Forest Green Gradient */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0B1F16, #163126, #1F5134)'
      }}>
        {/* Background Decor */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <FaLeaf className="text-3xl text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Code<span className="text-emerald-300">Carbon</span> AI
              </h1>
              <span className="inline-block bg-emerald-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-emerald-200/80 border border-emerald-500/20 mt-1">
                Green DevOps Platform
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-light text-white/80 mb-10 leading-relaxed">
            Sustainable Software Development <br />
            <span className="text-emerald-300 font-medium">Platform</span>
          </h2>
          
          <ul className="space-y-5">
            {[
              { icon: FaCheckCircle, text: 'Carbon Emission Analysis' },
              { icon: FaRocket, text: 'AI Optimization Suggestions' },
              { icon: FaChartLine, text: 'Repository Sustainability Score' },
              { icon: FaFileAlt, text: 'ESG Reporting Dashboard' }
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-4 text-white/80 text-base group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40 transition-all duration-300">
                  <item.icon className="text-emerald-300 text-base group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl"></div>
              <FaLeaf className="text-5xl text-emerald-400 mx-auto mb-3 relative" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Code<span className="text-emerald-400">Carbon</span> AI
            </h1>
          </div>

          {/* Premium Login Card */}
          <div className="bg-[#0F172A]/85 backdrop-blur-[20px] border border-emerald-500/15 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-emerald-300/50 mt-2 text-sm">Sign in to your CodeCarbon AI account</p>
            </div>

            {/* Verification Success Message */}
            {verificationMessage && (
              <div className={`${
                verificationMessage.includes('✅') 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              } px-4 py-3 rounded-xl mb-4 animate-fade-in flex items-start gap-2 backdrop-blur-sm`}>
                <FaCheck className="mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">{verificationMessage}</p>
                  {pendingEmail && (
                    <button 
                      onClick={handleResendVerification}
                      className="text-sm text-emerald-400 hover:text-emerald-300 mt-1 transition-colors duration-200"
                    >
                      Resend verification email →
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 animate-fade-in backdrop-blur-sm">
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-emerald-300/60 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 bg-[#071021]/80 border border-emerald-500/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 pr-12"
                    placeholder="Enter your password"
                    value={formData.password}
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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="w-4 h-4 rounded border-emerald-500/20 bg-[#071021] text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-200"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-emerald-300/40 group-hover:text-emerald-300/60 transition-colors duration-200">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="primary"
                className="w-full group"
                loading={loading}
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </form>

            <p className="text-center text-emerald-300/30 mt-6 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
                Create one →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;