import React from "react";
import { useState, useEffect } from "react";

function CalenderLayout() {
  // Booking states
  const [appointments, setAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(16); // Default selected day May 16 matching screenshot

  // Calendar cells generation for May 2026
  // Sunday 31 is wrapped to row 1, Mon/Tue/Wed/Thu are empty, Fri 01, Sat 02
  const calendarCells = [
    { day: 31, isCurrent: true, wrapped: true },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: null, isCurrent: false },
    { day: 1, isCurrent: true },
    { day: 2, isCurrent: true },

    { day: 3, isCurrent: true },
    { day: 4, isCurrent: true },
    { day: 5, isCurrent: true },
    { day: 6, isCurrent: true },
    { day: 7, isCurrent: true },
    { day: 8, isCurrent: true },
    { day: 9, isCurrent: true },

    { day: 10, isCurrent: true },
    { day: 11, isCurrent: true },
    { day: 12, isCurrent: true },
    { day: 13, isCurrent: true },
    { day: 14, isCurrent: true },
    { day: 15, isCurrent: true },
    { day: 16, isCurrent: true },

    { day: 17, isCurrent: true },
    { day: 18, isCurrent: true },
    { day: 19, isCurrent: true },
    { day: 20, isCurrent: true },
    { day: 21, isCurrent: true },
    { day: 22, isCurrent: true },
    { day: 23, isCurrent: true },

    { day: 24, isCurrent: true },
    { day: 25, isCurrent: true },
    { day: 26, isCurrent: true },
    { day: 27, isCurrent: true },
    { day: 28, isCurrent: true },
    { day: 29, isCurrent: true },
    { day: 30, isCurrent: true },
  ];

  return (
    <div className="flex flex-col w-full items-center justify-center border border-[#2D37482D] rounded-[15px] p-[20px]">
      <div className="flex justify-center items-center gap-[100px] mb-[30px] text-[16px] font-medium text-[#2D3748]">
        <button className="bg-transparent border-none text-base font-medium text-[#2D3748] cursor-pointer py-1 px-2 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-[#E2E8F0] hover:text-slate-800">
          {"<"}
        </button>

        <span>May 2026</span>

        <button className="bg-transparent border-none text-base font-medium text-[#2D3748] cursor-pointer py-1 px-2 rounded transition-all duration-200 outline-none focus:outline-none hover:bg-[#E2E8F0] hover:text-slate-800">
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3 w-full text-center">
        {/* Weekdays headers */}
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Sun
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Mon
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Tue
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Wed
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Thu
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Fri
        </span>
        <span className="text-[16px] font-medium text-[#2D3748] pb-2 border-b-[1.5px] border-[#2D37482D] mb-[10px]">
          Sat
        </span>
      </div>

      <div className="grid grid-cols-7 gap-3 w-full text-center">
        {/* Calendar Days */}
        {calendarCells.map((cell, index) => {
          const hasBooking = appointments.some((app) => app.day === cell.day);
          const isSelected = selectedDay === cell.day;

          if (cell.day === null) {
            return (
              <span
                key={index}
                className="text-[#2D3748] cursor-not-allowed"
              ></span>
            );
          }

          return (
            <span
              key={index}
              className={`aspect-[3] flex flex-col items-center justify-center text-[16px] font-medium text-[#2D3748] cursor-pointer rounded-[10px] transition-all duration-200 relative select-none hover:bg-[#E2E8F0] 
                ${cell.wrapped ? "text-slate-300 cursor-not-allowed" : ""} ${hasBooking ? "bg-amber-600 text-white font-bold hover:bg-amber-700" : ""} ${isSelected ? "ring-2 ring-[#1c355e] ring-offset-0" : ""}`}
              onClick={() => cell.day && setSelectedDay(cell.day)}
            >
              {cell.day < 10 ? "0" + cell.day : cell.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default CalenderLayout;
