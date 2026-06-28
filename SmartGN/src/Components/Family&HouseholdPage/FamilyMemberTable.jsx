import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";

function FamilyMemberTable({ members = [] }) {
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
        {members.map((member) => (
          <tr key={member.id}>
            <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
              {member.fullName}
            </td>
            <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
              {member.nic}
            </td>
            <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
              {member.age}
            </td>
            <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
              {member.occupation}
            </td>
            <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
              {member.relationship}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FamilyMemberTable;
