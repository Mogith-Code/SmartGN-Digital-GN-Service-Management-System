import React from "react";
import { useState } from "react";
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";
import BookingForm from "./BookingForm";
import AppointmentSummary from "./AppointmentSummary";

function AppointmentLayoutPage() {
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

  const [isBookingMode, setIsBookingMode] = useState(false);

  // Function to handle booking mode toggle
  const handleBookingModeToggle = () => {
    setIsBookingMode(!isBookingMode);
  };

  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[60px] mx-[30px]">
        Appointments
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px]">
        <CardLayout />
      </div>

      <div className="flex mt-[30px] mx-[100px] mt-[30px]">
        <CalenderLayout onDateSelect={handleDateSelect} />
      </div>

      <div className="flex justify-center mx-[75px] my-[30px]">
        <AppointmentSummary
          day={selectedDate.day}
          month={selectedDate.month}
          year={selectedDate.year}
        />
      </div>
    </>
  );
}

export default AppointmentLayoutPage;
