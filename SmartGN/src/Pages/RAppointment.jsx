import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import pendingIcon from "../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../assets/add_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function RAppointment() {
  return (
    <div className="flex flex-col w-full mb-[10px] bg-[#F7FAFC]">
      <div className="w-full fixed top-0  z-1000 flex flex-col border border-[red]">
        <AfterlogNavbar />
      </div>

      <div className="flex items-center w-full">
        <div className="flex h-full fixed left-0 top-[100px] max-md:hidden">
          <RSidebar />
        </div>

        <div className="w-full h-[1000px] ml-[300px] bg-[white] border-l border-[#2D37482D]">
          <div className="mt-[160px] ml-[30px] text-[#1B365D] text-[24px] font-semibold">
            Appointments
          </div>

          {/* Centered Stats Widget Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6 border mx-[75px] mt-[30px] max-lg:grid-cols-2 max-md:grid-cols-1 border-[red]">
            <div className="bg-[#E2E8F0] border border-[#2D37484D] rounded-[15px] p-[15px] flex flex-col items-center transition-all duration-200">
              <img
                src={pendingIcon}
                alt="Pending Icon"
                className="w-[80px] h-[80px] border border-[red]"
              />
              <span className="text-[16px] font-regular text-[#2D3748] border border-[red]">
                Pending appointment requests
              </span>
              <span className="text-[20px] font-medium text-[#2D3748] border border-[red]">
                5
              </span>{" "}
              {/*{pendingCount}*/}
            </div>

            <div className="bg-[#E2E8F0] border border-[#2D37484D] rounded-[15px] p-[15px] flex flex-col items-center transition-all duration-200">
              <img
                src={approvedIcon}
                alt="Approved Icon"
                className="w-20 h-20"
              />
              <span className="text-[16px] font-regular text-[#2D3748]">
                Approved appointment requests
              </span>
              <span className="text-[20px] font-medium text-[#2D3748]">5</span>{" "}
              {/*{approvedCount}*/}
            </div>

            <div
              className="bg-[#E2E8F0] rounded-[15px] p-[15px] flex flex-col items-center shadow-[0px_2px_10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:shadow-[0px_2px_20px_rgba(0,0,0,0.6)] hover:cursor-pointer"
              onClick={() => console.log("card clicked")}
            >
              <img src={addIcon} alt="Add Icon" className="w-20 h-20" />
              <span className="text-[16px] font-regular text-[#2D3748]">
                Book an appointment
              </span>
              <span className="text-[20px] font-medium text-[#2D3748]">
                Booking
              </span>{" "}
              {/*{isBookingMode ? 'Close Form' : 'Book Now'}*/}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full absolute bottom-0 border  max-md:hidden border-[green]">
        <Footer />
      </div>
    </div>
  );
}

export default RAppointment;
