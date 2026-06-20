// src/pages/BookingForm.jsx
import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BookingForm() {
  // Booking Form States
  const [purpose, setPurpose] = useState("");
  const [bookDay, setBookDay] = useState(null);
  const [bookTime, setBookTime] = useState("2:00 PM");
  const [officerName, setOfficerName] = useState("Kamal Silva");
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  // ============================================================================
  // GET DAY NAME
  // ============================================================================
  const getDayName = (dayIndex) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex];
  };

  // ============================================================================
  // HANDLE RESET FORM
  // ============================================================================
  const handleReset = () => {
    // Reset all form fields to default values
    setPurpose("");
    setBookDay(availableDates.length > 0 ? availableDates[0].day : null);
    setBookTime("2:00 PM");
    setOfficerName("Kamal Silva");
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
      officerName,
      contactNumber,
    });
    // navigate("/RAppointment");
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/RAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            Back
          </div>

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b-[1.5px] border-[#2D37482D] pb-3 mb-5 mt-[30px] mx-[30px]">
            Book New Appointment
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            <div className="mx-[50px] flex flex-col gap-5 border border-[#2D37482D] rounded-[15px] p-[20px]">
              {/* ============================================================ */}
              {/* APPOINTMENT PURPOSE - TEXT INPUT */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  Appointment Purpose:
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Certificate Collection, General Inquiry, etc."
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[10px] focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
                />
              </div>

              {/* ============================================================ */}
              {/* DATE SELECTION - Dynamic from Today to End of Month */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="daySelect" className="font-medium">
                  Date:
                </label>
                <select
                  id="daySelect"
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[10px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
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
                          {date.isToday ? "⭐ Today" : dayName}, {monthName}{" "}
                          {date.day < 10 ? `0${date.day}` : date.day},{" "}
                          {date.year}
                          {date.isWeekend && " 🗓️"}
                        </option>
                      );
                    })
                  )}
                </select>

                {/* Display selected date details */}
                {bookDay && availableDates.length > 0 && (
                  <p className="text-sm text-[#2D37488D] mt-1">
                    Selected: {getMonthName(availableDates[0].month)} {bookDay},{" "}
                    {availableDates[0].year}
                  </p>
                )}
              </div>

              {/* ============================================================ */}
              {/* TIME SELECTION */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="timeSelect" className="font-medium">
                  Time:
                </label>
                <select
                  id="timeSelect"
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[10px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
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
              {/* OFFICER NAME */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="officerName" className="font-medium">
                  Officer Name:
                </label>
                <select
                  id="officerName"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[10px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
                >
                  <option value="Kamal Silva">Kamal Silva</option>
                  <option value="Nimal Perera">Nimal Perera</option>
                  <option value="Sunil Fernando">Sunil Fernando</option>
                  <option value="Chandana Kumara">Chandana Kumara</option>
                  <option value="Samantha Rathnayake">
                    Samantha Rathnayake
                  </option>
                </select>
              </div>

              {/* ============================================================ */}
              {/* CONTACT NUMBER */}
              {/* ============================================================ */}
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="contactNumber" className="font-medium">
                  Contact Number:
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[10px] focus:outline-none focus:ring-2 focus:ring-[#2c5f8a]"
                  required
                />
              </div>

              {/* ============================================================ */}
              {/* ERROR MESSAGE */}
              {/* ============================================================ */}
              {errorMessage && (
                <div className="text-red-500 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* ============================================================ */}
              {/* ACTION BUTTONS - Reset & Submit */}
              {/* ============================================================ */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#2D37482D]">
                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 border border-[#2D3748] text-[#2D3748] rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Reset
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1B365D] text-white rounded-lg hover:bg-[#2c5f8a] transition-colors text-sm font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
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
