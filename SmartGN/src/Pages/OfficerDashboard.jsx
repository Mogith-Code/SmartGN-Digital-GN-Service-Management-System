import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import auth context
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import OSidebar from "../Components/Common/OSidebar";
import OfficerDashboardLayout from "../Components/OfficerDashboard.jsx/OfficerDashboardLayout";
import { getAuthHeaders, authenticatedFetch } from "../utils/api";

function OfficerDashboard({ onOpenHelp }) {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, loading: authLoading } = useAuth(); // Use auth context

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
  // AUTHENTICATION CHECK - Redirect if not authenticated or wrong role
  // ============================================================
  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/OfficerDashboard" } },
      });
      return;
    }

    // If authenticated but not an OFFICER, redirect to appropriate dashboard
    if (role !== "OFFICER") {
      if (role === "ADMIN") {
        navigate("/dashboard/admin");
      } else if (role === "RESIDENT") {
        navigate("/ResidentDashboard");
      } else {
        navigate("/login");
      }
      return;
    }

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, role, authLoading, navigate, token]);

  // ============================================================
  // FETCH PROFILE DATA
  // ============================================================
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      // Skip if not authenticated or not an officer
      if (!isAuthenticated || role !== "OFFICER" || !token) {
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/officer/profile`);

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid - logout
            localStorage.removeItem("smartgn_token");
            localStorage.removeItem("smartgn_user_id");
            localStorage.removeItem("smartgn_user_role");
            localStorage.removeItem("smartgn_user_name");
            localStorage.removeItem("smartgn_user_division");
            navigate("/login");
            return;
          }
          console.warn("Officer profile API non-OK status:", response.status);
          const cachedName =
            localStorage.getItem("smartgn_user_name") || "GN Officer";
          const cachedDivision =
            localStorage.getItem("smartgn_user_division") ||
            "Assigned Division";
          setGnProfile((prev) => ({
            ...prev,
            fullName: cachedName,
            division: cachedDivision,
          }));
          return;
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
        if (data.gn_id) localStorage.setItem("smartgn_user_id", data.gn_id);

        setError("");
      } catch (err) {
        console.warn("Error fetching officer profile:", err);
        // Don't set error state for network issues, use cached data if available
        const cachedName =
          localStorage.getItem("smartgn_user_name") || "GN Officer";
        const cachedDivision =
          localStorage.getItem("smartgn_user_division") || "Assigned Division";
        setGnProfile((prev) => ({
          ...prev,
          fullName: cachedName,
          division: cachedDivision,
        }));
      }
    };

    fetchOfficerProfile();
  }, [gnId, token, navigate, isAuthenticated, role]);

  // ============================================================
  // FETCH DASHBOARD STATS
  // ============================================================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      // Skip if not authenticated or not an officer
      if (!isAuthenticated || role !== "OFFICER" || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/officer/dashboard-stats`);

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired - logout
            localStorage.removeItem("smartgn_token");
            localStorage.removeItem("smartgn_user_id");
            localStorage.removeItem("smartgn_user_role");
            navigate("/login");
            return;
          }
          console.warn(
            "Dashboard stats returned non-OK status:",
            response.status,
          );
          // Use fallback data
          setDashboardStats({
            totalResidents: 0,
            totalPendingRequests: 0,
            pendingCertificates: 0,
            pendingAppointments: 0,
            pendingAllowances: 0,
            pendingDisasters: 0,
            activeDisasters: 0,
          });
          return;
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
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        // Set fallback data on error
        setDashboardStats({
          totalResidents: 0,
          totalPendingRequests: 0,
          pendingCertificates: 0,
          pendingAppointments: 0,
          pendingAllowances: 0,
          pendingDisasters: 0,
          activeDisasters: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [gnId, token, isAuthenticated, role, navigate]);

  // ============================================================
  // CHECK SESSION EXPIRATION
  // ============================================================
  useEffect(() => {
    // Check if token is about to expire
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("smartgn_token");
      if (!token || typeof token !== "string") return;

      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload && payload.exp) {
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const timeLeft = expirationTime - currentTime;

            if (timeLeft < 300000 && timeLeft > 0) {
              console.warn("Token expiring soon.");
            }

            if (timeLeft <= 0) {
              console.warn("Token expired. Logging out.");
              localStorage.removeItem("smartgn_token");
              localStorage.removeItem("smartgn_user_role");
              localStorage.removeItem("smartgn_user_id");
              localStorage.removeItem("smartgn_user_name");
              localStorage.removeItem("smartgn_user_division");
              navigate("/login");
            }
          }
        }
      } catch (e) {
        console.warn("Invalid token format:", e);
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (authLoading || loading) {
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

      {/* Floating AI Assistant Chatbot Button */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      <Footer />
    </div>
  );
}

export default OfficerDashboard;
