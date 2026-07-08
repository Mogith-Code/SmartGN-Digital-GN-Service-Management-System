import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import FamilyCardLyout from "./FamilyCardLyout";
import editIcon from "../../assets/edit_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import FamilyMemberTable from "./FamilyMemberTable";
import HouseholdDetailsLayout from "./HouseholdDetailsLayout";
import { useNavigate } from "react-router-dom";

function FamilyHouseholdLayout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const FamilyHouseholdLayoutTranslations = {
    EN: {
      Title: "Family and Household details",
      familyMembers: "Family Members",
      editFDetails: "Edit family details",
      householdDetails: "Household Details",
      editHDetails: "Edit household details",
    },
    SI: {
      Title: "පවුල සහ ගෘහ විස්තර",
      familyMembers: "පවුලේ සාමාජිකයින්",
      editFDetails: "පවුලේ විස්තර සංස්කරණය කරන්න",
      householdDetails: "ගෘහ විස්තර",
      editHDetails: "ගෘහ විස්තර සංස්කරණය කරන්න",
    },
    TA: {
      Title: "குடும்ப மற்றும் வீட்டு விவரங்கள்",
      familyMembers: "පවුලේ සාමාජිකයින්",
      editFDetails: "පවුලේ විස්තර සංස්කරණය කරන්න",
      householdDetails: "ගෘහ විස්තර",
      editHDetails: "ගෘහ විස්තර සංස්කරණය කරන්න",
    },
  };

  const t =
    FamilyHouseholdLayoutTranslations[lang] ||
    FamilyHouseholdLayoutTranslations.EN;

  const [members, setEditmembers] = useState([
    {
      id: 1,
      fullName: "Dissanayake Mudiyanselage Nimal Perera",
      nic: "197215644896",
      age: 54,
      occupation: "Government Officer",
      relationship: "Father",
    },
    {
      id: 2,
      fullName: "Warapitiyage Lakshan Janith Chamodya Warapitiya",
      nic: "200314611639",
      age: 23,
      occupation: "None",
      relationship: "Son",
    },
  ]);

  const [householdDetails, setHouseholdDetails] = useState({
    houseNumber: "123456",
    address: "Colombo",
    landSize: "2 acres",
    landOwner: "Kumara",
  });
  // Calculate dynamic stats
  const totalMembers = members.length;
  const adultMembers = members.filter((m) => parseInt(m.age) >= 18).length;
  const childrenMembers = members.filter((m) => parseInt(m.age) < 18).length;
  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <FamilyCardLyout
          Total={totalMembers}
          Adult={adultMembers}
          Children={childrenMembers}
        />
      </div>

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
          <FamilyMemberTable members={members} />
        </div>
      </div>

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
