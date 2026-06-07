import React from 'react'
import { translations, useLanguage } from '../../utils/translate'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import homeIcon from '../../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import dashBoard from '../../assets/team_dashboard_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import profileIcon from '../../assets/person_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import householdIcon from '../../assets/home_and_garden_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import certificateIcon from '../../assets/license_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import appointmentIcon from '../../assets/calendar_today_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import allowanceIcon from '../../assets/edit_document_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import disasterIcon from '../../assets/flood_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import announcementIcon from '../../assets/brand_awareness_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import homeIconHovered from '../../assets/home_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import dashBoardIconHovered from '../../assets/team_dashboard_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import profileIconHovered from '../../assets/person_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import householdIconHovered from '../../assets/home_and_garden_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import certificateIconHovered from '../../assets/license_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import appointmentIconHovered from '../../assets/calendar_today_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import allowanceIconHovered from '../../assets/edit_document_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import disasterIconHovered from '../../assets/flood_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import announcementIconHovered from '../../assets/brand_awareness_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'



function RSidebar() {
    const navigate = useNavigate()
    const { lang } = useLanguage()
    const t = translations[lang]

    const [ishomeHovered, setIshomeHovered] = useState(false);
    const [isdashboardHovered, setIsdashboardHovered] = useState(false);
    const [isprofileHovered, setIsprofileHovered] = useState(false);
    const [ishouseholdHovered, setIshouseholdHovered] = useState(false);
    const [iscertificateHovered, setIscertificateHovered] = useState(false);
    const [isappointmentHovered, setIsappointmentHovered] = useState(false);
    const [isallowanceHovered, setIsallowanceHovered] = useState(false);
    const [isdisasterHovered, setIsdisasterHovered] = useState(false);
    const [isannouncementHovered, setIsannouncementHovered] = useState(false);
    
  return (
    <>
         {/* Sidebar Nav */}
        <aside className="w-[280px] h-screen bg-white border-r border-[#2D37482D] pt-[60px] pr-[20px]">
          <nav className="flex flex-col gap-[5px]">
            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIshomeHovered(true)}
                    onMouseLeave={() => setIshomeHovered(false)}>
              {!ishomeHovered && (<img src={homeIcon} alt="Home Icon" className="w-auto h-[20px]" />)}
              {ishomeHovered && ( <img src={homeIconHovered} alt="Home Icon" className="w-auto h-[20px]" />)}
              <span>{t.home}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsdashboardHovered(true)}
                    onMouseLeave={() => setIsdashboardHovered(false)}>
              {!isdashboardHovered && (<img src={dashBoard} alt="Dashboard Icon" className="w-auto h-[20px]" />)}
              {isdashboardHovered && (<img src={dashBoardIconHovered} alt="Dashboard Icon" className="w-auto h-[20px]" />)}
              <span>{t.dashboard}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsprofileHovered(true)}
                    onMouseLeave={() => setIsprofileHovered(false)}>
              {!isprofileHovered && (<img src={profileIcon} alt="Profile Icon" className="w-auto h-[20px]" />)}
              {isprofileHovered && (<img src={profileIconHovered} alt="Profile Icon" className="w-auto h-[20px]" />)}
              <span>{t.profile}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIshouseholdHovered(true)}
                    onMouseLeave={() => setIshouseholdHovered(false)}>
              {!ishouseholdHovered && (<img src={householdIcon} alt="Household Icon" className="w-auto h-[20px]" />)}
              {ishouseholdHovered && (<img src={householdIconHovered} alt="Household Icon" className="w-auto h-[20px]" />)}
              <span>{t.family}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIscertificateHovered(true)}
                    onMouseLeave={() => setIscertificateHovered(false)}>
              {!iscertificateHovered && (<img src={certificateIcon} alt="Certificate Icon" className="w-auto h-[20px]" />)}
              {iscertificateHovered && (<img src={certificateIconHovered} alt="Certificate Icon" className="w-auto h-[20px]" />)}
              <span>{t.certificates}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsappointmentHovered(true)}
                    onMouseLeave={() => setIsappointmentHovered(false)}>
              {!isappointmentHovered && (<img src={appointmentIcon} alt="Appointment Icon" className="w-auto h-[20px]" />)}
              {isappointmentHovered && (<img src={appointmentIconHovered} alt="Appointment Icon" className="w-auto h-[20px]" />)}
              <span>{t.appointments}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsallowanceHovered(true)}
                    onMouseLeave={() => setIsallowanceHovered(false)}>
              {!isallowanceHovered && (<img src={allowanceIcon} alt="Allowance Icon" className="w-auto h-[20px]" />)}
              {isallowanceHovered && (<img src={allowanceIconHovered} alt="Allowance Icon" className="w-auto h-[20px]" />)}
              <span>{t.allowances}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsdisasterHovered(true)}
                    onMouseLeave={() => setIsdisasterHovered(false)}>
              {!isdisasterHovered && (<img src={disasterIcon} alt="Disaster Icon" className="w-auto h-[20px]" />)}
              {isdisasterHovered && (<img src={disasterIconHovered} alt="Disaster Icon" className="w-auto h-[20px]" />)}
              <span>{t.disaster}</span>
            </button>

            <button className="flex items-center gap-[10px] w-full border-none hover:rounded-r-full bg-transparent hover:bg-[#1B365D] py-[10px] px-[30px] cursor-pointer text-[16px] font-regular text-[#2D3748] hover:text-[#F7FAFC] text-left transition-all duration-200" 
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setIsannouncementHovered(true)}
                    onMouseLeave={() => setIsannouncementHovered(false)}>
              {!isannouncementHovered && (<img src={announcementIcon} alt="Announcement Icon" className="w-auto h-[20px]" />)}
              {isannouncementHovered && (<img src={announcementIconHovered} alt="Announcement Icon" className="w-auto h-[20px]" />)}
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>
    </>
  )
}

export default RSidebar