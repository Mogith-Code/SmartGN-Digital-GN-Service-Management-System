import React from "react";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function ProfileSearchingSection() {
  return (
    <div className="flex flex-col gap-[20px] w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl">
      <div className="flex w-[50%] bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] items-center gap-[10px]">
        <img
          src={searchIcon}
          alt="Search Icon"
          className="w-[15px] h-[15px] opacity-[50%]"
        />
        <span className="text-[16px] font-light text-[#2D3748] opacity-[50%]">
          Search residents using NIC number
        </span>
      </div>
    </div>
  );
}

export default ProfileSearchingSection;
