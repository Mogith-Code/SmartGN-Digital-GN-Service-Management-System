import React from "react";
import CardLayout from "./CardLayout";
import CalenderLayout from "./CalenderLayout";

function AppointmentLayoutPage() {
  return (
    <>
      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[60px] mx-[30px] border border-[red]">
        Appointments
      </div>

      <div className="grid grid-cols-3 gap-6 mx-[75px] mt-[30px] border border-[red]">
        <CardLayout />
      </div>

      <div className="flex text-[24px] font-medium text-[#1B365D] mt-[30px] mx-[100px] p-[20px] border border-[red]">
        <CalenderLayout />
      </div>
    </>
  );
}

export default AppointmentLayoutPage;
