import React from 'react'
import logoImage from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

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
      </div>
    </header>
  )
}

export default AfterlogNavbar