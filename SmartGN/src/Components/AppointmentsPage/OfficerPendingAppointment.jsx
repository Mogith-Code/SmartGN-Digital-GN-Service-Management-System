import React from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";

function OfficerPendingAppointment() {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          \
        </div>
      </div>
    </div>
  );
}

export default OfficerPendingAppointment;
