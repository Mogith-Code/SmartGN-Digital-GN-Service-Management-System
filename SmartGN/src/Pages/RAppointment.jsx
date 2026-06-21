// src/pages/RAppointment.jsx
import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import AppointmentLayoutPage from "../Components/AppointmentsPage/AppointmentLayoutPage";
import Footer from "../Components/Common/Footer";

function RAppointment() {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <AppointmentLayoutPage />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RAppointment;
