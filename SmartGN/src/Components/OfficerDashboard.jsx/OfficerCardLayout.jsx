import React from "react";
import { useLanguage } from "../../utils/translate";
import totalResidentsIcon from "../../assets/location_away_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import totalPendingIcon from "../../assets/pending_actions_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function OfficerCardLayout() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const CardLayoutTranslations = {
    EN: {
      Card1Title: "Total Residents",
      Card2Title: "Total Pending requests",
      Card3Title: "Active Disaster",
    },
    SI: {
      Card1Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      Card2Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්",
      Card3Title: "හමුවක් වෙන්කරන්න",
    },
    TA: {
      Card1Title: "நிலுவையில் உள்ள சந்திப்பு கோரிக்கைகள்",
      Card2Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      Card3Title: "சந்திப்பை பதிவு செய்யவும்",
    },
  };

  // Select the appropriate translation based on current language
  const t = CardLayoutTranslations[lang] || CardLayoutTranslations.EN;

  // ============================================================================
  // CARD ARRAY - Pass function references (NOT function calls!)
  // ============================================================================
  const cards = [
    {
      id: 1,
      icon: totalResidentsIcon,
      title: t.Card1Title,
      count: 10000,
    },
    {
      id: 2,
      icon: totalPendingIcon,
      title: t.Card2Title,
      count: 500,
    },
    {
      id: 3,
      icon: disasterIcon,
      title: t.Card3Title,
      count: null,
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]"
        >
          <img src={card.icon} alt="card icon" className="w-[50px]" />

          <div className="flex flex-col items-center">
            <span className="text-[16px] font-regular text-[#2D3748] text-center">
              {card.title}
            </span>

            <span className="text-[20px] font-medium text-[#2D3748]">
              {card.count}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

export default OfficerCardLayout;
