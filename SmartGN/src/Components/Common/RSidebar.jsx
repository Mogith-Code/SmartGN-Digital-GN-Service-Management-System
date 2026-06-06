import React from 'react'
import homeIcon from '../../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import dashBoard from '../../assets/team_dashboard_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import profileIcon from '../../assets/person_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import householdIcon from '../../assets/home_and_garden_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import certificateIcon from '../../assets/license_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import appointmentIcon from '../../assets/calendar_today_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import allowanceIcon from '../../assets/edit_document_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg'

function RSidebar() {
  return (
    <div className="flex gap-[20px]">
         {/* Sidebar Nav */}
        <aside className="w-[280px] bg-white border-r border-[#2D37482D] py-[60px] pr-[20px]">
          <nav className="flex flex-col gap-[5px]">
            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/')}>
              <img src={homeIcon} alt="Home Icon" className="w-auto h-[20px]" />
              <span>H</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none bg-transparent py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <img src={dashBoard} alt="Dashboard Icon" className="w-auto h-[20px]" />
              <span>D</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/profile', { state: { successUser, division: userDivision } })}>
              <img src={profileIcon} alt="Profile Icon" className="w-auto h-[20px]" />
              <span>P</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <img src={householdIcon} alt="Household Icon" className="w-auto h-[20px]" />
              <span>F</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <img src={certificateIcon} alt="Certificate Icon" className="w-auto h-[20px]" />
              <span>C</span>
            </button>

            <button className="bg-[#1c355e] flex gap-3.5 py-3 px-7 items-center text-white rounded-r-full shadow-[0_4px_10px_rgba(28,53,94,0.15)]">
              <img src={appointmentIcon} alt="Appointment Icon" className="w-auto h-[20px]" />
              <span>A</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser, division: userDivision } })}>
              <img src={allowanceIcon} alt="Allowance Icon" className="w-auto h-[20px]" />
              <span>AL</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser, division: userDivision } })}>
              <img src={dashBoard} alt="Home Icon" className="w-auto h-[20px]" />
              <span>D</span>
            </button>

            <button className="flex items-center gap-3.5 w-full border-none bg-transparent py-3 px-7 cursor-pointer text-[13.5px] font-semibold text-slate-600 text-left transition-all duration-200 outline-none focus:outline-none">
              <img src={dashBoard} alt="Home Icon" className="w-auto h-[20px]" />
              <span>AN</span>
            </button>
          </nav>
        </aside>
    </div>
  )
}

export default RSidebar