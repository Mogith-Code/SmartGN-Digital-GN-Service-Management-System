// src/components/Common/AfterlogNavbar.jsx
import React from "react";
import logoImage from "../../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../../utils/translate";
import { NavLink } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import NotificationsDropdown from "./NotificationsDropdown";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/api";
import { getImageUrl } from "../../utils/imageUtils";
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
  const { logout } = useAuth();
  const { lang } = useLanguage();

  // ✅ Get user's division name from localStorage
  const divisionName =
    localStorage.getItem("smartgn_user_division") || "GN Division";
  const userName = localStorage.getItem("smartgn_user_name") || "User";
  const userRole = localStorage.getItem("smartgn_user_role") || "Resident";

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

  // Dynamic Resident Profile state
  const [profile, setProfile] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    division: "Colombo, Borella",
    profilePhoto: null,
  });

  const loadProfile = async () => {
    const saved = localStorage.getItem("smartgn_resident_profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved profile", e);
      }
    }
    try {
      const res = await fetch("/api/residents/profile", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = {
          firstName: data.first_name || "Nimal",
          lastName: data.last_name || "Perera",
          division: data.division_name || "Colombo, Borella",
          profilePhoto: data.profile_photo_path || null,
        };
        setProfile(mapped);
        localStorage.setItem(
          "smartgn_resident_profile",
          JSON.stringify(mapped),
        );
      }
    } catch (err) {
      // Fallback keep cached
    }
  };

  useEffect(() => {
    loadProfile();
    const handleProfileUpdate = () => loadProfile();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

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
    <header
      className="
      flex justify-between items-center 
      py-2 sm:py-3 md:py-4 lg:py-[20px] 
      px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 
      bg-[#EBF8FF] 
      sticky top-0 z-[100] 
      shadow-[0_5px_25px_rgba(0,0,0,0.2)]
    "
    >
      {/* ==================================================================== */}
      {/* DESKTOP NAVBAR - Visible on tablets and desktops (768px and above) */}
      {/* ==================================================================== */}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section */}
        <div
          className="w-24 sm:w-28 md:w-32 lg:w-40 xl:w-48 2xl:w-56 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-[20px]">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Dropdown */}
          <NotificationsDropdown role="resident" />

          {/* User Profile Info */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-[10px] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate("/ResidentDashboard/profile")}
            title="Click to view profile"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-semibold text-[#1B365D] max-w-[100px] sm:max-w-[120px] md:max-w-[130px] truncate">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#64748b] max-w-[100px] sm:max-w-[120px] md:max-w-[130px] truncate">
                {profile.division || "Colombo, Borella"}
              </span>
            </div>
            <div
              className="
              w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-[46px] xl:h-[46px] 
              rounded-full bg-slate-200 
              flex items-center justify-center 
              border border-[#005BBD] 
              overflow-hidden flex-shrink-0 
              shadow-sm
            "
            >
              {profile.profilePhoto ? (
                <img
                  src={getImageUrl(profile.profilePhoto)}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = accountIcon;
                  }}
                />
              ) : (
                <img
                  src={accountIcon}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="
              py-1 px-2 sm:py-1.5 sm:px-3 
              bg-red-50 text-red-600 hover:bg-red-600 hover:text-white 
              border border-red-200 
              rounded-lg 
              text-[10px] sm:text-xs 
              font-semibold 
              cursor-pointer transition-colors duration-150 
              flex items-center gap-0.5 sm:gap-1 
              shadow-sm
            "
            title="Logout of your account"
          >
            <span className="text-xs sm:text-sm">🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MOBILE NAVBAR - Visible only on mobile devices (below 768px) */}
      {/* ==================================================================== */}
      <div className="flex w-full justify-between items-center md:hidden">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="relative cursor-pointer p-1 sm:p-1.5 -ml-1 sm:-ml-2"
            onClick={toggleMobileMenu}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <img
              src={menuIcon}
              alt="Menu"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </button>

          {/* Logo on Mobile */}
          <div
            className="w-16 sm:w-20 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
          </div>
        </div>

        {/* Right Section - Icons on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Dropdown */}
          <NotificationsDropdown role="resident" />

          {/* User Avatar (No text on mobile) */}
          <div
            className="
              w-7 h-7 sm:w-8 sm:h-8 
              rounded-full bg-slate-200 
              flex items-center justify-center 
              border border-[#2D3748] 
              overflow-hidden flex-shrink-0 
              cursor-pointer
            "
            onClick={() => navigate("/ResidentDashboard/profile")}
            title="Click to view profile"
          >
            {profile.profilePhoto ? (
              <img
                src={getImageUrl(profile.profilePhoto)}
                alt="User Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = accountIcon;
                }}
              />
            ) : (
              <img
                src={accountIcon}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu overlay"
          role="presentation"
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={mobileMenuRef}
        className={`
          fixed top-0 left-0 
          w-[280px] sm:w-[320px] 
          h-full 
          bg-white 
          shadow-2xl 
          z-50 
          transform transition-transform duration-300 ease-in-out 
          md:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Navigation menu"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#2D37481D]">
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

        {/* ✅ User Info in Mobile Menu */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#2D37481D] bg-[#EBF8FF]">
          <p className="text-sm sm:text-base font-semibold text-[#1B365D] truncate">
            {userName}
          </p>
          <p className="text-xs sm:text-sm text-[#2D3748] truncate">
            {divisionName}
          </p>
          <p className="text-[10px] sm:text-xs text-[#D69E2E] mt-0.5 font-medium">
            {userRole}
          </p>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col h-[calc(100%-220px)] overflow-y-auto">
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
                  py-2 sm:py-2.5 px-3 sm:px-4 
                  cursor-pointer 
                  text-xs sm:text-sm 
                  font-regular text-left 
                  transition-all duration-200
                  min-h-[40px] sm:min-h-[44px]
                `}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={getIconForItem(item, isActive)}
                      alt={`${item.name} Icon`}
                      className="
                        w-4 h-4 sm:w-5 sm:h-5 
                        object-contain flex-shrink-0
                      "
                    />
                    <span className="truncate text-xs sm:text-sm">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Logout Button in Mobile Menu */}
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="
                flex items-center gap-2 sm:gap-3 w-full border-none rounded-lg
                bg-red-50 text-red-600 hover:bg-red-100 
                py-2 sm:py-2.5 px-3 sm:px-4 
                cursor-pointer 
                text-xs sm:text-sm 
                font-semibold text-left 
                transition-all duration-200
                min-h-[40px] sm:min-h-[44px]
                mt-1 sm:mt-2
              "
            >
              <span className="text-base sm:text-lg">🚪</span>
              <span className="truncate">{t.logout}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1B365D] p-3 sm:p-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
            <p className="text-[9px] sm:text-xs lg:text-sm font-regular text-[#F7FAFC8D]">
              © {currentYear} SmartGN. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <p className="text-[9px] sm:text-xs lg:text-sm font-medium text-[#F7FAFC]">
                Admin Support:
              </p>
              <a
                href="tel:+94255731913"
                className="text-[9px] sm:text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
              >
                Mobile: 0255731913
              </a>
              <a
                href="mailto:warapitiyalakshan@gmail.com"
                className="text-[9px] sm:text-xs font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300 break-all text-center"
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
