import React from "react";
import { useLanguage } from "../../utils/translate";

function ResidentsDetailsLayout() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const OHouseholdLayoutTranslations = {
    EN: { Title: "Residents' details" },
    SI: { Title: "පදිංචිකරුවන්ගේ විස්තර" },
    TA: { Title: "குடியிருப்பவர்களின் விவரங்கள்" },
  };

  const t =
    OHouseholdLayoutTranslations[lang] || OHouseholdLayoutTranslations.EN;
  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.Title}
      </div>
    </>
  );
}

export default ResidentsDetailsLayout;
