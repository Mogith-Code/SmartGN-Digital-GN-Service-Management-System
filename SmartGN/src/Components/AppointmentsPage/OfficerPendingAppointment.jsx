import React, { useState } from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import Footer from "../Common/Footer";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import confirmIcon from "../../assets/check_circle_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function OfficerPendingAppointment({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const OfficerPendingTranslations = {
    EN: {
      back: "Back",
      Title: "Pending Appointment Requests",
      reject: "Reject Request",
      approve: "Approve Request",
      viewProfile: "View Profile",
      purpose: "Purpose :",
      appointmentDate: "Appointment Date :",
      time: "Time : ",
      contact: "Contact Number :",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      reject: "අවලංගු කරන්න",
      approve: "අනුමත කරන්න",
      viewProfile: "පැතිකඩ බලන්න",
      purpose: "අරමුණ :",
      appointmentDate: "හමුවීම් දිනය :",
      time: "වේලාව : ",
      contact: "දුරකථන අංකය :",
    },
    TA: {
      back: "பின்னால்",
      Title: "நிலுவையிலான முக்கிய சந்திப்புகள்",
      reject: "ரத்து செய்",
      approve: "அனுமதி செய்",
      viewProfile: "சுயவிவரத்தைப் பார்க்கவும்",
      purpose: "நோக்கம் :",
      appointmentDate: "ஹமுவிம் தேதி :",
      time: "நேரம் : ",
      contact: "தொடர்பு எண் :",
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
      date: new Date(2026, 6, 5),
      time: "10:00 AM",
      contact: "0703891153",
      status: "Approved",
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
      status: "Approved",
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
            onClick={() => navigate("/OfficerDashboard/OfficerAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>
          {pendingAppointments.length > 0 ? (
            <>
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="mx-[50px] my-[30px] flex flex-col border border-[#2D37484D] rounded-[15px] p-[20px] hover:bg-[#FDF5E6]"
                >
                  <div className="flex justify-between mb-[10px]">
                    <div className="flex w-[30%] items-center">
                      <img
                        src={profileIcon}
                        alt="Resident Photo"
                        className="w-[100px] h-[100px] rounded-full"
                      />

                      <div className="flex flex-col ml-[10px]">
                        <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] font-medium">
                          {appointment.firstName} {appointment.lastName}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#2D3748] font-light">
                          {appointment.nic}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#D69E2E] font-medium mt-[10px] hover:cursor-pointer hover:underline">
                          {t.viewProfile}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span key={appointment.id} className="font-light">
                        {appointment.createdAt.getDate()}/
                        {appointment.createdAt.getMonth() + 1}/
                        {appointment.createdAt.getFullYear()}
                      </span>
                      <span className="font-light">
                        {getFormattedTime(appointment.createdAt)}
                      </span>
                    </div>
                  </div>

                  <hr className="border border-[#2D37482D]" />

                  <div className="flex flex-col text-[16px] text-[#2D3748] my-[10px]">
                    <div className="flex gap-[5px]">
                      <span className="font-medium">{t.purpose} </span>
                      <span> {appointment.purpose}</span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">
                        <span>{t.appointmentDate}</span>
                      </span>
                      <span>
                        {appointment.date.getDate()}/
                        {appointment.date.getMonth() + 1}/
                        {appointment.date.getFullYear()}
                      </span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">{t.time}</span>
                      <span>{appointment.time}</span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">{t.contact}</span>
                      <span>{appointment.contact}</span>
                    </div>
                  </div>

                  <hr className="border border-[#2D37482D]" />
                  <div className="flex justify-end gap-[10px] mt-[10px]">
                    <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] hover:bg-[#005BBD] transition-colors text-[14px] font-regular cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group">
                      <img
                        src={confirmIcon}
                        alt="confirmIcon"
                        className="h-[15px]"
                      />
                      <span>{t.approve}</span>
                    </button>

                    <button className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#E7000B] text-[#F7FAFC] rounded-[15px] hover:bg-[#FF000C] hadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] text-[14px] font-regular cursor-pointer hover:scale-101 group">
                      <img
                        src={cancelIcon}
                        alt="cancelIcon"
                        className="h-[16px]"
                      />
                      <span>{t.reject}</span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
                No pending appointments available.
              </p>
            </div>
          )}
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
