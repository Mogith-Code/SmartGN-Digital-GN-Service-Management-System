// src/Components/ResidentsDetails/ProfileSearchingSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { encryptId } from "../../utils/encryption";

function ProfileSearchingSection() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("smartgn_token");

  const defaultMockResidents = [
    {
      r_nic: "199012345678",
      nic: "199012345678",
      full_name: "Nimal Perera",
      first_name: "Nimal",
      last_name: "Perera",
      household_number: "H-102",
      division_name: "Colombo Borella",
      email: "nimal.perera@example.com",
      mobile_number: "0771234567",
      dob: "1990-05-15",
      gender: "Male",
      occupation: "Civil Engineer",
      address: "No. 45/2, Temple Road, Maharagama"
    },
    {
      r_nic: "198598765432",
      nic: "198598765432",
      full_name: "Sunethra Silva",
      first_name: "Sunethra",
      last_name: "Silva",
      household_number: "H-105",
      division_name: "Colombo Borella",
      email: "sunethra.silva@example.com",
      mobile_number: "0719876543",
      dob: "1985-08-20",
      gender: "Female",
      occupation: "School Teacher",
      address: "No. 12, Station Road, Borella"
    },
    {
      r_nic: "199534567890",
      nic: "199534567890",
      full_name: "Kamal Jayasinghe",
      first_name: "Kamal",
      last_name: "Jayasinghe",
      household_number: "H-108",
      division_name: "Colombo Borella",
      email: "kamal.j@example.com",
      mobile_number: "0753456789",
      dob: "1995-11-03",
      gender: "Male",
      occupation: "Accountant",
      address: "No. 88, Lake Road, Rajagiriya"
    }
  ];

  // ============================================================
  // FETCH RESIDENTS FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/officer/residents", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const list = data.data || data || [];
          if (list.length > 0) {
            setResidents(list);
            setFilteredResidents(list);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Using fallback residents list:", err.message);
      }

      setResidents(defaultMockResidents);
      setFilteredResidents(defaultMockResidents);
      setLoading(false);
    };

    fetchResidents();
  }, [token]);

  // ============================================================
  // FILTER RESIDENTS BASED ON SEARCH TERM
  // ============================================================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResidents(residents);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    const filtered = residents.filter((resident) => {
      const nic = (resident.r_nic || resident.nic || "").toLowerCase();
      const firstName = (resident.first_name || "").toLowerCase();
      const lastName = (resident.last_name || "").toLowerCase();
      const fullName = (resident.full_name || "").toLowerCase();
      const householdNumber = (resident.household_number || "").toLowerCase();

      return (
        nic.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        fullName.includes(searchLower) ||
        householdNumber.includes(searchLower)
      );
    });

    setFilteredResidents(filtered);
  }, [searchTerm, residents]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="flex flex-col gap-[20px] w-full p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl">
        <div className="relative w-full md:w-[50%] bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] flex items-center gap-[10px]">
          <img
            src={searchIcon}
            alt="Search Icon"
            className="w-[15px] h-[15px] opacity-[50%] flex-shrink-0"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search residents using NIC number..."
            className="w-full bg-transparent border-none outline-none text-[16px] font-light text-[#2D3748] placeholder-[#2D3748] placeholder-opacity-50"
            disabled
          />
        </div>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D69E2E]"></div>
          <span className="ml-3 text-[#2D3748]">Loading residents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-[20px] w-full p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl">
        <div className="relative w-full md:w-[50%] bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] flex items-center gap-[10px]">
          <img
            src={searchIcon}
            alt="Search Icon"
            className="w-[15px] h-[15px] opacity-[50%] flex-shrink-0"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search residents using NIC number..."
            className="w-full bg-transparent border-none outline-none text-[16px] font-light text-[#2D3748] placeholder-[#2D3748] placeholder-opacity-50"
          />
        </div>
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-[#2D3748] mb-2">
            Error loading residents
          </h3>
          <p className="text-sm text-[#2D37488D] max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px] w-full p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl">
      {/* Search Bar */}
      <div className="relative w-full md:w-[50%] bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] flex items-center gap-[10px]">
        <img
          src={searchIcon}
          alt="Search Icon"
          className="w-[15px] h-[15px] opacity-[50%] flex-shrink-0"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search residents using NIC number..."
          className="w-full bg-transparent border-none outline-none text-[16px] font-light text-[#2D3748] placeholder-[#2D3748] placeholder-opacity-50"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="flex-shrink-0 text-[#2D3748] opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Count */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#2D37488D]">
          {searchTerm ? (
            <>
              Found{" "}
              <strong className="text-[#1B365D]">
                {filteredResidents.length}
              </strong>{" "}
              resident(s)
              {filteredResidents.length === 0 && " matching your search"}
            </>
          ) : (
            `Showing all ${residents.length} residents`
          )}
        </span>
        {searchTerm && filteredResidents.length > 0 && (
          <button
            onClick={clearSearch}
            className="text-sm text-[#D69E2E] hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Residents List */}
      {filteredResidents.length > 0 ? (
        filteredResidents.map((resident) => {
          const displayName =
            resident.full_name ||
            `${resident.first_name || ""} ${resident.last_name || ""}`.trim() ||
            "Unnamed Resident";
          const displayNic = resident.r_nic || resident.nic || "N/A";
          const displayHousehold = resident.household_number || "N/A";

          // ✅ Encrypt NIC for URL
          const encryptedNic = encryptId(displayNic);

          return (
            <div
              key={resident.r_nic || resident.id || Math.random().toString()}
              className="flex flex-col gap-[20px] w-full py-[10px] px-[20px] border border-[#2D37484D] rounded-xl hover:bg-[#F7FAFC] transition-colors duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  {resident.profile_photo_path ? (
                    <img
                      src={resident.profile_photo_path}
                      alt="Resident Photo"
                      className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <img
                      src={profileIcon}
                      alt="Resident Photo"
                      className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="ml-[15px] sm:ml-[20px] flex flex-col">
                    <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] font-medium line-clamp-1">
                      {displayName}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-[12px] text-[#2D3748]">
                      NIC: {displayNic}
                    </span>
                  </div>
                </div>
                <div className="flex w-[40%] items-center justify-between">
                  <div className="ml-[55px] sm:ml-[70px] md:ml-0">
                    <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                      Household No: {displayHousehold}
                    </span>
                  </div>
                  <div className="ml-[55px] sm:ml-[70px] md:ml-0">
                    <span
                      className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#D69E2E] font-medium hover:cursor-pointer hover:underline transition-all duration-200"
                      onClick={() => {
                        // ✅ Navigate with encrypted NIC
                        navigate(
                          `/OfficerDashboard/ResidentsDetails/profile/${encryptedNic}`,
                        );
                      }}
                    >
                      View Profile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-[#2D3748] mb-2">
            {searchTerm ? "No residents found" : "No residents available"}
          </h3>
          <p className="text-sm text-[#2D37488D] max-w-md">
            {searchTerm
              ? `We couldn't find any resident matching "${searchTerm}". Please try a different NIC, name, or household number.`
              : "There are no residents registered in your division yet."}
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-[#2c5f8a] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileSearchingSection;
