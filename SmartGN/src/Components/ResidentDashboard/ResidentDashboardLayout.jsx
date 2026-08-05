// Components/ResidentDashboard/ResidentDashboardLayout.jsx
import React from "react";
import { useLanguage } from "../../utils/translate";
import ResidentCardLayout from "./ResidentCardLayout";
import QuickActions from "./QuickActions";
import Announcements from "./Announcements";
import { useNavigate } from "react-router-dom";

function ResidentDashboardLayout({
  profile = {},
  showAlert = false,
  setShowAlert = () => {},
  totalPendingCount = 0,
  totalApprovedCount = 0,
  upcomingAppointmentsCount = 0,
  announcements = [],
  recentActivities = [],
}) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Check if we have valid data
  const hasValidData = Boolean(profile);

  // Fallback UI when no data
  if (!hasValidData) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 mt-8 sm:mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 max-w-full sm:max-w-md w-full text-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-yellow-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
            Unable to Load Dashboard
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            We're having trouble loading your dashboard data. Please try
            refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            Refresh Page
          </button>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
            If this persists, please check your internet connection and try
            again later.
          </p>
        </div>
      </div>
    );
  }

  const DashboardLayoutTranslations = {
    EN: {
      greeting: `Have a Nice Day, ${profile.firstName || "Resident"}!`,
      alert:
        "Please upload a high-quality image of your National Identity Card",
    },
    SI: {
      greeting: `සුභ දවසක්, ${profile.firstName || "නේවාසික"}!`,
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
    },
    TA: {
      greeting: `இனிய நாள், ${profile.firstName || "குடியுரிமை"}!`,
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
    },
  };

  const t = DashboardLayoutTranslations[lang] || DashboardLayoutTranslations.EN;

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "approve")
      return "text-green-600 bg-green-50 border-green-200";
    if (s === "rejected" || s === "reject")
      return "text-red-600 bg-red-50 border-red-200";
    if (s === "completed" || s === "complete")
      return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  return (
    <>
      {/* ── NIC upload alert - NOW ABOVE HEADER ── */}
      {showAlert && profile.nic && (
        <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
          <div className="flex flex-wrap items-center justify-between p-2 sm:p-2.5 md:p-[10px] bg-[#fef3c7] border border-[#fde68a] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-lg sm:rounded-xl text-[#d97706] font-medium text-[11px] sm:text-xs md:text-sm lg:text-[14px] text-left w-full transition-shadow duration-300">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <span
                className="hover:underline hover:cursor-pointer truncate"
                onClick={() => {
                  navigate("/ResidentDashboard/profile");
                }}
              >
                {t.alert}
              </span>
            </div>
            <button
              className="bg-transparent border-0 text-[#d97706] cursor-pointer p-0.5 sm:p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] flex-shrink-0 ml-1 sm:ml-2"
              onClick={() => setShowAlert(false)}
              aria-label="Close Warning"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-[16px] sm:h-[16px]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
          {t.greeting}
        </h2>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px] justify-center">
        <ResidentCardLayout
          totalPendingCount={totalPendingCount}
          totalApprovedCount={totalApprovedCount}
          upcomingAppointmentsCount={upcomingAppointmentsCount}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] justify-center border border-[#2D37482D] rounded-[10px] sm:rounded-[12px] md:rounded-[15px] bg-[#FDF5E6] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] p-3 sm:p-4 md:p-5 lg:p-[20px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
        <QuickActions />
      </div>

      {/* ── Recent Activity ── */}
      {recentActivities && recentActivities.length > 0 && (
        <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border border-[#2D37482D] rounded-[10px] sm:rounded-[12px] md:rounded-[15px] mt-4 sm:mt-5 md:mt-[20px] p-3 sm:p-4 md:p-5 lg:p-[20px] shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-[18px] font-medium text-[#1B365D] mb-3 sm:mb-4">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {recentActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 p-2 sm:p-2.5 md:p-3 bg-[#F7FAFC] rounded-lg border border-[#2D37482D] hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="text-xs sm:text-sm font-medium text-[#2D3748] truncate">
                    {act.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#2D374880]">
                    {act.type} · {act.date}
                  </div>
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap ${statusColor(act.status)}`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Announcements ── */}
      <div className="flex mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border border-[#2D37482D] rounded-[10px] sm:rounded-[12px] md:rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] my-4 sm:my-5 md:my-6 lg:my-[30px] p-3 sm:p-4 md:p-5 lg:p-[20px] transition-shadow duration-300">
        <Announcements announcements={announcements} />
      </div>
    </>
  );
}

export default ResidentDashboardLayout;
