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
import announcementIcon from "../../assets/brand_awareness_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import homeIconHovered from "../../assets/home_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import dashBoardIconHovered from "../../assets/team_dashboard_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIconHovered from "../../assets/person_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import householdIconHovered from "../../assets/home_and_garden_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import certificateIconHovered from "../../assets/license_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIconHovered from "../../assets/calendar_today_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import allowanceIconHovered from "../../assets/edit_document_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIconHovered from "../../assets/flood_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import announcementIconHovered from "../../assets/brand_awareness_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

function AfterlogNavbar() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];

  // State to track which menu item is being hovered (only ONE item at a time)
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Menu items configuration - Single source of truth
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
      path: "/dashboard",
      icon: dashBoard,
      iconActive: dashBoardIconHovered,
    },
    {
      id: "profile",
      name: t.profile,
      path: "/profile",
      icon: profileIcon,
      iconActive: profileIconHovered,
    },
    {
      id: "household",
      name: t.family,
      path: "/RHousehold",
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
      path: "/RAppointment",
      icon: appointmentIcon,
      iconActive: appointmentIconHovered,
    },
    {
      id: "allowances",
      name: t.allowances,
      path: "/allowances",
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
    {
      id: "announcements",
      name: t.announcements,
      path: "/announcements",
      icon: announcementIcon,
      iconActive: announcementIconHovered,
    },
  ];

  // Function to determine which icon to show for a specific item
  const getIconForItem = (item, isActive) => {
    // Show active icon if:
    // 1. The item is currently active (user is on that page)
    // 2. The item is the one being hovered
    if (isActive || hoveredItemId === item.id) {
      return item.iconActive;
    }
    return item.icon;
  };

  // Function to determine button styles for a specific item
  const getButtonStylesForItem = (item, isActive) => {
    // Apply hover/active styles if:
    // 1. The item is currently active
    // 2. The item is the one being hovered
    if (isActive || hoveredItemId === item.id) {
      if (isActive) {
        return "bg-[#005BBD] text-[#F7FAFC]";
      }
      return "bg-[#1B365D] text-[#F7FAFC]";
    }
    return "bg-transparent text-[#2D3748]";
  };

  // STATE MANAGEMENT
  // Mobile menu management state - controls the visibility of mobile sidebar.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref for mobile menu DOM element - To detect clicks outside the menu.
  const mobileMenuRef = useRef(null);

  // MOBILE MENU HANDLERS
  // Toggles the mobile sidebar menu visibility (opens/closes the menu)
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Closes the mobile sidebar menu - called when clicking outside or on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // SIDE EFFECTS (useEffect Hooks)
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside mobile menu AND sidebar is open
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Only add event listener when sidebar is open to improve performance
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup: remove event listener when component unmounts or sidebar closes
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile sidebar is open.
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Disable scrolling on body when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when sidebar closes
      document.body.style.overflow = "unset";
    }

    // Cleanup: ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]); // Re-run effect when isMobileMenuOpen changes

  const currentYear = new Date().getFullYear();

  return (
    <header className="flex justify-between items-center py-[20px] px-[100px] bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.2)] max-lg:px-[60px] max-md:px-[30px] py-[10px]">
      {/* DESKTOP NAVBAR - Visible on tablets and desktops (md and above)*/}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section - Clickable to navigate home */}
        <div
          className="w-[280px] max-lg:w-[200px]"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logoImage} alt="SmartGN Logo" />
        </div>

        <div className="flex items-center gap-[20px]">
          {/* Language Selector Component */}
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative cursor-pointer flex items-center justify-center transition-colors duration-200">
            <img
              src={notificationIcon}
              alt="Notifications"
              className="w-auto h-[30px]"
            />
            <span className="absolute -top-1.5 -right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[12px] font-medium w-[20px] h-[20px] rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-[10px]">
            <div className="flex flex-col text-right ">
              <span className="text-[10px] font-regular text-[#2D3748]">
                Colombo
              </span>
              <span className="text-[16px] font-medium text-[#2D3748]">
                Janith
              </span>
            </div>
            <div className="w-[50px] h-[50px] rounded-full bg-slate-200 flex items-center justify-cente border-[1.5px] border-slate-300">
              <img
                src={accountIcon}
                alt="User Profile"
                className="w-auto h-[50px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR - Visible only on mobile devices (max-md) */}
      <div className="hidden max-md:w-full max-md:flex max-md:justify-between max-md:items-center ">
        {/*Menu Button - Toggles mobile sidebar */}
        <button
          className="relative cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <img src={menuIcon} alt="Menu" className="w-auto h-6" />
        </button>

        <div className="flex items-center gap-[20px]">
          {/* Language Selector Component */}
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative cursor-pointer flex items-center justify-center transition-colors duration-200">
            <img
              src={notificationIcon}
              alt="Notifications"
              className="w-auto h-[30px]"
            />
            <span className="absolute -top-1.5 -right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[12px] font-medium w-[20px] h-[20px] rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-[10px]">
            <div className="w-[50px] h-[50px] rounded-full bg-slate-200 flex items-center justify-cente border-[1.5px] border-slate-300">
              <img
                src={accountIcon}
                alt="User Profile"
                className="w-auto h-[50px]"
              />
            </div>
          </div>
        </div>

        {/* Overlay Background - Darkens page content when sidebar is open */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={closeMobileMenu}
            aria-label="Close menu overlay"
            role="presentation"
          />
        )}

        {/* VERTICAL NAVIGATION SIDEBAR - Slides in from left on mobile      */}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 left-0 w-[300px] h-full bg-white shadow-2xl z-1000 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Navigation menu"
          role="navigation"
        >
          {/* Sidebar Header - Title section */}
          <div className="px-8 py-[27px] border-b border-[#2D37481D]">
            <div
              className="max-md:w-[150px]"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img src={logoImage} alt="SmartGN Logo" />
            </div>
          </div>

          {/* Vertical Navigation Links - Optimized for mobile touch targets */}
          <div className="flex flex-col mb-0 mt-[40px] overflow-y-auto max-h-100vh">
            <nav className="flex flex-col gap-[5px]">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={({ isActive }) => `
                            flex items-center gap-[10px] w-full border-none 
                            ${getButtonStylesForItem(item, isActive)}
                            py-[10px] px-[30px] cursor-pointer text-[12px] font-regular text-left transition-all duration-200
                          `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon - Shows active icon when active OR this specific item is hovered */}
                      <img
                        src={getIconForItem(item, isActive)}
                        alt={`${item.name} Icon`}
                        className="w-auto h-[20px]"
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <footer className="w-full bg-[#1B365D] mt-[50px] p-[10px]">
              <div className="w-full flex items-center justify-between gap-8 max-md:gap-[10px] max-md:flex-col max-md:text-center">
                {/* RIGHTS CONTAINER - Copyright Text */}
                <div className="flex-shrink-0">
                  <p className="text-[16px] max-md:text-[12px] font-regular text-[#F7FAFC8D]">
                    © {currentYear} SmartGN. All rights reserved.
                  </p>
                </div>

                {/* CONTACT CONTAINER - Admin Support Information */}
                <div className="flex flex-col items-start gap-1 max-md:items-center">
                  {/* Admin Support Title */}
                  <p className="text-[16px] max-md:text-[12px] font-medium text-[#F7FAFC]">
                    Admin Support:
                  </p>

                  {/* Mobile Number */}
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] max-md:text-[12px] font-regular text-[#F7FAFC]">
                      Mobile:
                    </span>
                    <a
                      href="tel:+94255731913"
                      className="text-[14px] max-md:text-[12px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
                    >
                      0255731913
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-regular text-[#F7FAFC]">
                      Email:
                    </span>
                    <a
                      href="mailto:Admin@gmail.com"
                      className="text-[14px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
                    >
                      warapitiyalakshan@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AfterlogNavbar;
