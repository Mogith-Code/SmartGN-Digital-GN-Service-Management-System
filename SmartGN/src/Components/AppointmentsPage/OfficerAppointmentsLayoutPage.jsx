import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import viewIcon from "../../assets/arrow_outward_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import OfficerCardLayout from "./OfficerCardLayout";
import CalendarLayout from "./CalenderLayout";
import AppointmentSummary from "./AppointmentSummary";

function OfficerAppointmentsLayoutPage() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const AppointmentLayoutTranslations = {
    EN: { Title: "Appointments" },
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

  // Get appointment for selected date if it exists
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
      <div className="flex justify-between text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        <span>{t.Title}</span>
        <div className="flex bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] items-center gap-[10px]">
          <img
            src={searchIcon}
            alt="Search Icon"
            className="w-[15px] h-[15px] opacity-[50%]"
          />
          <span className="text-[16px] font-light text-[#2D3748] opacity-[50%]">
            Search residents
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[75px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <OfficerCardLayout />
      </div>

      <div className="flex mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-4 sm:mx-6 md:mx-8 lg:mx-[100px]">
        <CalendarLayout
          onDateSelect={handleDateSelect}
          bookings={getBookingsForCalendar()}
        />
      </div>

      <div
        className="flex justify-center mx-4 sm:mx-6 md:mx-8 lg:mx-[75px] my-4 sm:my-5 md:my-6 lg:my-[30px]"
        id="summary"
      >
        {activeAppointment.length > 0 ? (
          // ================================================================
          // ACTIVE APPOINTMENT DISPLAY
          // ================================================================
          <div className="flex w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl">
            <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D]">
              Appointment Summary
            </p>
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 mx-4  mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] justify-between">
              {activeAppointment.map((appointment) => (
                <div className="gap-[15px] border border-[#2D37484D] rounded-[15px] p-[20px] flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
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

                    <div className="flex flex-col ml-[10px]">
                      <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                        <span className="font-medium">Purpose:</span>{" "}
                        {appointment.purpose}
                      </p>

                      <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                        <span className="font-medium">Time:</span>{" "}
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-[20px] flex justify-center">
              <button className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px] items-center px-3 sm:px-4 md:px-5 lg:px-[20px] py-1.5 sm:py-2 md:py-2.5 lg:py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:bg-[#005BBD] hover:scale-[1.02] text-[11px] sm:text-xs md:text-sm lg:text-[12px] font-regular cursor-pointer transition-all duration-200">
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

export default OfficerAppointmentsLayoutPage;
