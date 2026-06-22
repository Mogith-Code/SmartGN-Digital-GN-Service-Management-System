import React from "react";
import { useLanguage } from "../../utils/translate";

function FamilyCardLyout() {
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
      Card2Title: "වැඩිහිටි සාමාජිකයින්(18+)",
      Card3Title: "ළමුන්",
    },

    TA: {
      Card1Title: "மொத்த உறுப்பினர்கள்",
      Card2Title: "வயது 18+ பெரியவர்கள்",
      Card3Title: "குழந்தைகள்",
    },
  };
  return <div>FamilyCardLyout</div>;
}

export default FamilyCardLyout;
