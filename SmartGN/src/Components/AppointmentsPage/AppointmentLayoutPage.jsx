import React from "react";
import { useState } from "react";
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";
import BookingForm from "./BookingForm";

function AppointmentLayoutPage() {
  const [isBookingMode, setIsBookingMode] = useState(false);

  // Function to handle booking mode toggle
  const handleBookingModeToggle = () => {
    setIsBookingMode(!isBookingMode);
  };

  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[60px] mx-[30px] border border-[red]">
        Appointments
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px] border border-[red]">
        <CardLayout
          isBookingMode={isBookingMode}
          onBookingModeToggle={handleBookingModeToggle}
        />
      </div>

      {!isBookingMode ? (
        <div className="flex mt-[30px] mx-[100px] p-[20px] border border-[red]">
          <CalenderLayout />
        </div>
      ) : (
        <div className="flex mt-[30px] mx-[100px] p-[20px] border border-[red]">
          <BookingForm />
        </div>
      )}
    </>
  );
}

export default AppointmentLayoutPage;
