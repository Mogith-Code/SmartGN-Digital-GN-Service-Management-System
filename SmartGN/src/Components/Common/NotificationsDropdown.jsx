// src/Components/Common/NotificationsDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../../assets/notifications_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import certificateIcon from "../../assets/license_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIcon from "../../assets/calendar_today_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import announcementIcon from "../../assets/brand_awareness_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  formatNotificationTime,
} from "../../utils/notifications";

function NotificationsDropdown({ role = "resident" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread'
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const loadNotifs = () => {
    const list = getNotifications(role);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifs();

    const handleUpdate = () => {
      loadNotifs();
    };

    window.addEventListener("notificationsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("notificationsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [role]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const getCategoryIcon = (type) => {
    switch (type) {
      case "certificate":
        return certificateIcon;
      case "appointment":
        return appointmentIcon;
      case "announcement":
        return announcementIcon;
      case "disaster":
        return disasterIcon;
      default:
        return notificationIcon;
    }
  };

  const handleNotificationClick = (item) => {
    markAsRead(role, item.id);
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer flex items-center justify-center p-1 sm:p-1.5 rounded-full transition-all duration-200 hover:bg-slate-200/60 focus:outline-none border-0 bg-transparent"
        aria-label="Toggle Notifications"
      >
        <img
          src={notificationIcon}
          alt="Notifications"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[28px] lg:h-[28px] object-contain"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[9px] sm:text-[10px] md:text-[11px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-200 hover:scale-110">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[200] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 bg-[#1B365D] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide m-0 text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-[#D69E2E] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead(role)}
                  className="text-[11px] text-blue-200 hover:text-white underline border-0 bg-transparent cursor-pointer font-medium"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearNotifications(role)}
                  className="text-[11px] text-red-300 hover:text-red-100 border-0 bg-transparent cursor-pointer font-medium ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/80 px-3 pt-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer border-0 bg-transparent text-xs ${
                activeTab === "all"
                  ? "border-[#005BBD] text-[#005BBD] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer border-0 bg-transparent text-xs ${
                activeTab === "unread"
                  ? "border-[#005BBD] text-[#005BBD] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <img
                  src={notificationIcon}
                  alt="Empty"
                  className="w-8 h-8 opacity-30"
                />
                <span>No notifications found</span>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer transition-colors duration-150 text-left ${
                    item.read
                      ? "bg-white hover:bg-slate-50 opacity-80"
                      : "bg-blue-50/60 hover:bg-blue-50/90 font-medium"
                  }`}
                >
                  {/* Category Icon Container */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.type === "certificate"
                        ? "bg-amber-100 text-amber-700"
                        : item.type === "appointment"
                        ? "bg-blue-100 text-blue-700"
                        : item.type === "announcement"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <img
                      src={getCategoryIcon(item.type)}
                      alt={item.type}
                      className="w-4 h-4 object-contain"
                    />
                  </div>

                  {/* Body Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-800 truncate m-0">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-normal flex-shrink-0">
                        {formatNotificationTime(item)}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 line-clamp-2 m-0 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {/* Unread Dot Indicator */}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#005BBD] flex-shrink-0 mt-2"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 bg-slate-50 text-center border-t border-slate-100">
            <span className="text-[10px] text-slate-400">
              SmartGN Notifications • Click items to view details
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
