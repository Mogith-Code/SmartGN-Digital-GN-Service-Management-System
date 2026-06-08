// src/components/RSidebar.jsx
import React, { useState } from "react";
import { translations, useLanguage } from "../../utils/translate";
import { NavLink } from "react-router-dom";
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

function RSidebar() {
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
        return "bg-[#005BBD] text-[#F7FAFC] rounded-r-full shadow-[0px_3px_15px_rgba(0,0,0,0.5)]";
      }
      return "bg-[#1B365D] text-[#F7FAFC] rounded-r-full shadow-[0px_2px_10px_rgba(0,0,0,0.5)]";
    }
    return "bg-transparent text-[#2D3748]";
  };

  return (
    <>
      {/* Sidebar Nav */}
      <aside className="w-[280px] bg-white border-r border-[#2D37482D] pt-[60px] pr-[20px] ">
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
                py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-left transition-all duration-200
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
      </aside>
    </>
  );
}

export default RSidebar;
