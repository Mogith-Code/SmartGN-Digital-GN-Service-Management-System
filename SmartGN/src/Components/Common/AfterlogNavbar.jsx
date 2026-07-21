// src/components/Common/AfterlogNavbar.jsx
import React from "react";
import logoImage from "../../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../../utils/translate";
import { NavLink } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import notificationIcon from "../../assets/notifications_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import accountIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import menuIcon from "../../assets/menu_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import homeIcon from "../../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import dashBoard from "../../assets/team_dashboard_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/person_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import householdIcon from "../../assets/home_and_garden_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import certificateIcon from "../../assets/license_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIcon from "../../assets/calendar_today_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import allowanceIcon from "../../assets/edit_document_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import homeIconHovered from "../../assets/home_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import dashBoardIconHovered from "../../assets/team_dashboard_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIconHovered from "../../assets/person_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import householdIconHovered from "../../assets/home_and_garden_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import certificateIconHovered from "../../assets/license_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIconHovered from "../../assets/calendar_today_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import allowanceIconHovered from "../../assets/edit_document_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIconHovered from "../../assets/flood_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

function AfterlogNavbar() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const navTranslations = {
    EN: {
      home: "Home",
      dashboard: "Dashboard",
      certificates: "Certificates Services",
      allowances: "Allowance Programs",
      appointments: "Appointments",
      disaster: "Disaster Report",
      profile: "Profile & Settings",
      family: "Family & Household",
      logout: "Log Out",
    },

    SI: {
      home: "මුල් පිටුව",
      dashboard: "පාලන පුවරුව",
      certificates: "සහතික සේවා",
      allowances: "දීමනා වැඩසටහන්",
      appointments: "හමුවීම්",
      disaster: "ආපදා වාර්තා",
      profile: "පැතිකඩ සහ සැකසුම්",
      family: "පවුලේ සහ ගෘහ විස්තර",
      logout: "පිටවීම",
    },

    TA: {
      home: "முகப்பு",
      dashboard: "டாஷ்போர்டு",
      certificates: "சான்றிதழ் சேவைகள்",
      allowances: "கொடுப்பனவு திட்டங்கள்",
      appointments: "சந்திப்புகள்",
      disaster: "பேரழிவு அறிக்கை",
      profile: "சுயவிவரம் & அமைப்புகள்",
      family: "குடும்பம் மற்றும் வீட்டு விவரங்கள்",
      logout: "வெளியேறு",
    },
  };

  const t = navTranslations[lang] || navTranslations.EN;

  // State to track which menu item is being hovered
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Menu items configuration
  const menuItems = [
    {
      id: "home",
      name: t.home,
      path: "/",
      icon: homeIcon,
      iconActive: homeIconHovered,
    },
    {
      id: "dashboard",
      name: t.dashboard,
      path: "/ResidentDashboard",
      icon: dashBoard,
      iconActive: dashBoardIconHovered,
    },
    {
      id: "profile",
      name: t.profile,
      path: "/ResidentDashboard/profile",
      icon: profileIcon,
      iconActive: profileIconHovered,
    },
    {
      id: "household",
      name: t.family,
      path: "/ResidentDashboard/RHousehold",
      icon: householdIcon,
      iconActive: householdIconHovered,
    },
    {
      id: "certificates",
      name: t.certificates,
      path: "/certificates",
      icon: certificateIcon,
      iconActive: certificateIconHovered,
    },
    {
      id: "appointments",
      name: t.appointments,
      path: "/ResidentDashboard/RAppointment",
      icon: appointmentIcon,
      iconActive: appointmentIconHovered,
    },
    {
      id: "allowances",
      name: t.allowances,
      path: "/dashboard/resident/allowances",
      icon: allowanceIcon,
      iconActive: allowanceIconHovered,
    },
    {
      id: "disaster",
      name: t.disaster,
      path: "/disaster-relief",
      icon: disasterIcon,
      iconActive: disasterIconHovered,
    },
  ];

  // Function to determine which icon to show
  const getIconForItem = (item, isActive) => {
    if (isActive || hoveredItemId === item.id) {
      return item.iconActive;
    }
    return item.icon;
  };

  // Function to determine button styles
  const getButtonStylesForItem = (item, isActive) => {
    if (isActive || hoveredItemId === item.id) {
      if (isActive) {
        return "bg-[#005BBD] text-[#F7FAFC] rounded-r-full shadow-md";
      }
      return "bg-[#1B365D] text-[#F7FAFC] rounded-r-full shadow-sm";
    }
    return "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900";
  };

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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
    <header className="flex justify-between items-center py-3 sm:py-4 lg:py-[20px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
      {/* ==================================================================== */}
      {/* DESKTOP NAVBAR - Visible on tablets and desktops (768px and above) */}
      {/* ==================================================================== */}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section */}
        <div
          className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-[20px]">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Bell */}
          <div className="relative cursor-pointer flex items-center justify-center transition-colors duration-200 hover:opacity-80">
            <img
              src={notificationIcon}
              alt="Notifications"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[30px] lg:h-[30px] object-contain"
            />
            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px]">
            <div className="flex flex-col text-right">
              <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-regular text-[#2D3748]">
                Colombo
              </span>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-regular text-[#2D3748]">
                Borella
              </span>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-[50px] xl:h-[50px] rounded-full bg-slate-200 flex items-center justify-center border-[1.5px] border-slate-300 overflow-hidden flex-shrink-0">
              <img
                src={accountIcon}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
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
          className="relative cursor-pointer p-1.5 sm:p-2 -ml-2"
          onClick={toggleMobileMenu}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <img
            src={menuIcon}
            alt="Menu"
            className="w-4 h-4 sm:w-5 sm:h-6 object-contain"
          />
        </button>

        {/* Right Section - Icons only on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Bell */}
          <div className="relative cursor-pointer flex items-center justify-center">
            <img
              src={notificationIcon}
              alt="Notifications"
              className="w-4 h-4 sm:w-5 sm:h-6 object-contain"
            />
            <span className="absolute -top-1 -right-1 bg-[#D69E2E] text-[#F7FAFC] text-[8px] sm:text-[10px] font-medium w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Avatar (No text on mobile) */}
          <div className="w-7 h-7 sm:w-8 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center border-[1.5px] border-slate-300 overflow-hidden flex-shrink-0">
            <img
              src={accountIcon}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
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
        className={`fixed top-0 left-0 w-[280px] sm:w-[300px] h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation menu"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#2D37481D]">
          <div
            className="w-20 sm:w-24 cursor-pointer"
            onClick={() => {
              navigate("/");
              closeMobileMenu();
            }}
          >
            <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col h-[calc(100%-130px)] overflow-y-auto">
          <nav className="flex flex-col gap-0.5 sm:gap-1 p-2 sm:p-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end
                onClick={closeMobileMenu}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className={({ isActive }) => `
                  flex items-center gap-2 sm:gap-3 w-full border-none rounded-lg
                  ${getButtonStylesForItem(item, isActive)}
                  py-2 sm:py-2.5 px-3 sm:px-4 cursor-pointer text-xs sm:text-sm font-regular text-left transition-all duration-200
                `}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={getIconForItem(item, isActive)}
                      alt={`${item.name} Icon`}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain flex-shrink-0"
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1B365D] p-3 sm:p-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
            <p className="text-[10px] sm:text-xs lg:text-sm font-regular text-[#F7FAFC8D]">
              © {currentYear} SmartGN. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#F7FAFC]">
                Admin Support:
              </p>
              <a
                href="tel:+94255731913"
                className="text-[10px] sm:text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
              >
                Mobile: 0255731913
              </a>
              <a
                href="mailto:warapitiyalakshan@gmail.com"
                className="text-[10px] sm:text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300 break-all text-center"
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
