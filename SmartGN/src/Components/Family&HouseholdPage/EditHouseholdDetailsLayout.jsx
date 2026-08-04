// EditHouseholdDetailsLayout.jsx
import React, { useState, useEffect } from "react";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import resetIcon from "../../assets/refresh_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import updateIcon from "../../assets/update_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/api";
import { useLanguage } from "../../utils/translate";

function EditHouseholdDetailsLayout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const editHouseholdTranslations = {
    EN: {
      back: "back",
      title: "Edit your Household details",
      householdNo: "Household Number :",
      address: "Address :",
      addressPlaceholder: "Enter household address",
      landSize: "Size of the land :",
      landSizePlaceholder: "e.g., 10 perches, 20 acres",
      landOwner: "Land Owner :",
      landOwnerPlaceholder: "Enter land owner name",
      reset: "Reset",
      update: "Update",
      updating: "Updating...",
    },
    SI: {
      back: "ආපසු",
      title: "ඔබගේ ගෘහස්ථ විස්තර සංස්කරණය කරන්න",
      householdNo: "ගෘහ අංකය :",
      address: "ලිපිනය :",
      addressPlaceholder: "ගෘහස්ථ ලිපිනය ඇතුළත් කරන්න",
      landSize: "ඉඩමේ ප්‍රමාණය :",
      landSizePlaceholder: "උදා: පර්චස් 10, අක්කර 20",
      landOwner: "ඉඩම් හිමියා :",
      landOwnerPlaceholder: "ඉඩම් හිමියාගේ නම ඇතුළත් කරන්න",
      reset: "නැවත සකසන්න",
      update: "යාවත්කාලීන කරන්න",
      updating: "යාවත්කාලීන වෙමින්...",
    },
    TA: {
      back: "பின்னால்",
      title: "உங்கள் வீட்டு விவரங்களை திருத்தவும்",
      householdNo: "வீட்டு අංකය :",
      address: "முகவரி :",
      addressPlaceholder: "வீட்டு முகவரியை உள்ளிடவும்",
      landSize: "நிலத்தின் அளவு :",
      landSizePlaceholder: "உதா: 10 பேர்ச்சஸ், 20 ஏக்கர்",
      landOwner: "நிலத்தின் உரிமையாளர் :",
      landOwnerPlaceholder: "நில உரிமையாளரின் பெயரை உள்ளிடவும்",
      reset: "மீட்டமை",
      update: "புதுப்பிக்கவும்",
      updating: "புதுப்பிக்கிறது...",
    },
  };

  const t = editHouseholdTranslations[lang] || editHouseholdTranslations.EN;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for household details
  const [household, setHousehold] = useState({
    household_number: "",
    address: "",
    land_size: "",
    land_owner: "",
  });

  // State for edit form
  const [editHousehold, setEditHousehold] = useState({
    address: "",
    land_size: "",
    land_owner: "",
  });

  // Fetch household details on component mount
  useEffect(() => {
    fetchHouseholdDetails();
  }, []);

  // ============================================================
  // FETCH HOUSEHOLD DETAILS
  // ============================================================
  const fetchHouseholdDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/residents/household", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch household details");
      }

      const data = await response.json();
      setHousehold({
        household_number: data.household_number || "",
        address: data.address || "",
        land_size: data.land_size || "",
        land_owner: data.land_owner || "",
      });

      // Populate edit form
      setEditHousehold({
        address: data.address || "",
        land_size: data.land_size || "",
        land_owner: data.land_owner || "",
      });

      setError("");
    } catch (err) {
      console.error("Error fetching household details:", err);
      setError("Failed to load household details");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================
  const handleInputChange = (field, value) => {
    setEditHousehold((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // HANDLE RESET
  // ============================================================
  const handleReset = () => {
    setEditHousehold({
      address: household.address || "",
      land_size: household.land_size || "",
      land_owner: household.land_owner || "",
    });
    setError("");
    setSuccess("");
  };

  // ============================================================
  // HANDLE UPDATE
  // ============================================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/residents/household", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          address: editHousehold.address,
          land_size: editHousehold.land_size,
          land_owner: editHousehold.land_owner,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update household");
      }

      const data = await response.json();
      setSuccess("Household details updated successfully!");

      // Update local state
      setHousehold({
        ...household,
        address: editHousehold.address,
        land_size: editHousehold.land_size,
        land_owner: editHousehold.land_owner,
      });

      // Redirect back after 2 seconds
      setTimeout(() => {
        navigate("/ResidentDashboard/RHousehold");
      }, 2000);
    } catch (err) {
      console.error("Error updating household:", err);
      setError(err.message || "Failed to update household");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Back Button */}
      <div
        className="flex px-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
        onClick={() => navigate("/ResidentDashboard/RHousehold")}
      >
        <img src={backIcon} alt="backIcon" className="w-[14px] sm:w-[16px]" />
        {t.back}
      </div>

      {/* Page Title */}
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[10px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
        {t.title}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-2.5 sm:p-3 bg-green-100 text-green-700 rounded-lg border border-green-300 text-sm sm:text-base">
          {success}
        </div>
      )}
      {error && (
        <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Edit Form */}
      <div className="flex flex-col border border-[#2D37482D] p-3 sm:p-4 md:p-5 lg:p-[20px] mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] rounded-[8px] sm:rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
        <form onSubmit={handleUpdate}>
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            {/* Household Number (Read Only) */}
            <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
              <label className="font-medium">{t.householdNo}</label>
              <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#1B365D]">
                {household.household_number || "-"}
              </span>
            </div>

            {/* Address (Editable) */}
            <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748]">
              <label htmlFor="addressInput" className="font-medium">
                {t.address}
              </label>
              <input
                type="text"
                id="addressInput"
                value={editHousehold.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D] py-1"
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Land Size & Land Owner (Editable) */}
            <div className="flex w-full flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1 w-full sm:w-auto">
                <label htmlFor="landSizeInput" className="font-medium">
                  {t.landSize}
                </label>
                <input
                  type="text"
                  id="landSizeInput"
                  value={editHousehold.land_size}
                  onChange={(e) =>
                    handleInputChange("land_size", e.target.value)
                  }
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D] py-1"
                  placeholder={t.landSizePlaceholder}
                />
              </div>

              <div className="flex flex-col items-start gap-[2px] text-sm sm:text-base md:text-lg lg:text-[16px] font-regular text-[#2D3748] flex-1 w-full sm:w-auto">
                <label htmlFor="landOwnerInput" className="font-medium">
                  {t.landOwner}
                </label>
                <input
                  type="text"
                  id="landOwnerInput"
                  value={editHousehold.land_owner}
                  onChange={(e) =>
                    handleInputChange("land_owner", e.target.value)
                  }
                  className="w-full border-b border-[#2D37488D] text-sm sm:text-base focus:outline-none focus:border-b-2 focus:border-[#1B365D] py-1"
                  placeholder={t.landOwnerPlaceholder}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-[20px] mt-2 sm:mt-3 md:mt-4 lg:mt-[10px]">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#E7000B] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-101 group font-regular hover:bg-[#FF000C] transition-all duration-200 w-full sm:w-auto"
              >
                <span>{t.reset}</span>
                <img
                  src={resetIcon}
                  alt="resetIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 flex justify-center items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-[10px] text-xs sm:text-sm md:text-base lg:text-[14px] bg-[#1B365D] text-[#F7FAFC] rounded-xl sm:rounded-2xl lg:rounded-[15px] cursor-pointer font-regular hover:bg-[#005BBD] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-101 group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <span>{loading ? t.updating : t.update}</span>
                <img
                  src={updateIcon}
                  alt="updateIcon"
                  className="w-3.5 sm:w-4 md:w-4.5 lg:w-[16px]"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditHouseholdDetailsLayout;
