// frontend/src/pages/auth/GitHubSuccess.jsx

import React, {
  useEffect,
  useContext
} from 'react';

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import {
  FaLeaf,
  FaCheckCircle
} from 'react-icons/fa';

import {
  AuthContext
} from '../../context/AuthContext';


const GithubSuccess = () => {

  const navigate =
    useNavigate();


  const [searchParams] =
    useSearchParams();


  const {
    githubLogin
  } = useContext(AuthContext);


  // =================================
  // GITHUB AUTHENTICATION
  // =================================

  useEffect(() => {

    const authenticateGithub =
      async () => {

        try {

          // Get JWT token from URL

          const token =
            searchParams.get('token');


          if (!token) {

            navigate(
              '/login?github=error',
              { replace: true }
            );

            return;

          }


          // Authenticate using AuthContext

          const result =
            await githubLogin(
              token
            );


          if (result?.success) {

            navigate(
              '/dashboard',
              { replace: true }
            );

            return;

          }


          // Fallback

          navigate(
            '/login?github=error',
            { replace: true }
          );

        }

        catch (error) {

          console.error(
            'GitHub authentication error:',
            error.response?.data ||
            error.message
          );


          navigate(
            '/login?github=error',
            { replace: true }
          );

        }

      };


    authenticateGithub();


  }, [
    searchParams,
    navigate,
    githubLogin
  ]);


  // =================================
  // LOADING UI
  // =================================

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#071021]
        px-4
      "
    >

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div
          className="
            absolute
            -top-32
            -right-32
            w-96
            h-96
            rounded-full
            bg-emerald-500/10
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
            bg-green-400/10
            blur-3xl
          "
        />

      </div>


      <div
        className="
          relative
          z-10
          text-center
          bg-[#0F172A]/90
          border
          border-emerald-400/10
          backdrop-blur-xl
          rounded-3xl
          px-10
          py-12
          shadow-2xl
          shadow-black/30
          max-w-md
          w-full
        "
      >

        {/* Animated Logo */}

        <div className="relative inline-block mb-7">

          <div
            className="
              absolute
              inset-0
              bg-emerald-500/20
              rounded-full
              blur-2xl
              animate-pulse
            "
          />

          <div
            className="
              relative
              w-20
              h-20
              rounded-2xl
              bg-gradient-to-br
              from-emerald-400
              to-emerald-600
              flex
              items-center
              justify-center
              shadow-xl
              shadow-emerald-500/20
              animate-pulse
            "
          >

            <FaLeaf
              className="
                text-4xl
                text-white
              "
            />

          </div>

        </div>


        {/* Title */}

        <h1
          className="
            text-3xl
            font-bold
            text-white
            tracking-tight
          "
        >

          Welcome to

          {' '}

          <span className="text-emerald-400">

            CarbonWise

          </span>

        </h1>


        {/* Success Icon */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            mt-5
            text-emerald-300/70
          "
        >

          <FaCheckCircle
            className="
              text-emerald-400
            "
          />

          <span className="text-sm">

            GitHub authentication successful

          </span>

        </div>


        {/* Loading */}

        <p
          className="
            mt-6
            text-sm
            text-white/40
          "
        >

          Securely signing you in and preparing your dashboard...

        </p>


        {/* Loading Bar */}

        <div
          className="
            mt-7
            h-1.5
            w-full
            rounded-full
            bg-emerald-500/10
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              w-1/2
              bg-gradient-to-r
              from-emerald-400
              to-green-400
              rounded-full
              animate-pulse
            "
          />

        </div>


      </div>

    </div>

  );

};


export default GithubSuccess;