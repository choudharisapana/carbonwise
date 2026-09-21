import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const BACKEND_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  useEffect(() => {
    if (isAuthenticated && !success) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, success, navigate]);

  const handleGithubLogin = () => {
    setGithubLoading(true);
    setError('');
    window.location.href = `${BACKEND_URL}/api/auth/github/login`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

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
      await register(formData.name, formData.email, formData.password);

      setSuccess(true);
      setRegisteredEmail(formData.email);

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      if (validationErrors?.length) {
        setError(validationErrors.map((e) => e.message).join(' '));
      } else {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Carbon Emission Analysis',
    'AI-Powered Code Optimization Suggestions',
    'Repository Sustainability Insights',
    'Automated ESG Reports',
  ];

  const inputClass =
    'w-full rounded-xl border border-emerald-400/10 bg-[#071021] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="min-h-screen bg-[#071021] text-white">
      <div className="min-h-screen flex">
        
        <section
          className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-1/2"
          style={{
            background:
              'linear-gradient(135deg, #081C15 0%, #123524 50%, #1B5E3A 100%)',
          }}
        >
          {/* Decorative glows — same visual language as Login */}
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-center px-10 xl:px-16">
            {/* Logo */}
            <div className="mb-9 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-950/30">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2.2} />
              </div>

              <div className="text-2xl font-bold tracking-tight">
                Carbon<span className="text-emerald-300">Wise</span>
              </div>
            </div>

            {/* Badge */}
            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
              Green Software Intelligence
            </div>

            {/* Heading */}
            <h1    className="
              text-3xl
              xl:text-4xl
              font-bold
              text-white/90
              leading-relaxed
              mb-4
            ">
              Build Better Software.
              <br />
              <span className="text-emerald-300">
                Build a Greener Future.
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-lg text-base leading-7 text-emerald-50/70">
              Measure, analyze and optimize the environmental impact of your
              software development.
            </p>


            <div className="mt-8 space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  </div>

                  <span className="text-sm text-emerald-50/80">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <p className="mt-9 max-w-md border-l-2 border-emerald-400/50 pl-4 text-sm italic text-emerald-100/60">
              Sustainable development starts with smarter decisions.
            </p>
          </div>
        </section>


        <section className="flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-5 sm:px-6 lg:w-1/2 lg:px-10 lg:py-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo — same as Login */}
            <div className="mb-6 flex items-center justify-center lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-950/30">
                  <Leaf className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>

                <div className="text-xl font-bold tracking-tight">
                  Carbon<span className="text-emerald-300">Wise</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/10 bg-[#0F172A]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
              {!success ? (
                <>
                  {/* Header */}
                  <div className="mb-5">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                      Create Your Account
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      Start your sustainability journey with CarbonWise.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    disabled={githubLoading || loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-600/70 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {githubLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaGithub className="h-5 w-5" />
                    )}

                    {githubLoading ? 'Connecting...' : 'Continue with GitHub'}
                  </button>

                  {/* Divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-700/70" />

                    <span className="whitespace-nowrap text-[10px] font-medium tracking-wider text-slate-500">
                      OR CONTINUE WITH EMAIL
                    </span>

                    <div className="h-px flex-1 bg-slate-700/70" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          disabled={loading}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                      >
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={loading}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          disabled={loading}
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-emerald-300"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                        At least 8 characters, with 1 uppercase letter and 1
                        number
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                      >
                        Confirm Password
                      </label>

                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          autoComplete="new-password"
                          disabled={loading}
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-emerald-300"
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex cursor-pointer items-start gap-2.5 pt-0.5">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-emerald-500"
                      />

                      <span className="text-xs leading-5 text-slate-400">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          className="font-medium text-emerald-300 transition hover:text-emerald-200"
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="font-medium text-emerald-300 transition hover:text-emerald-200"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>

                    {/* Submit */}
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={loading || githubLoading}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Login */}
                  <p className="mt-5 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-emerald-300 transition hover:text-emerald-200"
                    >
                      Sign In →
                    </Link>
                  </p>
                </>
              ) : (
                
                <div className="py-3 text-center sm:py-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Check Your Email!
                  </h2>

                  <p className="mx-auto mt-2 text-sm leading-6 text-slate-400">
                    We&apos;ve sent a verification link to
                  </p>

                  <p className="mt-1 break-all px-2 text-sm font-semibold text-emerald-300">
                    {registeredEmail}
                  </p>

                  <div className="mt-5 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4 text-left">
                    <p className="text-sm leading-6 text-amber-200/80">
                      Please check your inbox and verify your email address
                      before signing in. If you don&apos;t see the email,
                      check your spam or junk folder.
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
                  >
                    Go to Sign In
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <p className="mt-4 text-xs text-slate-500">
                    Your account has been created successfully.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-slate-600 lg:hidden">
              © {new Date().getFullYear()} CarbonWise. Build greener software.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
