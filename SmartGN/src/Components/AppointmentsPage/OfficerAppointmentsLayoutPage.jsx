// src/Components/AppointmentsPage/OfficerAppointmentsLayoutPage.jsx
import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import viewIcon from "../../assets/arrow_outward_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import OfficerCardLayout from "./OfficerCardLayout";
import CalendarLayout from "./CalenderLayout";
import AppointmentSummary from "./AppointmentSummary";
import { useNavigate } from "react-router-dom";

function OfficerAppointmentsLayoutPage({
  pendingCount = 0,
  approvedCount = 0,
  tomorrowCount = 0,
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const AppointmentLayoutTranslations = {
    EN: { Title: "Appointments" },
    SI: { Title: "හමුවවීම්" },
    TA: { Title: "சந்திப்புகள்" },
  };

  const t =
    AppointmentLayoutTranslations[lang] || AppointmentLayoutTranslations.EN;

  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleDateSelect = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  // Hardcoded appointments (will be replaced with API data later)
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
      requestedDate: new Date(2026, 5, 21, 13, 17),
      createdAt: new Date(2026, 5, 21, 13, 17),
    },
    // ... more appointments
  ]);

  const getAppointmentForSelectedDate = () => {
    return appointments.filter((appointment) => {
      const appDate = appointment.date;
      return (
        appDate.getDate() === selectedDate.day &&
        appDate.getMonth() === selectedDate.month &&
        appDate.getFullYear() === selectedDate.year
      );
    });
  };

  const activeAppointment = getAppointmentForSelectedDate();

  const getBookingsForCalendar = () => {
    return appointments.map((appointment) => ({
      day: appointment.date.getDate(),
      month: appointment.date.getMonth(),
      year: appointment.date.getFullYear(),
    }));
  };

  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        <span>{t.Title}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <OfficerCardLayout
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          tomorrowCount={tomorrowCount}
        />
      </div>

      <div className="flex mt-4 sm:mt-5 md:mt-6 lg:m-[30px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] items-start justify-between gap-[30px]">
        <CalendarLayout
          onDateSelect={handleDateSelect}
          bookings={getBookingsForCalendar()}
        />

        <div className="flex justify-center w-full">
          {activeAppointment.length > 0 ? (
            <div className="flex w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D]">
                Appointment Summary
              </p>
              <div className="flex flex-col gap-[15px] my-[20px]">
                {activeAppointment.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-[15px] border border-[#2D37484D] rounded-[15px] p-[20px]"
                  >
                    <div className="flex flex-col items-start justify-between">
                      <div className="flex w-full items-center justify-between border-b border-[#2D37484D] pb-[10px]">
                        <div className="flex w-[60%] items-center">
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
                          </div>
                        </div>
                        <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#D69E2E] font-medium hover:cursor-pointer hover:underline">
                          View Profile
                        </span>
                      </div>

                      <div className="flex flex-col w-full justify-between mt-[10px]">
                        <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                          <span className="font-medium">Purpose :</span>{" "}
                          {appointment.purpose}
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                          <span className="font-medium">Time :</span>{" "}
                          {appointment.time}
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                          <span className="font-medium">Contact :</span>{" "}
                          {appointment.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px] items-center px-3 sm:px-4 md:px-5 lg:px-[20px] py-1.5 sm:py-2 md:py-2.5 lg:py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:bg-[#005BBD] hover:scale-[1.02] text-[11px] sm:text-xs md:text-sm lg:text-[12px] font-regular cursor-pointer transition-all duration-200"
                  onClick={() =>
                    navigate("/OfficerAppointment/OfficerApprovedAppointment")
                  }
                >
                  <span>More Appointments</span>
                  <img
                    src={viewIcon}
                    alt="viewIcon"
                    className="h-3 sm:h-3.5 md:h-4 lg:h-[15px] w-auto"
                  />
                </button>
              </div>
            </div>
          ) : (
            <AppointmentSummary
              day={selectedDate.day}
              month={selectedDate.month}
              year={selectedDate.year}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OfficerAppointmentsLayoutPage;
