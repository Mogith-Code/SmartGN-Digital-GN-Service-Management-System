import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import { getAuthHeaders } from "../../utils/api";
import ResidentCardLayout from "./ResidentCardLayout";
import QuickActions from "./QuickActions";
import Announcements from "./Announcements";

function ResidentDashboardLayout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // ============================================================
  // STATE DECLARATIONS
  // ============================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  // Profile data from database
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    nic: "",
    occupation: "",
    email: "",
    mobile: "",
    address: "",
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

  // Get resident NIC from localStorage
  const residentNic = localStorage.getItem("smartgn_user_id");
  const token = localStorage.getItem("smartgn_token");

  // ============================================================
  // FETCH PROFILE DATA
  // ============================================================
  useEffect(() => {
    const fetchResidentProfile = async () => {
      if (!token || !residentNic) {
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
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          fullName: data.full_name || "",
          nic: data.r_nic || "",
          occupation: data.occupation || "",
          email: data.email || "",
          mobile: data.mobile_no || "",
          address:
            data.permanent_address ||
            data.current_address ||
            data.household_address ||
            "",
          division: data.division_name || "",
          dob: data.date_of_birth
            ? new Date(data.date_of_birth).toLocaleDateString()
            : "",
          gender: data.gender || "",
          householdNumber: data.household_number || "",
          profilePhoto: data.profile_photo_path || null,
          nicFront: data.nic_front_path || null,
          nicBack: data.nic_back_path || null,
        });

        // Show alert if NIC images are missing
        if (!data.nic_front_path || !data.nic_back_path) {
          setShowAlert(true);
        } else {
          setShowAlert(false);
        }

        // Store in localStorage for other components
        localStorage.setItem("smartgn_user_name", data.full_name || "Resident");
        localStorage.setItem("smartgn_user_division", data.division_name || "");
        localStorage.setItem("smartgn_user_nic", data.r_nic || "");

        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      }
    };

    fetchResidentProfile();
  }, [residentNic, token, navigate]);

  // ============================================================
  // FETCH DASHBOARD STATS
  // ============================================================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) return;

      try {
        const headers = getAuthHeaders();

        // Primary: Fetch stats from dedicated endpoint
        const statsRes = await fetch("/api/residents/dashboard-stats", {
          headers,
        });
        if (statsRes.ok) {
          const stats = await statsRes.json();

          const pending =
            (stats.certificates?.pending || 0) +
            (stats.appointments?.pending || 0) +
            (stats.allowances?.pending || 0) +
            (stats.disasters?.pending || 0);

          const approved =
            (stats.certificates?.approved || 0) +
            (stats.allowances?.approved || 0);

          setTotalPendingCount(pending);
          setTotalApprovedCount(approved);
          setUpcomingAppointmentsCount(
            stats.appointments?.upcoming || stats.appointments?.approved || 0,
          );
        } else {
          // Fallback: Fetch individual endpoints
          const [certRes, allowRes, apptRes] = await Promise.all([
            fetch("/api/certificates/resident", { headers }),
            fetch("/api/allowances/resident", { headers }),
            fetch("/api/appointments/resident", { headers }),
          ]);

          const certs = certRes.ok ? await certRes.json() : [];
          const allows = allowRes.ok ? await allowRes.json() : [];
          const appts = apptRes.ok ? await apptRes.json() : [];

          const pending =
            certs.filter((c) => c.status === "Pending").length +
            allows.filter((a) => a.status === "PENDING").length +
            appts.filter((a) => a.status === "Pending").length;

          const approved =
            certs.filter((c) => c.status === "Approved").length +
            allows.filter((a) => a.status === "APPROVED").length;

          const upcoming = appts.filter((a) => a.status === "Approved").length;

          setTotalPendingCount(pending);
          setTotalApprovedCount(approved);
          setUpcomingAppointmentsCount(upcoming);

          // Build recent activity list
          const activities = [
            ...certs.slice(0, 3).map((c) => ({
              id: c.request_id,
              label: `${c.certificate_type} Certificate`,
              status: c.status,
              date: c.request_date,
              type: "Certificate",
            })),
            ...appts.slice(0, 3).map((a) => ({
              id: a.appointment_id,
              label: `Appointment — ${a.purpose}`,
              status: a.status,
              date: a.date,
              type: "Appointment",
            })),
            ...allows.slice(0, 2).map((al) => ({
              id: al.allowance_id,
              label: `${al.allowance_type} Allowance`,
              status: al.status,
              date: al.application_date,
              type: "Allowance",
            })),
          ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

          setRecentActivities(activities);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  // ============================================================
  // FETCH ANNOUNCEMENTS
  // ============================================================
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements");
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "approve")
      return "text-green-600 bg-green-50 border-green-200";
    if (s === "rejected" || s === "reject")
      return "text-red-600 bg-red-50 border-red-200";
    if (s === "completed" || s === "complete")
      return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  // ============================================================
  // TRANSLATIONS
  // ============================================================
  const DashboardLayoutTranslations = {
    EN: {
      greeting: `Have a Nice Day, ${profile.firstName || "Resident"}!`,
    },
    SI: {
      greeting: `සුභ දවසක්, ${profile.firstName || "නේවාසික"}!`,
    },
    TA: {
      greeting: `இனிய நாள், ${profile.firstName || "குடியுரிமை"}!`,
    },
  };

  const t = DashboardLayoutTranslations[lang] || DashboardLayoutTranslations.EN;

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B365D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error) {
    return (
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
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* ── Header ── */}
      <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
        <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
          {t.greeting}
        </h2>

        {/* NIC upload alert */}
        <div className="flex justify-end -mt-[70px]">
          {showAlert && profile.nic && (
            <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1">
              <div className="flex items-center gap-2">
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => {
                    navigate("/ResidentDashboard/profile");
                  }}
                >
                  Please upload a high-quality image of your National Identity
                  Card
                </span>
              </div>
              <button
                className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1 ml-3"
                onClick={() => setShowAlert(false)}
                aria-label="Close Warning"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] justify-center">
        <ResidentCardLayout
          totalPendingCount={totalPendingCount}
          totalApprovedCount={totalApprovedCount}
          upcomingAppointmentsCount={upcomingAppointmentsCount}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex mx-[30px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px]">
        <QuickActions />
      </div>

      {/* ── Recent Activity ── */}
      {recentActivities.length > 0 && (
        <div className="mx-[30px] border border-[#2D37482D] rounded-[15px] mt-[20px] p-[20px]">
          <h3 className="text-[18px] font-medium text-[#1B365D] mb-4">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-2">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex justify-between items-center p-3 bg-[#F7FAFC] rounded-lg border border-[#2D37482D]"
              >
                <div>
                  <div className="text-sm font-medium text-[#2D3748]">
                    {act.label}
                  </div>
                  <div className="text-xs text-[#2D374880]">
                    {act.type} · {act.date}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor(act.status)}`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Announcements ── */}
      <div className="flex mx-[30px] border border-[#2D37482D] rounded-[15px] my-[30px] p-[20px]">
        <Announcements announcements={announcements} />
      </div>
    </>
  );
}

export default ResidentDashboardLayout;
