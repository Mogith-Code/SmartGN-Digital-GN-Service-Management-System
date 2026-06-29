import React from "react";
import { useLanguage } from "../../utils/translate";
import totalMembersIcon from "../../assets/groups_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import adultIcon from "../../assets/18_up_rating_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import childrenIcon from "../../assets/child_care_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function FamilyCardLyout({ Total, Adult, Children }) {
  const { lang } = useLanguage();

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
      <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]">
        <img
          src={totalMembersIcon}
          alt="totalMembersIcon"
          className="w-[50px]"
        />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card1Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {Total}
          </span>
        </div>
      </div>

      <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]">
        <img src={adultIcon} alt="adultIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card2Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {Adult}
          </span>
        </div>
      </div>

      <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]">
        <img src={childrenIcon} alt="childrenIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748] text-center">
            {t.Card3Title}
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">
            {Children}
          </span>
        </div>
      </div>
    </>
  );
}

export default FamilyCardLyout;
