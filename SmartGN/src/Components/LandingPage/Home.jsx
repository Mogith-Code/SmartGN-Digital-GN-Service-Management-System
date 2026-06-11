import React from 'react'
import { useLanguage } from '../../utils/translate'; // Custom hook for multilingual support
import heroImage from '../../assets/hero-image.png';
import loginIcon from '../../assets/login_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';
import registerIcon from '../../assets/how_to_reg_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg';
import helpIcon from '../../assets/contact_support_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  // Get the current language from the custom hook (EN, SI, or TA)
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN), 
  // Sinhala (SI), and Tamil (TA)
  const homeTranslations = {
    EN: {
      heroDesc: "Empowering you with effortless access to village administrative services. Connect with your Grama Niladhari officer and manage your official needs in just a few clicks.",
      login: "Login",
      register: "Register"
    },
    SI: {
      heroDesc: "ග්‍රාමීය පරිපාලන සේවාවන් වෙත පහසුවෙන් ප්‍රවේශ වීමට ඔබට බලය ලබා දෙයි. ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සම්බන්ධ වී ක්ලික් කිරීම් කිහිපයකින් ඔබේ නිල අවශ්‍යතා ඉටු කරගන්න.",
      login: "ඇතුල් වන්න",
      register: "ලියාපදිංචි වන්න"
    },
    TA: {
      heroDesc: "கிராம நிர்வாகச் சேவைகளுக்கான தடையற்ற அணுகலை உங்களுக்கு வழங்குகிறது. உங்கள் கிராம நிலதாரி அதிகாரியுடன் இணைந்து உங்கள் அதிகாரப்பூர்வ தேவைகளை சில கிளிக்குகளில் நிர்வகிக்கவும்.",
      login: "உள்நுழைக",
      register: "பதிவு செய்க"
    }
  };

  // Select the appropriate translation based on current language
  // Defaults to English if language not found
  const t = homeTranslations[lang]

   // COMPONENT RENDER
  return (
  <section className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:p-[30px] py-[25px] max-md:p-[20px]" id="home">

    {/* Inner container - flex column layout to stack elements vertically */}
    <div className="w-full flex flex-col justify-between items-center"> 

      {/*  HERO IMAGE */}
      <div className="w-full h-auto"> {/*border border-amber-900*/}
        <img src={heroImage} alt="Grama Niladhari Service - Helping citizens with administrative services" className="w-full h-[400px] max-lg:h-[300px] max-md:h-[200px]" />
      </div>

      {/* HERO HEADLINE */}
      <div className="w-full px-[50px] max-md:px-0"> {/*border border-amber-900*/}
        <p className="text-center font-light text-[24px] max-lg:text-[20px] max-md:text-[16px] text-[#2D3748]"> 
          {t.heroDesc}
        </p>
      </div>

      {/* BUTTON CONTAINER */}
      <div className="w-full flex items-center justify-center gap-5 mt-[10px]">
          
        {/* LOGIN BUTTON */}
        <button className="flex items-center justify-center gap-2.5 max-md:gap-[5px] px-[50px] py-2.5 bg-[#1B365D] shadow-[0_3px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] text-[#F7FAFC] font-medium text-[16px] max-md:text-[12px] max-md:py-[8px] max-md:px-[30px] rounded-[15px] max-md:rounded-[12px] hover:bg-[#005BBD] hover:text-white transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/login')}>
          {t.login}
          <img src={loginIcon} alt="Login Icon" className="w-5 h-5" />
        </button>

        {/* REGISTER BUTTON */}
        <button className="flex items-center justify-center gap-2.5 px-[50px] py-2.5 bg-[#D69E2E] shadow-[0_3px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] text-[#F7FAFC] font-medium text-[16px] max-md:text-[12px] max-md:py-[8px] max-md:px-[20px] rounded-[15px] max-md:rounded-[12px] hover:bg-[#FFAA00] hover:text-white transition-all duration-300 cursor-pointer" 
                onClick={() => navigate('/register')}>
          {t.register}
          <img src={registerIcon} alt="Register Icon" className="w-5 h-5" />
        </button>

        {/* HELP BUTTON - Fixed position at bottom right corner */}
        <button className="bg-[#D69E2E] z-[100] ml-[1270px] max-md:ml-[400px] fixed p-[10px] rounded-full cursor-pointer flex items-center justify-center shadow-[0_3px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] transition-all duration-200  hover:bg-[#FFAA00]" aria-label="Help Center" 
                onClick={() => console.log("help clicked")}> {/*TODO: replace = {onOpenHelp} instead of console.log()*/}
        <img src={helpIcon} alt="Help Icon" className="h-[30px] max-md:h-[20px]" />
        </button>
      </div>
    </div>
  </section>
  )
}

export default Home;