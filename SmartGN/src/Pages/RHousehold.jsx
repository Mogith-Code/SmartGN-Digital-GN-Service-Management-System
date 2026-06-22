import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";

function RHousehold({ onOpenHelp }) {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {" "}
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default RHousehold;
