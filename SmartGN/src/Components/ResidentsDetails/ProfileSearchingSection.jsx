import React, { useState } from "react";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function ProfileSearchingSection() {
  const navigate = useNavigate();

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Residents data
  const [residents, setResidents] = useState([
    {
      id: 1,
      name: "Dissanayake Mudiyanselage Nimal Perera",
      nic: "2005686114655",
      householdNumber: "12345",
      profilePhoto: null,
    },
    {
      id: 2,
      name: "Warapitiyage Lakshan Janith Chamodya Warapitiya",
      nic: "200315611265",
      householdNumber: "1652345",
      profilePhoto: null,
    },
    {
      id: 3,
      name: "Warapitiyage Lakshan Janith Chamodya Warapitiya",
      nic: "200315611265",
      householdNumber: "1652345",
      profilePhoto: null,
    },
    {
      id: 4,
      name: "Dissanayake Mudiyanselage Nimal Perera",
      nic: "2005686114655",
      householdNumber: "12345",
      profilePhoto: null,
    },
  ]);

  // Filter residents based on search term
  const filteredResidents = residents.filter((resident) =>
    resident.nic.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col gap-[20px] w-full p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl">
      {/* ================================================================ */}
      {/* SEARCH BAR */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/* SEARCH RESULTS COUNT */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/* RESIDENTS LIST */}
      {/* ================================================================ */}
      {filteredResidents.length > 0 ? (
        filteredResidents.map((resident) => (
          <div
            key={resident.id}
            className="flex flex-col gap-[20px] w-full py-[10px] px-[20px] border border-[#2D37484D] rounded-xl hover:bg-[#F7FAFC] transition-colors duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Section: Profile Photo & Name */}
              <div className="flex items-center">
                <img
                  src={profileIcon}
                  alt="Resident Photo"
                  className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full flex-shrink-0"
                />
                <div className="ml-[15px] sm:ml-[20px] flex flex-col">
                  <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] font-medium line-clamp-1">
                    {resident.name}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-[12px] text-[#2D3748]">
                    NIC: {resident.nic}
                  </span>
                </div>
              </div>
              <div className="flex w-[40%] items-center justify-between">
                {/* Middle Section: Household Number */}
                <div className="ml-[55px] sm:ml-[70px] md:ml-0">
                  <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                    Household No: {resident.householdNumber}
                  </span>
                </div>

                {/* Right Section: View Profile Button */}
                <div className="ml-[55px] sm:ml-[70px] md:ml-0">
                  <span
                    className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#D69E2E] font-medium hover:cursor-pointer hover:underline transition-all duration-200"
                    onClick={() => {
                      navigate(
                        `/OfficerDashboard/ResidentsDetails/profile/${resident.nic}`,
                      );
                    }}
                  >
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // ================================================================
        // EMPTY STATE - No results found
        // ================================================================
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-[#2D3748] mb-2">
            No residents found
          </h3>
          <p className="text-sm text-[#2D37488D] max-w-md">
            We couldn't find any resident with NIC number matching "{searchTerm}
            ". Please try a different NIC number.
          </p>
          <button
            onClick={clearSearch}
            className="mt-4 px-4 py-2 bg-[#2c5f8a] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileSearchingSection;
