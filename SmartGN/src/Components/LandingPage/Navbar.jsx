// src/components/Navbar.jsx
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../../utils/translate";
import LanguageSelector from "../Common/LanguageSelector";
import logoImage from "../../assets/logo.png";
import homeIcon from "../../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import aboutIcon from "../../assets/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import servicesIcon from "../../assets/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import menuIcon from "../../assets/menu_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function Navbar() {
  const navigate = useNavigate();

  // ============================================================================
  // LANGUAGE & TRANSLATION SETUP
  // ============================================================================
  const { lang } = useLanguage();
  // const t = translations[lang];

  // Navigation translations for different languages (EN, SI, TA)
  const navTranslations = {
    EN: { home: "Home", about: "About", services: "Services" },
    SI: { home: "මුල් පිටුව", about: "අපි ගැන", services: "සේවාවන්" },
    TA: { home: "முகப்பு", about: "எங்களைப் பற்றி", services: "சேவைகள்" },
  };

  // Navigation links data array
  const navLinks = [
    { name: navTranslations[lang].home, icon: homeIcon, href: "#home" },
    { name: navTranslations[lang].about, icon: aboutIcon, href: "#about" },
    {
      name: navTranslations[lang].services,
      icon: servicesIcon,
      href: "#services",
    },
  ];

  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // User session state for logged-in status
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("smartgn_token");
    const role = localStorage.getItem("smartgn_user_role");
    const name = localStorage.getItem("smartgn_user_name") || "User";
    const division = localStorage.getItem("smartgn_user_division") || "";

    if (token) {
      let dashboardPath = "/ResidentDashboard";
      if (role === "OFFICER" || role === "GN") {
        dashboardPath = "/OfficerDashboard";
      } else if (role === "ADMIN") {
        dashboardPath = "/dashboard/admin";
      }

      setUserSession({
        token,
        role,
        name,
        division,
        dashboardPath,
      });
    } else {
      setUserSession(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserSession(null);
    navigate("/login");
  };

  // ============================================================================
  // MOBILE MENU HANDLERS
  // ============================================================================
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================
  return (
    <header className="flex justify-between items-center py-3 sm:py-4 md:py-5 lg:py-[20px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-[#EBF8FF] sticky top-0 z-[1000] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
      {/* ====================================================================== */}
      {/* DESKTOP NAVBAR - Visible on tablets and desktops (768px and above) */}
      {/* ====================================================================== */}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section */}
        <div
          className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-[280px] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-20">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 text-[#2D3748] font-medium text-sm sm:text-base hover:text-[#005BBD] hover:underline underline-offset-4 decoration-[#D69E2E] decoration-2 transition-all duration-300 group"
            >
              <img
                className="w-auto h-4 sm:h-5 transition-transform duration-300 group-hover:scale-110"
                src={link.icon}
                alt={`${link.name} icon`}
              />
              <span className="transition-transform duration-300 group-hover:scale-105">
                {link.name}
              </span>
            </a>
          ))}
        </nav>

        {/* Language & Logged-In User Actions Section */}
        <div className="flex items-center gap-3">
          <LanguageSelector />

          {userSession ? (
            <div className="flex items-center gap-3 bg-white/90 p-1.5 pl-3 pr-2 border border-slate-200 rounded-full shadow-sm">
              <div 
                onClick={() => navigate(userSession.dashboardPath)}
                className="flex items-center gap-2 cursor-pointer"
                title="Click to go to your dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-[#1B365D] text-white font-bold flex items-center justify-center text-xs shadow-inner">
                  {userSession.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#1B365D] leading-tight max-w-[120px] truncate">
                    {userSession.name}
                  </span>
                  <span className="text-[10px] text-[#005BBD] font-semibold leading-tight">
                    {userSession.role === "OFFICER" || userSession.role === "GN" ? "Grama Niladhari" : (userSession.role === "ADMIN" ? "System Admin" : "Resident")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(userSession.dashboardPath)}
                className="px-3 py-1.5 bg-[#1B365D] text-white rounded-full text-xs font-bold hover:bg-[#005BBD] transition-colors border-0 cursor-pointer shadow-sm"
              >
                Dashboard ➔
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
                title="Logout"
              >
                Logout 🚪
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-[#1B365D] text-white rounded-lg text-xs font-bold hover:bg-[#005BBD] transition-colors border-0 cursor-pointer shadow-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 bg-[#D69E2E] text-white rounded-lg text-xs font-bold hover:bg-[#B8860B] transition-colors border-0 cursor-pointer shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MOBILE NAVBAR - Visible only on mobile devices (below 768px) */}
      {/* ====================================================================== */}
      <div className="flex w-full justify-between items-center md:hidden">
        {/* Menu Button */}
        <button
          className="relative cursor-pointer p-2 -ml-2"
          onClick={toggleMobileMenu}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <img src={menuIcon} alt="Menu" className="w-auto h-5 sm:h-6" />
        </button>

        {/* Logo Section */}
        <div
          className="w-24 sm:w-28 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
        </div>

        {/* Language Selector Component */}
        <LanguageSelector />
      </div>

      {/* ====================================================================== */}
      {/* MOBILE SIDEBAR MENU - Slides in from left on mobile */}
      {/* ====================================================================== */}

      {/* Overlay Background */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu overlay"
          role="presentation"
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-64 sm:w-72 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation menu"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-[#2D37481D]">
          <h2 className="text-sm sm:text-base text-left font-bold text-[#2c5f8a]">
            Navigation Menu
          </h2>
          <p className="text-xs text-gray-500 mt-1">Resident Portal</p>
        </div>

        {/* Vertical Navigation Links - Scrollable */}
        <div className="flex flex-col px-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-4 text-[#2D3748] font-medium text-sm hover:bg-[#EBF8FF] hover:text-[#2c5f8a] transition-all duration-300 rounded-lg border-b border-gray-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={link.icon}
                alt={`${link.name} icon`}
                className="w-auto h-4 sm:h-5"
              />
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex flex-col gap-2">
          {userSession ? (
            <>
              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate(userSession.dashboardPath);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1B365D] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer border-0"
              >
                <span>My Dashboard ➔</span>
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0"
              >
                <span className="text-sm">🚪</span>
                <span>Logout ({userSession.name})</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
                className="flex-1 py-2.5 px-4 bg-[#1B365D] text-white rounded-lg text-xs font-bold cursor-pointer border-0"
              >
                Login
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/register");
                }}
                className="flex-1 py-2.5 px-4 bg-[#D69E2E] text-white rounded-lg text-xs font-bold cursor-pointer border-0"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
