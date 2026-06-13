import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";

function RAppointment() {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex gap-[20px]">
        <div className=" bg-[#FFFFFF] border border-[red]">
          {/* Sidebar content */}
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] p-4 border-l border-[#2D37482D]">
          <h2 className="text-lg font-medium text-[#1B365D] mb-4">Dashboard</h2>
        </div>
      </div>
    </div>
  );
}

export default RAppointment;
