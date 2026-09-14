// frontend/src/components/layout/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaCode,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";


const Sidebar = ({
  isOpen,
  toggleSidebar
}) => {

  const { logout } = React.useContext(AuthContext);

  const navigate = useNavigate();


  // =========================================
  // Navigation Items
  // =========================================

  const menuItems = [
    {
      path: "/dashboard",
      icon: FaHome,
      label: "Dashboard"
    },
    {
      path: "/repository",
      icon: FaCode,
      label: "Repositories"
    },
    {
      path: "/analytics",
      icon: FaChartLine,
      label: "Analytics"
    },
    {
      path: "/reports",
      icon: FaFileAlt,
      label: "Reports"
    },
    {
      path: "/settings",
      icon: FaCog,
      label: "Settings"
    }
  ];


  // =========================================
  // Logout
  // =========================================

  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  // =========================================
  // Mobile Navigation
  // =========================================

  const handleNavigation = () => {

    if (
      window.innerWidth < 768 &&
      isOpen
    ) {
      toggleSidebar();
    }

  };


  return (
    <>

      {/* ========================================= */}
      {/* Mobile Overlay */}
      {/* ========================================= */}

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-[2px]
            z-40
            md:hidden
          "
        />
      )}


      {/* ========================================= */}
      {/* Sidebar */}
      {/* ========================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          h-screen
          z-50

          flex
          flex-col

          bg-[#080D1A]
          border-r
          border-white/[0.08]

          transition-all
          duration-300
          ease-in-out

          ${
            isOpen
              ? "w-64 translate-x-0"
              : "w-[76px] -translate-x-full md:translate-x-0"
          }
        `}
      >


        {/* ========================================= */}
        {/* Brand */}
        {/* ========================================= */}

        <div
          className={`
            h-[72px]
            flex
            items-center
            flex-shrink-0

            border-b
            border-white/[0.08]

            ${
              isOpen
                ? "px-5"
                : "justify-center"
            }
          `}
        >

          <NavLink
            to="/dashboard"
            onClick={handleNavigation}
            className="
              flex
              items-center
              gap-3
              group
              min-w-0
            "
          >

            {/* Logo */}

            <div
              className="
                w-10
                h-10
                rounded-xl

                bg-emerald-500/10
                border
                border-emerald-500/20

                flex
                items-center
                justify-center

                flex-shrink-0

                transition-all
                duration-200

                group-hover:bg-emerald-500/15
                group-hover:border-emerald-500/30
              "
            >

              <FaLeaf
                size={18}
                className="
                  text-emerald-400
                  group-hover:scale-110
                  transition-transform
                "
              />

            </div>


            {/* Brand Text */}

            {isOpen && (
              <div className="min-w-0">

                <h1
                  className="
                    text-white
                    font-bold
                    text-[17px]
                    leading-tight
                    tracking-tight
                  "
                >
                  CarbonWise
                </h1>

                <p
                  className="
                    text-[10px]
                    text-gray-500
                    mt-0.5
                  "
                >
                  Green DevOps Platform
                </p>

              </div>
            )}

          </NavLink>

        </div>


        {/* ========================================= */}
        {/* Desktop Collapse Button */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            isOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
          className="
            hidden
            md:flex

            absolute
            -right-3
            top-[76px]

            w-7
            h-7

            rounded-full

            bg-[#111827]
            border
            border-white/10

            items-center
            justify-center

            text-gray-400

            hover:text-emerald-400
            hover:border-emerald-500/40
            hover:bg-[#162033]

            shadow-lg

            transition-all
            duration-200

            z-50
          "
        >

          {isOpen ? (
            <FaChevronLeft size={10} />
          ) : (
            <FaChevronRight size={10} />
          )}

        </button>


        {/* ========================================= */}
        {/* Navigation */}
        {/* ========================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto

            px-3
            py-7

            scrollbar-thin
            scrollbar-thumb-gray-800
          "
        >

          {/* Section Label */}

          {isOpen && (
            <p
              className="
                px-3
                mb-3

                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]

                text-gray-600
              "
            >
              Main Menu
            </p>
          )}


          {/* Menu */}

          <div className="space-y-1.5">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  className={({ isActive }) => `
                    group
                    relative

                    flex
                    items-center

                    ${
                      isOpen
                        ? "gap-3 px-3"
                        : "justify-center px-2"
                    }

                    h-12

                    rounded-xl

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-emerald-500/[0.10]
                          text-emerald-400
                        `
                        : `
                          text-gray-500
                          hover:text-gray-200
                          hover:bg-white/[0.035]
                        `
                    }
                  `}
                >

                  {({ isActive }) => (
                    <>

                      {/* Active Indicator */}

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            -translate-y-1/2

                            w-[3px]
                            h-7

                            rounded-r-full

                            bg-emerald-400
                          "
                        />
                      )}


                      {/* Icon Container */}

                      <div
                        className={`
                          w-9
                          h-9

                          rounded-lg

                          flex
                          items-center
                          justify-center

                          flex-shrink-0

                          transition-all
                          duration-200

                          ${
                            isActive
                              ? "bg-emerald-500/10"
                              : "group-hover:bg-white/[0.04]"
                          }
                        `}
                      >

                        <Icon
                          size={17}
                          className={`
                            transition-transform
                            duration-200

                            ${
                              isActive
                                ? "text-emerald-400"
                                : "text-current"
                            }

                            group-hover:scale-105
                          `}
                        />

                      </div>


                      {/* Label */}

                      {isOpen && (
                        <span
                          className="
                            text-sm
                            font-medium
                            whitespace-nowrap
                          "
                        >
                          {item.label}
                        </span>
                      )}


                      {/* Collapsed Tooltip */}

                      {!isOpen && (
                        <div
                          className="
                            absolute
                            left-full
                            ml-3

                            px-3
                            py-2

                            rounded-lg

                            bg-[#111827]
                            border
                            border-white/10

                            text-white
                            text-xs
                            font-medium

                            whitespace-nowrap

                            opacity-0
                            invisible

                            pointer-events-none

                            group-hover:opacity-100
                            group-hover:visible

                            transition-all
                            duration-200

                            shadow-xl

                            z-[60]
                          "
                        >
                          {item.label}
                        </div>
                      )}

                    </>
                  )}

                </NavLink>
              );

            })}

          </div>

        </nav>


        {/* ========================================= */}
        {/* Bottom Section */}
        {/* ========================================= */}

        <div
          className="
            flex-shrink-0

            border-t
            border-white/[0.08]

            p-3
          "
        >

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className={`
              group
              relative

              w-full
              h-12

              flex
              items-center

              ${
                isOpen
                  ? "gap-3 px-3"
                  : "justify-center px-2"
              }

              rounded-xl

              text-red-400

              hover:text-red-300
              hover:bg-red-500/[0.08]

              transition-all
              duration-200
            `}
          >

            {/* Icon */}

            <div
              className="
                w-9
                h-9

                rounded-lg

                bg-red-500/10

                flex
                items-center
                justify-center

                flex-shrink-0

                transition-all

                group-hover:bg-red-500/15
              "
            >

              <FaSignOutAlt
                size={15}
              />

            </div>


            {/* Text */}

            {isOpen && (
              <span
                className="
                  text-sm
                  font-medium
                "
              >
                Logout
              </span>
            )}


            {/* Collapsed Tooltip */}

            {!isOpen && (
              <div
                className="
                  absolute
                  left-full
                  ml-3

                  px-3
                  py-2

                  rounded-lg

                  bg-[#111827]
                  border
                  border-white/10

                  text-white
                  text-xs
                  font-medium

                  whitespace-nowrap

                  opacity-0
                  invisible

                  pointer-events-none

                  group-hover:opacity-100
                  group-hover:visible

                  transition-all
                  duration-200

                  shadow-xl

                  z-[60]
                "
              >
                Logout
              </div>
            )}

          </button>


          {/* Version */}

          {isOpen && (
            <div
              className="
                text-center
                pt-3
                pb-1
              "
            >

              <p
                className="
                  text-[10px]
                  text-gray-600
                "
              >
                CarbonWise AI v2.0.0
              </p>

              <p
                className="
                  text-[9px]
                  text-gray-700
                  mt-0.5
                "
              >
                Green DevOps Platform
              </p>

            </div>
          )}

        </div>

      </aside>

    </>
  );
};


export default Sidebar;