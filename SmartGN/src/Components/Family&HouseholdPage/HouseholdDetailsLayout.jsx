import React from "react";
import { useLanguage } from "../../utils/translate";

function HouseholdDetailsLayout({ HDetails }) {
  const { lang } = useLanguage();

  const HouseholdDetailsLayoutTranslations = {
    EN: {
      householdNmber: "Household Number :",
      address: "Address :",
      sizeLand: "Size of the land :",
      landOwner: "Land Owner :",
    },
    SI: {
      householdNmber: "ගෘහ අංකය :",
      address: "ලිපිනය :",
      sizeLand: "ඉඩමේ ප්‍රමාණය :",
      landOwner: "ඉඩමේ හිමිකරු :",
    },
    TA: {
      householdNmber: "Household Number :",
      address: "Address :",
      sizeLand: "Size of the land :",
      landOwner: "Land Owner :",
    },
  };

  const t =
    HouseholdDetailsLayoutTranslations[lang] ||
    HouseholdDetailsLayoutTranslations.EN;
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.householdNmber}</span>
        <span className="font-regular">{HDetails.houseNumber}</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.address}</span>
        <span className="font-regular">{HDetails.address}</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.sizeLand}</span>
        <span className="font-regular">{HDetails.landSize}</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.landOwner}</span>
        <span className="font-regular">{HDetails.landOwner}</span>
      </div>
    </div>
  );
}

export default HouseholdDetailsLayout;
