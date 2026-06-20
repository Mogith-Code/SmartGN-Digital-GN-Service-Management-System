import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import { useLanguage } from "../../utils/translate";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Common/Footer";

function ApprovedAppointmentsRequests() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const ApprovedAppointmentTranslations = {
    EN: {
      back: "Back",
      Title: "Pending Appointment Requests",
    },

    SI: { back: "ආපසු", Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්" },

    TA: { back: "பின்னால்", Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்" },
  };

  const t =
    ApprovedAppointmentTranslations[lang] || ApprovedAppointmentTranslations.EN;
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
              <span className="font-medium">Certificate Collection</span>
              <span className="font-light">25/06/2026</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Requested Date: 24/06/2026</span>
              <span className="font-light">11:30 AM</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Apointment Date: 30/06/2026</span>
            </div>

            <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
              <span className="font-regular">Time: 10:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ApprovedAppointmentsRequests;
