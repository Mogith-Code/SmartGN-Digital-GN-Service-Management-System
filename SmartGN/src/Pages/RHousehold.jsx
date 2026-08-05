// RHousehold.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import FamilyHouseholdLayout from "../Components/Family&HouseholdPage/FamilyHouseholdLayout";
import { getAuthHeaders } from "../utils/api";

function RHousehold({ onOpenHelp }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);

  // State for household details
  const [householdDetails, setHouseholdDetails] = useState({
    houseNumber: "",
    address: "",
    landSize: "",
    landOwner: "",
    totalMembers: 0,
    headOfHousehold: "",
  });

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");

  // ============================================================
  // FETCH FAMILY MEMBERS
  // ============================================================
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("/api/residents/family", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("smartgn_token");
            localStorage.removeItem("smartgn_user_id");
            localStorage.removeItem("smartgn_user_role");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch family members");
        }

        const data = await response.json();
        setFamilyMembers(data);
        setError("");
      } catch (err) {
        console.error("Error fetching family members:", err);
        setError("Failed to load family members");
      }
    };

    fetchFamilyMembers();
  }, [token, navigate]);

  // ============================================================
  // FETCH HOUSEHOLD DETAILS
  // ============================================================
  useEffect(() => {
    const fetchHouseholdDetails = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/residents/household", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setHouseholdDetails({
            houseNumber: data.household_number || "",
            address: data.address || "Not provided",
            landSize: data.land_size || "Not specified",
            landOwner: data.land_owner || "Not specified",
            totalMembers: data.total_members || 0,
            headOfHousehold: data.head_of_household || "",
          });
        }
        setError("");
      } catch (err) {
        console.error("Error fetching household details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholdDetails();
  }, [token]);

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
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              Loading your household details...
            </p>
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
        <div className="flex flex-col justify-center items-center h-64 px-4">
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
      <AfterlogNavbar />
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <FamilyHouseholdLayout
            familyMembers={familyMembers}
            householdDetails={householdDetails}
          />
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default RHousehold;
