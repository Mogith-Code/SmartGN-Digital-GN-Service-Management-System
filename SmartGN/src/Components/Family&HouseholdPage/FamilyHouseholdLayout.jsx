// FamilyHouseholdLayout.jsx
import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import FamilyCardLyout from "./FamilyCardLyout";
import editIcon from "../../assets/edit_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import FamilyMemberTable from "./FamilyMemberTable";
import HouseholdDetailsLayout from "./HouseholdDetailsLayout";
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
        <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
          {t.Title}
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

      {/* Pass calculated stats to FamilyCardLyout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <FamilyCardLyout
          Total={totalMembers}
          Adult={adultMembers}
          Children={childrenMembers}
        />
      </div>

      {/* Family Members Table */}
      <div className="flex flex-col border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px]">
        <div className="flex w-full justify-between items-center mb-[15px]">
          <span className="text-[20px] text-[#1B365D] font-medium">
            {t.familyMembers}
          </span>

          <button
            className="flex gap-[10px] items-center text-[16px] text-[#D69E2E] cursor-pointer hover:underline underline-offset-2"
            onClick={() =>
              navigate("/ResidentDashboard/RHousehold/EditFamilyDetails")
            }
          >
            <img src={editIcon} alt="editIcon" className="h-[16px]" />
            {t.editFDetails}
          </button>
        </div>

        <div className="flex">
          <FamilyMemberTable members={familyMembers} />
        </div>
      </div>

      {/* Household Details */}
      <div className="flex flex-col gap-[10px] border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px]">
        <div className="flex w-full justify-between items-center mb-[15px]">
          <span className="text-[20px] text-[#1B365D] font-medium">
            {t.householdDetails}
          </span>

          <button
            className="flex gap-[10px] items-center text-[16px] text-[#D69E2E] cursor-pointer hover:underline underline-offset-2"
            onClick={() =>
              navigate("/ResidentDashboard/RHousehold/EditHouseholdDetails")
            }
          >
            <img src={editIcon} alt="editIcon" className="h-[16px]" />
            {t.editHDetails}
          </button>
        </div>

        <div className="flex">
          <HouseholdDetailsLayout HDetails={householdDetails} />
        </div>
      </div>
    </>
  );
}

export default FamilyHouseholdLayout;
