// src/pages/ResidentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../utils/api";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import ResidentDashboardLayout from "../Components/ResidentDashboard/ResidentDashboardLayout";
import Footer from "../Components/Common/Footer";

function ResidentDashboard({ onOpenHelp }) {
  const navigate = useNavigate();

  // ============================================================
  // STATE DECLARATIONS
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Profile data from database
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    nic: "",
    occupation: "",
    email: "",
    mobile: "",
    homeAddress: "",
    division: "",
    dob: "",
    gender: "",
    householdNumber: "",
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
  });

  // Dashboard stats from database
  const [totalPendingCount, setTotalPendingCount] = useState(0);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0);
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get resident NIC and token from localStorage
  const residentNic = localStorage.getItem("smartgn_user_id");
  const token = localStorage.getItem("smartgn_token");

  // ============================================================
  // FETCH PROFILE DATA
  // ============================================================
  useEffect(() => {
    const fetchResidentProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`/api/residents/profile`, {
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
          console.warn("Resident profile API non-OK status:", response.status);
          const cachedName =
            localStorage.getItem("smartgn_user_name") || "Resident";
          const cachedDivision =
            localStorage.getItem("smartgn_user_division") ||
            "Assigned Division";
          const cachedNic =
            localStorage.getItem("smartgn_user_nic") || residentNic || "";
          setProfile((prev) => ({
            ...prev,
            fullName: cachedName,
            division: cachedDivision,
            nic: cachedNic,
          }));
          return;
        }

        const data = await response.json();

        const profileData = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          fullName: data.full_name || "",
          nic: data.r_nic || "",
          occupation: data.occupation || "",
          email: data.email || "",
          mobile: data.mobile_no || "",
          homeAddress: data.home_address || data.household_address || "",
          division: data.division_name || "",
          divisionId: data.division_id || "",
          dob: data.date_of_birth
            ? new Date(data.date_of_birth).toLocaleDateString()
            : "",
          gender: data.gender || "",
          householdNumber: data.household_number || "",
          profilePhoto: data.profile_photo_path || null,
          nicFront: data.nic_front_path || null,
          nicBack: data.nic_back_path || null,
        };

        setProfile(profileData);

        // Show alert if NIC images are missing
        if (!data.nic_front_path || !data.nic_back_path) {
          setShowAlert(true);
        } else {
          setShowAlert(false);
        }

        // Store in localStorage for other components
        localStorage.setItem("smartgn_user_name", data.full_name || "Resident");
        localStorage.setItem("smartgn_user_division", data.division_name || "");
        if (data.r_nic) localStorage.setItem("smartgn_user_nic", data.r_nic);

        setError("");
      } catch (err) {
        console.warn("Error fetching resident profile:", err);
      }
    };

    fetchResidentProfile();
  }, [residentNic, token]);

  // ============================================================
  // FETCH DASHBOARD STATS
  // ============================================================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = getAuthHeaders();

        // Primary: Fetch stats from dedicated endpoint
        const statsRes = await fetch("/api/residents/dashboard-stats", {
          headers,
        });

        if (statsRes.ok) {
          const stats = await statsRes.json();

          console.log("Dashboard stats received:", stats); // Debug log

          // ✅ FIX: Include appointments in total counts
          const pending =
            (stats.certificates?.pending || 0) +
            (stats.appointments?.pending || 0) +
            (stats.allowances?.pending || 0) +
            (stats.disasters?.pending || 0);

          const approved =
            (stats.certificates?.approved || 0) +
            (stats.appointments?.approved || 0) + // ✅ ADDED: Approved appointments
            (stats.allowances?.approved || 0);

          setTotalPendingCount(pending);
          setTotalApprovedCount(approved);
          setUpcomingAppointmentsCount(
            stats.appointments?.upcoming || stats.appointments?.approved || 0,
          );

          // Build recent activity from stats if available
          const activities = [];

          if (stats.certificates?.recent) {
            activities.push(
              ...stats.certificates.recent.map((c) => ({
                id: c.request_id || c.id,
                label: `${c.certificate_type || "Certificate"} Certificate`,
                status: c.status || "Pending",
                date:
                  c.request_date ||
                  c.created_at ||
                  new Date().toISOString().split("T")[0],
                type: "Certificate",
              })),
            );
          }

          if (stats.appointments?.recent) {
            activities.push(
              ...stats.appointments.recent.map((a) => ({
                id: a.appointment_id || a.id,
                label: `Appointment — ${a.purpose || "Meeting"}`,
                status: a.status || "Pending",
                date:
                  a.date ||
                  a.created_at ||
                  new Date().toISOString().split("T")[0],
                type: "Appointment",
              })),
            );
          }

          if (stats.allowances?.recent) {
            activities.push(
              ...stats.allowances.recent.map((al) => ({
                id: al.allowance_id || al.id,
                label: `${al.allowance_type || "Allowance"} Allowance`,
                status: al.status || "Pending",
                date:
                  al.application_date ||
                  al.created_at ||
                  new Date().toISOString().split("T")[0],
                type: "Allowance",
              })),
            );
          }

          setRecentActivities(
            activities
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5),
          );
        } else {
          // Fallback: Fetch individual endpoints
          const [certRes, allowRes, apptRes] = await Promise.all([
            fetch("/api/certificates/resident", { headers }),
            fetch("/api/allowances/resident", { headers }),
            fetch("/api/appointments/resident", { headers }),
          ]);

          const rawCerts = certRes.ok ? await certRes.json() : [];
          const rawAllows = allowRes.ok ? await allowRes.json() : [];
          const rawAppts = apptRes.ok ? await apptRes.json() : [];

          const certs = Array.isArray(rawCerts) ? rawCerts : [];
          const allows = Array.isArray(rawAllows) ? rawAllows : [];
          const appts = Array.isArray(rawAppts) ? rawAppts : [];

          const pending =
            certs.filter((c) => c.status === "Pending").length +
            allows.filter((a) => a.status === "PENDING").length +
            appts.filter((a) => a.status === "Pending").length;

          const approved =
            certs.filter((c) => c.status === "Approved").length +
            allows.filter((a) => a.status === "APPROVED").length +
            appts.filter((a) => a.status === "Approved").length; // ✅ ADDED

          const upcoming = appts.filter((a) => a.status === "Approved").length;

          setTotalPendingCount(pending);
          setTotalApprovedCount(approved);
          setUpcomingAppointmentsCount(upcoming);

          // Build recent activity list
          const activities = [
            ...certs.slice(0, 3).map((c) => ({
              id: c.request_id || c.id,
              label: `${c.certificate_type || "Certificate"} Certificate`,
              status: c.status || "Pending",
              date:
                c.request_date ||
                c.created_at ||
                new Date().toISOString().split("T")[0],
              type: "Certificate",
            })),
            ...appts.slice(0, 3).map((a) => ({
              id: a.appointment_id || a.id,
              label: `Appointment — ${a.purpose || "Meeting"}`,
              status: a.status || "Pending",
              date:
                a.date ||
                a.created_at ||
                new Date().toISOString().split("T")[0],
              type: "Appointment",
            })),
            ...allows.slice(0, 2).map((al) => ({
              id: al.allowance_id || al.id,
              label: `${al.allowance_type || "Allowance"} Allowance`,
              status: al.status || "PENDING",
              date:
                al.application_date ||
                al.created_at ||
                new Date().toISOString().split("T")[0],
              type: "Allowance",
            })),
          ];

          setRecentActivities(
            activities
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5),
          );
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token, refreshKey]); // ✅ Added refreshKey dependency

  // ============================================================
  // REFRESH DASHBOARD (Call this when returning from other pages)
  // ============================================================
  const refreshDashboard = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ============================================================
  // FETCH ANNOUNCEMENTS
  // ============================================================
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("smartgn_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch("/api/residents/announcements", { headers });
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setAnnouncements(data.slice(0, 5));
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching announcements API:", err);
      }

      // Fallback to local synced announcements
      const localSaved = localStorage.getItem("smartgn_announcements");
      if (localSaved) {
        try {
          const list = JSON.parse(localSaved);
          setAnnouncements(list.slice(0, 5));
        } catch (e) {
          console.error("Error parsing local announcements:", e);
        }
      }
    };

    fetchAnnouncements();

    const handleAnnChange = () => fetchAnnouncements();
    window.addEventListener("announcementsUpdated", handleAnnChange);
    window.addEventListener("storage", handleAnnChange);

    return () => {
      window.removeEventListener("announcementsUpdated", handleAnnChange);
      window.removeEventListener("storage", handleAnnChange);
    };
  }, []);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
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
        <AfterlogNavbar />
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
      {/* Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content - Pass all data as props to ResidentDashboardLayout */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <ResidentDashboardLayout
            profile={profile}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            totalPendingCount={totalPendingCount}
            totalApprovedCount={totalApprovedCount}
            upcomingAppointmentsCount={upcomingAppointmentsCount}
            announcements={announcements}
            recentActivities={recentActivities}
            onRefresh={refreshDashboard}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ResidentDashboard;
