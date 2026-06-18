import React from "react";
import { useState } from "react";
import pendingIcon from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function CardLayout() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl border border-[#2D37482D] p-[15px] flex flex-col items-center">
        <img src={pendingIcon} alt="pendingIcon" className="w-[50px]" />

        <div
          className="flex flex-col gap-[10px] items-center"
          onClick={() => navigate("/RAppointment/PendingAppointmentRequests")}
        >
          <span className="text-[16px] font-regular text-[#2D3748]">
            Pending appointment requests
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">5</span>
        </div>
      </div>

      <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl border border-[#2D37482D] p-[15px] flex flex-col items-center">
        <img src={approvedIcon} alt="approvedIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748]">
            Approved appointment requests
          </span>
          <span className="text-[20px] font-medium text-[#2D3748]">5</span>
        </div>
      </div>

      <div
        className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.6)] cursor-pointer"
        onClick={() => navigate("/RAppointment/BookingForm")}
      >
        <img src={addIcon} alt="pendingIcon" className="w-[50px]" />

        <div className="flex flex-col gap-[10px] items-center">
          <span className="text-[16px] font-regular text-[#2D3748]">
            Book an appointment
          </span>
        </div>
      </div>
    </>
  );
}

export default CardLayout;
