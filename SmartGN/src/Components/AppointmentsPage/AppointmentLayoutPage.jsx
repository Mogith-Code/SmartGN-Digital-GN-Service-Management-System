// src/pages/AppointmentLayoutPage.jsx
import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";
import BookingForm from "./BookingForm";
import AppointmentSummary from "./AppointmentSummary";
import viewIcon from "../../assets/arrow_outward_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function AppointmentLayoutPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const AppointmentLayoutTranslations = {
    EN: { Title: "Meetings" },
    SI: { Title: "හමුවවීම්" },
    TA: { Title: "சந்திப்புகள்" },
  };

  const t =
    AppointmentLayoutTranslations[lang] || AppointmentLayoutTranslations.EN;

  // State to track the selected date from calendar
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  // Handler for date selection from calendar
  const handleDateSelect = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

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

  // Calculate dynamic stats
  const pendingCount = appointments.filter(
    (item) => item.status === "Pending",
  ).length;
  const approvedCount = appointments.filter(
    (item) => item.status === "Approved",
  ).length;

  // Get appointment for selected date if it exists
  const getAppointmentForSelectedDate = () => {
    return appointments.find((appointment) => {
      const appDate = appointment.date;
      return (
        appDate.getDate() === selectedDate.day &&
        appDate.getMonth() === selectedDate.month &&
        appDate.getFullYear() === selectedDate.year
      );
    });
  };

  const activeAppointment = getAppointmentForSelectedDate();

  // ============================================================================
  // FORMAT BOOKINGS FOR CALENDAR
  // ============================================================================
  const getBookingsForCalendar = () => {
    return appointments.map((appointment) => ({
      day: appointment.date.getDate(),
      month: appointment.date.getMonth(),
      year: appointment.date.getFullYear(),
    }));
  };

  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[60px] mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px]">
        <CardLayout pendingCount={pendingCount} approvedCount={approvedCount} />
      </div>

      <div className="flex mt-[30px] mx-[100px]">
        <CalenderLayout
          onDateSelect={handleDateSelect}
          bookings={getBookingsForCalendar()}
        />
      </div>

      <div className="flex justify-center mx-[75px] my-[30px]">
        {activeAppointment ? (
          // ================================================================
          // ACTIVE APPOINTMENT DISPLAY
          // ================================================================
          <div className="flex w-full flex-col p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl">
            <p className="font-medium text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D] ">
              Appointment Summary
            </p>

            <div className="flex flex-col gap-[5px] mt-[20px]">
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Purpose:</span>{" "}
                {activeAppointment.purpose}
              </p>
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Time:</span>{" "}
                {activeAppointment.time}
              </p>
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Status:</span>{" "}
                {activeAppointment.status}
              </p>
            </div>

            <div className="mt-[20px] flex justify-center">
              <button
                className="flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:bg-[#005BBD] hover:scale-101 text-[12px] font-regular cursor-pointer"
                onClick={() => {
                  if (activeAppointment.status === "Pending") {
                    navigate("/RAppointment/PendingAppointmentRequests");
                  } else if (activeAppointment.status === "Approved") {
                    navigate("/RAppointment/ApprovedAppointmentRequests");
                  }
                }}
              >
                <span>More {activeAppointment.status} Appointments</span>
                <img src={viewIcon} alt="viewIcon" className="h-[15px]" />
              </button>
            </div>
          </div>
        ) : (
          // ================================================================
          // NO APPOINTMENT - Show Appointment Summary
          // ================================================================
          <AppointmentSummary
            day={selectedDate.day}
            month={selectedDate.month}
            year={selectedDate.year}
          />
        )}
      </div>
    </>
  );
}

export default AppointmentLayoutPage;
