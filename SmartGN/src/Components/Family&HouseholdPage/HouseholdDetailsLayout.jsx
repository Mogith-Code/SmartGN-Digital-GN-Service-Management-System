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

  const details = [
    { label: t.householdNumber, value: HDetails.houseNumber || "-" },
    { label: t.address, value: HDetails.address || "Not provided" },
    { label: t.sizeLand, value: HDetails.landSize || "Not specified" },
    { label: t.landOwner, value: HDetails.landOwner || "Not specified" },
  ];

  return (
    <div className="flex flex-col gap-[4px] sm:gap-[5px] w-full">
      {details.map((detail, index) => (
        <div
          key={index}
          className="text-[14px] sm:text-[15px] md:text-[16px] text-[#2D3748] flex flex-col sm:flex-row gap-0.5 sm:gap-[5px]"
        >
          <span className="font-medium">{detail.label}</span>
          <span className="font-regular break-words">{detail.value}</span>
        </div>
      ))}
    </div>
  );
}

export default HouseholdDetailsLayout;
