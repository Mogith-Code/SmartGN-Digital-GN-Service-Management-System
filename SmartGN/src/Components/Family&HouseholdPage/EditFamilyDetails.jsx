import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import EditFamilyDetailsLayout from "./EditFamilyDetailsLayout";
import Footer from "../Common/Footer";
import ChatbotButton from "../Common/ChatbotButton";

function EditFamilyDetails({ onOpenHelp }) {
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <EditFamilyDetailsLayout />
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default EditFamilyDetails;
