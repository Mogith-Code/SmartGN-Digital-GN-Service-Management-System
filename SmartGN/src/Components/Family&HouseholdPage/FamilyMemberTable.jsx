import React from "react";

function FamilyMemberTable() {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] py-[10px]">
            Full Name
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] py-[10px]">
            NIC
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] py-[10px]">
            Age
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] py-[10px]">
            Occupation
          </th>
          <th className="text-[16px] text-[#2D3748] bg-[#FDF5E6] border border-[#2D37484D] py-[10px]">
            Relationship
          </th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Janith Chamodya Warapitiya
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            200314611639
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            23
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            None
          </td>
          <td className="text-[16px] text-[#2D3748] border border-[#2D37484D] px-[10px] py-[5px]">
            Son
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default FamilyMemberTable;
