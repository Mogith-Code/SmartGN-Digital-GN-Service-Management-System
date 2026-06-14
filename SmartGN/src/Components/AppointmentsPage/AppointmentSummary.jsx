import React from "react";

function AppointmentSummary() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-12 px-6 text-center text-[#2D37488D] border-[1.5px] border-dashed border-[#2D37488D] rounded-xl bg-[#E2E8F0]">
      <div className="mb-3 text-slate-400">icon</div>
      <p className="font-medium text-[16px]">
        No Appointments scheduled for May 16, 2026.
      </p>
      <p className="text-[14px] text-[#2D37488D]">
        Click highlighted days in amber to check booking summaries, or click
        "Book Now" to schedule a meeting.
      </p>
    </div>
  );
}

export default AppointmentSummary;
