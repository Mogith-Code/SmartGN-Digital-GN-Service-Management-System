// src/pages/AppointmentLayoutPage.jsx
import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";
import BookingForm from "./BookingForm";
import AppointmentSummary from "./AppointmentSummary";

function AppointmentLayoutPage() {
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

  // ============================================================================
  // BOOKING STATES - CORRECTLY CREATING DATES
  // ============================================================================
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
    },
  ]);

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

  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[60px] mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px]">
        <CardLayout />
      </div>

      <div className="flex mt-[30px] mx-[100px]">
        <CalenderLayout onDateSelect={handleDateSelect} />
      </div>

      <div className="flex justify-center mx-[75px] my-[30px]">
        {activeAppointment ? (
          // ================================================================
          // ACTIVE APPOINTMENT DISPLAY
          // ================================================================
          <div className="flex w-full flex-col items-center justify-center text-center text-[#2D3748] border-[1.5px] border-[#2D37488D] rounded-xl bg-[#E2E8F0]">
            <p className="font-medium text-[16px]">Appointment Summary</p>

            <div className="space-y-2">
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Purpose:</span>{" "}
                {activeAppointment.purpose}
              </p>
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Time:</span>{" "}
                {activeAppointment.time}
              </p>
              <p className="text-[16px] text-[#2D3748]">
                <span className="font-medium">Contact:</span>{" "}
                {activeAppointment.contact}
              </p>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button className="px-4 py-2 bg-[#1B365D] text-white rounded-lg hover:bg-[#2c5f8a] transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Cancel Appointment
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
