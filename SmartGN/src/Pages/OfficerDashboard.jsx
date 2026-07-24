import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import Footer from "../Components/Common/Footer";
import OSidebar from "../Components/Common/OSidebar";
import OfficerDashboardLayout from "../Components/OfficerDashboard.jsx/OfficerDashboardLayout";
import { getAuthHeaders } from "../utils/api";

function OfficerDashboard({ onOpenHelp }) {
  const navigate = useNavigate();

  // ============================================================
  // STATE DECLARATIONS
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Profile data from database
  const [gnProfile, setGnProfile] = useState({
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

  // Dashboard stats from database
  const [dashboardStats, setDashboardStats] = useState({
    totalResidents: 0,
    totalPendingRequests: 0,
    pendingCertificates: 0,
    pendingAppointments: 0,
    pendingAllowances: 0,
    pendingDisasters: 0,
    activeDisasters: 0,
  });

  // Get GN Officer ID and token from localStorage
  const gnId = localStorage.getItem("smartgn_user_id");
  const token = localStorage.getItem("smartgn_token");

  // ============================================================
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

        // Calculate service time
        let serviceTime = "";
        if (data.appointment_date) {
          const startDate = new Date(data.appointment_date);
          const now = new Date();
          const years = now.getFullYear() - startDate.getFullYear();
          const months = now.getMonth() - startDate.getMonth();
          if (years > 0) {
            serviceTime = `${years} year${years > 1 ? "s" : ""}`;
            if (months > 0) {
              serviceTime += ` ${months} month${months > 1 ? "s" : ""}`;
            }
          } else if (months > 0) {
            serviceTime = `${months} month${months > 1 ? "s" : ""}`;
          } else {
            serviceTime = "Less than a month";
          }
        }

        const profileData = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          fullName: data.full_name || "",
          gnId: data.gn_id || "",
          division: data.division_name || "Not Assigned",
          email: data.email || "",
          mobile: data.mobile || "",
          serviceTime: serviceTime,
          idCardFront: data.gn_front_path || null,
          idCardBack: data.gn_back_path || null,
        };

        setGnProfile(profileData);

        // Show alert if GN ID images are missing
        if (!data.gn_front_path || !data.gn_back_path) {
          setShowAlert(true);
        } else {
          setShowAlert(false);
        }

        // Store in localStorage
        localStorage.setItem(
          "smartgn_user_name",
          data.full_name || "GN Officer",
        );
        localStorage.setItem("smartgn_user_division", data.division_name || "");
        localStorage.setItem("smartgn_user_id", data.gn_id || "");

        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      }
    };

    fetchOfficerProfile();
  }, [gnId, token, navigate]);

  // ============================================================
  // FETCH DASHBOARD STATS
  // ============================================================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token || !gnId) return;

      try {
        const response = await fetch(`/api/officer/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();

        setDashboardStats({
          totalResidents: data.totalResidents || 0,
          totalPendingRequests: data.totalPendingRequests || 0,
          pendingCertificates: data.pendingCertificates || 0,
          pendingAppointments: data.pendingAppointments || 0,
          pendingAllowances: data.pendingAllowances || 0,
          pendingDisasters: data.pendingDisasters || 0,
          activeDisasters: data.activeDisasters || 0,
        });

        setError("");
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [gnId, token]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B365D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#1B365D] text-white rounded-lg hover:bg-[#005BBD] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <OfficerDashboardLayout
            gnProfile={gnProfile}
            dashboardStats={dashboardStats}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            loading={loading}
          />
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

      <Footer />
    </div>
  );
}

export default OfficerDashboard;
