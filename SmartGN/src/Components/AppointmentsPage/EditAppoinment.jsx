// src/pages/EditAppointment.jsx
import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import ChatbotButton from "../Common/ChatbotButton";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate";
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import updateIcon from "../../assets/update_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

function EditAppoinment({ onOpenHelp }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams(); // Get appointment ID from URL

  const BookingFormTranslations = {
    EN: {
      Title: "Edit Appointment",
      back: "Back",
      Purpose: "Appointment Purpose: ",
      eg: "e.g. ",
      date: "Date: ",
      time: "Time: ",
      contact: "Contact Number: ",
      contactPlaceholder: "Enter your contact number",
      January: "January",
      February: "February",
      March: "March",
      April: "April",
      May: "May",
      June: "June",
      July: "July",
      August: "August",
      September: "September",
      October: "October",
      November: "November",
      December: "December",
      Today: "Today",
      Sun: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",
      Selected: "Selected: ",
      reset: "Reset",
      updateAppointment: "Update Appointment",
      updateSuccess: "Appointment updated successfully!",
      updateError: "Failed to update appointment. Please try again.",
      contactRequired: "Please enter your contact number.",
      purposeRequired: "Please enter an appointment purpose.",
      dateRequired: "Please select a date.",
      submitting: "Updating...",
      success: "Success!",
      goBack: "Go Back",
      loading: "Loading appointment details...",
      error: "Error loading appointment details",
      retry: "Retry",
    },
    SI: {
      Title: "හමුව සංස්කරණය කරන්න",
      back: "ආපසු",
      Purpose: "හමුවේ අරමුණ: ",
      eg: "උදා. ",
      date: "දිනය: ",
      time: "වේලාව: ",
      contact: "සම්බන්ධ කරගත හැකි අංකය: ",
      contactPlaceholder: "ඔබේ සම්බන්ධ කරගත හැකි අංකය ඇතුළත් කරන්න",
      January: "ජනවාරි",
      February: "පෙබරවාරි",
      March: "මාර්තු",
      April: "අප්‍රේල්",
      May: "මැයි",
      June: "ජූනි",
      July: "ජූලි",
      August: "අගෝස්තු",
      September: "සැප්තැම්බර්",
      October: "ඔක්තෝබර්",
      November: "නවම්බර්",
      December: "දෙසැම්බර්",
      Today: "අද",
      Sun: "ඉරිදා",
      Mon: "සඳුදා",
      Tue: "අඟහරු.",
      Wed: "බදාදා",
      Thu: "බ්‍රහස්.",
      Fri: "සිකු.",
      Sat: "සෙන.",
      Selected: "තෝරාගත්: ",
      reset: "නැවත සකසන්න",
      updateAppointment: "හමුව යාවත්කාලීන කරන්න",
      updateSuccess: "හමුව සාර්ථකව යාවත්කාලීන කරන ලදී!",
      updateError:
        "හමුව යාවත්කාලීන කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      contactRequired: "කරුණාකර ඔබේ සම්බන්ධ කරගත හැකි අංකය ඇතුළත් කරන්න.",
      purposeRequired: "කරුණාකර හමුවේ අරමුණ ඇතුළත් කරන්න.",
      dateRequired: "කරුණාකර දිනයක් තෝරන්න.",
      submitting: "යාවත්කාලීන කරමින්...",
      success: "සාර්ථකයි!",
      goBack: "ආපසු යන්න",
      loading: "හමුවේ විස්තර පූරණය වෙමින්...",
      error: "හමුවේ විස්තර පූරණය කිරීමේ දෝෂයකි",
      retry: "නැවත උත්සාහ කරන්න",
    },
    TA: {
      Title: "சந்திப்பை திருத்து",
      back: "பின்னால்",
      Purpose: "சந்திப்பின் நோக்கம்: ",
      eg: "எ.கா. ",
      date: "தேதி: ",
      time: "நேரம்: ",
      contact: "தொடர்பு எண்: ",
      contactPlaceholder: "உங்கள் தொடர்பு எண்ணை உள்ளிடவும்",
      January: "ஜனவரி",
      February: "பிப்ரவரி",
      March: "மார்ச்",
      April: "ஏப்ரல்",
      May: "மே",
      June: "ஜூன்",
      July: "ஜூலை",
      August: "ஆகஸ்ட்",
      September: "செப்டம்பர்",
      October: "அக்டோபர்",
      November: "நவம்பர்",
      December: "டிசம்பர்",
      Today: "இன்று",
      Sun: "ஞாயிறு",
      Mon: "திங்கள்",
      Tue: "செவ்வாய்",
      Wed: "புதன்",
      Thu: "வியாழன்",
      Fri: "வெள்ளி",
      Sat: "சனி",
      Selected: "தேர்ந்தெடுக்கப்பட்டது: ",
      reset: "மீட்டமைக்கவும்",
      updateAppointment: "சந்திப்பை புதுப்பிக்கவும்",
      updateSuccess: "சந்திப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      updateError:
        "சந்திப்பை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      contactRequired: "தயவுசெய்து உங்கள் தொடர்பு எண்ணை உள்ளிடவும்.",
      purposeRequired: "தயவுசெய்து சந்திப்பின் நோக்கத்தை உள்ளிடவும்.",
      dateRequired: "தயவுசெய்து ஒரு தேதியை தேர்ந்தெடுக்கவும்.",
      submitting: "புதுப்பிக்கிறது...",
      success: "வெற்றி!",
      goBack: "திரும்பிச் செல்",
      loading: "சந்திப்பு விவரங்கள் ஏற்றப்படுகின்றன...",
      error: "சந்திப்பு விவரங்களை ஏற்றுவதில் பிழை",
      retry: "மீண்டும் முயற்சிக்கவும்",
    },
  };

  const t = BookingFormTranslations[lang] || BookingFormTranslations.EN;

  // Booking Form States
  const [purpose, setPurpose] = useState("");
  const [bookDay, setBookDay] = useState(null);
  const [bookTime, setBookTime] = useState("9:00 AM");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");

  // ============================================================================
  // GENERATE AVAILABLE DATES (Today to End of Current Month)
  // ============================================================================
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dates = [];
    for (let day = currentDay; day <= lastDayOfMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      dates.push({
        day: day,
        month: currentMonth,
        year: currentYear,
        monthName: dateObj.toLocaleString("default", { month: "long" }),
        dayName: dateObj.toLocaleString("default", { weekday: "long" }),
        isToday: day === currentDay,
        isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6,
        formatted: dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
    setAvailableDates(dates);
  }, []);

  // ============================================================================
  // FETCH APPOINTMENT DETAILS
  // ============================================================================
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!token || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError(null);

        // Fetch all appointments and find the specific one
        const response = await fetch("/api/appointments/rappointments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();

        if (data.success) {
          // Find the appointment by ID
          const appointment = data.appointments.find(
            (app) => app.appointment_id === id,
          );

          if (appointment) {
            setAppointmentData(appointment);

            // Populate form fields
            setPurpose(appointment.purpose || "");
            setContactNumber(appointment.contact_number || "");

            // Set date
            if (appointment.date) {
              const dateObj = new Date(appointment.date);
              const day = dateObj.getDate();
              // Check if this day is in available dates
              const dateExists = availableDates.some((d) => d.day === day);
              if (dateExists) {
                setBookDay(day);
              } else {
                // If not in available dates, add it
                const month = dateObj.getMonth();
                const year = dateObj.getFullYear();
                // Add the date to available dates
                setAvailableDates((prev) => {
                  const exists = prev.some(
                    (d) =>
                      d.day === day && d.month === month && d.year === year,
                  );
                  if (!exists) {
                    return [
                      ...prev,
                      {
                        day: day,
                        month: month,
                        year: year,
                        monthName: dateObj.toLocaleString("default", {
                          month: "long",
                        }),
                        dayName: dateObj.toLocaleString("default", {
                          weekday: "long",
                        }),
                        isToday: false,
                        isWeekend:
                          dateObj.getDay() === 0 || dateObj.getDay() === 6,
                        formatted: dateObj.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }),
                      },
                    ].sort((a, b) => a.day - b.day);
                  }
                  return prev;
                });
                setBookDay(day);
              }
            }

            // Set time
            if (appointment.time) {
              // Convert from 24-hour to 12-hour format
              const timeStr = appointment.time;
              if (timeStr.includes("AM") || timeStr.includes("PM")) {
                setBookTime(timeStr);
              } else {
                const [hours, minutes] = timeStr.split(":");
                const h = parseInt(hours);
                const ampm = h >= 12 ? "PM" : "AM";
                const h12 = h % 12 || 12;
                setBookTime(`${h12}:${minutes} ${ampm}`);
              }
            }
          } else {
            setFetchError("Appointment not found");
          }
        } else {
          throw new Error(data.error || "Failed to fetch appointment details");
        }
      } catch (err) {
        setFetchError(err.message);
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (availableDates.length > 0) {
      fetchAppointmentDetails();
    }
  }, [token, id, availableDates]);

  // ============================================================================
  // GET MONTH NAME
  // ============================================================================
  const getMonthName = (monthIndex) => {
    const months = [
      t.January,
      t.February,
      t.March,
      t.April,
      t.May,
      t.June,
      t.July,
      t.August,
      t.September,
      t.October,
      t.November,
      t.December,
    ];
    return months[monthIndex];
  };

  // ============================================================================
  // GET DAY NAME
  // ============================================================================
  const getDayName = (dayIndex) => {
    const days = [t.Sun, t.Mon, t.Tue, t.Wed, t.Thu, t.Fri, t.Sat];
    return days[dayIndex];
  };

  // ============================================================================
  // HANDLE RESET FORM
  // ============================================================================
  const handleReset = () => {
    if (appointmentData) {
      // Reset to original values
      setPurpose(appointmentData.purpose || "");
      setContactNumber(appointmentData.contact_number || "");
      if (appointmentData.date) {
        const dateObj = new Date(appointmentData.date);
        setBookDay(dateObj.getDate());
      }
      if (appointmentData.time) {
        const timeStr = appointmentData.time;
        if (timeStr.includes("AM") || timeStr.includes("PM")) {
          setBookTime(timeStr);
        } else {
          const [hours, minutes] = timeStr.split(":");
          const h = parseInt(hours);
          const ampm = h >= 12 ? "PM" : "AM";
          const h12 = h % 12 || 12;
          setBookTime(`${h12}:${minutes} ${ampm}`);
        }
      }
    } else {
      setBookDay(availableDates.length > 0 ? availableDates[0].day : null);
      setBookTime("9:00 AM");
      setContactNumber("");
      setPurpose("");
    }
    setErrorMessage("");
    setSuccessMessage("");
    setBookingComplete(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================================
  // HANDLE FORM SUBMISSION - UPDATE APPOINTMENT
  // ============================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!purpose.trim()) {
      setErrorMessage(t.purposeRequired);
      return;
    }
    if (!bookDay) {
      setErrorMessage(t.dateRequired);
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage(t.contactRequired);
      return;
    }

    if (!token) {
      setErrorMessage("Please login to update appointment.");
      return;
    }

    const selectedDateObj = availableDates.find((d) => d.day === bookDay);
    if (!selectedDateObj) {
      setErrorMessage("Invalid date selected.");
      return;
    }

    const formattedDate = `${selectedDateObj.year}-${String(selectedDateObj.month + 1).padStart(2, "0")}-${String(selectedDateObj.day).padStart(2, "0")}`;

    const formData = {
      purpose: purpose.trim(),
      date: formattedDate,
      time: bookTime,
      contactNumber: contactNumber.trim(),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/appointments/${id}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update appointment");
      }

      setSuccessMessage(data.message || t.updateSuccess);
      setErrorMessage("");
      setBookingComplete(true);

      setTimeout(() => {
        handleReset();
        navigate("/ResidentDashboard/RAppointment/PendingAppointmentRequests");
      }, 2500);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message || t.updateError);
      setSuccessMessage("");
      setBookingComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex flex-col md:flex-row gap-0 md:gap-[20px] flex-1">
          <div className="hidden md:block bg-[#FFFFFF]">
            <RSidebar />
          </div>
          <div className="w-full bg-[#FFFFFF] border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
              <p className="mt-4 text-[#1B365D]">{t.loading}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex flex-col md:flex-row gap-0 md:gap-[20px] flex-1">
          <div className="hidden md:block bg-[#FFFFFF]">
            <RSidebar />
          </div>
          <div className="w-full bg-[#FFFFFF] border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="text-red-600 font-semibold mb-2">{t.error}</p>
                <p className="text-red-500 text-sm">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
                >
                  {t.retry}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex flex-col md:flex-row gap-0 md:gap-[20px] flex-1">
        <div className="hidden md:block bg-[#FFFFFF]">
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l-0 md:border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-auto p-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
            onClick={() =>
              navigate(
                "/ResidentDashboard/RAppointment/PendingAppointmentRequests",
              )
            }
          >
            <img
              src={backIcon}
              alt="backIcon"
              className="w-[14px] sm:w-[16px]"
            />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            {t.Title}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-4 sm:mx-5 md:mx-6 lg:mx-[50px] mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
              <p className="text-sm mt-1">
                Redirecting to pending appointments...
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && !successMessage && (
            <div className="mx-4 sm:mx-5 md:mx-6 lg:mx-[50px] mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            <div className="mx-4 sm:mx-5 md:mx-6 lg:mx-[50px] my-4 sm:my-5 md:my-6 lg:my-[30px] flex flex-col gap-4 sm:gap-5 border border-[#2D37482D] rounded-xl sm:rounded-2xl lg:rounded-[15px] p-4 sm:p-5 md:p-6 lg:p-[20px]">
              {/* Appointment Number Display */}
              {appointmentData && (
                <div className="flex gap-[10px] items-center bg-[#E2E8F0] p-2 px-4 rounded-lg">
                  <span className="text-sm font-medium text-[#1B365D]">
                    Appointment Number:
                  </span>
                  <span className="text-sm font-bold text-[#1B365D]">
                    {appointmentData.appointment_number || "N/A"}
                  </span>
                </div>
              )}

              {/* ============================================================ */}
              {/* APPOINTMENT PURPOSE - TEXT INPUT */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  {t.Purpose}
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={
                    t.eg + " Certificate Collection, General Inquiry, etc."
                  }
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isSubmitting || bookingComplete}
                />
              </div>

              {/* ============================================================ */}
              {/* DATE SELECTION */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="daySelect" className="font-medium">
                  {t.date}
                </label>
                <select
                  id="daySelect"
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                  value={bookDay || ""}
                  onChange={(e) => setBookDay(parseInt(e.target.value))}
                  required
                  disabled={isSubmitting || bookingComplete}
                >
                  {availableDates.length === 0 ? (
                    <option value="">Loading dates...</option>
                  ) : (
                    availableDates.map((date) => {
                      const monthName = getMonthName(date.month);
                      const dayName = getDayName(
                        new Date(date.year, date.month, date.day).getDay(),
                      );

                      return (
                        <option key={date.day} value={date.day}>
                          {date.isToday ? t.Today : dayName}, {monthName}{" "}
                          {date.day < 10 ? `0${date.day}` : date.day},{" "}
                          {date.year}
                        </option>
                      );
                    })
                  )}
                </select>

                {bookDay && availableDates.length > 0 && (
                  <p className="text-xs sm:text-sm text-[#2D37488D] mt-1">
                    {t.Selected} {getMonthName(availableDates[0].month)}{" "}
                    {bookDay}, {availableDates[0].year}
                  </p>
                )}
              </div>

              {/* ============================================================ */}
              {/* TIME SELECTION */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="timeSelect" className="font-medium">
                  {t.time}
                </label>
                <select
                  id="timeSelect"
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isSubmitting || bookingComplete}
                >
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                </select>
              </div>

              {/* ============================================================ */}
              {/* CONTACT NUMBER */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="contactNumber" className="font-medium">
                  {t.contact}
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder={t.contactPlaceholder}
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isSubmitting || bookingComplete}
                />
              </div>

              {/* ============================================================ */}
              {/* ACTION BUTTONS */}
              {/* ============================================================ */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#E7000B] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group font-regular hover:bg-[#FF000C] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || bookingComplete}
                >
                  <span>{t.reset}</span>
                  <img
                    src={resetIcon}
                    alt="resetIcon"
                    className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                  />
                </button>

                <button
                  type="submit"
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer font-regular hover:bg-[#005BBD] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || bookingComplete}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.updateAppointment}</span>
                      <img
                        src={updateIcon}
                        alt="updateIcon"
                        className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                      />
                    </>
                  )}
                </button>
              </div>

              {bookingComplete && (
                <div className="flex justify-center mt-2">
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <svg
                      className="w-5 h-5 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t.success} Redirecting...
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />

      <Footer />
    </div>
  );
}

export default EditAppoinment;
