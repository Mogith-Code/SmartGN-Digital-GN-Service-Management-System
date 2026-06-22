import React from "react";
import { useLanguage } from "../../utils/translate";
import totalMembersIcon from "../../assets/groups_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import adultIcon from "../../assets/18_up_rating_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import childrenIcon from "../../assets/child_care_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function FamilyCardLyout() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN),
  // Sinhala (SI), and Tamil (TA)
  const FamilyCardLayoutTranslations = {
    EN: {
      Card1Title: "Total members",
      Card2Title: "Adult members (18+)",
      Card3Title: "Children",
    },

    SI: {
      Card1Title: "මුළු සාමාජිකයින්",
      Card2Title: "වැඩිහිටි සාමාජිකයින් (18+)",
      Card3Title: "ළමුන්",
    },

    TA: {
      Card1Title: "மொத்த உறுப்பினர்கள்",
      Card2Title: "வயது 18+ பெரியவர்கள்",
      Card3Title: "குழந்தைகள்",
    },
  };

  // Select the appropriate translation based on current language
  const t =
    FamilyCardLayoutTranslations[lang] || FamilyCardLayoutTranslations.EN;
  return (
    <>
      <div
        className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={totalMembersIcon}
          alt="totalMembersIcon"
          className="w-[50px]"
        />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card1Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">5</span>
        </div>
      </div>

      <div
        className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={adultIcon} alt="adultIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card2Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">2</span>
        </div>
      </div>

      <div
        className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={childrenIcon} alt="childrenIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card3Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">3</span>
        </div>
      </div>
    </>
  );
}

export default FamilyCardLyout;
