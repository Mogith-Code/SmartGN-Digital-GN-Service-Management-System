import React, { useState } from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import Footer from "../Common/Footer";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function OfficerPendingAppointment({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const OfficerPendingTranslations = {
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

  const t = OfficerPendingTranslations[lang] || OfficerPendingTranslations.EN;

  // BOOKING STATES - CORRECTLY CREATING DATES
  // ============================================================================
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      firstName: "Nirmal",
      lastName: "Perera",
      photo: "photo_here",
      nic: "200314911465",
      purpose: "Meeting with Officer A",
      date: new Date(2026, 6, 5), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      photo: "photo_here",
      nic: "200314911455",
      purpose: "Certificate Collection",
      date: new Date(2026, 6, 5), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      firstName: "John",
      lastName: "Doe",
      photo: "photo_here",
      nic: "200314911459",
      purpose: "Document Submission",
      date: new Date(2026, 6, 6), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },

    {
      id: 4,
      firstName: "Alice",
      lastName: "Johnson",
      photo: "photo_here",
      nic: "200314911460",
      purpose: "Meeting with Officer B",
      date: new Date(2026, 5, 23), // June 23, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
    },
  ]);

  // to get the formatted time in 12-hour format with AM/PM
  const getFormattedTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    // Pad minutes with leading zero
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  };

  // filter pending appointments
  const pendingAppointments = appointments.filter(
    (item) => item.status === "Pending",
  );

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/OfficerAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default OfficerPendingAppointment;
