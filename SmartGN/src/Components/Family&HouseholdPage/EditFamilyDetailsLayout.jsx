import React from "react";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function EditFamilyDetailsLayout() {
  const navigate = useNavigate();
  return (
    <>
      {/* Back Button */}
      <div
        className="flex w-auto p-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
        onClick={() => navigate("/RHousehold")}
      >
        <img src={backIcon} alt="backIcon" className="w-[14px] sm:w-[16px]" />
        back
      </div>

      {/* Page Title */}
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
        Edit your family details
      </div>
    </>
  );
}

export default EditFamilyDetailsLayout;
