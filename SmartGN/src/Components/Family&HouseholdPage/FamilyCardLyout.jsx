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

  const cards = [
    {
      id: 1,
      icon: totalMembersIcon,
      alt: "Total Members",
      title: t.Card1Title,
      count: Total,
    },
    {
      id: 2,
      icon: adultIcon,
      alt: "Adult Members",
      title: t.Card2Title,
      count: Adult,
    },
    {
      id: 3,
      icon: childrenIcon,
      alt: "Children",
      title: t.Card3Title,
      count: Children,
    },
  ];
  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]"
        >
          <img src={card.icon} alt={card.alt} className="w-[50px]" />

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

export default FamilyCardLyout;
