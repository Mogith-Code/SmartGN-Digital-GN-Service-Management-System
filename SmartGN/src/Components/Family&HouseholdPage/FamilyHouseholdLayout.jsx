import React from "react";
import { useLanguage } from "../../utils/translate";
import FamilyCardLyout from "./FamilyCardLyout";
import editIcon from "../../assets/edit_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import FamilyMemberTable from "./FamilyMemberTable";

function FamilyHouseholdLayout() {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const FamilyHouseholdLayoutTranslations = {
    EN: { Title: "Family and Household details" },
    SI: { Title: "පවුල සහ ගෘහ විස්තර" },
    TA: { Title: "குடும்ப மற்றும் வீட்டு விவரங்கள்" },
  };

  const t =
    FamilyHouseholdLayoutTranslations[lang] ||
    FamilyHouseholdLayoutTranslations.EN;

  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[75px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <FamilyCardLyout />
      </div>

      <div className="flex flex-col border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px]">
        <div className="flex w-full justify-between items-center mb-[15px]">
          <span className="text-[20px] text-[#1B365D] font-medium">
            Family Members
          </span>

          <button className="flex gap-[10px] items-center text-[16px] text-[#D69E2E] cursor-pointer">
            <img src={editIcon} alt="editIcon" className="h-[16px]" />
            Edit family details
          </button>
        </div>

        <div className="flex">
          <FamilyMemberTable />
        </div>
      </div>

      <div className="flex flex-col border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px]">
        <div className="flex w-full justify-between items-center mb-[15px]">
          <span className="text-[20px] text-[#1B365D] font-medium">
            Household Details
          </span>

          <button className="flex gap-[10px] items-center text-[16px] text-[#D69E2E] cursor-pointer">
            <img src={editIcon} alt="editIcon" className="h-[16px]" />
            Edit household details
          </button>
        </div>
      </div>
    </>
  );
}

export default FamilyHouseholdLayout;
