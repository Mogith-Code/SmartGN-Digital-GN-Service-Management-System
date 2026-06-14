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
  const t = translations[lang];

  // Navigation translations for different languages (EN, SI, TA)
  const navTranslations = {
    EN: { about: "About", services: "Services" },
    SI: { about: "අපි ගැන", services: "සේවාවන්" },
    TA: { about: "எங்களைப் பற்றி", services: "சேவைகள்" },
  };

  // Navigation links data array
  const navLinks = [
    { name: t.home, icon: homeIcon, href: "#home" },
    { name: navTranslations[lang].about, icon: aboutIcon, href: "#about" },
    {
      name: navTranslations[lang].services,
      icon: servicesIcon,
      href: "#services",
    },
  ];

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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

        {/* Language Selector Component */}
        <LanguageSelector />
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              closeMobileMenu();
              // Add logout logic here if needed
            }}
            className="flex items-center gap-3 w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
