import React, { useState } from "react";
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
      Title: "Approved Appointment Requests",
    },

    SI: { back: "ආපසු", Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්" },

    TA: { back: "பின்னால்", Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்" },
  };

  const t =
    ApprovedAppointmentTranslations[lang] || ApprovedAppointmentTranslations.EN;

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
  const approvedAppointments = appointments.filter(
    (item) => item.status === "Approved",
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

          {approvedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="mx-[50px] my-[30px] flex flex-col gap-[5px] border border-[#2D37484D] rounded-[15px] p-[20px]"
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
                  Requested Date: {appointment.requestedDate.getDate()}/
                  {appointment.requestedDate.getMonth() + 1}/
                  {appointment.requestedDate.getFullYear()}
                </span>
                <span className="font-light">
                  {getFormattedTime(appointment.createdAt)}
                </span>
              </div>

              <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
                <span className="font-regular">
                  Appointment Date: {appointment.date.getDate()}/
                  {appointment.date.getMonth() + 1}/
                  {appointment.date.getFullYear()}
                </span>
              </div>

              <div className="ml-[20px] flex justify-between text-[16px] text-[#2D3748]">
                <span className="font-regular">Time: {appointment.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ApprovedAppointmentsRequests;
