import React from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function PendingAppointmentRequests() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const PendingAppointmentTranslations = {
    EN: { back: "Back" },
    SI: { back: "ආපසු" },
    TA: { back: "பின்னால்" },
  };

  const t =
    PendingAppointmentTranslations[lang] || PendingAppointmentTranslations.EN;

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/RAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingAppointmentRequests;
