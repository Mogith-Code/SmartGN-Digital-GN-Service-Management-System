import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import OSidebar from "../Common/OSidebar";

function OfficerApprovedAppointment() {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          <OSidebar />
        </div>
      </div>
    </div>
  );
}

export default OfficerApprovedAppointment;
