import React from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";

function RequestsForTommorow() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const RFTTranslations = {
    EN: {
      back: "Back",
      Title: "Tomorrow's Appointments",
      cancel: "Cancel Request",
      edit: "Edit Request",
    },
    SI: {
      back: "ආපසු",
      Title: "හෙට ඇති හමුවීම්",
      cancel: "අවලංගු කරන්න",
      edit: "සංස්කරණය කරන්න",
    },
    TA: {
      back: "பின்னால்",
      Title: "நிலுவையிலான முக்கிய சந்திப்புகள்",
      cancel: "ரத்து செய்",
      edit: "திருத்து",
    },
  };

  const t = RFTTranslations[lang] || RFTTranslations.EN;
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/OfficerAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestsForTommorow;
