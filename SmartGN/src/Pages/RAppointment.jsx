// src/pages/RAppointment.jsx
import React, { useState, useEffect } from "react";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import AppointmentLayoutPage from "../Components/AppointmentsPage/AppointmentLayoutPage";
import Footer from "../Components/Common/Footer";

function RAppointment({ onOpenHelp }) {
  // State for counts
  const [appointments, setAppointments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get resident NIC and token from localStorage
  const residentNic = localStorage.getItem("smartgn_user_id");
  const token = localStorage.getItem("smartgn_token");

  // Fetch counts when component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      // Check if token exists
      if (!token) {
        console.log("No token found, user might not be logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch("/api/appointments/residentcounts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error("Failed to fetch appointment counts");
        }

        const data = await response.json();

        // Update state with the counts
        setPendingCount(data.pending || 0);
        setApprovedCount(data.approved || 0);

        console.log("Appointment counts fetched:", {
          pending: data.pending,
          approved: data.approved,
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointment counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [token]); // Re-run if token changes

  // EFFECT 2: Fetch all appointments (for calendar and display)
  // ============================================================
  useEffect(() => {
    const fetchAppointments = async () => {
      // Check if token exists
      if (!token) {
        console.log("No token found, user might not be logged in");
        setLoading(false);
        return;
      }

      if (!residentNic) {
        console.log("No resident NIC found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/appointments/rappointments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();

        if (data.success) {
          // Update state with appointments
          setAppointments(data.appointments || []);

          console.log("Appointments fetched:", {
            total: data.appointments?.length || 0,
            pending: data.counts?.pending || 0,
            approved: data.counts?.approved || 0,
          });
        } else {
          throw new Error(data.error || "Failed to fetch appointments");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, residentNic]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
            <p className="mt-4 text-[#1B365D]">Loading appointments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state (optional - you can also just show the page with zeros)
  if (error) {
    // You might want to show a toast notification instead
    console.error("Appointment error:", error);
    // Continue rendering with zero counts
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content - Pass counts as props */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <AppointmentLayoutPage
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            appointments={appointments}
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

export default RAppointment;
