import React from "react";
import { useLanguage } from "../../utils/translate";

import ResidentsDetailsCardLAyout from "./ResidentsDetailsCardLAyout";
import ProfileSearchingSection from "./ProfileSearchingSection";

function ResidentsDetailsLayout() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const OHouseholdLayoutTranslations = {
    EN: { Title: "Residents' Information" },
    SI: { Title: "පදිංචිකරුවන්ගේ විස්තර" },
    TA: { Title: "குடியிருப்பவர்களின் விவரங்கள்" },
  };

  const t =
    OHouseholdLayoutTranslations[lang] || OHouseholdLayoutTranslations.EN;
  return (
    <>
      <div className="flex justify-between text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <ResidentsDetailsCardLAyout />
      </div>

      <div className="flex mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        <ProfileSearchingSection />
      </div>
    </>
  );
}

export default ResidentsDetailsLayout;
