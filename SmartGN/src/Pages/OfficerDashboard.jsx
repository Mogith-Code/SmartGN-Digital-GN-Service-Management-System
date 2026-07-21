import React, { useState } from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import Footer from "../Components/Common/Footer";
import OSidebar from "../Components/Common/OSidebar";
import OfficerDashboardLayout from "../Components/OfficerDashboard.jsx/OfficerDashboardLayout";

function OfficerDashboard({ onOpenHelp }) {
  // STATE DECLARATIONS
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Profile data from database
  const [gnProfile, setgnProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    division: "",
    gnId: "",
    serviceTime: "",
    email: "",
    mobile: "",
    gnFront: null,
    gnBack: null,
  });
  return (
    <>
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        {/* Navbar */}
        <OfficerNavbar />

        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          {/* Sidebar - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block bg-white">
            <OSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
            <OfficerDashboardLayout />
          </div>
        </div>

        {/* Floating Help Trigger */}
        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
          aria-label="Help Trigger"
          onClick={onOpenHelp}
        >
          ?
        </button>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default OfficerDashboard;
