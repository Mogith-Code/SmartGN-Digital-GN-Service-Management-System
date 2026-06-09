// src/components/Home.jsx
import React from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import heroImage from "../../assets/hero-image.png";
import loginIcon from "../../assets/login_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import registerIcon from "../../assets/how_to_reg_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import helpIcon from "../../assets/contact_support_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  // Get the current language from the custom hook (EN, SI, or TA)
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN),
  // Sinhala (SI), and Tamil (TA)
  const homeTranslations = {
    EN: {
      heroDesc:
        "Empowering you with effortless access to village administrative services. Connect with your Grama Niladhari officer and manage your official needs in just a few clicks.",
      login: "Login",
      register: "Register",
    },
    SI: {
      heroDesc:
        "ග්‍රාමීය පරිපාලන සේවාවන් වෙත පහසුවෙන් ප්‍රවේශ වීමට ඔබට බලය ලබා දෙයි. ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සම්බන්ධ වී ක්ලික් කිරීම් කිහිපයකින් ඔබේ නිල අවශ්‍යතා ඉටු කරගන්න.",
      login: "ඇතුල් වන්න",
      register: "ලියාපදිංචි වන්න",
    },
    TA: {
      heroDesc:
        "கிராம நிர்வாகச் சேவைகளுக்கான தடையற்ற அணுகலை உங்களுக்கு வழங்குகிறது. உங்கள் கிராம நிலதாரி அதிகாரியுடன் இணைந்து உங்கள் அதிகாரப்பூர்வ தேவைகளை சில கிளிக்குகளில் நிர்வகிக்கவும்.",
      login: "உள்நுழைக",
      register: "பதிவு செய்க",
    },
  };

  // Select the appropriate translation based on current language
  const t = homeTranslations[lang] || homeTranslations.EN;

  // ============================================================================
  // HELP BUTTON CLICK HANDLER
  // ============================================================================
  const handleHelpClick = () => {
    console.log("help clicked");
    // TODO: Open help modal or navigate to help page
    // Example: navigate('/help');
  };

  return (
    <section
      className="w-full bg-[#F7FAFC] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 py-6 sm:py-8 md:py-10 lg:py-[30px]"
      id="home"
    >
      {/* Inner container - flex column layout to stack elements vertically */}
      <div className="w-full flex flex-col justify-between items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {/* ================================================================ */}
        {/* HERO IMAGE SECTION */}
        {/* ================================================================ */}
        <div className="w-full h-auto">
          <img
            src={heroImage}
            alt="Grama Niladhari Service - Helping citizens with administrative services"
            className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
          />
        </div>

        {/* ================================================================ */}
        {/* HERO HEADLINE / DESCRIPTION SECTION */}
        {/* ================================================================ */}
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-10 xl:px-12">
          <p className="text-center font-light text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#2D3748] leading-relaxed">
            {t.heroDesc}
          </p>
        </div>

        {/* ================================================================ */}
        {/* BUTTON CONTAINER SECTION */}
        {/* ================================================================ */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 mt-2 sm:mt-3 md:mt-4">
          {/* ============================================================== */}
          {/* LOGIN BUTTON */}
          {/* ============================================================== */}
          <button
            className="flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[50px] py-2 sm:py-2.5 bg-[#1B365D] shadow-md hover:shadow-lg text-[#F7FAFC] font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-[#005BBD] transition-all duration-300 cursor-pointer w-full sm:w-auto"
            onClick={() => navigate("/RAppointment")}
          >
            <span>{t.login}</span>
            <img
              src={loginIcon}
              alt="Login Icon"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>

          {/* ============================================================== */}
          {/* REGISTER BUTTON */}
          {/* ============================================================== */}
          <button
            className="flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[50px] py-2 sm:py-2.5 bg-[#D69E2E] shadow-md hover:shadow-lg text-[#F7FAFC] font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-[#FFAA00] transition-all duration-300 cursor-pointer w-full sm:w-auto"
            onClick={() => console.log("register clicked")}
          >
            <span>{t.register}</span>
            <img
              src={registerIcon}
              alt="Register Icon"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FLOATING HELP BUTTON - Fixed position at bottom right corner */}
      {/* ================================================================ */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 bg-[#D69E2E] p-2 sm:p-2.5 md:p-3 rounded-full cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#FFAA00] z-50 group"
        aria-label="Help Center"
        onClick={handleHelpClick}
      >
        <img
          src={helpIcon}
          alt="Help Icon"
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-[30px] lg:w-[30px] transition-transform duration-200 group-hover:scale-110"
        />
      </button>
    </section>
  );
}

export default Home;
