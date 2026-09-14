// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHeart, FaGithub, FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-700/50 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <FaLeaf className="text-primary-500 text-lg" />
            <span className="text-sm font-semibold text-white">CarbonWise </span>
            <span className="text-xs text-dark-500">|</span>
            <span className="text-xs text-dark-400">Green DevOps Platform</span>
          </div>

          {/* Center Section - Tech Stack */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-dark-500">Built with</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors group">
                <FaReact className="text-blue-400 group-hover:text-blue-300 transition-colors" size={14} />
                <span className="hidden sm:inline">React</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors group">
                <FaNodeJs className="text-green-500 group-hover:text-green-400 transition-colors" size={14} />
                <span className="hidden sm:inline">Node.js</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors group">
                <SiMongodb className="text-green-600 group-hover:text-green-500 transition-colors" size={14} />
                <span className="hidden sm:inline">MongoDB</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors group">
                <FaGithub className="text-dark-400 group-hover:text-white transition-colors" size={14} />
                <span className="hidden sm:inline">GitHub API</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-dark-500">
              © {currentYear} CarbonWise
            </span>
            <div className="flex items-center gap-1 text-xs text-dark-500">
              <FaHeart className="text-red-500 animate-pulse" size={12} />
              <span>Made with ❤️ for Green Software</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-dark-800/50 flex flex-wrap items-center justify-center gap-4 text-[10px] text-dark-600">
          <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <span>Cookie Policy</span>
          <span>•</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;