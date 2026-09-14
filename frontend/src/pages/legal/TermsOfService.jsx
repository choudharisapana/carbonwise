// frontend/src/pages/legal/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaArrowLeft } from 'react-icons/fa';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
    <div className="text-sm text-emerald-100/60 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  const lastUpdated = 'January 2026';

  return (
    <div className="min-h-screen bg-[#071021] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl"></div>
            <FaLeaf className="text-4xl text-emerald-400 mx-auto mb-3 relative" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Code<span className="text-emerald-400">Carbon</span> AI — CarbonWise
          </h1>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-[20px] border border-emerald-500/15 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-500/5">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-emerald-300/40 text-sm mb-8">Last updated: {lastUpdated}</p>

          <Section title="1. Overview">
            <p>
              CarbonWise ("we", "our", "the platform") is a final-year academic project that analyzes
              public and connected GitHub repositories to estimate their carbon footprint and
              sustainability metrics. This policy explains what data we collect, why, and how it is used.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>When you create an account or sign in, we may collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your name and email address (provided directly, or via GitHub OAuth)</li>
              <li>A securely hashed password (for email/password accounts only)</li>
              <li>Your GitHub username, avatar, and public profile information (if you connect GitHub)</li>
              <li>Repository metadata you choose to analyze (name, size, language, dependency count)</li>
              <li>Usage preferences (theme, notification settings, default export format)</li>
            </ul>
          </Section>

          <Section title="3. How We Use GitHub Access">
            <p>
              If you connect your GitHub account, we request the minimum access needed to read repository
              data for analysis. Your GitHub access token is encrypted before being stored and is never
              displayed back to you or shared with third parties. You can disconnect your GitHub account
              at any time from Settings, which permanently removes the stored token.
            </p>
          </Section>

          <Section title="4. AI-Generated Suggestions">
            <p>
              Sustainability suggestions are generated using real analysis data (dependency names, energy
              breakdown, repository metadata) sent to a third-party AI provider to generate recommendations.
              No personal account information (name, email, password) is included in these requests.
            </p>
          </Section>

          <Section title="5. Data Storage & Security">
            <p>
              Data is stored in a MongoDB database. Passwords are hashed and never stored in plain text.
              Sensitive tokens are encrypted at rest. As an academic project, this platform is not intended
              for production-scale sensitive data and should not be used to analyze private, proprietary
              codebases beyond demonstration purposes.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              You may update your profile, change notification and appearance preferences, disconnect
              GitHub, or request account deletion at any time via Settings.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              This project is developed as part of an academic curriculum. For questions about this
              policy, please reach out through the contact details provided in the project submission.
            </p>
          </Section>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors duration-200 mt-4"
          >
            <FaArrowLeft size={12} /> Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
