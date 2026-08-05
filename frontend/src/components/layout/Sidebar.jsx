// frontend/src/components/layout/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCode,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaGithub,
} from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [sidebarStats, setSidebarStats] = useState({ totalProjects: 0, sustainability: 0 });

  useEffect(() => {
    dashboardService.getDashboard()
      .then((data) => setSidebarStats({ totalProjects: data.totalProjects, sustainability: data.sustainability }))
      .catch(() => {});
  }, []);

  const menuItems = [
  { path: "/dashboard", icon: FaHome, label: "Dashboard", color: "#10B981" },
  { path: "/repository", icon: FaCode, label: "Repositories", color: "#3B82F6" },
  { path: "/analytics", icon: FaChartLine, label: "Analytics", color: "#EC4899" },
  { path: "/reports", icon: FaFileAlt, label: "Reports", color: "#14B8A6" },
  { path: "/settings", icon: FaCog, label: "Settings", color: "#64748B" },
];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-dark-900 via-dark-900 to-dark-950 border-r border-dark-700/50 transition-all duration-500 ease-in-out z-40 pt-16 shadow-2xl shadow-dark-950/50 ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      {/* Glowing Border Effect */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary-500/20 to-transparent"></div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-dark-800 border-2 border-dark-700 hover:border-primary-500 rounded-full p-1.5 text-dark-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/20 z-50"
      >
        {isOpen ? (
          <FaChevronLeft size={14} className="transition-transform duration-300" />
        ) : (
          <FaChevronRight size={14} className="transition-transform duration-300" />
        )}
      </button>

      {/* User Profile Section */}
      <div className={`px-4 pb-6 border-b border-dark-700/50 ${!isOpen && 'px-2'}`}>
        <div className={`flex items-center ${isOpen ? 'gap-4' : 'justify-center'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {isOpen && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900"></div>
            )}
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-dark-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-1.5">
          {/* Menu Label */}
          {isOpen && (
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider px-3 py-2">
              Main Menu
            </p>
          )}

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500/20 to-transparent text-primary-400 border-r-2 border-primary-500' 
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                }
                ${!isOpen && 'justify-center'}
              `}
              title={!isOpen ? item.label : ''}
            >
              {/* Animated Background Glow */}
              {hoveredItem === item.path && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-xl animate-pulse"></div>
              )}
              
              {/* Icon Container with Gradient */}
              <div className={`
                relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300
                ${isOpen ? 'bg-dark-800/50' : 'bg-transparent'}
                group-hover:scale-105
              `}>
                <item.icon 
                  size={20} 
                  className="relative z-10 transition-colors duration-300"
                  style={{ 
                    color: hoveredItem === item.path || window.location.pathname === item.path 
                      ? item.color 
                      : 'currentColor'
                  }}
                />
                {isOpen && (
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>

              {isOpen && (
                <span className="text-sm font-medium truncate transition-all duration-300">
                  {item.label}
                </span>
              )}

              {/* Active Indicator Dot */}
              {isOpen && window.location.pathname === item.path && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
              )}

              {/* Tooltip for Collapsed State */}
              {!isOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-dark-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-dark-700 shadow-xl shadow-dark-950/50 transform group-hover:scale-100 scale-95">
                  {item.label}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-dark-800 border-l border-t border-dark-700 rotate-45"></div>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-dark-700/50">
          {/* GitHub Stats */}
          {isOpen && (
            <div className="px-3 py-3 mb-4 bg-gradient-to-r from-dark-800/50 to-dark-800/30 rounded-xl border border-dark-700/30">
              <div className="flex items-center gap-3">
                <FaGithub className="text-dark-400" size={16} />
                <div className="flex-1">
                  <p className="text-xs text-dark-400">Connected Repos</p>
                  <p className="text-sm font-semibold text-white">{sidebarStats.totalProjects}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-dark-400">Sustainability</p>
                  <p className="text-sm font-semibold text-primary-500">{sidebarStats.sustainability}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              relative flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-300 group
              ${isOpen ? 'justify-start' : 'justify-center'}
              text-red-400 hover:text-red-300 hover:bg-red-500/10
            `}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300">
              <FaSignOutAlt size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            
            {isOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}

            {!isOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-dark-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-dark-700 shadow-xl shadow-dark-950/50">
                Logout
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-dark-800 border-l border-t border-dark-700 rotate-45"></div>
              </div>
            )}
          </button>

          {/* Version Info */}
          {isOpen && (
            <div className="mt-4 text-center">
              <p className="text-[10px] text-dark-500">CodeCarbon AI v2.0.0</p>
              <p className="text-[10px] text-dark-600">Green DevOps Platform</p>
            </div>
          )}
        </div>
      </nav>

      {/* Decorative Gradient Orbs */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl translate-x-1/2"></div>
    </aside>
  );
};

export default Sidebar;