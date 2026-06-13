import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import AppointmentLayoutPage from "../Components/AppointmentsPage/AppointmentLayoutPage";

function RAppointment() {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex gap-[20px]">
        <div className="flex bg-[#FFFFFF]">
          {/* Sidebar content */}
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          <AppointmentLayoutPage />
        </div>
      </div>
    </div>
  );
}

export default RAppointment;
