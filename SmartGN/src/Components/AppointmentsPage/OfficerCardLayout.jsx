import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import pendingIcon from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import urgentIcon from "../../assets/work_alert_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function OfficerCardLayout({ pendingCount, approvedCount, tomorrowCount }) {
  const navigate = useNavigate();

  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN),
  // Sinhala (SI), and Tamil (TA)
  const OCardLayoutTranslations = {
    EN: {
      Card1Title: "Pending Requests",
      Card2Title: "Approved Appointments",
      Card3Title: "Tomorrow's Appointments",
    },

    SI: {
      Card1Title: "හමුවීම් සඳහා ඉල්ලීම්",
      Card2Title: "අනුමත හමුවීම්",
      Card3Title: "හෙට හමුවීම්",
    },

    TA: {
      Card1Title: "நிலுவையில் உள்ள சந்திப்பு கோரிக்கைகள்",
      Card2Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      Card3Title: "சந்திப்பை பதிவு செய்யவும்",
    },
  };

  // Select the appropriate translation based on current language
  const t = OCardLayoutTranslations[lang] || OCardLayoutTranslations.EN;
  return (
    <>
      <div
        className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() =>
          navigate("/OfficerAppointment/OfficerPendingAppointment")
        }
      >
        <img src={pendingIcon} alt="pendingIcon" className="w-[50px]" />

        <div className="flex flex-col items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card1Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {pendingCount}
          </span>
        </div>
      </div>

      <div
        className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() =>
          navigate("/OfficerAppointment/OfficerApprovedAppointment")
        }
      >
        <img src={approvedIcon} alt="approvedIcon" className="w-[50px]" />

        <div className="flex flex-col items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card2Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {approvedCount}
          </span>
        </div>
      </div>

      <div
        className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() => navigate("/OfficerAppointment/RequestsForTomorrow")}
      >
        <img src={urgentIcon} alt="pendingIcon" className="w-[50px]" />

        <div className="flex flex-col items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card3Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {tomorrowCount}
          </span>
        </div>
      </div>
    </>
  );
}

export default OfficerCardLayout;
