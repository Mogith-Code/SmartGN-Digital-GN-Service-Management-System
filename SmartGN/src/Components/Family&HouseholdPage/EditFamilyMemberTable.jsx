import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import editIcon from "../../assets/edit_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../../assets/delete_24dp_E7000B_FILL0_wght400_GRAD0_opsz24.svg";
import saveIcon from "../../assets/save_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_E7000B_FILL0_wght400_GRAD0_opsz24.svg";

function EditFamilyMemberTable({ Editmembers = [] }) {
  const { lang } = useLanguage();

  // State to track edit mode for each member
  const [editMode, setEditMode] = useState({});

  // State to store edited values
  const [editedMembers, setEditedMembers] = useState(Editmembers);

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

  // ============================================================================
  // HANDLE EDIT BUTTON CLICK
  // ============================================================================
  const handleEditClick = (memberId) => {
    setEditMode((prev) => ({
      ...prev,
      [memberId]: true,
    }));
  };

  // ============================================================================
  // HANDLE SAVE BUTTON CLICK
  // ============================================================================
  const handleSaveClick = (memberId) => {
    setEditMode((prev) => ({
      ...prev,
      [memberId]: false,
    }));
    console.log("Saved member:", memberId);
  };

  // ============================================================================
  // HANDLE CANCEL BUTTON CLICK
  // ============================================================================
  const handleCancelClick = (memberId) => {
    setEditMode((prev) => ({
      ...prev,
      [memberId]: false,
    }));
    console.log("Cancelled editing for member:", memberId);
  };

  // ============================================================================
  // HANDLE INPUT CHANGE
  // ============================================================================
  const handleInputChange = (memberId, field, value) => {
    setEditedMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, [field]: value } : member,
      ),
    );
  };

  // ============================================================================
  // RENDER EDITABLE ROW
  // ============================================================================
  const renderEditableRow = (member) => {
    return (
      <tr key={member.id}>
        <td className="text-[16px] text-[#2D3748] bg-[#E2E8F0] border border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.fullName}
            onChange={(e) =>
              handleInputChange(member.id, "fullName", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] rounded px-[px] py-[5px]"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] bg-[#E2E8F0] border border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.nic}
            onChange={(e) =>
              handleInputChange(member.id, "nic", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] rounded"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="number"
            value={member.age}
            onChange={(e) =>
              handleInputChange(member.id, "age", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] rounded"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.occupation}
            onChange={(e) =>
              handleInputChange(member.id, "occupation", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] rounded"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.relationship}
            onChange={(e) =>
              handleInputChange(member.id, "relationship", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] rounded"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
          <div className="flex gap-[20px] ml-[20px] items-center justify-center">
            {/* Save Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleSaveClick(member.id)}
            >
              <img
                src={saveIcon}
                alt="saveIcon"
                className="w-[30px] h-[30px]"
              />
            </button>
            {/* Cancel Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleCancelClick(member.id)}
            >
              <img
                src={cancelIcon}
                alt="cancelIcon"
                className="w-[30px] h-[30px]"
              />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // ============================================================================
  // RENDER VIEW ROW
  // ============================================================================
  const renderViewRow = (member) => {
    return (
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
        <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
          <div className="flex gap-[20px] ml-[30px]items-center justify-center">
            {/* Edit Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleEditClick(member.id)}
            >
              <img
                src={editIcon}
                alt="editIcon"
                className="w-[20px] h-[20px]"
              />
            </button>
            {/* Delete Button */}
            <button className="cursor-pointer hover:scale-110 transition-transform">
              <img
                src={deleteIcon}
                alt="deleteIcon"
                className="w-[20px] h-[20px]"
              />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================
  return (
    <div className="flex w-full gap-[30px]">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
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
            {editedMembers.map((member) =>
              editMode[member.id]
                ? renderEditableRow(member)
                : renderViewRow(member),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditFamilyMemberTable;
