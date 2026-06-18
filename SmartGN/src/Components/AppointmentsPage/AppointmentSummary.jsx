// src/components/AppointmentSummary.jsx
import React from "react";
import appointmentIcon from "../../assets/calendar_today_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function AppointmentSummary({ day, month, year }) {
  // Get month name
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

  // Format the date
  const formattedDate = `${getMonthName(month)} ${day}, ${year}`;

  return (
    <div className="flex w-full flex-col items-center justify-center p-12 px-6 text-center text-[#2D37488D] border-[1.5px] border-dashed border-[#2D37488D] rounded-xl bg-[#E2E8F0]">
      <img
        className="mb-3 w-[50px]"
        src={appointmentIcon}
        alt="Appointment Icon"
      />
      <p className="font-medium text-[16px]">
        No Appointments scheduled for {formattedDate}.
      </p>
      <p className="text-[14px] text-[#2D37488D]">
        Click highlighted days in amber to check booking summaries, or click
        "Book Now" to schedule a meeting.
      </p>
    </div>
  );
}

export default AppointmentSummary;
