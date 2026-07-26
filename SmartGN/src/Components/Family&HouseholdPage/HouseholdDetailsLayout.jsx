// HouseholdDetailsLayout.jsx
import React from "react";
import { useLanguage } from "../../utils/translate";

function HouseholdDetailsLayout({ HDetails }) {
  const { lang } = useLanguage();

  const HouseholdDetailsLayoutTranslations = {
    EN: {
      householdNumber: "Household Number :",
      address: "Address :",
      sizeLand: "Size of the land :",
      landOwner: "Land Owner :",
      headOfHousehold: "Head of Household :",
    },
    SI: {
      householdNumber: "ගෘහ අංකය :",
      address: "ලිපිනය :",
      sizeLand: "ඉඩමේ ප්‍රමාණය :",
      landOwner: "ඉඩමේ හිමිකරු :",
      headOfHousehold: "ගෘහ ප්‍රධානියා :",
    },
    TA: {
      householdNumber: "வீட்டு எண் :",
      address: "முகவரி :",
      sizeLand: "நில அளவு :",
      landOwner: "நில உரிமையாளர் :",
      headOfHousehold: "வீட்டின் தலைவர் :",
    },
  };

  const t =
    HouseholdDetailsLayoutTranslations[lang] ||
    HouseholdDetailsLayoutTranslations.EN;

  return (
    <div className="flex flex-col gap-[5px] w-full">
      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.householdNumber}</span>
        <span className="font-regular">{HDetails.houseNumber || "-"}</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.headOfHousehold}</span>
        <span className="font-regular">{HDetails.headOfHousehold || "-"}</span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.address}</span>
        <span className="font-regular">
          {HDetails.address || "Not provided"}
        </span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.sizeLand}</span>
        <span className="font-regular">
          {HDetails.landSize || "Not specified"}
        </span>
      </div>

      <div className="text-[16px] text-[#2D3748] flex gap-[5px]">
        <span className="font-medium">{t.landOwner}</span>
        <span className="font-regular">
          {HDetails.landOwner || "Not specified"}
        </span>
      </div>
    </div>
  );
}

export default HouseholdDetailsLayout;
