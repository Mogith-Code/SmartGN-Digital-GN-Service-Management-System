import React from "react";
import { useLanguage } from "../../utils/translate";
import totalResidentsIcon from "../../assets/location_away_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import totalPendingIcon from "../../assets/pending_actions_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function OfficerCardLayout({ dashboardStats = {} }) {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const CardLayoutTranslations = {
    EN: {
      Card1Title: "Total Residents",
      Card2Title: "Total Pending requests",
      Card3Title: "Active Disasters",
    },
    SI: {
      Card1Title: "මුළු පදිංචිකරුවන්",
      Card2Title: "මුළු පොරොත්තු ඉල්ලීම්",
      Card3Title: "සක්‍රීය ව්‍යසන",
    },
    TA: {
      Card1Title: "மொத்த குடியிருப்பாளர்கள்",
      Card2Title: "மொத்த நிலுவையில் உள்ள கோரிக்கைகள்",
      Card3Title: "செயலில் உள்ள பேரழிவு",
    },
  };

  // Select the appropriate translation based on current language
  const t = CardLayoutTranslations[lang] || CardLayoutTranslations.EN;

  // Format numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  // ============================================================================
  // CARD ARRAY - Using dashboardStats from props
  // ============================================================================
  const cards = [
    {
      id: 1,
      icon: totalResidentsIcon,
      title: t.Card1Title,
      count: formatNumber(dashboardStats.totalResidents),
    },
    {
      id: 2,
      icon: totalPendingIcon,
      title: t.Card2Title,
      count: formatNumber(dashboardStats.totalPendingRequests),
    },
    {
      id: 3,
      icon: disasterIcon,
      title: t.Card3Title,
      count: formatNumber(dashboardStats.activeDisasters),
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D] hover:shadow-md transition-shadow duration-200"
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
