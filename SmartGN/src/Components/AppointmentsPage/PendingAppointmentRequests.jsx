import React, { useState } from "react";
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
      appointmentDate: "Appointment Date : ",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      cancel: "අවලංගු කරන්න",
      edit: "සංස්කරණය කරන්න",
      appointmentDate: "හමුවීම් දිනය : ",
    },
    TA: {
      back: "பின்னால்",
      Title: "நிலுவையிலான முக்கிய சந்திப்புகள்",
      cancel: "ரத்து செய்",
      edit: "திருத்து",
      appointmentDate: "முகாமை தேதி : ",
    },
  };

  const t =
    PendingAppointmentTranslations[lang] || PendingAppointmentTranslations.EN;

  // BOOKING STATES - CORRECTLY CREATING DATES
  // ============================================================================
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Approved",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      purpose: "Document Submission",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },
    {
      id: 4,
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

          {pendingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="mx-[50px] my-[30px] flex flex-col gap-[5px] border border-[#2D37484D] rounded-[15px] p-[20px] hover:bg-[#FDF5E6]"
            >
              <div className="flex justify-between text-[16px] text-[#2D3748]">
                <span className="font-medium">{appointment.purpose}</span>
                <span key={appointment.id} className="font-light">
                  {appointment.createdAt.getDate()}/
                  {appointment.createdAt.getMonth() + 1}/
                  {appointment.createdAt.getFullYear()}
                </span>
              </div>

              <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
                <span className="font-regular">
                  {t.appointmentDate} {appointment.date.getDate()}/
                  {appointment.date.getMonth() + 1}/
                  {appointment.date.getFullYear()}
                </span>
                <span className="font-light">
                  {getFormattedTime(appointment.createdAt)}
                </span>
              </div>

              <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
                <span className="font-regular">Time: {appointment.time}</span>
              </div>

              <div className="flex justify-end gap-[10px] mt-[10px]">
                <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] hover:bg-[#005BBD] transition-colors text-[14px] font-regular cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group">
                  <img src={editIcon} alt="editIcon" className="h-[15px]" />
                  <span>{t.edit}</span>
                </button>

                <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#E7000B] text-[#F7FAFC] rounded-[15px] hover:bg-[#FF000C] hadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] text-[14px] font-regular cursor-pointer hover:scale-101 group">
                  <img src={cancelIcon} alt="cancelIcon" className="h-[16px]" />
                  <span>{t.cancel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PendingAppointmentRequests;
