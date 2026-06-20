// src/components/CalendarLayout.jsx
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support

function CalendarLayout({ onDateSelect }) {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN),
  // Sinhala (SI), and Tamil (TA)
  const CalenderLayoutTranslations = {
    EN: {
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

      Booked: "Booked",
      Selected: "Selected",
    },

    SI: {
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

      Booked: "වෙන්කර ඇත",
      Selected: "තෝරාගත්",
    },

    TA: {
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

      Booked: "நேரம் கொடுக்கப்பட்டது",
      Selected: "தேர்ந்தெடுக்கப்பட்டது",
    },
  };

  // Select the appropriate translation based on current language
  const t = CalenderLayoutTranslations[lang] || CalenderLayoutTranslations.EN;

  // Receive onDateSelect as prop
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Current date state - tracks the displayed month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  // Get month name
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

  // Get number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get days from previous month to display
  const getPreviousMonthDays = (year, month) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthDays = prevMonthDate.getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(prevMonthDays - i);
    }
    return days;
  };

  // Get days from next month to display
  const getNextMonthDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();
    const days = [];

    for (let i = 1; i < 7 - lastDay; i++) {
      days.push(i);
    }
    return days;
  };

  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
    setSelectedDay(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    setSelectedDay(null);
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());

    // Notify parent when Today button is clicked
    if (onDateSelect) {
      onDateSelect(today.getDate(), today.getMonth(), today.getFullYear());
    }
  };

  // ============================================================================
  // GENERATE CALENDAR CELLS
  // ============================================================================

  const generateCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const previousMonthDays = getPreviousMonthDays(year, month);
    const nextMonthDays = getNextMonthDays(year, month);

    const cells = [];

    // Previous month days
    previousMonthDays.forEach((day) => {
      cells.push({
        day: day,
        isCurrentMonth: false,
        isPreviousMonth: true,
        isNextMonth: false,
      });
    });

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        day: day,
        isCurrentMonth: true,
        isPreviousMonth: false,
        isNextMonth: false,
      });
    }

    // Next month days
    nextMonthDays.forEach((day) => {
      cells.push({
        day: day,
        isCurrentMonth: false,
        isPreviousMonth: false,
        isNextMonth: true,
      });
    });

    return cells;
  };

  // ============================================================================
  // HANDLE DATE CLICK
  // ============================================================================

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update selected day state
    setSelectedDay(day);

    // Notify parent component about the selected date
    if (onDateSelect) {
      onDateSelect(day, month, year);
    }
  };

  // ============================================================================
  // RENDER CALENDAR
  // ============================================================================

  const calendarCells = generateCalendarCells();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Weekday headers
  const weekdays = [t.Sun, t.Mon, t.Tue, t.Wed, t.Thu, t.Fri, t.Sat];

  // Check if navigation should be disabled (past 10 years or future 10 years)
  const isPrevDisabled = year <= new Date().getFullYear() - 10;
  const isNextDisabled = year >= new Date().getFullYear() + 10;

  return (
    <div className="flex flex-col w-full items-center justify-center border border-[#2D37488D] rounded-[15px] p-4 sm:p-5 md:p-6">
      {/* ==================================================================== */}
      {/* CALENDAR HEADER - Month/Year Navigation */}
      {/* ==================================================================== */}
      <div className="flex justify-between items-center w-full mb-6">
        <button
          onClick={goToPreviousMonth}
          disabled={isPrevDisabled}
          className="bg-transparent border-none text-base font-medium text-[#2D3748] cursor-pointer py-1 px-3 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-[#E2E8F0] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          ←
        </button>

        <div className="flex items-center gap-4">
          <span className="text-base md:text-lg font-medium text-[#2D3748]">
            {getMonthName(month)} {year}
          </span>
          <button
            onClick={goToToday}
            className="text-xs px-3 py-2 bg-[#D69E2E] text-[#F7FAFC] rounded-[10px] hover:bg-[#B8860B] transition-colors duration-200 cursor-pointer"
          >
            {t.Today}
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          disabled={isNextDisabled}
          className="bg-transparent border-none text-base font-medium text-[#2D3748] cursor-pointer py-1 px-3 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-[#E2E8F0] hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* ==================================================================== */}
      {/* WEEKDAY HEADERS */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-7 gap-2 w-full text-center">
        {weekdays.map((day) => (
          <span
            key={day}
            className="text-[16px] sm:text-sm md:text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37488D] mb-2"
          >
            {day}
          </span>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* CALENDAR DAYS GRID */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-7 gap-2 w-full text-center">
        {calendarCells.map((cell, index) => {
          const hasBooking = appointments.some(
            (app) =>
              app.day === cell.day && app.month === month && app.year === year,
          );
          const isSelected = selectedDay === cell.day && cell.isCurrentMonth;
          const today = isToday(year, month, cell.day) && cell.isCurrentMonth;

          let cellClasses = `py-2
            flex flex-col items-center justify-center 
            text-xs sm:text-sm md:text-[16px] 
            rounded-lg sm:rounded-xl 
            transition-all duration-200 
            relative select-none 
            w-full
          `;

          if (!cell.isCurrentMonth) {
            cellClasses += `
              text-[#2D37482D] cursor-not-allowed
            `;
          } else {
            if (isSelected) {
              cellClasses += `
                bg-white text-[#2D3748] font-medium 
                ring-2 ring-[#2D3748]
                hover:bg-[#E2E8F0] cursor-pointer
              `;
            } else if (hasBooking) {
              cellClasses += `
                bg-amber-600 text-white font-bold 
                hover:bg-amber-700 hover:shadow-md cursor-pointer
              `;
            } else {
              cellClasses += `
                text-[#2D3748] 
                hover:bg-[#E2E8F0] cursor-pointer
              `;
            }
          }

          return (
            <div
              key={index}
              className={cellClasses}
              onClick={() => {
                if (cell.isCurrentMonth) {
                  handleDateClick(cell.day);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center gap-[5px]">
                <span className="text-xs sm:text-sm md:text-base font-medium">
                  {cell.day < 10 ? `0${cell.day}` : cell.day}
                </span>

                <div className="h-2 w-2 flex items-center justify-center">
                  {today && (
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
                  )}
                  {hasBooking &&
                    cell.isCurrentMonth &&
                    !isSelected &&
                    !today && (
                      <span className="w-2 h-2 bg-[#D69E2E] rounded-full"></span>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* LEGEND */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-[#2D37482D] text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
          <span className="text-[#2D3748]">{t.Today}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#D69E2E] rounded-full"></div>
          <span className="text-[#2D3748]">{t.Booked}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-white ring-2 ring-[#2D3748] rounded-full"></div>
          <span className="text-[#2D3748]">{t.Selected}</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarLayout;
