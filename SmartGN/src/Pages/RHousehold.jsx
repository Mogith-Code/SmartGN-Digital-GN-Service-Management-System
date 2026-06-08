import React from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";

function RHousehold() {
  return (
    <div className="flex flex-col w-full mb-[10px] bg-[#F7FAFC]">
      <div className="w-full fixed top-0  z-[1000] flex flex-col">
        <AfterlogNavbar />
      </div>

      <div className="flex items-center w-full border border-[blue]">
        <div className="flex h-full fixed left-0 top-[100px]">
          <RSidebar />
        </div>

        <div className="w-full h-[1000px] ml-[300px] bg-[white] border-l border-[#2D37482D]">
          <div className=" mt-[160px] ml-[30px] text-[#1B365D] text-[24px] font-semibold">
            Household
          </div>
        </div>
      </div>

      <div className="flex w-full absolute bottom-0 border border-[green]">
        <Footer />
      </div>
    </div>
  );
}

export default RHousehold;
