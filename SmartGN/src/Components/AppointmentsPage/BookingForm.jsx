// src/pages/BookingForm.jsx
import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import ChatbotButton from "../Common/ChatbotButton";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate";
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import confirmIcon from "../../assets/check_circle_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

function BookingForm({ onOpenHelp }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const BookingFormTranslations = {
    EN: {
      Title: "Book New Appointment",
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
      Tomorrow: "Tomorrow",
      Sun: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",
      Selected: "Selected: ",
      reset: "Reset",
      bookAppointment: "Book Appointment",
      bookingSuccess: "Appointment booked successfully!",
      bookingError: "Failed to book appointment. Please try again.",
      contactRequired: "Please enter your contact number.",
      purposeRequired: "Please enter an appointment purpose.",
      dateRequired: "Please select a date.",
      submitting: "Booking...",
      success: "Success!",
      goBack: "Go Back",
      alreadyBooked:
        "You already have an appointment on {date}. Only one appointment per day is allowed.",
      alreadyBookedTitle: "Already Booked",
      fetchingAppointments: "Checking your existing appointments...",
      invalidDate: "Please select a valid date.",
      noAvailableDates: "No available dates in the next 14 days.",
    },
    SI: {
      Title: "නව හමුවක් වෙන්කරන්න",
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
      Tomorrow: "හෙට",
      Sun: "ඉරිදා",
      Mon: "සඳුදා",
      Tue: "අඟහරු.",
      Wed: "බදාදා",
      Thu: "බ්‍රහස්.",
      Fri: "සිකු.",
      Sat: "සෙන.",
      Selected: "තෝරාගත්: ",
      reset: "නැවත සකසන්න",
      bookAppointment: "හමුව වෙන්කරන්න",
      bookingSuccess: "හමුව සාර්ථකව වෙන්කරන ලදී!",
      bookingError: "හමුව වෙන්කර ගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      contactRequired: "කරුණාකර ඔබේ සම්බන්ධ කරගත හැකි අංකය ඇතුළත් කරන්න.",
      purposeRequired: "කරුණාකර හමුවේ අරමුණ ඇතුළත් කරන්න.",
      dateRequired: "කරුණාකර දිනයක් තෝරන්න.",
      submitting: "වෙන්කරමින්...",
      success: "සාර්ථකයි!",
      goBack: "ආපසු යන්න",
      alreadyBooked:
        "ඔබ දැනටමත් {date} සඳහා හමුවක් වෙන්කර ඇත. දිනකට එක් හමුවක් පමණක් වෙන්කර ගත හැක.",
      alreadyBookedTitle: "දැනටමත් වෙන්කර ඇත",
      fetchingAppointments: "ඔබගේ පවතින හමුවීම් පරීක්ෂා කරමින්...",
      invalidDate: "කරුණාකර වලංගු දිනයක් තෝරන්න.",
      noAvailableDates: "ඉදිරි දින 14 තුළ හමුවීම් සඳහා නිදහස් දින නොමැත.",
    },
    TA: {
      Title: "புதிய சந்திப்பை பதிவு செய்யவும்",
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
      Tomorrow: "நாளை",
      Sun: "ஞாயிறு",
      Mon: "திங்கள்",
      Tue: "செவ்வாய்",
      Wed: "புதன்",
      Thu: "வியாழன்",
      Fri: "வெள்ளி",
      Sat: "சனி",
      Selected: "தேர்ந்தெடுக்கப்பட்டது: ",
      reset: "மீட்டமைக்கவும்",
      bookAppointment: "சந்திப்பை பதிவு செய்யவும்",
      bookingSuccess: "சந்திப்பு வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
      bookingError:
        "சந்திப்பை பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      contactRequired: "தயவுசெய்து உங்கள் தொடர்பு எண்ணை உள்ளிடவும்.",
      purposeRequired: "தயவுசெய்து சந்திப்பின் நோக்கத்தை உள்ளிடவும்.",
      dateRequired: "தயவுசெய்து ஒரு தேதியை தேர்ந்தெடுக்கவும்.",
      submitting: "பதிவு செய்கிறது...",
      success: "வெற்றி!",
      goBack: "திரும்பிச் செல்",
      alreadyBooked:
        "{date} அன்று நீங்கள் ஏற்கனவே ஒரு சந்திப்பை பதிவு செய்துள்ளீர்கள். ஒரு நாளில் ஒரு சந்திப்பு மட்டுமே அனுமதிக்கப்படுகிறது.",
      alreadyBookedTitle: "ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது",
      fetchingAppointments: "உங்கள் தற்போதைய சந்திப்புகளை சரிபார்க்கிறது...",
      invalidDate: "தயவுசெய்து சரியான தேதியை தேர்ந்தெடுக்கவும்.",
      noAvailableDates: "அடுத்த 14 நாட்களில் கிடைக்கும் தேதிகள் எதுவும் இல்லை.",
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
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");

  // ============================================================================
  // CONVERT TIME TO 24-HOUR FORMAT
  // ============================================================================
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00:00";

    timeStr = timeStr.trim();

    if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = timeStr.split(":");
      return `${hours.padStart(2, "0")}:${minutes}:00`;
    }

    const parts = timeStr.split(" ");
    if (parts.length !== 2) return "09:00:00";

    const [time, period] = parts;
    let [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "09:00:00";

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  };

  // ============================================================================
  // CHECK IF DATE IS ALREADY BOOKED
  // ============================================================================
  const isDateAlreadyBooked = (day, month, year) => {
    return existingAppointments.some((appointment) => {
      const appDate = new Date(appointment.date);
      return (
        appDate.getDate() === day &&
        appDate.getMonth() === month &&
        appDate.getFullYear() === year &&
        (appointment.status === "Pending" || appointment.status === "Approved")
      );
    });
  };

  // ============================================================================
  // FETCH EXISTING APPOINTMENTS
  // ============================================================================
  const fetchExistingAppointments = async () => {
    if (!token) return;

    setIsLoadingExisting(true);
    try {
      const response = await fetch("/api/appointments/rappointments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const appointments = data.appointments || data || [];
        setExistingAppointments(appointments);
        console.log("📋 Existing appointments loaded:", appointments.length);
      }
    } catch (error) {
      console.error("Error fetching existing appointments:", error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  // ============================================================================
  // GENERATE AVAILABLE DATES - Next 14 Days
  // ============================================================================
  useEffect(() => {
    const today = new Date();
    const dates = [];

    // Start from tomorrow (today + 1) and go 14 days forward
    for (let i = 1; i <= 14; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      const day = dateObj.getDate();
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();

      const isBooked = isDateAlreadyBooked(day, month, year);

      dates.push({
        day: day,
        month: month,
        year: year,
        monthName: dateObj.toLocaleString("default", { month: "long" }),
        dayName: dateObj.toLocaleString("default", { weekday: "long" }),
        isToday: false,
        isTomorrow: i === 1,
        isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6,
        formatted: dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        isBooked: isBooked,
        dateObj: dateObj,
      });
    }

    setAvailableDates(dates);

    // Find the first available date
    const firstAvailable = dates.find((d) => !d.isBooked);
    if (firstAvailable) {
      setBookDay(firstAvailable.day);
    } else {
      // If all dates are booked, show a message
      setErrorMessage(t.noAvailableDates);
    }
  }, [existingAppointments]);

  // ============================================================================
  // FETCH EXISTING APPOINTMENTS ON MOUNT
  // ============================================================================
  useEffect(() => {
    fetchExistingAppointments();
  }, [token]);

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
    setPurpose("");
    const firstAvailable = availableDates.find((d) => !d.isBooked);
    setBookDay(
      firstAvailable
        ? firstAvailable.day
        : availableDates.length > 0
          ? availableDates[0].day
          : null,
    );
    setBookTime("9:00 AM");
    setContactNumber("");
    setErrorMessage("");
    setSuccessMessage("");
    setBookingComplete(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================================
  // HANDLE DATE SELECTION
  // ============================================================================
  const handleDateSelect = (e) => {
    const day = parseInt(e.target.value);
    setBookDay(day);

    const selectedDate = availableDates.find((d) => d.day === day);
    if (selectedDate && selectedDate.isBooked) {
      const formattedDate = `${String(selectedDate.day).padStart(2, "0")}/${String(selectedDate.month + 1).padStart(2, "0")}/${selectedDate.year}`;
      setErrorMessage(t.alreadyBooked.replace("{date}", formattedDate));
    } else {
      setErrorMessage("");
    }
  };

  // ============================================================================
  // HANDLE FORM SUBMISSION
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
      setErrorMessage("Please login to book an appointment.");
      return;
    }

    const selectedDateObj = availableDates.find((d) => d.day === bookDay);
    if (!selectedDateObj) {
      setErrorMessage(t.invalidDate);
      return;
    }

    if (
      isDateAlreadyBooked(
        selectedDateObj.day,
        selectedDateObj.month,
        selectedDateObj.year,
      )
    ) {
      const formattedDate = `${String(selectedDateObj.day).padStart(2, "0")}/${String(selectedDateObj.month + 1).padStart(2, "0")}/${selectedDateObj.year}`;
      setErrorMessage(t.alreadyBooked.replace("{date}", formattedDate));
      return;
    }

    const formattedDate = `${selectedDateObj.year}-${String(selectedDateObj.month + 1).padStart(2, "0")}-${String(selectedDateObj.day).padStart(2, "0")}`;
    const formattedTime = convertTo24Hour(bookTime);

    const formData = {
      purpose: purpose.trim(),
      date: formattedDate,
      time: formattedTime,
      contactNumber: contactNumber.trim(),
    };

    console.log("Submitting form data:", formData);

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          const formattedDate = `${String(selectedDateObj.day).padStart(2, "0")}/${String(selectedDateObj.month + 1).padStart(2, "0")}/${selectedDateObj.year}`;
          setErrorMessage(t.alreadyBooked.replace("{date}", formattedDate));
          fetchExistingAppointments();
          return;
        }
        throw new Error(data.error || "Failed to book appointment");
      }

      setSuccessMessage(data.message || t.bookingSuccess);
      setErrorMessage("");
      setBookingComplete(true);

      fetchExistingAppointments();

      setTimeout(() => {
        handleReset();
        navigate("/ResidentDashboard/RAppointment");
      }, 2500);
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage(error.message || t.bookingError);
      setSuccessMessage("");
      setBookingComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER - DATE OPTIONS
  // ============================================================================
  const renderDateOptions = () => {
    if (availableDates.length === 0) {
      return <option value="">Loading dates...</option>;
    }

    return availableDates.map((date) => {
      const monthName = getMonthName(date.month);
      const dayName = getDayName(
        new Date(date.year, date.month, date.day).getDay(),
      );

      let label = "";
      if (date.isTomorrow) {
        label = t.Tomorrow;
      } else {
        label = dayName;
      }
      label += `, ${monthName} ${date.day < 10 ? `0${date.day}` : date.day}, ${date.year}`;

      if (date.isBooked) {
        label += " You alreay have booked this day";
      }

      return (
        <option key={date.day} value={date.day} disabled={date.isBooked}>
          {label}
        </option>
      );
    });
  };

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
            onClick={() => navigate("/ResidentDashboard/RAppointment")}
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

          {/* Loading Existing Appointments Indicator */}
          {isLoadingExisting && (
            <div className="mx-4 sm:mx-5 md:mx-6 lg:mx-[50px] mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
              <span>{t.fetchingAppointments}</span>
            </div>
          )}

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
                Redirecting to appointments page...
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
              {/* DATE SELECTION - Next 14 Days */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="daySelect" className="font-medium">
                  {t.date}
                </label>
                <select
                  id="daySelect"
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] disabled:opacity-50 disabled:cursor-not-allowed"
                  value={bookDay || ""}
                  onChange={handleDateSelect}
                  required
                  disabled={isSubmitting || bookingComplete}
                >
                  {renderDateOptions()}
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
              {/* ACTION BUTTONS - Reset & Submit */}
              {/* ============================================================ */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
                {/* Reset Button */}
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

                {/* Submit Button */}
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
                      <span>{t.bookAppointment}</span>
                      <img
                        src={confirmIcon}
                        alt="confirmIcon"
                        className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                      />
                    </>
                  )}
                </button>
              </div>

              {/* Booking Complete Indicator */}
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

      {/* Floating Help Trigger */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      <Footer />
    </div>
  );
}

export default BookingForm;
