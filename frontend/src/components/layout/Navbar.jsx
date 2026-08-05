// frontend/src/components/layout/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaBars, 
  FaBell, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCircle,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/repository?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s so new analysis/report notifications show up without a manual refresh
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left Section - Logo & Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="text-dark-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-800"
            aria-label="Toggle sidebar"
          >
            <FaBars size={20} />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-500/30 transition-all duration-300"></div>
              <FaLeaf className="text-primary-500 text-2xl relative" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Code<span className="text-primary-500">Carbon</span> AI
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden text-dark-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-800"
          >
            <FaSearch size={18} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-dark-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-800"
              aria-label="Notifications"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white border-2 border-dark-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifLoading ? (
                    <p className="px-4 py-6 text-sm text-dark-400 text-center">Loading...</p>
                  ) : notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-dark-400 text-center">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        className={`px-4 py-3 hover:bg-dark-700 transition-colors cursor-pointer ${
                          !notification.isRead ? 'border-l-2 border-primary-500' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-dark-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-dark-500 mt-1">{timeAgo(notification.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-dark-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-800"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-primary-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={20} />}
              </div>
              <span className="hidden lg:block text-sm font-medium">
                {user?.name || 'User'}
              </span>
            </button>

            {/* User Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-dark-700">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-dark-400 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUser size={14} className="text-dark-400" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaCog size={14} className="text-dark-400" />
                    Settings
                  </Link>
                </div>
                
                <hr className="border-dark-700 my-1" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 transition-colors"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search repositories..."
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;