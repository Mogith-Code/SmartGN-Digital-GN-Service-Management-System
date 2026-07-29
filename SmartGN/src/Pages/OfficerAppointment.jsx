// src/Pages/OfficerAppointment.jsx
import React, { useState, useEffect } from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";
import OfficerAppointmentsLayoutPage from "../Components/AppointmentsPage/OfficerAppointmentsLayoutPage";

function OfficerAppointment({ onOpenHelp }) {
  // State for appointment counts
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [tomorrowCount, setTomorrowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");
  const gnId = localStorage.getItem("smartgn_user_id");

  // Fetch appointment counts
  useEffect(() => {
    const fetchAppointmentCounts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch("/api/appointments/officercounts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error("Failed to fetch appointment counts");
        }

        const data = await response.json();

        if (data.success) {
          setPendingCount(data.pending || 0);
          setApprovedCount(data.approved || 0);
          setTomorrowCount(data.tomorrow || 0);

          console.log("Officer appointment counts:", {
            pending: data.pending,
            approved: data.approved,
            tomorrow: data.tomorrow,
            total: data.total,
          });
        } else {
          throw new Error(data.error || "Failed to fetch counts");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointment counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentCounts();
  }, [token, gnId]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
            <p className="mt-4 text-[#1B365D]">Loading appointments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-600 font-semibold mb-2">
                Error loading appointments
              </p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        {/* Main Content - Pass counts as props */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <OfficerAppointmentsLayoutPage
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            tomorrowCount={tomorrowCount}
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

export default OfficerAppointment;
