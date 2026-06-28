import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import editIcon from "../../assets/edit_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../../assets/delete_24dp_E7000B_FILL0_wght400_GRAD0_opsz24.svg";

function EditFamilyMemberTable({ Editmembers = [] }) {
  const { lang } = useLanguage();

  const EditFamilyMemberTableTranslations = {
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
    EditFamilyMemberTableTranslations[lang] ||
    EditFamilyMemberTableTranslations.EN;
  return (
    <div className="flex w-full gap-[30px]">
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
          {Editmembers.map((member) => (
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
              <div className="flex gap-[20px] ml-[30px] items-center">
                <button className="cursor-pointer hover:scale-120">
                  <img
                    src={editIcon}
                    alt="editIcon"
                    className="w-[20px] h-[20px]"
                  />
                </button>

                <button className="cursor-pointer hover:scale-120">
                  <img
                    src={deleteIcon}
                    alt="deleteIcon"
                    className="w-[20px] h-[20px]"
                  />
                </button>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditFamilyMemberTable;
