import React from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import editIcon from "../../assets/edit_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Common/Footer";

function PendingAppointmentRequests() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const PendingAppointmentTranslations = {
    EN: {
      back: "Back",
      Title: "Pending Appointment Requests",
      cancel: "Cancel Request",
      edit: "Edit Request",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
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

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>

          <div className="mx-[50px] mt-[30px] flex flex-col gap-[5px] border border-[#2D37488D] rounded-[15px] p-[20px]">
            <div className="flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-medium">Meeting with Officer A</span>
              <span className="font-light">20/06/2026</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Appointment Date: 30/06/2026</span>
              <span className="font-light">11:30 AM</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Time: 10:00 AM</span>
            </div>

            <div className="flex justify-end gap-[10px] mt-[10px]">
              <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] hover:bg-[#005BBD] transition-colors text-[14px] font-medium cursor-pointer">
                <img src={editIcon} alt="editIcon" className="h-[16px]" />
                <span>{t.edit}</span>
              </button>

              <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#E7000B] text-[#F7FAFC] rounded-[15px] hover:bg-[#FF000C] transition-colors text-[14px] font-medium cursor-pointer">
                <img src={cancelIcon} alt="cancelIcon" className="h-[16px]" />
                <span>{t.cancel}</span>
              </button>
            </div>
          </div>

          <div className="mx-[50px] mt-[30px] flex flex-col gap-[5px] border border-[#2D37488D] rounded-[15px] p-[20px]">
            <div className="flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-medium">Document Submission</span>
              <span className="font-light">26/06/2026</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Appointment Date: 30/06/2026</span>
              <span className="font-light">11:30 AM</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Time: 10:00 AM</span>
            </div>

            <div className="flex justify-end gap-[10px] mt-[10px]">
              <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] hover:bg-[#005BBD] transition-colors text-[14px] font-medium cursor-pointer">
                <img src={editIcon} alt="editIcon" className="h-[16px]" />
                <span>{t.edit}</span>
              </button>

              <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#E7000B] text-[#F7FAFC] rounded-[15px] hover:bg-[#FF000C] transition-colors text-[14px] font-medium cursor-pointer">
                <img src={cancelIcon} alt="cancelIcon" className="h-[16px]" />
                <span>{t.cancel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PendingAppointmentRequests;
