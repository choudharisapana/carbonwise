import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // =========================================
  // Responsive Sidebar
  // =========================================

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  // =========================================
  // Toggle Sidebar
  // =========================================

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };


  return (
    <div className="min-h-screen bg-[#030712] text-white">

      {/* ===================================== */}
      {/* Navbar */}
      {/* ===================================== */}

      <Navbar
        onToggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />


      {/* ===================================== */}
      {/* Main Layout */}
      {/* ===================================== */}

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />


        {/* =================================== */}
        {/* Main Content */}
        {/* =================================== */}

        <main
          className={`
            flex-1
            min-w-0
            flex
            flex-col
            min-h-screen

            transition-all
            duration-300
            ease-in-out

            ${
              isMobile
                ? "ml-0"
                : sidebarOpen
                  ? "ml-64"
                  : "ml-[76px]"
            }
          `}
        >

          <div
            className="
              flex-1

              pt-20

              px-4
              sm:px-5
              md:px-6
              lg:px-8

              pb-8

              w-full
            "
          >

            {children}

          </div>

          <Footer />

        </main>

      </div>

    </div>
  );
};

export default Layout;