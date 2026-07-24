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

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    fullName: "Dissanayake Mudiyanselage Nimal Perera",
    nic: "200324511540",
    occupation: "Farmer",
    email: "Nimal.Perera@example.com",
    mobile: "0703564478",
    address: "123 Main Street, Colombo",
    division: "Colombo, Borella",
    dob: "28/05/2000",
    gender: "Male",
    householdNumber: "123456",
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
  });

  // TRANSLATION OBJECTS
  const AppointmentLayoutTranslations = {
    EN: {
      Title: "Appointments",
      alert:
        "Please upload a high-quality image of your National Identity Card",
    },
    SI: {
      Title: "හමුවවීම්",
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
    },
    TA: {
      Title: "சந்திப்புகள்",
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
    },
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
      <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
        <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]  ">
          {t.Title}
        </h2>

        {/* NIC upload alert */}
        <div className="flex justify-end -mt-[70px]">
          {showAlert && profile.nic && (
            <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1">
              <div className="flex items-center gap-2">
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => {
                    navigate("/ResidentDashboard/profile");
                  }}
                >
                  {t.alert}
                </span>
              </div>
              <button
                className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1 ml-3"
                onClick={() => setShowAlert(false)}
                aria-label="Close Warning"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <CardLayout pendingCount={pendingCount} approvedCount={approvedCount} />
      </div>

      <div className="flex mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-4 sm:mx-6 md:mx-8 lg:m-[30px] items-start justify-between gap-[30px]">
        <CalenderLayout
          onDateSelect={handleDateSelect}
          bookings={getBookingsForCalendar()}
        />

        <div className="flex justify-center w-full">
          {activeAppointment ? (
            // ================================================================
            // ACTIVE APPOINTMENT DISPLAY
            // ================================================================
            <div className="flex w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D]">
                Appointment Summary
              </p>

              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-[5px] mt-3 sm:mt-4 md:mt-5 lg:mt-[20px]">
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Purpose:</span>{" "}
                  {activeAppointment.purpose}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Time:</span>{" "}
                  {activeAppointment.time}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Status:</span>{" "}
                  {activeAppointment.status}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-[20px] flex justify-center">
                <button
                  className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px] items-center px-3 sm:px-4 md:px-5 lg:px-[20px] py-1.5 sm:py-2 md:py-2.5 lg:py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:bg-[#005BBD] hover:scale-[1.02] text-[11px] sm:text-xs md:text-sm lg:text-[12px] font-regular cursor-pointer transition-all duration-200"
                  onClick={() => {
                    if (activeAppointment.status === "Pending") {
                      navigate(
                        "/ResidentDashboard/RAppointment/PendingAppointmentRequests",
                      );
                    } else if (activeAppointment.status === "Approved") {
                      navigate(
                        "/ResidentDashboard/RAppointment/ApprovedAppointmentRequests",
                      );
                    }
                  }}
                >
                  <span>More {activeAppointment.status} Appointments</span>
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
      </div>
    </>
  );
}

export default AppointmentLayoutPage;
