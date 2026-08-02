// src/pages/AppointmentLayoutPage.jsx
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

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Profile data state
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

  // ✅ Check if NIC images are missing - used for alert
  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  // ✅ Fetch profile to get NIC images
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

          // ✅ Auto-hide alert if both NIC images exist
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

  // ✅ Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Re-fetch profile when updated
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

  // Handler for date selection from calendar
  const handleDateSelect = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  // ✅ FIXED: Format bookings for calendar - handles date with time
  const getBookingsForCalendar = () => {
    if (!appointments || appointments.length === 0) return [];

    return appointments
      .map((appointment) => {
        let appDate;
        if (typeof appointment.date === "string") {
          // If date includes time (e.g., "2026-07-31 10:00:00"), take only the date part
          const datePart = appointment.date.split(" ")[0];
          appDate = new Date(datePart);
        } else if (appointment.date instanceof Date) {
          appDate = appointment.date;
        } else {
          return null;
        }

        // Check if the date is valid
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

  // ✅ FIXED: Get appointment for selected date
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

  // Helper function to format time
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

  // Helper function to format date
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
      <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
        <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
          {t.Title}
        </h2>

        {/* ✅ NIC upload alert - Check if NIC images are missing */}
        <div className="flex justify-end -mt-[70px]">
          {showAlert && areNicImagesMissing() && (
            <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
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
          bookings={calendarBookings}
        />

        <div className="flex justify-center w-full">
          {activeAppointment ? (
            <div className="flex w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[30px] border-[1.5px] border-[#2D37484D] rounded-xl shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] ">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] pb-[1px] text-center border-b-[1.5px] border-[#2D37484D]">
                Appointment Summary
              </p>

              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-[5px] mt-3 sm:mt-4 md:mt-5 lg:mt-[20px]">
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  <span className="font-medium">Purpose:</span>{" "}
                  {activeAppointment.purpose || "N/A"}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
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
                        ? "text-yellow-600"
                        : "text-green-600"
                    }
                  >
                    {activeAppointment.status || "N/A"}
                  </span>
                </p>
                {activeAppointment.contact_number && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
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
