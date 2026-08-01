// Components/ResidentDashboard/ResidentDashboardLayout.jsx
import React from "react";
import { useLanguage } from "../../utils/translate";
import ResidentCardLayout from "./ResidentCardLayout";
import QuickActions from "./QuickActions";
import Announcements from "./Announcements";
import { useNavigate } from "react-router-dom";

function ResidentDashboardLayout({
  profile = {},
  showAlert = false,
  setShowAlert = () => {},
  totalPendingCount = 0,
  totalApprovedCount = 0,
  upcomingAppointmentsCount = 0,
  announcements = [],
  recentActivities = [],
}) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const DashboardLayoutTranslations = {
    EN: {
      greeting: `Have a Nice Day, ${profile.firstName || "Resident"}!`,
      alert:
        "Please upload a high-quality image of your National Identity Card",
    },
    SI: {
      greeting: `සුභ දවසක්, ${profile.firstName || "නේවාසික"}!`,
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
    },
    TA: {
      greeting: `இனிய நாள், ${profile.firstName || "குடியுரிமை"}!`,
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
    },
  };

  const t = DashboardLayoutTranslations[lang] || DashboardLayoutTranslations.EN;

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
            <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1">
              <div className="flex items-center gap-2">
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => {
                    navigate("/ResidentDashboard/profile");
                  }}
                >
                  {t.alert}
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

      {/* ── Assigned Grama Niladhari Officer Information Card ── */}
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-6 p-6 bg-gradient-to-r from-[#1B365D] via-[#244778] to-[#005BBD] text-white rounded-2xl shadow-md border border-[#D69E2E]/40 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-[#D69E2E] flex items-center justify-center text-[#FFAA00] font-bold text-xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#FFAA00] uppercase tracking-wider bg-[#D69E2E]/20 px-2.5 py-0.5 rounded-full border border-[#D69E2E]/30">
                  Assigned GN Division
                </span>
                <span className="text-xs text-slate-200 font-semibold">
                  {profile.division || localStorage.getItem("smartgn_user_division") || "Colombo, Borella"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 mb-0">
                Grama Niladhari - Officer K.A. Jayasekara
              </h3>
              <p className="text-xs text-slate-300 m-0 mt-0.5 font-medium">
                Official Officer in charge of Division: {profile.division || localStorage.getItem("smartgn_user_division") || "Colombo, Borella"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-slate-200 gap-1 bg-white/10 p-3 rounded-xl border border-white/10 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#FFAA00]">📞 Office Phone:</span>
              <span className="font-bold text-white">011-2691234 / 077-1234567</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#FFAA00]">📍 Office Location:</span>
              <span className="text-white">Divisional Secretariat, Main Rd</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#FFAA00]">🕒 Public Hours:</span>
              <span className="text-emerald-300 font-bold">Mon - Fri (8:30 AM - 4:15 PM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex mx-[30px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
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
      <div className="flex mx-[30px] border border-[#2D37482D] rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] my-[30px] p-[20px]">
        <Announcements announcements={announcements} />
      </div>
    </>
  );
}

export default ResidentDashboardLayout;
