import React, { useState } from "react";
import searchIcon from "../../assets/search_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function ProfileSearchingSection() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([
    {
      name: "Dissanayake Mudiyanselage Nimal Perera",
      nic: "2005686114655",
      householdNumber: "12345",
      profilePhoto: null,
    },
    {
      name: "Warapitiyage Lakshan Janith Chamodya Warapitiya",
      nic: "200315611265",
      householdNumber: "1652345",
      profilePhoto: null,
    },
    {
      name: "Warapitiyage Lakshan Janith Chamodya Warapitiya",
      nic: "200315611265",
      householdNumber: "1652345",
      profilePhoto: null,
    },
    {
      name: "Dissanayake Mudiyanselage Nimal Perera",
      nic: "2005686114655",
      householdNumber: "12345",
      profilePhoto: null,
    },
  ]);

  return (
    <div className="flex flex-col gap-[20px] w-full flex-col p-4 sm:p-5 md:p-6 lg:p-[20px] border-[1.5px] border-[#2D37484D] rounded-xl mb-[30px]">
      <div className="flex w-[50%] bg-[#E2E8F0] border border-[#2D37482D] rounded-[10px] py-[10px] px-[30px] items-center gap-[10px]">
        <img
          src={searchIcon}
          alt="Search Icon"
          className="w-[15px] h-[15px] opacity-[50%]"
        />
        <span className="text-[16px] font-light text-[#2D3748] opacity-[50%]">
          Search residents using NIC number
        </span>
      </div>
      <>
        {residents.map((resident) => (
          <div className="flex flex-col gap-[20px] w-full py-[10px] px-[20px] border border-[#2D37484D] rounded-xl">
            <div className="flex justify-between ">
              <div className="flex w-full items-center justify-between ">
                <div className="flex items-center justify-between">
                  <img
                    src={profileIcon}
                    alt="Resident Photo"
                    className="w-[50px] h-[50px] rounded-full"
                  />

                  <div className="ml-[20px] flex flex-col items-start">
                    <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] font-medium">
                      {resident.name}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#2D3748]">
                      NIC: {resident.nic}
                    </span>
                  </div>
                </div>

                <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D3748]">
                  Household Number : {resident.householdNumber}
                </span>

                <span
                  className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#D69E2E] font-medium hover:cursor-pointer hover:underline"
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
        ))}
      </>
    </div>
  );
}

export default ProfileSearchingSection;
