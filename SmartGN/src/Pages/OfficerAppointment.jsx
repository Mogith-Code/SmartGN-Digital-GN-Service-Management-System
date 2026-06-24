// src/Pages/OfficerAppointment.jsx
import React from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";

function OfficerAppointment({ onOpenHelp }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      <OfficerNavbar />
      <div className="flex flex-1 w-full">
        <OSidebar />
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto text-left">
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6">Appointments Management</h2>
          <div className="bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm">
            <p className="text-gray-600 text-lg">Officer scheduling and resident appointment bookings portal is under construction.</p>
          </div>
          <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default OfficerAppointment;
