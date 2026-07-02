import React from "react";
import { useLanguage } from "../../utils/translate";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function OfficerAppointmentsLayoutPage() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const AppointmentLayoutTranslations = {
    EN: { Title: "Appointments" },
    SI: { Title: "හමුවවීම්" },
    TA: { Title: "சந்திப்புகள்" },
  };

  const t =
    AppointmentLayoutTranslations[lang] || AppointmentLayoutTranslations.EN;
  return (
    <>
      <div className="flex justify-between text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        <span>{t.Title}</span>
        <div className="flex bg-[#E2E8F0] border border-[#2D37482D] rounded-[15px] py-[10px] px-[30px] items-center gap-[10px]">
          <img
            src={searchIcon}
            alt="Search Icon"
            className="w-[15px] h-[15px] opacity-[50%]"
          />
          <span className="text-[16px] font-light text-[#2D3748] opacity-[50%]">
            Search residents
          </span>
        </div>
      </div>
    </>
  );
}

export default OfficerAppointmentsLayoutPage;
