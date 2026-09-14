import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaLeaf,
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const timeAgo = (dateString) => {
  const seconds = Math.floor(
    (new Date() - new Date(dateString)) / 1000
  );

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

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

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  // ==========================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ==========================================
  // FOCUS SEARCH INPUT ON MOBILE
  // ==========================================

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

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

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // SEARCH REPOSITORIES
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    /*
      IMPORTANT:
      Your current project route is /repository.
      Keep this route if RepositoryAnalysis.jsx
      is registered at /repository.
    */
    navigate(`/repository?search=${encodeURIComponent(query)}`);

    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // ==========================================
  // PROFILE
  // ==========================================

  const handleProfile = () => {
    setShowDropdown(false);
    navigate('/settings');
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true
              }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        bg-dark-950/95
        backdrop-blur-xl
        border-b
        border-dark-700
      "
    >
      <div
        className="
          min-h-[68px]
          flex
          items-center
          justify-between
          gap-3
          px-3
          sm:px-5
          lg:px-6
        "
      >

        {/* =====================================================
            LEFT SECTION
        ====================================================== */}

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-lg
              text-dark-300
              hover:text-white
              hover:bg-dark-800
              transition-all
              duration-200
            "
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <FaBars size={18} />
          </button>

          {/* CarbonWise Logo */}
          <Link
            to="/dashboard"
            className="
              flex
              items-center
              gap-2.5
              group
              flex-shrink-0
            "
          >
            {/* Logo Icon */}
            <div
             
            >
            
            </div>

            {/* Full Logo Name */}
            <span
              className="
                text-green-400
                font-bold
                text-lg
                sm:text-xl
                tracking-tight
                whitespace-nowrap
              "
            >
              CarbonWise
            </span>
          </Link>
        </div>

        {/* =====================================================
            CENTER - SEARCH
        ====================================================== */}

        <div
          className="
            hidden
            md:flex
            flex-1
            justify-center
            px-4
            lg:px-8
          "
        >
          <form
            onSubmit={handleSearch}
            className="
              relative
              w-full
              max-w-[530px]
            "
          >
            <FaSearch
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-dark-400
              "
              size={15}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="
                w-full
                h-11
                pl-10
                pr-4
                rounded-xl
                bg-dark-900
                border
                border-dark-700
                text-white
                text-sm
                placeholder:text-dark-400
                outline-none
                transition-all
                duration-200
                focus:border-primary-500
                focus:ring-2
                focus:ring-primary-500/10
              "
            />
          </form>
        </div>

        {/* =====================================================
            RIGHT SECTION
        ====================================================== */}

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* Mobile Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="
              md:hidden
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-lg
              text-dark-300
              hover:text-white
              hover:bg-dark-800
              transition-all
            "
            aria-label="Search"
            title="Search"
          >
            <FaSearch size={17} />
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}

          <div
            className="relative"
            ref={notificationRef}
          >
            <button
              type="button"
              onClick={() =>
                setShowNotifications((prev) => !prev)
              }
              className="
                relative
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-xl
                text-dark-300
                hover:text-white
                hover:bg-dark-800
                transition-all
                duration-200
              "
              aria-label="Notifications"
              title="Notifications"
            >
              <FaBell size={19} />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    top-0.5
                    right-0.5
                    min-w-[17px]
                    h-[17px]
                    px-1
                    rounded-full
                    bg-red-500
                    border-2
                    border-dark-950
                    text-[9px]
                    font-bold
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-[320px]
                  max-w-[calc(100vw-24px)]
                  bg-dark-900
                  border
                  border-dark-700
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-[60]
                "
              >
                {/* Header */}
                <div
                  className="
                    px-4
                    py-3.5
                    border-b
                    border-dark-700
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        w-7
                        h-7
                        rounded-lg
                        bg-primary-500/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaBell
                        className="text-primary-400"
                        size={13}
                      />
                    </div>

                    <h4 className="text-sm font-semibold text-white">
                      Notifications
                    </h4>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="
                        text-xs
                        text-primary-400
                        hover:text-primary-300
                        transition-colors
                      "
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification Content */}
                <div className="max-h-[340px] overflow-y-auto">

                  {notifLoading ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-dark-400">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div
                        className="
                          w-11
                          h-11
                          mx-auto
                          mb-3
                          rounded-full
                          bg-dark-800
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FaBell
                          className="text-dark-500"
                          size={17}
                        />
                      </div>

                      <p className="text-sm text-dark-300">
                        No notifications yet
                      </p>

                      <p className="text-xs text-dark-500 mt-1">
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          !notification.isRead &&
                          handleMarkAsRead(notification._id)
                        }
                        className={`
                          px-4
                          py-3.5
                          border-b
                          border-dark-800
                          hover:bg-dark-800
                          cursor-pointer
                          transition-colors
                          ${
                            !notification.isRead
                              ? 'bg-primary-500/[0.03] border-l-2 border-l-primary-500'
                              : ''
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                              mt-0.5
                              w-7
                              h-7
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                !notification.isRead
                                  ? 'bg-primary-500/10 text-primary-400'
                                  : 'bg-dark-800 text-dark-500'
                              }
                            `}
                          >
                            <FaBell size={11} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>

                            <p
                              className="
                                text-xs
                                text-dark-400
                                mt-1
                                leading-relaxed
                              "
                            >
                              {notification.message}
                            </p>

                            <p
                              className="
                                text-[11px]
                                text-dark-500
                                mt-1.5
                              "
                            >
                              {timeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              PROFILE
          ================================================== */}

          <div
            className="relative"
            ref={dropdownRef}
          >
            <button
              type="button"
              onClick={() =>
                setShowDropdown((prev) => !prev)
              }
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                bg-primary-500/10
                border
                border-primary-500/20
                text-primary-400
                hover:bg-primary-500/15
                hover:border-primary-500/40
                hover:text-primary-300
                transition-all
                duration-200
              "
              aria-label="Profile menu"
              title="Profile"
            >
              <FaUserCircle size={23} />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-[240px]
                  bg-dark-900
                  border
                  border-dark-700
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-[60]
                "
              >
                {/* User Info */}
                <div
                  className="
                    px-4
                    py-4
                    border-b
                    border-dark-700
                    bg-dark-800/40
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-primary-500/10
                        border
                        border-primary-500/20
                        flex
                        items-center
                        justify-center
                        text-primary-400
                      "
                    >
                      <FaUserCircle size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.name || 'User'}
                      </p>

                      <p className="text-xs text-dark-400 truncate mt-0.5">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleProfile}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      text-dark-200
                      hover:text-white
                      hover:bg-dark-800
                      transition-colors
                      text-left
                    "
                  >
                    <span
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-dark-800
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaUser
                        size={13}
                        className="text-primary-400"
                      />
                    </span>

                    <span>Profile</span>
                  </button>
                </div>

                {/* Logout */}
                <div
                  className="
                    border-t
                    border-dark-700
                    p-2
                  "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      text-red-400
                      hover:text-red-300
                      hover:bg-red-500/10
                      transition-colors
                      text-left
                    "
                  >
                    <span
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-red-500/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaSignOutAlt size={13} />
                    </span>

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH
      ====================================================== */}

      {isSearchOpen && (
        <div
          className="
            md:hidden
            px-4
            pb-3
            border-t
            border-dark-800
            pt-3
            bg-dark-950
          "
        >
          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <FaSearch
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-dark-400
              "
              size={15}
            />

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="
                w-full
                h-11
                pl-10
                pr-10
                rounded-xl
                bg-dark-900
                border
                border-dark-700
                text-white
                text-sm
                placeholder:text-dark-400
                outline-none
                focus:border-primary-500
                focus:ring-2
                focus:ring-primary-500/10
              "
            />

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-dark-400
                hover:text-white
              "
              aria-label="Close search"
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
