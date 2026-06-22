import React, { useState, useEffect, useRef } from "react";
import logoImage from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../../utils/translate";
import { NavLink } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

function AfterlogNavbar() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Dynamic user profile details fetched from localStorage
  const [profile, setProfile] = useState({
    firstName: "Janith",
    lastName: "",
    nic: "200324511540",
    profilePhoto: null,
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("smartgn_resident_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Menu items configuration
  const menuItems = [
    {
      id: "home",
      name: t.home,
      path: "/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      id: "dashboard",
      name: t.dashboard,
      path: "/dashboard/resident",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <rect x="3" y="3" width="7" height="9" rx="1"></rect>
          <rect x="14" y="3" width="7" height="5" rx="1"></rect>
          <rect x="14" y="12" width="7" height="9" rx="1"></rect>
          <rect x="3" y="16" width="7" height="5" rx="1"></rect>
        </svg>
      ),
    },
    {
      id: "profile",
      name: t.profile,
      path: "/profile",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      id: "household",
      name: t.family,
      path: "/dashboard/resident/household",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <circle cx="9" cy="14" r="2"></circle>
          <circle cx="15" cy="14" r="2"></circle>
        </svg>
      ),
    },
    {
      id: "certificates",
      name: t.certificates,
      path: "/dashboard/resident/certificates",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <circle cx="12" cy="11" r="3"></circle>
        </svg>
      ),
    },
    {
      id: "appointments",
      name: t.appointments,
      path: "/dashboard/resident/appointments",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      id: "allowances",
      name: t.allowances,
      path: "/dashboard/resident/allowances",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
      ),
    },
    {
      id: "disaster",
      name: t.disaster,
      path: "/dashboard/resident/disaster",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
    {
      id: "announcements",
      name: t.announcements,
      path: "/dashboard/resident/announcements",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

  const currentYear = new Date().getFullYear();

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white border-b border-[#cbd5e1] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] sticky top-0 z-50">
      {/* ==================================================================== */}
      {/* DESKTOP NAVBAR - Visible on tablets and desktops (768px and above) */}
      {/* ==================================================================== */}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section */}
        <div
          className="w-28 sm:w-32 md:w-40 lg:w-48 cursor-pointer flex flex-col items-start gap-1"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto object-contain" />
          <p className="text-[10px] text-[#718096] font-normal leading-none">{t.tagline}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Bell */}
          <div className="relative cursor-pointer text-[#475569] flex items-center justify-center transition-colors duration-200 hover:opacity-80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-[#64748b] font-medium">
                {profile.nic}
              </span>
              <span className="text-[14px] font-semibold text-[#1e293b]">
                {profile.firstName} {profile.lastName}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MOBILE NAVBAR - Visible only on mobile devices (below 768px) */}
      {/* ==================================================================== */}
      <div className="flex w-full justify-between items-center md:hidden">
        {/* Menu Button */}
        <button
          className="relative cursor-pointer p-2 -ml-2 border-0 bg-transparent text-[#475569]"
          onClick={toggleMobileMenu}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Right Section - Icons only on mobile */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Bell */}
          <div className="relative cursor-pointer text-[#475569]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#cbd5e1] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MOBILE SIDEBAR MENU */}
      {/* ==================================================================== */}

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
        className={`fixed top-0 left-0 w-[280px] sm:w-[320px] h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation menu"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#2D37481D] flex flex-col items-start gap-1">
          <div
            className="w-24 sm:w-28 cursor-pointer"
            onClick={() => {
              navigate("/");
              closeMobileMenu();
            }}
          >
            <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto object-contain" />
          </div>
          <p className="text-[10px] text-[#718096] font-normal leading-none">{t.tagline}</p>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col h-[calc(100%-140px)] overflow-y-auto">
          <nav className="flex flex-col gap-1 p-3 sm:p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => `
                  flex items-center gap-3 w-full border-none rounded-lg py-2.5 px-4 cursor-pointer text-xs sm:text-sm font-regular text-left transition-all duration-200
                  ${isActive 
                    ? "bg-[#1B365D] text-white font-semibold" 
                    : "bg-transparent text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1B365D] p-3 sm:p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs sm:text-sm font-regular text-[#F7FAFC8D]">
              © {currentYear} SmartGN. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs sm:text-sm font-medium text-[#F7FAFC]">
                Admin Support:
              </p>
              <a
                href="tel:+94255731913"
                className="text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
              >
                Mobile: 0255731913
              </a>
              <a
                href="mailto:warapitiyalakshan@gmail.com"
                className="text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300 break-all text-center"
              >
                Email: warapitiyalakshan@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AfterlogNavbar;
