// FamilyHouseholdLayout.jsx
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate";
import FamilyCardLyout from "./FamilyCardLyout";
import editIcon from "../../assets/edit_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import FamilyMemberTable from "./FamilyMemberTable";
import HouseholdDetailsLayout from "./HouseholdDetailsLayout";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/api";

function FamilyHouseholdLayout({ familyMembers = [], householdDetails = {} }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Profile data state
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

  // TRANSLATION OBJECTS
  const FamilyHouseholdLayoutTranslations = {
    EN: {
      Title: "Family and Household details",
      familyMembers: "Family Members",
      editFDetails: "Edit family details",
      householdDetails: "Household Details",
      editHDetails: "Edit household details",
      alert:
        "Please upload a high-quality image of your National Identity Card",
    },
    SI: {
      Title: "පවුල සහ ගෘහ විස්තර",
      familyMembers: "පවුලේ සාමාජිකයින්",
      editFDetails: "පවුලේ විස්තර සංස්කරණය කරන්න",
      householdDetails: "ගෘහ විස්තර",
      editHDetails: "ගෘහ විස්තර සංස්කරණය කරන්න",
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් කාඩ්පතේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
    },
    TA: {
      Title: "குடும்ப மற்றும் வீட்டு விவரங்கள்",
      familyMembers: "குடும்ப உறுப்பினர்கள்",
      editFDetails: "குடும்ப விவரங்களைத் திருத்தவும்",
      householdDetails: "வீட்டு விவரங்கள்",
      editHDetails: "வீட்டு விவரங்களைத் திருத்தவும்",
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
    },
  };

  const t =
    FamilyHouseholdLayoutTranslations[lang] ||
    FamilyHouseholdLayoutTranslations.EN;

  // ✅ Check if NIC images are missing - used for alert
  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  // ✅ Fetch profile to get NIC images
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/residents/profile", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({
            ...prev,
            nic: data.r_nic || "",
            nicFront: data.nic_front_path || null,
            nicBack: data.nic_back_path || null,
          }));

          // ✅ Auto-hide alert if both NIC images exist
          if (data.nic_front_path && data.nic_back_path) {
            setShowAlert(false);
          } else {
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile for NIC images:", error);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      const fetchUpdatedProfile = async () => {
        try {
          const res = await fetch("/api/residents/profile", {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const data = await res.json();
            setProfile((prev) => ({
              ...prev,
              nic: data.r_nic || "",
              nicFront: data.nic_front_path || null,
              nicBack: data.nic_back_path || null,
            }));

            if (data.nic_front_path && data.nic_back_path) {
              setShowAlert(false);
            }
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
        }
      };

      fetchUpdatedProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Calculate stats from familyMembers prop
  const totalMembers = familyMembers.length;
  const adultMembers = familyMembers.filter(
    (m) => parseInt(m.age) >= 18,
  ).length;
  const childrenMembers = familyMembers.filter(
    (m) => parseInt(m.age) < 18,
  ).length;

  return (
    <>
      {/* ── NIC upload alert - ABOVE HEADER ── */}
      {showAlert && areNicImagesMissing() && (
        <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
          <div className="flex flex-wrap items-center justify-between p-2 sm:p-2.5 md:p-[10px] bg-[#fef3c7] border border-[#fde68a] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-lg sm:rounded-xl text-[#d97706] font-medium text-[11px] sm:text-xs md:text-sm lg:text-[14px] text-left w-full transition-shadow duration-300">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <span
                className="hover:underline hover:cursor-pointer truncate"
                onClick={() => {
                  navigate("/ResidentDashboard/profile");
                }}
              >
                {t.alert}
              </span>
            </div>
            <button
              className="bg-transparent border-0 text-[#d97706] cursor-pointer p-0.5 sm:p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] flex-shrink-0 ml-1 sm:ml-2"
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
                className="sm:w-[16px] sm:h-[16px]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
          {t.Title}
        </h2>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px] justify-center">
        <FamilyCardLyout
          Total={totalMembers}
          Adult={adultMembers}
          Children={childrenMembers}
        />
      </div>

      {/* ── Family Members Table ── */}
      <div className="flex flex-col border border-[#2D37482D] p-3 sm:p-4 md:p-5 lg:p-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] rounded-[8px] sm:rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
        <div className="flex w-full justify-between items-center mb-3 sm:mb-[15px]">
          <span className="text-[16px] sm:text-[18px] md:text-[20px] text-[#1B365D] font-medium">
            {t.familyMembers}
          </span>

          <button
            className="flex gap-[6px] sm:gap-[8px] md:gap-[10px] items-center text-[13px] sm:text-[14px] md:text-[16px] text-[#D69E2E] cursor-pointer hover:underline underline-offset-2 whitespace-nowrap"
            onClick={() =>
              navigate("/ResidentDashboard/RHousehold/EditFamilyDetails")
            }
          >
            <img
              src={editIcon}
              alt="editIcon"
              className="h-[14px] sm:h-[16px]"
            />
            {t.editFDetails}
          </button>
        </div>

        <div className="flex w-full overflow-x-auto">
          <FamilyMemberTable members={familyMembers} />
        </div>
      </div>

      {/* ── Household Details ── */}
      <div className="flex flex-col gap-[6px] sm:gap-[8px] md:gap-[10px] border border-[#2D37482D] p-3 sm:p-4 md:p-5 lg:p-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] rounded-[8px] sm:rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
        <div className="flex w-full justify-between items-center mb-3 sm:mb-[15px]">
          <span className="text-[16px] sm:text-[18px] md:text-[20px] text-[#1B365D] font-medium">
            {t.householdDetails}
          </span>

          <button
            className="flex gap-[6px] sm:gap-[8px] md:gap-[10px] items-center text-[13px] sm:text-[14px] md:text-[16px] text-[#D69E2E] cursor-pointer hover:underline underline-offset-2 whitespace-nowrap"
            onClick={() =>
              navigate("/ResidentDashboard/RHousehold/EditHouseholdDetails")
            }
          >
            <img
              src={editIcon}
              alt="editIcon"
              className="h-[14px] sm:h-[16px]"
            />
            {t.editHDetails}
          </button>
        </div>

        <div className="flex w-full">
          <HouseholdDetailsLayout HDetails={householdDetails} />
        </div>
      </div>
    </>
  );
}

export default FamilyHouseholdLayout;
