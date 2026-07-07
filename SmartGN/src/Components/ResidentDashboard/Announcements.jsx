import React from "react";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function Announcements() {
  return (
    <>
      <div className="flex flex-col w-full gap-[20px]">
        <div className="flex w-full justify-between items-center border border-[red]">
          <div className="flex text-[white] text-[16px]">
            <span>View all</span>
          </div>
          <div className="flex text-[#1B365D] font-medium text-[20px]">
            Announcements
          </div>
          <div className="flex text-[#D69E2E] text-[16px] bover: cursor-pointer hover:underline hover:font-medium">
            <span>View all</span>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] w-full justify-between items-center border border-[red]">
          <div className="flex w-full border border-[#2D37482D] rounded-[15px] p-[20px]">
            <div className="flex gap-[10px] items-center">
              <img
                src={announcementIcon}
                alt="announcement icon"
                className="h-[20px]"
              />
              <span className="text-[#2D3748] text-[16px]">
                Community Health Camp
              </span>
            </div>
          </div>
          <div className="flex border border-[#2D37482D] rounded-[15px] p-[20px]">
            <div className="flex gap-[10px]">
              <img
                src={announcementIcon}
                alt="announcement icon"
                className="h-[20px]"
              />
              <span className="text-[#2D3748] text-[16px]">
                Community Health Camp
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Announcements;
