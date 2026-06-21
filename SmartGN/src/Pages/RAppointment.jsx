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

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D69E2E] text-white border-0 text-base sm:text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00] z-50"
        aria-label="Help Trigger"
        onClick={() => console.log("Help clicked")}
      >
        ?
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RAppointment;
