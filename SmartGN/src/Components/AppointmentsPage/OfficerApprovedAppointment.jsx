import React, { useState } from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import OSidebar from "../Common/OSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import Footer from "../Common/Footer";

function OfficerApprovedAppointment() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const OfficerApprovedTranslations = {
    EN: {
      back: "Back",
      Title: "Approved Appointment Requests",
    },

    SI: { back: "ආපසු", Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්" },

    TA: { back: "பின்னால்", Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்" },
  };

  const t = OfficerApprovedTranslations[lang] || OfficerApprovedTranslations.EN;

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

  // filter approved appointments
  const approvedAppointments = appointments.filter(
    (item) => item.status === "Approved",
  );
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
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

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>
          {approvedAppointments.length > 0 ? (
            <>
              {approvedAppointments.map((appointment) => (
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
                          View Profile
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
                      <span className="font-medium">Purpose : </span>
                      <span> {appointment.purpose}</span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">
                        <span>Appointment Date :</span>
                      </span>
                      <span>
                        {appointment.date.getDate()}/
                        {appointment.date.getMonth() + 1}/
                        {appointment.date.getFullYear()}
                      </span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">Time :</span>
                      <span>{appointment.time}</span>
                    </div>

                    <div className="flex gap-[5px]">
                      <span className="font-medium">contact : </span>
                      <span>{appointment.contact}</span>
                    </div>
                  </div>

                  <hr className="border border-[#2D37482D]" />
                </div>
              ))}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
                No approved appointments available.
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-[14px] text-[#2D3748D] mt-1 sm:mt-2">
                Please check Pending requests to view and approve requests.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OfficerApprovedAppointment;
