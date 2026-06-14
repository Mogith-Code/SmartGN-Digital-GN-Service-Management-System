import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function BookingForm() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          {/* Sidebar content */}
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer border border-[red]"
            onClick={() => navigate("/RAppointment")}
          >
            <img src={backIcon} alt="pendingIcon" className="w-[16px]" />
            Back
          </div>
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={() => console.log("Help clicked")}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default BookingForm;
