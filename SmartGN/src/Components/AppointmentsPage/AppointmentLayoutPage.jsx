// src/components/AppointmentsPage/AppointmentLayoutPage.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate";
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";
import AppointmentSummary from "./AppointmentSummary";
import viewIcon from "../../assets/arrow_outward_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/api";

function AppointmentLayoutPage({
  appointments = [],
  pendingCount = 0,
  approvedCount = 0,
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [showAlert, setShowAlert] = useState(true);

  const [profile, setProfile] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    fullName: "Dissanayake Mudiyanselage Nimal Perera",
    nic: "",
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

  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/residents/profile", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({
            ...prev,
            nic: data.r_nic || "",
            nicFront: data.nic_front_path || null,
            nicBack: data.nic_back_path || null,
          }));

          if (data.nic_front_path && data.nic_back_path) {
            setShowAlert(false);
          } else {
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile for NIC images:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const fetchUpdatedProfile = async () => {
        try {
          const res = await fetch("/api/residents/profile", {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const data = await res.json();
            setProfile((prev) => ({
              ...prev,
              nic: data.r_nic || "",
              nicFront: data.nic_front_path || null,
              nicBack: data.nic_back_path || null,
            }));

            if (data.nic_front_path && data.nic_back_path) {
              setShowAlert(false);
            }
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
        }
      };

      fetchUpdatedProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleDateSelect = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  const getBookingsForCalendar = () => {
    if (!appointments || appointments.length === 0) return [];

    return appointments
      .map((appointment) => {
        let appDate;
        if (typeof appointment.date === "string") {
          const datePart = appointment.date.split(" ")[0];
          appDate = new Date(datePart);
        } else if (appointment.date instanceof Date) {
          appDate = appointment.date;
        } else {
          return null;
        }

        if (isNaN(appDate.getTime())) {
          return null;
        }

        return {
          day: appDate.getDate(),
          month: appDate.getMonth(),
          year: appDate.getFullYear(),
        };
      })
      .filter((booking) => booking !== null);
  };

  const getAppointmentForSelectedDate = () => {
    return appointments.find((appointment) => {
      let appDate;
      if (typeof appointment.date === "string") {
        const datePart = appointment.date.split(" ")[0];
        appDate = new Date(datePart);
      } else if (appointment.date instanceof Date) {
        appDate = appointment.date;
      } else {
        return false;
      }

      if (isNaN(appDate.getTime())) {
        return false;
      }

      return (
        appDate.getDate() === selectedDate.day &&
        appDate.getMonth() === selectedDate.month &&
        appDate.getFullYear() === selectedDate.year
      );
    });
  };

  const activeAppointment = getAppointmentForSelectedDate();
  const calendarBookings = getBookingsForCalendar();

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }
      const [hours, minutes] = timeString.split(":");
      const h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const datePart = dateString.split(" ")[0];
      const date = new Date(datePart);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* Alert Banner - Above Header */}
      {showAlert && areNicImagesMissing() && (
        <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
          <div className="flex flex-wrap items-center justify-between p-2 sm:p-2.5 md:p-[10px] bg-[#fef3c7] border border-[#fde68a] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-lg sm:rounded-xl text-[#d97706] font-medium text-[11px] sm:text-xs md:text-sm lg:text-[14px] text-left w-full transition-shadow duration-300">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <span
                className="hover:underline hover:cursor-pointer truncate"
                onClick={() => {
                  navigate("/ResidentDashboard/profile");
                }}
              >
                {t.alert}
              </span>
            </div>
            <button
              className="bg-transparent border-0 text-[#d97706] cursor-pointer p-0.5 sm:p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] flex-shrink-0 ml-1 sm:ml-2"
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
                className="sm:w-[16px] sm:h-[16px]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
          {t.Title}
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px] justify-center">
        <CardLayout pendingCount={pendingCount} approvedCount={approvedCount} />
      </div>

      {/* Calendar and Appointment Summary */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <div className="w-full lg:w-[45%] xl:w-[40%]">
          <CalenderLayout
            onDateSelect={handleDateSelect}
            bookings={calendarBookings}
          />
        </div>

        <div className="flex justify-center w-full lg:w-[55%] xl:w-[60%]">
          {activeAppointment ? (
            <div className="flex w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D]">
                Appointment Summary
              </p>

              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-[5px] mt-3 sm:mt-4 md:mt-5 lg:mt-[20px]">
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748] break-words">
                  <span className="font-medium">Purpose:</span>{" "}
                  {activeAppointment.purpose || "N/A"}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748] break-words">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(activeAppointment.date)}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Time:</span>{" "}
                  {formatTime(activeAppointment.time)}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      activeAppointment.status === "Pending"
                        ? "text-yellow-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {activeAppointment.status || "N/A"}
                  </span>
                </p>
                {activeAppointment.contact_number && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748] break-words">
                    <span className="font-medium">Contact:</span>{" "}
                    {activeAppointment.contact_number}
                  </p>
                )}
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
