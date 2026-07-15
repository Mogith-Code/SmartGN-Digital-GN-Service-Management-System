// src/components/Common/RSidebar.jsx
import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import { NavLink } from "react-router-dom";
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
function RSidebar() {
  const { lang } = useLanguage();
  const RSidebarTranslations = {
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

  const t = RSidebarTranslations[lang] || RSidebarTranslations.EN;

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
      path: "/ResidentDashboard/certificates",
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
      path: "/ResidentDashboard/allowances",
      icon: allowanceIcon,
      iconActive: allowanceIconHovered,
    },
    {
      id: "disaster",
      name: t.disaster,
      path: "/ResidentDashboard/disaster-relief",
      icon: disasterIcon,
      iconActive: disasterIconHovered,
    },
  ];

  // Function to determine which icon to show for a specific item
  const getIconForItem = (item, isActive) => {
    if (isActive || hoveredItemId === item.id) {
      return item.iconActive;
    }
    return item.icon;
  };

  // Function to determine button styles for a specific item
  const getButtonStylesForItem = (item, isActive) => {
    if (isActive || hoveredItemId === item.id) {
      if (isActive) {
        return "bg-[#005BBD] text-[#F7FAFC] rounded-r-full shadow-md";
      }
      return "bg-[#1B365D] text-[#F7FAFC] rounded-r-full shadow-sm";
    }
    return "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900 rounded-r-full";
  };

  return (
    <aside className="w-56 sm:w-60 md:w-68 lg:w-72 xl:w-[280px] bg-white border-r border-[#2D37482D] pt-10 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-[60px] pr-2 sm:pr-3 md:pr-4 lg:pr-5 xl:pr-[20px] h-screen sticky top-0 overflow-y-auto flex-shrink-0">
      <nav className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-[5px]">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            className={({ isActive }) => `
              flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none 
              ${getButtonStylesForItem(item, isActive)}
              py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] 
              cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left 
              transition-all duration-200 hover:translate-x-0.5 sm:hover:translate-x-1
            `}
          >
            {({ isActive }) => (
              <>
                {/* Icon - Shows active icon when active OR this specific item is hovered */}
                <img
                  src={getIconForItem(item, isActive)}
                  alt={`${item.name} Icon`}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
                />
                <span className="truncate text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px]">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default RSidebar;
