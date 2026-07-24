// Components/OfficerDashboard.jsx/OfficerDashboardLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import OfficerCardLayout from "./OfficerCardLayout";
import QuickActions from "./QuickActions";
import Announcement from "./Announcement";

function OfficerDashboardLayout({
  gnProfile = {},
  dashboardStats = {},
  showAlert = false,
  setShowAlert = () => {},
  loading = false,
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const DashboardLayoutTranslations = {
    EN: {
      greeting: `Have a Nice Day, ${gnProfile.firstName || "GN Officer"}!`,
    },
    SI: {
      greeting: `සුභ දවසක්, ${gnProfile.firstName || "GN නිලධාරී"}!`,
    },
    TA: {
      greeting: `இனிய நாள், ${gnProfile.firstName || "GN அதிகாரி"}!`,
    },
  };

  const t = DashboardLayoutTranslations[lang] || DashboardLayoutTranslations.EN;

  // Check if ID card images are missing
  const isIdCardMissing = !gnProfile.idCardFront || !gnProfile.idCardBack;

  return (
    <>
      {/* ── Header with Greeting and Alert ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px]">
        <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
          {t.greeting}
        </h2>
        {/*ID upload alert */}
        <div className="flex justify-end -mt-[70px]">
          {showAlert && isIdCardMissing && gnProfile.gnId && (
            <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1">
              <div className="flex items-center gap-2">
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => {
                    navigate("/OfficerDashboard/profile");
                  }}
                >
                  Please upload a high-quality image of your GN Identity Card
                </span>
              </div>
              <button
                className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1 ml-3"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] justify-center">
        <OfficerCardLayout dashboardStats={dashboardStats} />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex mx-[30px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px]">
        <QuickActions />
      </div>

      {/* ── Announcements ── */}
      <div className="flex mx-[30px] border border-[#2D37482D] rounded-[15px] my-[30px] p-[20px]">
        <Announcement />
      </div>
    </>
  );
}

export default OfficerDashboardLayout;
