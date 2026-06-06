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
        {/* CTAs */}
        <div className="hero-ctas">
          <button className="btn-landing-login" onClick={() => navigate('/login')}>
            {navTranslations[lang].login}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
          
          <button className="btn-landing-register" onClick={() => navigate('/register')}>
            {navTranslations[lang].register}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </button>

          <button className="btn-landing-help" aria-label="Help Center" onClick={onOpenHelp}>
            ?
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home