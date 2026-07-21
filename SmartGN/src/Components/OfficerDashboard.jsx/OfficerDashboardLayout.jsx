import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import OfficerCardLayout from "./OfficerCardLayout";
import QuickActions from "./QuickActions";
import Announcement from "./Announcement";

function OfficerDashboardLayout({ gnprofile = {} }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const DashboardLayoutTranslations = {
    EN: {
      greeting: `Have a Nice Day, ${gnprofile.firstName}!`,
    },
    SI: {
      greeting: `සුභ දවසක්, ${gnprofile.firstName}!`,
    },
    TA: {
      greeting: `இனிய நாள், ${gnprofile.firstName}!`,
    },
  };

  const t = DashboardLayoutTranslations[lang] || DashboardLayoutTranslations.EN;
  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.greeting}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] justify-center">
        <OfficerCardLayout />
      </div>

      <div className="flex mx-[30px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px]">
        <QuickActions />
      </div>

      <div className="flex mx-[30px] border border-[#2D37482D] rounded-[15px] my-[30px] p-[20px] ">
        <Announcement />
      </div>
    </>
  );
}

export default OfficerDashboardLayout;
