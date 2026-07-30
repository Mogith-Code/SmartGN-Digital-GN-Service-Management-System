// src/Components/ResidentsDetails/ResidentsDetailsCardLayout.jsx
import React from "react";
import { useLanguage } from "../../utils/translate";
import totalIcon from "../../assets/groups_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import familyIcon from "../../assets/family_group_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import beneficiaryIcon from "../../assets/real_estate_agent_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function ResidentsDetailsCardLayout({
  totalResidents = 0,
  totalFamilies = 0,
  totalBeneficiaries = 0,
}) {
  const { lang } = useLanguage();

  const CardLayoutTranslations = {
    EN: {
      Card1Title: "Total Number of Residents",
      Card2Title: "Total Number of Families",
      Card3Title: "Total number of families receiving grants",
    },
    SI: {
      Card1Title: "මුළු පදිංචිකරුවන් ගණන",
      Card2Title: "මුළු පවුල් ගණන",
      Card3Title: "දීමනා ලබන පවුල් ගණන",
    },
    TA: {
      Card1Title: "மொத்த குடியிருப்பாளர்களின் எண்ணிக்கை",
      Card2Title: "மொத்த குடும்பங்களின் எண்ணிக்கை",
      Card3Title: "மானியம் பெறும் குடும்பங்களின் மொத்த எண்ணிக்கை",
    },
  };

  const t = CardLayoutTranslations[lang] || CardLayoutTranslations.EN;

  const cards = [
    {
      id: 1,
      icon: totalIcon,
      title: t.Card1Title,
      count: totalResidents,
    },
    {
      id: 2,
      icon: familyIcon,
      title: t.Card2Title,
      count: totalFamilies,
    },
    {
      id: 3,
      icon: beneficiaryIcon,
      title: t.Card3Title,
      count: totalBeneficiaries,
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200"
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

export default ResidentsDetailsCardLayout;
