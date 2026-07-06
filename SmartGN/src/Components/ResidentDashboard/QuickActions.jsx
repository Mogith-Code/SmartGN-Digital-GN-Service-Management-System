import React from "react";
import certificateIcon from "../../assets/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import arrowIcon from "../../assets/arrow_forward_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function QuickActions() {
  return (
    <div className="flex flex-col gap-[20px] items-center justify-center">
      <span className="text-[#1B365D] text-[20px] font-medium">
        Quick Actions
      </span>
      <div className="grid grid-cols-2 gap-[20px]">
        <button className="bg-[#FFFFFF] flex items-center justify-center py-[20px] px-[50px] rounded-[15px] shadow-[0px_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <img
              src={certificateIcon}
              alt="certificateIcon"
              className="h-[20px]"
            />
            <span className="text-[16px] text-[#2D3748]">
              Request Certificates
            </span>
            <img
              src={arrowIcon}
              alt="arrowIcon"
              className="ml-[10px] h-[16px] w-[20px] opacity-[50%]"
            />
          </div>
        </button>

        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <img
              src={certificateIcon}
              alt="certificateIcon"
              className="h-[20px]"
            />
            <span className="text-[16px] text-[#2D3748]">
              Request Certificates
            </span>
            <img
              src={arrowIcon}
              alt="arrowIcon"
              className="ml-[10px] h-[16px] w-[20px] opacity-[50%]"
            />
          </div>
        </button>

        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <img
              src={certificateIcon}
              alt="certificateIcon"
              className="h-[20px]"
            />
            <span className="text-[16px] text-[#2D3748]">
              Request Certificates
            </span>
            <img
              src={arrowIcon}
              alt="arrowIcon"
              className="ml-[10px] h-[16px] w-[20px] opacity-[50%]"
            />
          </div>
        </button>

        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <img
              src={certificateIcon}
              alt="certificateIcon"
              className="h-[20px]"
            />
            <span className="text-[16px] text-[#2D3748]">
              Request Certificates
            </span>
            <img
              src={arrowIcon}
              alt="arrowIcon"
              className="ml-[10px] h-[16px] w-[20px] opacity-[50%]"
            />
          </div>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
