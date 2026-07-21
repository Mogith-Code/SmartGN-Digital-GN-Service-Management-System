import React, { useEffect, useState } from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import Footer from "../Components/Common/Footer";
import OSidebar from "../Components/Common/OSidebar";
import OfficerDashboardLayout from "../Components/OfficerDashboard.jsx/OfficerDashboardLayout";
import { getAuthHeaders } from "../utils/api";
import { useNavigate } from "react-router-dom";

function OfficerDashboard({ onOpenHelp }) {
  const navigate = useNavigate();
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

  // Get resident NIC and token from localStorage
  const gnId = localStorage.getItem("smartgn_user_id");
  const token = localStorage.getItem("smartgn_token");

  // FETCH PROFILE DATA
  // ============================================================
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      if (!token || !gnId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`/api/officer/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("smartgn_token");
            localStorage.removeItem("smartgn_user_id");
            localStorage.removeItem("smartgn_user_role");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        const profileData = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          fullName: data.full_name || "",
          gnId: data.gn_id || "",
          gnFront: data.gn_front_path || null,
          gnBack: data.gn_back_path || null,
        };

        setgnProfile(profileData);

        // Show alert if NIC images are missing
        if (!data.gn_front_path || !data.gn_back_path) {
          setShowAlert(true);
        } else {
          setShowAlert(false);
        }

        // Store in localStorage for other components
        localStorage.setItem("smartgn_user_name", data.full_name || "Resident");
        localStorage.setItem("smartgn_user_division", data.division_name || "");
        localStorage.setItem("smartgn_user_id", data.gn_id || "");

        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      }
    };

    fetchOfficerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gnId, token]);

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
            <OfficerDashboardLayout gnprofile={gnProfile} />
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
