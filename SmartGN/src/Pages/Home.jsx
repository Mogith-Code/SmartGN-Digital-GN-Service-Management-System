import React from 'react'
import loginIcon from '../assets/images/login_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';
import registerIcon from '../assets/images/how_to_reg_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';

function Home() {
  return (
    <section 
      id="home" 
      className="w-full bg-[#F7FAFC] px-[1000px] py-[30px] max-lg:p-[30px] py-[25px] max-md:p-[25px]"
    >
      <div className="w-full flex flex-col justify-between items-center gap-5">
        
        {/* IMAGE CONTAINER */}
        <div className="w-full h-auto "> 
          <img 
            src="/hero-image.png"
            alt="Grama Niladhari Service - Helping citizens with administrative services"
            className="w-full h-[400px] max-lg:h-[300px] max-md:h-[200px]"
          />
        </div>
        <div className="w-full px-[50px]"> 
          <p className="text-center font-light text-[24px] leading-tight max-lg:text-[20px] max-md:text-[16px] text-[#2D3748]">
            Empowering you with effortless access to village administrative services. 
            Connect with your Grama Niladhari officer and manage your official needs 
            in just a few clicks.
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-5 max-sm:gap-3"> 
          
          {/* LOGIN BUTTON */}
          <button 
            className="flex items-center justify-center gap-2.5 px-[50px] py-2.5 bg-[#1B365D] shadow-[0_3px_10px_rgba(0,0,0,0.5)] text-[#F7FAFC] font-medium text-[16px] rounded-[15px] hover:bg-[#005BBD] hover:text-white transition-all duration-300 cursor-pointer max-sm:px-8 max-sm:py-2"
            onClick={() => console.log('Login clicked')}
            aria-label="Login to your account"
          >
            <span>Login</span>
            <img src={loginIcon} alt="Login Icon" className="w-5 h-5" />
          </button>

          {/* REGISTER BUTTON */}
          <button 
            className="flex items-center justify-center gap-2.5 px-[50px] py-2.5 bg-[#D69E2E] shadow-[0_3px_10px_rgba(0,0,0,0.5)] text-[#F7FAFC] font-medium text-[16px] rounded-[15px] hover:bg-[#FFAA00] hover:text-white transition-all duration-300 cursor-pointer max-sm:px-8 max-sm:py-2"
            onClick={() => console.log('Register clicked')}
            aria-label="Register for a new account"
          >
            <span>Register</span>
           <img src={registerIcon} alt="Register Icon" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home