import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import AppointmentLayoutPage from "../Components/AppointmentsPage/AppointmentLayoutPage";
import Footer from "../Components/Common/Footer";

function RAppointment({ onOpenHelp }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      <AfterlogNavbar />
      <div className="flex flex-1 w-full">
        <RSidebar />
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          <AppointmentLayoutPage />
        </main>
      </div>

      {/* Floating Help Trigger */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]" aria-label="Help Trigger" onClick={onOpenHelp}>
        ?
      </button>

      <Footer />
    </div>
  );
}

export default RAppointment;
