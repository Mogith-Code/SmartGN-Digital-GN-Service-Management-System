// src/pages/BookingForm.jsx
import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import confirmIcon from "../../assets/check_circle_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

function BookingForm() {
  const { lang } = useLanguage();

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
    },
  };

  // Select the appropriate translation based on current language
  const t = BookingFormTranslations[lang] || BookingFormTranslations.EN;

  // Booking Form States
  const [purpose, setPurpose] = useState("");
  const [bookDay, setBookDay] = useState(null);
  const [bookTime, setBookTime] = useState("9:00 AM");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  const navigate = useNavigate();

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

    // Set default selected date to today
    if (dates.length > 0) {
      setBookDay(currentDay);
    }
  }, []);

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
    // Reset all form fields to default values
    setPurpose("");
    setBookDay(availableDates.length > 0 ? availableDates[0].day : null);
    setBookTime("9:00 AM");
    setContactNumber("");
    setErrorMessage("");

    // Optional: Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================================
  // HANDLE FORM SUBMISSION
  // ============================================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!purpose.trim()) {
      setErrorMessage("Please enter an appointment purpose.");
      return;
    }
    if (!bookDay) {
      setErrorMessage("Please select a date.");
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage("Please enter your contact number.");
      return;
    }
    setErrorMessage("");
    console.log("Form submitted:", {
      purpose,
      bookDay,
      bookTime,
      contactNumber,
    });
    // navigate("/RAppointment");
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
            onClick={() => navigate("/RAppointment")}
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
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
                />
              </div>

              {/* ============================================================ */}
              {/* DATE SELECTION - Dynamic from Today to End of Month */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="daySelect" className="font-medium">
                  {t.date}
                </label>
                <select
                  id="daySelect"
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  value={bookDay || ""}
                  onChange={(e) => setBookDay(parseInt(e.target.value))}
                  required
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
                          {date.isWeekend}
                        </option>
                      );
                    })
                  )}
                </select>

                {/* Display selected date details */}
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
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
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
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-2 sm:p-2.5 md:p-3 lg:p-[10px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
                />
              </div>

              {/* ============================================================ */}
              {/* ERROR MESSAGE */}
              {/* ============================================================ */}
              {errorMessage && (
                <div className="text-red-500 text-xs sm:text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* ============================================================ */}
              {/* ACTION BUTTONS - Reset & Submit */}
              {/* ============================================================ */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#E7000B] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group font-regular hover:bg-[#FF000C] transition-all duration-200"
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
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer font-regular hover:bg-[#005BBD] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group transition-all duration-200"
                >
                  <span>{t.bookAppointment}</span>
                  <img
                    src={confirmIcon}
                    alt="confirmIcon"
                    className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D69E2E] text-white border-0 text-base sm:text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00] z-50"
        aria-label="Help Trigger"
        onClick={() => console.log("Help clicked")}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default BookingForm;
