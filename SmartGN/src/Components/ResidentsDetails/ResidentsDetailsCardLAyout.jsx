import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import totalIcon from "../../assets/groups_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import familyIcon from "../../assets/family_group_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import beneficiaryIcon from "../../assets/real_estate_agent_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function ResidentsDetailsCardLAyout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const CardLayoutTranslations = {
    EN: {
      Card1Title: "Total Number of Residents",
      Card2Title: "Total Number of Families",
      Card3Title: "Total number of families receiving grants",
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
      icon: totalIcon,
      title: t.Card1Title,
      count: 6,
    },
    {
      id: 2,
      icon: familyIcon,
      title: t.Card2Title,
      count: 5,
    },
    {
      id: 3,
      icon: beneficiaryIcon,
      title: t.Card3Title,
      count: 4,
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

export default ResidentsDetailsCardLAyout;
