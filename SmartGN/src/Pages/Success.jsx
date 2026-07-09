import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'

const successTranslations = {
  EN: {
    title: "Account Created Successfully!",
    subtitle: "Your resident account has been created and registered with the digital Grama Niladhari service portal.",
    nextSteps: "You can now log in using your credentials to apply for certificates, request appointments, and access other services.",
    loginBtn: "Proceed to Login",
    homeBtn: "Back to Home",
    welcome: "Welcome,",
    fallbackUser: "Resident Account"
  },
  SI: {
    title: "ගිණුම සාර්ථකව සාදන ලදී!",
    subtitle: "ඔබගේ නේවාසික ගිණුම සාර්ථකව සාදා ඩිජිටල් ග්‍රාම නිලධාරී සේවා ද්වාරයෙහි ලියාපදිංචි කර ඇත.",
    nextSteps: "සහතික පත්‍ර සඳහා ඉල්ලුම් කිරීමට, හමුවීම් වෙන්කරවා ගැනීමට සහ අනෙකුත් සේවාවන් ලබා ගැනීමට ඔබට දැන් ඔබගේ ගිණුම් තොරතුරු භාවිතයෙන් ඇතුල් විය හැක.",
    loginBtn: "ඇතුල්වීමේ පිටුවට",
    homeBtn: "ප්‍රධාන පිටුවට",
    welcome: "සාදරයෙන් පිළිගනිමු,",
    fallbackUser: "නේවාසික ගිණුම"
  },
  TA: {
    title: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!",
    subtitle: "உங்கள் குடியுரிமை கணக்கு உருவாக்கப்பட்டு டிஜிட்டல் கிராம நிலதாரி சேவை போர்ட்டலில் பதிவு செய்யப்பட்டுள்ளது.",
    nextSteps: "சான்றிதழ்களுக்கு விண்ணப்பிக்கவும், சந்திப்புகளைக் கோரவும் மற்றும் பிற சேவைகளைப் பெறவும் இப்போது உங்கள் விவரங்களைப் பயன்படுத்தி உள்நுழையலாம்.",
    loginBtn: "உள்நுழைய செல்லவும்",
    homeBtn: "முகப்புப் பக்கத்திற்கு",
    welcome: "வரவேற்கிறோம்,",
    fallbackUser: "குடியுரிமை கணக்கு"
  }
}

function Success() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = successTranslations[lang] || successTranslations.EN

  // Retrieve user info from state if navigated from registration
  const successUser = location.state?.successUser || t.fallbackUser

   return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 relative bg-[#F7FAFC]">
      {/* Language Selector */}
      <div className="absolute top-6 right-8">
        <LanguageSelector />
      </div>

      {/* Success Card */}
      <div className="w-full max-w-[550px] bg-white rounded-[32px] border border-[#2D37482D] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 md:p-12 flex flex-col items-center transition-all duration-300 text-center">
        
        {/* Animated Checkmark Wrapper */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.15)] animate-pulse">
            <svg 
              className="w-10 h-10 text-emerald-500" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-ping"></div>
        </div>

        {/* Success Title */}
        <h2 className="text-[26px] font-bold text-[#1B365D] mb-2 tracking-tight">
          {t.title}
        </h2>

        {/* Registered User Badge */}
        <div className="mb-6 px-4 py-2 bg-[#EBF1F6] rounded-full border border-[#2D37481F]">
          <span className="text-[13px] font-medium text-gray-500 mr-1.5">{t.welcome}</span>
          <span className="text-[14px] font-semibold text-[#1B365D]">{successUser}</span>
        </div>

        {/* Informative Descriptions */}
        <p className="text-[15px] text-[#2D3748] leading-relaxed mb-4">
          {t.subtitle}
        </p>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
          {t.nextSteps}
        </p>

        {/* Buttons / Actions */}
        <div className="w-full flex flex-col gap-3.5">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.25)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.35)] transition-all duration-300 cursor-pointer"
          >
            {t.loginBtn}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-transparent hover:bg-gray-50 text-[#1B365D] border border-[#1B365D2A] hover:border-[#1B365D] font-medium text-[16px] rounded-full transition-all duration-300 cursor-pointer"
          >
            {t.homeBtn}
          </button>
        </div>

        {/* Footer Brand & Logo */}
        <div className="w-full flex justify-center items-center mt-10 border-t border-[#2D37481F] pt-6">
          <img 
            src={logoImage} 
            alt="SmartGN Logo" 
            className="w-[125px] h-auto object-contain cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200" 
            onClick={() => navigate('/')}
          />
        </div>

      </div>
    </div>
  )
}

export default Success

