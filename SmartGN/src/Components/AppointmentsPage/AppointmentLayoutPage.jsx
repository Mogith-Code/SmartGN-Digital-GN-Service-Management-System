import React from "react";
import pendingIcon from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function AppointmentLayoutPage() {
  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[60px] mx-[30px] border border-[red]">
        Appointments
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px]">
        <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl border border-[#2D37482D] p-[15px] flex flex-col items-center">
          <img
            src={pendingIcon}
            alt="pendingIcon"
            className="w-[50px] border border-[red]"
          />

          <div className="flex flex-col gap-[10px] border border-[red] items-center">
            <span className="text-[16px] font-regular text-[#2D3748]">
              Pending appointment requests
            </span>
            <span className="text-[20px] font-medium text-[#2D3748]">5</span>
          </div>
        </div>

        <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl border border-[#2D37482D] p-[15px] flex flex-col items-center">
          <img
            src={approvedIcon}
            alt="approvedIcon"
            className="w-[50px] border border-[red]"
          />

          <div className="flex flex-col gap-[10px] border border-[red] items-center">
            <span className="text-[16px] font-regular text-[#2D3748]">
              Approved appointment requests
            </span>
            <span className="text-[20px] font-medium text-[#2D3748]">5</span>
          </div>
        </div>

        <div className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.6)] cursor-pointer">
          <img
            src={addIcon}
            alt="pendingIcon"
            className="w-[50px] border border-[red]"
          />

          <div className="flex flex-col gap-[10px] border border-[red] items-center">
            <span className="text-[16px] font-regular text-[#2D3748]">
              Book an appointment
            </span>
            <span className="text-[20px] font-medium text-[#2D3748]">5</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppointmentLayoutPage;
