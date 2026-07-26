// FamilyMemberTable.jsx
import React from "react";
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
      noMembers: "No family members found.",
    },
    SI: {
      fullName: "සම්පූර්ණ නම",
      nic: "ජා.හැ.අ",
      age: "වයස",
      occupation: "රැකියාව",
      relationship: "ඥාති සම්බන්ධය",
      noMembers: "පවුලේ සාමාජිකයින් නොමැත.",
    },
    TA: {
      fullName: "முழு பெயர்",
      nic: "தேசிய அடையாள அட்டை",
      age: "வயது",
      occupation: "தொழில்",
      relationship: "உறவு",
      noMembers: "குடும்ப உறுப்பினர்கள் எதுவும் இல்லை.",
    },
  };

  const t =
    FamilyMemberTableTranslations[lang] || FamilyMemberTableTranslations.EN;

  // If no members, show a message
  if (members.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500 border border-[#2D37484D] rounded-lg bg-[#F7FAFC]">
        <p className="text-[16px]">{t.noMembers}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-left">
              {t.fullName}
            </th>
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-left">
              {t.nic}
            </th>
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-left">
              {t.age}
            </th>
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-left">
              {t.occupation}
            </th>
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-left">
              {t.relationship}
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr
              key={member.member_id || member.id || index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-[#F7FAFC]"
              } hover:bg-[#EBF1F6] transition-colors duration-150`}
            >
              <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
                {member.name || member.fullName || "-"}
              </td>
              <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
                {member.nic || "-"}
              </td>
              <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
                {member.age || "-"}
              </td>
              <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
                {member.occupation || "-"}
              </td>
              <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
                {member.relationship || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FamilyMemberTable;
