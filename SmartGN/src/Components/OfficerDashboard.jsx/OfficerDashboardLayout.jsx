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

  return (
    <>
      {/* Header with Greeting */}
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.greeting}
      </div>

      {/* Stats Cards - Pass dashboardStats to OfficerCardLayout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] justify-center">
        <OfficerCardLayout dashboardStats={dashboardStats} />
      </div>

      {/* Quick Actions */}
      <div className="flex mx-[30px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px]">
        <QuickActions />
      </div>

      {/* Announcements */}
      <div className="flex mx-[30px] border border-[#2D37482D] rounded-[15px] my-[30px] p-[20px]">
        <Announcement />
      </div>
    </>
  );
}

export default OfficerDashboardLayout;
