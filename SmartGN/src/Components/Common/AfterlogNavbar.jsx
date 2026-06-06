import React from 'react'
import logoImage from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import notificationIcon from '../../assets/notifications_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';
import accountIcon from '../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';

function AfterlogNavbar() {
    const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center py-[20px] px-[100px] bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.2)] max-lg:px-[60px] max-md:px-[30px] py-[10px]">

      {/* DESKTOP NAVBAR - Visible on tablets and desktops (md and above)*/}
      <div className="flex w-full justify-between items-center max-md:hidden">
        {/* Logo Section - Clickable to navigate home */}
        <div className="w-[280px] max-lg:w-[200px]" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logoImage} alt="SmartGN Logo" />
        </div>

        
        <div className="flex items-center gap-[20px] border border-[red]">
            {/* Language Selector Component */}
            <LanguageSelector />

             {/* Notifications */}
          <div className="relative cursor-pointer flex items-center justify-center transition-colors duration-200">
            <img src={notificationIcon} alt="Notifications" className="w-auto h-[30px]" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[12px] font-medium w-[20px] h-[20px] rounded-full flex items-center justify-center">2</span>
          </div>

            {/* User Profile Info */}
          <div className="flex items-center gap-[10px] border border-[red]">
            <div className="flex flex-col text-right border border-[blue]">
              <span className="text-[10px] font-regular text-[#2D3748]">Colombo</span>
              <span className="text-[16px] font-medium text-[#2D3748]">Janith</span>
            </div>
            <div className="w-[50px] h-[50px] rounded-full bg-slate-200 flex items-center justify-cente border-[1.5px] border-slate-300">
              <img src={accountIcon} alt="User Profile" className="w-auto h-[50px]" />
            </div>
          </div>
        </div>
        

        
      </div>
    </header>
  )
}

export default AfterlogNavbar