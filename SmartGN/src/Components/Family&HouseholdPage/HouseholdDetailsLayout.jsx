import React from "react";

function HouseholdDetailsLayout() {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">Household Number : </span>
        <span className="font-regular">123456</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">Address : </span>
        <span className="font-regular">Colombo</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">Size of the land : </span>
        <span className="font-regular">2 acres</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">Land Owner : </span>
        <span className="font-regular">Kumara</span>
      </div>
    </div>
  );
}

export default HouseholdDetailsLayout;
