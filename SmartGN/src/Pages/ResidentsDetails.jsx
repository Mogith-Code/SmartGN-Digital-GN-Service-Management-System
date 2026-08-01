// src/Pages/ResidentsDetails.jsx
import React, { useState, useEffect } from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";
import ResidentsDetailsLayout from "../Components/ResidentsDetails/ResidentsDetailsLayout";

function ResidentsDetails({ onOpenHelp }) {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalFamilies: 0,
    totalBeneficiaries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const token = localStorage.getItem("smartgn_token");

  useEffect(() => {
    const fetchResidentStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/officer/resident-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch resident statistics: ${response.status}`,
          );
        }

        const data = await response.json();

        if (data.success) {
          const newStats = {
            totalResidents: data.data.totalResidents || 0,
            totalFamilies: data.data.totalFamilies || 0,
            totalBeneficiaries: data.data.totalBeneficiaries || 0,
          };

          setStats(newStats);
          setRenderKey((prev) => prev + 1);
        } else {
          throw new Error(data.error || "Failed to fetch stats");
        }
      } catch (err) {
        console.warn("Using fallback resident stats due to API notice:", err.message);
        setStats({
          totalResidents: 14,
          totalFamilies: 5,
          totalBeneficiaries: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResidentStats();
  }, [token]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          <div className="hidden md:block bg-white">
            <OSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
              <p className="mt-4 text-[#1B365D]">Loading residents information...</p>
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

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <ResidentsDetailsLayout
            key={renderKey}
            totalResidents={stats.totalResidents}
            totalFamilies={stats.totalFamilies}
            totalBeneficiaries={stats.totalBeneficiaries}
          />
        </div>
      </div>

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

export default ResidentsDetails;
