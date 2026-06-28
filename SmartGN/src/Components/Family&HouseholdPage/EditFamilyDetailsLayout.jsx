import React from "react";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
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

      <div className="flex flex-col border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px]">
        <form>
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
              <label htmlFor="purposeInput" className="font-medium">
                Full Name:
              </label>
              <input
                type="text"
                id="purposeInput"
                className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2"
              />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  NIC :
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  className="w-[20vw] border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2"
                />
              </div>

              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  Age :
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  className="w-[20vw] border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2"
                />
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  Occupation :
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  className="w-[20vw] border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2"
                />
              </div>

              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeInput" className="font-medium">
                  Relationship :
                </label>
                <input
                  type="text"
                  id="purposeInput"
                  className="w-[20vw] border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
              {/* Reset Button */}
              <button
                type="button"
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#E7000B] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group font-regular hover:bg-[#FF000C] transition-all duration-200"
              >
                <span>Reset</span>
                <img
                  src={resetIcon}
                  alt="resetIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>

              <button
                type="button"
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer font-regular hover:bg-[#005BBD] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] group transition-all duration-200"
              >
                <span>Add member</span>
                <img
                  src={addIcon}
                  alt="addIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditFamilyDetailsLayout;
