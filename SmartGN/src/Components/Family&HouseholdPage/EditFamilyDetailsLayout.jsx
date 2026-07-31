// EditFamilyDetailsLayout.jsx
import React, { useState, useEffect } from "react";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import EditFamilyMemberTable from "./EditFamilyMemberTable";
import { getAuthHeaders } from "../../utils/api";

// ✅ Relationship options based on database ENUM values
const relationshipOptions = [
  { value: "Head", label: "Head" },
  { value: "Wife", label: "Wife" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Mother", label: "Mother" },
  { value: "Father", label: "Father" },
  { value: "Sibling", label: "Sibling" },
  { value: "Other", label: "Other" },
];

function EditFamilyDetailsLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for family members
  const [familyMembers, setFamilyMembers] = useState([]);

  // State for new member form
  const [newMember, setNewMember] = useState({
    name: "",
    nic: "",
    age: "",
    occupation: "",
    relationship: "",
  });

  // Fetch family members on component mount
  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  // ============================================================
  // FETCH FAMILY MEMBERS
  // ============================================================
  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/residents/family", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch family members");
      }

      const data = await response.json();
      setFamilyMembers(data);
      setError("");
    } catch (err) {
      console.error("Error fetching family members:", err);
      setError("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE ADD NEW MEMBER
  // ============================================================
  const handleAddMember = async () => {
    // Validate required fields
    if (!newMember.name || !newMember.age || !newMember.relationship) {
      setError("Name, age, and relationship are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/residents/family", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newMember.name,
          age: parseInt(newMember.age),
          relationship: newMember.relationship,
          nic: newMember.nic || null,
          gender: null,
          dateOfBirth: null,
          occupation: newMember.occupation || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add family member");
      }

      // Reset form and refresh list
      setNewMember({
        name: "",
        nic: "",
        age: "",
        occupation: "",
        relationship: "",
      });
      setSuccess("Family member added successfully!");
      await fetchFamilyMembers();
    } catch (err) {
      console.error("Error adding family member:", err);
      setError(err.message || "Failed to add family member");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE UPDATE MEMBER
  // ============================================================
  const handleUpdateMember = async (memberId, updatedData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/residents/family/${memberId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: updatedData.name,
          age: parseInt(updatedData.age),
          relationship: updatedData.relationship,
          nic: updatedData.nic || null,
          occupation: updatedData.occupation || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update family member");
      }

      setSuccess("Family member updated successfully!");
      await fetchFamilyMembers();
    } catch (err) {
      console.error("Error updating family member:", err);
      setError(err.message || "Failed to update family member");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE DELETE MEMBER
  // ============================================================
  const handleDeleteMember = async (memberId) => {
    if (
      !window.confirm("Are you sure you want to delete this family member?")
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/residents/family/${memberId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete family member");
      }

      setSuccess("Family member deleted successfully!");
      await fetchFamilyMembers();
    } catch (err) {
      console.error("Error deleting family member:", err);
      setError(err.message || "Failed to delete family member");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE INPUT CHANGE FOR NEW MEMBER
  // ============================================================
  const handleInputChange = (field, value) => {
    setNewMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // HANDLE RESET FORM
  // ============================================================
  const handleResetForm = () => {
    setNewMember({
      name: "",
      nic: "",
      age: "",
      occupation: "",
      relationship: "",
    });
    setError("");
    setSuccess("");
  };

  return (
    <>
      {/* Back Button */}
      <div
        className="flex px-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
        onClick={() => navigate("/ResidentDashboard/RHousehold")}
      >
        <img src={backIcon} alt="backIcon" className="w-[14px] sm:w-[16px]" />
        back
      </div>

      {/* Page Title */}
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[10px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
        Edit your family details
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-[30px] mt-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
          {success}
        </div>
      )}
      {error && (
        <div className="mx-[30px] mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {/* Add Member Form */}
      <div className="flex flex-col border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMember();
          }}
        >
          <div className="flex flex-col gap-4 sm:gap-5 ">
            {/* Full Name */}
            <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
              <label htmlFor="nameInput" className="font-medium">
                Full Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nameInput"
                value={newMember.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D]"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* NIC, Age */}
            <div className="flex w-full justify-between gap-4">
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1">
                <label htmlFor="nicInput" className="font-medium">
                  NIC :
                </label>
                <input
                  type="text"
                  id="nicInput"
                  value={newMember.nic}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D]"
                  placeholder="Enter NIC"
                />
              </div>

              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1">
                <label htmlFor="ageInput" className="font-medium">
                  Age: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="ageInput"
                  value={newMember.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D]"
                  placeholder="Enter age"
                  required
                  min="0"
                  max="150"
                />
              </div>
            </div>

            {/* Occupation, Relationship */}
            <div className="flex w-full justify-between gap-4">
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1">
                <label htmlFor="occupationInput" className="font-medium">
                  Occupation :
                </label>
                <input
                  type="text"
                  id="occupationInput"
                  value={newMember.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D]"
                  placeholder="Enter occupation"
                />
              </div>

              {/* ✅ Updated to Dropdown */}
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1">
                <label htmlFor="relationshipInput" className="font-medium">
                  Relationship: <span className="text-red-500">*</span>
                </label>
                <select
                  id="relationshipInput"
                  value={newMember.relationship}
                  onChange={(e) =>
                    handleInputChange("relationship", e.target.value)
                  }
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D] bg-white py-2 cursor-pointer"
                  required
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#E7000B] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-101 group font-regular hover:bg-[#FF000C] transition-all duration-200"
              >
                <span>Reset</span>
                <img
                  src={resetIcon}
                  alt="resetIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer font-regular hover:bg-[#005BBD] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Adding..." : "Add member"}</span>
                <img
                  src={addIcon}
                  alt="addIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Family Members Table */}
      <div className="flex border border-[#2D37482D] p-[20px] m-[30px] rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col w-full">
          {loading && familyMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Loading family members...
            </div>
          ) : (
            <EditFamilyMemberTable
              members={familyMembers}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              onRefresh={fetchFamilyMembers}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default EditFamilyDetailsLayout;
