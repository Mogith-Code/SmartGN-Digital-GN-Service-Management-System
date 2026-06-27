import React from "react";
import { useLanguage } from "../../utils/translate";

function HouseholdDetailsLayout() {
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
        <span className="font-regular">123456</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.address}</span>
        <span className="font-regular">Colombo</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.sizeLand}</span>
        <span className="font-regular">2 acres</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.landOwner}</span>
        <span className="font-regular">Kumara</span>
      </div>
    </div>
  );
}

export default HouseholdDetailsLayout;
