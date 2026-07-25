// EditFamilyMemberTable.jsx
import React, { useState } from "react";
import { useLanguage } from "../../utils/translate";
import editIcon from "../../assets/edit_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "../../assets/delete_24dp_E7000B_FILL0_wght400_GRAD0_opsz24.svg";
import saveIcon from "../../assets/save_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_E7000B_FILL0_wght400_GRAD0_opsz24.svg";

function EditFamilyMemberTable({
  members = [],
  onUpdateMember,
  onDeleteMember,
  onRefresh,
}) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState({});

  // State to track edit mode for each member
  const [editMode, setEditMode] = useState({});

  // State to store edited values
  const [editedMembers, setEditedMembers] = useState(members);

  // Update edited members when props change
  React.useEffect(() => {
    setEditedMembers(members);
  }, [members]);

  const EditFamilyMemberTableTranslations = {
    EN: {
      fullName: "Full Name",
      nic: "NIC",
      age: "Age",
      occupation: "Occupation",
      relationship: "Relationship",
      actions: "Actions",
      noMembers: "No family members found.",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
    },
    SI: {
      fullName: "සම්පූර්ණ නම",
      nic: "ජා.හැ.අ",
      age: "වයස",
      occupation: "රැකියාව",
      relationship: "ඥාති සම්බන්ධය",
      actions: "ක්‍රියා",
      noMembers: "පවුලේ සාමාජිකයින් නොමැත.",
      save: "සුරකින්න",
      cancel: "අවලංගු කරන්න",
      edit: "සංස්කරණය",
      delete: "මකන්න",
    },
    TA: {
      fullName: "முழு பெயர்",
      nic: "தேசிய அடையாள அட்டை",
      age: "வயது",
      occupation: "தொழில்",
      relationship: "உறவு",
      actions: "செயல்கள்",
      noMembers: "குடும்ப உறுப்பினர்கள் எதுவும் இல்லை.",
      save: "சேமி",
      cancel: "ரத்து செய்",
      edit: "திருத்து",
      delete: "நீக்கு",
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
  const handleSaveClick = async (memberId) => {
    const member = editedMembers.find(
      (m) => m.id === memberId || m.member_id === memberId,
    );
    if (!member) return;

    setLoading((prev) => ({ ...prev, [memberId]: true }));

    try {
      const dataToUpdate = {
        name: member.name || member.fullName,
        age: member.age,
        relationship: member.relationship,
        nic: member.nic || null,
        occupation: member.occupation || null,
      };

      await onUpdateMember(memberId, dataToUpdate);
      setEditMode((prev) => ({
        ...prev,
        [memberId]: false,
      }));
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  // ============================================================================
  // HANDLE CANCEL BUTTON CLICK
  // ============================================================================
  const handleCancelClick = (memberId) => {
    // Reset to original data
    const originalMember = members.find(
      (m) => m.id === memberId || m.member_id === memberId,
    );
    if (originalMember) {
      setEditedMembers((prev) =>
        prev.map((m) =>
          m.id === memberId || m.member_id === memberId
            ? { ...originalMember }
            : m,
        ),
      );
    }
    setEditMode((prev) => ({
      ...prev,
      [memberId]: false,
    }));
  };

  // ============================================================================
  // HANDLE INPUT CHANGE
  // ============================================================================
  const handleInputChange = (memberId, field, value) => {
    setEditedMembers((prev) =>
      prev.map((member) =>
        member.id === memberId || member.member_id === memberId
          ? { ...member, [field]: value }
          : member,
      ),
    );
  };

  // ============================================================================
  // HANDLE DELETE
  // ============================================================================
  const handleDeleteClick = (memberId) => {
    onDeleteMember(memberId);
  };

  // ============================================================================
  // GET MEMBER ID
  // ============================================================================
  const getMemberId = (member) => {
    return member.member_id || member.id;
  };

  // ============================================================================
  // RENDER EDITABLE ROW
  // ============================================================================
  const renderEditableRow = (member) => {
    const memberId = getMemberId(member);
    const isLoading = loading[memberId];

    return (
      <tr key={memberId}>
        <td className="text-[16px] text-[#2D3748] bg-[#E2E8F0] border border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.name || member.fullName || ""}
            onChange={(e) =>
              handleInputChange(memberId, "name", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#1B365D] rounded px-2 py-1"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] bg-[#E2E8F0] border border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.nic || ""}
            onChange={(e) => handleInputChange(memberId, "nic", e.target.value)}
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#1B365D] rounded px-2 py-1"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="number"
            value={member.age || ""}
            onChange={(e) => handleInputChange(memberId, "age", e.target.value)}
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#1B365D] rounded px-2 py-1"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.occupation || ""}
            onChange={(e) =>
              handleInputChange(memberId, "occupation", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#1B365D] rounded px-2 py-1"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border bg-[#E2E8F0] border-[#2D37484D] px-[10px] py-[5px]">
          <input
            type="text"
            value={member.relationship || ""}
            onChange={(e) =>
              handleInputChange(memberId, "relationship", e.target.value)
            }
            className="w-full bg-[#E2E8F0] border-none focus:outline-none focus:ring-2 focus:ring-[#1B365D] rounded px-2 py-1"
          />
        </td>
        <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
          <div className="flex gap-[20px] items-center justify-center">
            {/* Save Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform disabled:opacity-50"
              onClick={() => handleSaveClick(memberId)}
              disabled={isLoading}
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
              onClick={() => handleCancelClick(memberId)}
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
    const memberId = getMemberId(member);

    return (
      <tr key={memberId}>
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
        <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
          <div className="flex gap-[20px] items-center justify-center">
            {/* Edit Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleEditClick(memberId)}
            >
              <img
                src={editIcon}
                alt="editIcon"
                className="w-[20px] h-[20px]"
              />
            </button>
            {/* Delete Button */}
            <button
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleDeleteClick(memberId)}
            >
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
            <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] p-[10px] text-center">
              {t.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {editedMembers.map((member) =>
            editMode[getMemberId(member)]
              ? renderEditableRow(member)
              : renderViewRow(member),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EditFamilyMemberTable;
