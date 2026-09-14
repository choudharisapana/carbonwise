// frontend/src/pages/auth/Login.jsx

import React, {
  useState,
  useContext,
  useEffect
} from 'react';

import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import {
  FaLeaf,
  FaCheckCircle,
  FaRocket,
  FaChartLine,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaArrowRight,
  FaGithub
} from 'react-icons/fa';

import {
  AuthContext
} from '../../context/AuthContext';

import Button from '../../components/common/Button';


// ==========================================
// API URL
// ==========================================

// ==========================================
// API URL
// ==========================================

const BACKEND_URL =
  (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');


// ==========================================
// LOGIN COMPONENT
// ==========================================

const Login = () => {

  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();


  const {
    login,
    isAuthenticated,
    resendVerification
  } = useContext(AuthContext);


  // ==========================================
  // URL STATUS
  // ==========================================

  const verified =
    searchParams.get('verified') === 'true';

  const registered =
    searchParams.get('registered') === 'true';

  const githubError =
    searchParams.get('github') === 'error';


  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
      rememberMe: false
    });


  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [githubLoading, setGithubLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [
    verificationMessage,
    setVerificationMessage
  ] =
    useState('');

  const [pendingEmail, setPendingEmail] =
    useState('');


  // ==========================================
  // REDIRECT IF ALREADY LOGGED IN
  // ==========================================

  useEffect(() => {

    if (isAuthenticated) {

      navigate('/dashboard');

    }

  }, [
    isAuthenticated,
    navigate
  ]);


  // ==========================================
  // SUCCESS / ERROR MESSAGES
  // ==========================================

  useEffect(() => {

    if (verified) {

      setVerificationMessage(
        'Email verified successfully! You can now sign in.'
      );

    }


    if (registered) {

      setVerificationMessage(
        'Registration successful! Please check your email to verify your account.'
      );

    }


    if (githubError) {

      setError(
        'GitHub sign in failed. Please try again.'
      );

    }

  }, [
    verified,
    registered,
    githubError
  ]);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;


    setFormData((previousData) => ({

      ...previousData,

      [name]:
        type === 'checkbox'
          ? checked
          : value

    }));

  };


  // ==========================================
  // GITHUB LOGIN
  // ==========================================

  const handleGithubLogin = () => {

  setGithubLoading(true);

  setError('');

  window.location.href =
    `${BACKEND_URL}/api/auth/github/login`;

};


  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResendVerification =
    async () => {

      if (!pendingEmail) {

        setError(
          'Please enter your email address.'
        );

        return;

      }


      setLoading(true);


      try {

        const response =
          await resendVerification(
            pendingEmail
          );


        if (response.success) {

          setError('');

          setVerificationMessage(
            'Verification email resent successfully! Please check your inbox.'
          );

        }

      }

      catch (err) {

        setError(
          err.response?.data?.message ||
          'Failed to resend verification email.'
        );

      }

      finally {

        setLoading(false);

      }

    };


  // ==========================================
  // LOGIN SUBMIT
  // ==========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setError('');

      setVerificationMessage('');


      // Basic validation

      if (
        !formData.email ||
        !formData.password
      ) {

        setError(
          'Please fill in all required fields.'
        );

        return;

      }


      setLoading(true);


      try {

        const result =
          await login(
            formData.email,
            formData.password
          );


        if (result?.success) {

          navigate('/dashboard');

          return;

        }


        if (
          result?.needsVerification
        ) {

          setVerificationMessage(
            'Please verify your email before signing in.'
          );

          setPendingEmail(
            formData.email
          );

          setError('');

        }

      }

      catch (err) {

        setError(
          err.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
        );

      }

      finally {

        setLoading(false);

      }

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="min-h-screen flex bg-[#071021]">


      {/* ======================================
          LEFT BRANDING SECTION
      ====================================== */}

      <div
        className="
          hidden
          lg:flex
          lg:w-1/2
          relative
          overflow-hidden
        "

        style={{
          background:
            'linear-gradient(135deg, #081C15 0%, #123524 50%, #1B5E3A 100%)'
        }}
      >


        {/* Background Glow */}

        <div className="absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              -top-32
              -right-32
              w-96
              h-96
              rounded-full
              bg-emerald-400/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-32
              w-96
              h-96
              rounded-full
              bg-green-300/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              top-1/2
              left-1/2
              w-72
              h-72
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-emerald-300/5
              blur-3xl
            "
          />

        </div>


        {/* Branding Content */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            justify-center
            px-16
            xl:px-24
            py-12
            w-full
          "
        >


          {/* Logo */}

          <div
            className="
              flex
              items-center
              gap-4
              mb-10
            "
          >

            <div className="relative">

              <div
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  bg-emerald-400/30
                  blur-xl
                "
              />

              <div
                className="
                  relative
                  w-16
                  h-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-emerald-400
                  to-emerald-600
                  shadow-xl
                  shadow-emerald-500/20
                "
              >

                <FaLeaf
                  className="
                    text-white
                    text-3xl
                  "
                />

              </div>

            </div>


            <div>

              <h1
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >

                Carbon
                <span className="text-emerald-300">
                  Wise
                </span>

              </h1>


              <div
                className="
                  inline-flex
                  items-center
                  mt-2
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  text-emerald-100/80
                  bg-emerald-400/10
                  border
                  border-emerald-300/20
                  backdrop-blur-sm
                "
              >

                Green Software Intelligence

              </div>

            </div>

          </div>


          {/* Heading */}

          <h2
            className="
              text-3xl
              xl:text-4xl
              font-light
              text-white/90
              leading-relaxed
              mb-4
            "
          >

            Build Better Software.

            <br />

            <span
              className="
                text-emerald-300
                font-medium
              "
            >

              Build a Greener Future.

            </span>

          </h2>


          <p
            className="
              max-w-md
              text-white/55
              leading-relaxed
              mb-12
            "
          >

            Measure, analyze and optimize the environmental
            impact of your software development.

          </p>


          {/* Features */}

          <div className="space-y-5">

            {[
              {
                icon: FaCheckCircle,
                text: 'Carbon Emission Analysis'
              },

              {
                icon: FaRocket,
                text: 'AI-Powered Code Optimization'
              },

              {
                icon: FaChartLine,
                text: 'Repository Sustainability Insights'
              },

              {
                icon: FaFileAlt,
                text: 'Automated ESG Reports'
              }

            ].map((item, index) => {

              const Icon =
                item.icon;


              return (

                <div
                  key={index}

                  className="
                    flex
                    items-center
                    gap-4
                    text-white/75
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      bg-emerald-400/10
                      border
                      border-emerald-300/15
                    "
                  >

                    <Icon
                      className="
                        text-emerald-300
                      "
                    />

                  </div>


                  <span>

                    {item.text}

                  </span>

                </div>

              );

            })}

          </div>


          {/* Bottom Tagline */}

          <div
            className="
              mt-14
              text-xs
              text-emerald-100/30
            "
          >

            Sustainable development starts with smarter decisions.

          </div>


        </div>

      </div>



      {/* ======================================
          RIGHT LOGIN SECTION
      ====================================== */}

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-5
          sm:px-8
          py-10
        "
      >


        <div
          className="
            w-full
            max-w-md
          "
        >


          {/* Mobile Branding */}

          <div
            className="
              lg:hidden
              text-center
              mb-8
            "
          >

            <div className="relative inline-block">

              <div
                className="
                  absolute
                  inset-0
                  bg-emerald-500/20
                  rounded-full
                  blur-2xl
                "
              />

              <FaLeaf
                className="
                  relative
                  mx-auto
                  text-5xl
                  text-emerald-400
                  mb-3
                "
              />

            </div>


            <h1
              className="
                text-3xl
                font-bold
                text-white
              "
            >

              Carbon
              <span className="text-emerald-400">
                Wise
              </span>

            </h1>


            <p
              className="
                text-sm
                text-emerald-300/40
                mt-2
              "
            >

              Green Software Intelligence

            </p>

          </div>



          {/* ======================================
              LOGIN CARD
          ====================================== */}

          <div
            className="
              bg-[#0F172A]/90
              backdrop-blur-xl
              border
              border-emerald-400/10
              rounded-3xl
              p-6
              sm:p-8
              shadow-2xl
              shadow-black/30
            "
          >


            {/* Header */}

            <div
              className="
                text-center
                mb-8
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  text-white
                "
              >

                Welcome Back

              </h2>


              <p
                className="
                  text-sm
                  text-emerald-200/40
                  mt-2
                "
              >

                Sign in to continue your sustainability journey.

              </p>

            </div>



            {/* ======================================
                SUCCESS / VERIFICATION MESSAGE
            ====================================== */}

            {verificationMessage && (

              <div
                className="
                  mb-5
                  p-4
                  rounded-xl
                  flex
                  items-start
                  gap-3
                  bg-emerald-500/10
                  border
                  border-emerald-400/20
                  text-emerald-200
                "
              >

                <FaCheck
                  className="
                    mt-1
                    flex-shrink-0
                    text-emerald-400
                  "
                />


                <div>

                  <p className="text-sm">

                    {verificationMessage}

                  </p>


                  {pendingEmail && (

                    <button
                      type="button"

                      onClick={
                        handleResendVerification
                      }

                      disabled={
                        loading
                      }

                      className="
                        mt-2
                        text-sm
                        text-emerald-400
                        hover:text-emerald-300
                        transition-colors
                        disabled:opacity-50
                      "
                    >

                      Resend verification email →

                    </button>

                  )}

                </div>

              </div>

            )}



            {/* ======================================
                ERROR MESSAGE
            ====================================== */}

            {error && (

              <div
                className="
                  mb-5
                  p-4
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-300
                  text-sm
                "
              >

                {error}

              </div>

            )}



            {/* ======================================
                GITHUB LOGIN
            ====================================== */}

            <button
              type="button"

              onClick={
                handleGithubLogin
              }

              disabled={
                githubLoading ||
                loading
              }

              className="
                w-full
                flex
                items-center
                justify-center
                gap-3
                py-3.5
                px-4
                rounded-xl
                bg-white
                text-gray-900
                font-semibold
                transition-all
                duration-200
                hover:bg-gray-100
                hover:-translate-y-0.5
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
              "
            >

              <FaGithub
                size={20}
              />

              {githubLoading
                ? 'Connecting to GitHub...'
                : 'Continue with GitHub'
              }

            </button>



            {/* ======================================
                DIVIDER
            ====================================== */}

            <div
              className="
                flex
                items-center
                gap-4
                my-7
              "
            >

              <div
                className="
                  flex-1
                  h-px
                  bg-white/10
                "
              />

              <span
                className="
                  text-xs
                  text-white/30
                "
              >

                OR CONTINUE WITH EMAIL

              </span>

              <div
                className="
                  flex-1
                  h-px
                  bg-white/10
                "
              />

            </div>



            {/* ======================================
                EMAIL LOGIN FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"

                  className="
                    block
                    mb-2
                    text-sm
                    font-medium
                    text-emerald-100/60
                  "
                >

                  Email Address

                </label>


                <input
                  type="email"

                  id="email"

                  name="email"

                  placeholder="you@example.com"

                  value={
                    formData.email
                  }

                  onChange={
                    handleChange
                  }

                  required

                  className="
                    w-full
                    px-4
                    py-3.5
                    rounded-xl
                    bg-[#071021]
                    border
                    border-emerald-400/10
                    text-white
                    placeholder:text-white/25
                    outline-none
                    transition-all
                    focus:border-emerald-400/40
                    focus:ring-2
                    focus:ring-emerald-400/10
                  "
                />

              </div>



              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"

                  className="
                    block
                    mb-2
                    text-sm
                    font-medium
                    text-emerald-100/60
                  "
                >

                  Password

                </label>


                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }

                    id="password"

                    name="password"

                    placeholder="Enter your password"

                    value={
                      formData.password
                    }

                    onChange={
                      handleChange
                    }

                    required

                    className="
                      w-full
                      px-4
                      py-3.5
                      pr-12
                      rounded-xl
                      bg-[#071021]
                      border
                      border-emerald-400/10
                      text-white
                      placeholder:text-white/25
                      outline-none
                      transition-all
                      focus:border-emerald-400/40
                      focus:ring-2
                      focus:ring-emerald-400/10
                    "
                  />


                  <button
                    type="button"

                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }

                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-emerald-200/40
                      hover:text-emerald-300
                      transition-colors
                    "
                  >

                    {showPassword ? (

                      <FaEyeSlash
                        size={18}
                      />

                    ) : (

                      <FaEye
                        size={18}
                      />

                    )}

                  </button>

                </div>

              </div>



              {/* OPTIONS */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                  "
                >

                  <input
                    type="checkbox"

                    name="rememberMe"

                    checked={
                      formData.rememberMe
                    }

                    onChange={
                      handleChange
                    }

                    className="
                      w-4
                      h-4
                      rounded
                      accent-emerald-500
                      cursor-pointer
                    "
                  />


                  <span
                    className="
                      text-sm
                      text-white/40
                    "
                  >

                    Remember me

                  </span>

                </label>



                <Link
                  to="/forgot-password"

                  className="
                    text-sm
                    text-emerald-400/70
                    hover:text-emerald-300
                    transition-colors
                  "
                >

                  Forgot password?

                </Link>

              </div>



              {/* SUBMIT BUTTON */}

              <Button
                type="submit"

                variant="primary"

                loading={loading}

                className="
                  w-full
                  group
                "
              >

                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  Sign In

                  <FaArrowRight
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />

                </span>

              </Button>


            </form>



            {/* REGISTER LINK */}

            <p
              className="
                text-center
                text-sm
                text-white/35
                mt-7
              "
            >

              Don't have an account?

              {' '}

              <Link
                to="/register"

                className="
                  text-emerald-400
                  hover:text-emerald-300
                  font-medium
                  transition-colors
                "
              >

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