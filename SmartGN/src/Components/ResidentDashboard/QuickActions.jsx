import React from "react";

function QuickActions() {
  return (
    <div className="flex flex-col gap-[25px] justify-center">
      <span className="text-[#1B365D] text-[20px]">Quick Actions</span>
      <div className="grid grid-cols-2 gap-[20px]">
        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          {" "}
        </button>
        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          {" "}
        </button>
        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          {" "}
        </button>
        <button className="bg-[#FFFFFF] flex items-center justify-center p-[20px] rounded-[15px] shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer">
          {" "}
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
