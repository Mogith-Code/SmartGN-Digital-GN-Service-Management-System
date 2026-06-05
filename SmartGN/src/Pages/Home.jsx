import React from 'react'
import loginIcon from '../assets/images/login_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';
import registerIcon from '../assets/images/how_to_reg_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';

function Home() {
  return (
    <section 
      id="home" 
      className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:p-[30px] py-[25px] max-md:p-[25px]"
    >
      <div className="w-full flex flex-col justify-between items-center gap-5">
        
        /* IMAGE CONTAINER */
        <div className="w-full h-auto "> 
          <img 
            src="/hero-image.png"
            alt="Grama Niladhari Service - Helping citizens with administrative services"
            className="w-full h-[400px] max-lg:h-[300px] max-md:h-[200px]"
          />
        </div>