import React from "react";
import { useLanguage } from "../../utils/translate";

function FamilyMemberTable() {
  const { lang } = useLanguage();

  const FamilyMemberTableTranslations = {
    EN: {
      fullName: "Full Name",
      nic: "NIC",
      age: "Age",
      occupation: "Occupation",
      relationship: "Relationship",
    },
    SI: {
      fullName: "සම්පූර්ණ නම",
      nic: "ජා.හැ.අ",
      age: "වයස",
      occupation: "රැකියාව",
      relationship: "ඥාති සම්බන්ධය",
    },
    TA: {
      fullName: "Full Name",
      nic: "NIC",
      age: "Age",
      occupation: "Occupation",
      relationship: "Relationship",
    },
  };

  const t =
    FamilyMemberTableTranslations[lang] || FamilyMemberTableTranslations.EN;
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px]">
            {t.fullName}
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px]">
            {t.nic}
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px]">
            {t.age}
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px]">
            {t.occupation}
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px]">
            {t.relationship}
          </th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Dissanayake Mudiyanselage Nimal Perera
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            197215644896
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            54
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Government Officer
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Father
          </td>
        </tr>
        <tr>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Warapitiyage Lakshan Janith Chamodya Warapitiya
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            200314611639
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            23
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            None
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Son
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default FamilyMemberTable;
