import React from 'react'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/LanguageSelector'
import logoImage from '../assets/logo.png'
import homeIcon from '../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import aboutIcon from '../assets/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import servicesIcon from '../assets/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import Services from './Services'


function LandingPage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const navTranslations = {
    EN: {
      about: "About",
      services: "Services",
      login: "Login",
      register: "Register",
      aboutTitle: "About SmartGN",
      aboutDesc: "SmartGN is a modern digital initiative designed to transform the traditional Grama Niladhari service into a high-speed, transparent, and user-friendly experience. We aim to bridge the gap between village-level administration and citizens by leveraging the latest technology to ensure every resident can access essential services from the comfort of their home.",
      objectivesTitle: "Our Objectives",
      servicesTitle: "Services You Can Get",
      servicesList: [
        { title: "Request Certificates", desc: "Apply for character certificates, income certificates, permit requests and more with digital verification." },
        { title: "Book Appointments", desc: "Schedule meetings with your Grama Niladhari officer at convenient times." },
        { title: "Track Requests", desc: "Check the status of your applications (pending, approved, or require further information)." },
        { title: "Apply for Allowances", desc: "Register for Aswesuma, Samurdhi and other government allowance programs." },
        { title: "Disaster Relief", desc: "Report disaster damage and apply for government relief assistance." },
        { title: "Announcements", desc: "Stay informed with official notices and community announcements." }
      ],
      heroDesc: "Empowering you with effortless access to village administrative services. Connect with your Grama Niladhari officer and manage your official needs in just a few clicks."
    },
    SI: {
      about: "අපි ගැන",
      services: "සේවාවන්",
      login: "ඇතුල් වන්න",
      register: "ලියාපදිංචි වන්න",
      aboutTitle: "SmartGN පිළිබඳව",
      aboutDesc: "SmartGN යනු සාම්ප්‍රදායික ග්‍රාම නිලධාරී සේවාව වඩාත් වේගවත්, විනිවිදභාවයකින් යුත් සහ පරිශීලක-හිතකාමී අත්දැකීමක් බවට පත් කිරීම සඳහා නිර්මාණය කර ඇති නවීන ඩිජිටල් මුලපිරීමකි. සෑම පදිංචිකරුවෙකුටම තමාගේම නිවසේ සිට අත්‍යවශ්‍ය සේවාවන් ලබාගත හැකි වන පරිදි නවීන තාක්ෂණය උපයෝගී කර ගනිමින් ගම් මට්ටමේ පරිපාලනය සහ පුරවැසියන් අතර පරතරය පියවීම අපගේ අරමුණයි.",
      objectivesTitle: "අපගේ අරමුණු",
      servicesTitle: "ඔබට ලබාගත හැකි සේවාවන්",
      servicesList: [
        { title: "සහතික ඉල්ලීම්", desc: "ඩිජිටල් සත්‍යාපනය සමඟ චරිත සහතික, ආදායම් සහතික සහ වෙනත් සහතික සඳහා ඉල්ලුම් කරන්න." },
        { title: "හමුවීම් වෙන්කරවා ගැනීම", desc: "පහසු වේලාවන්හිදී ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සාකච්ඡා වෙන්කරවා ගන්න." },
        { title: "ඉල්ලීම් ලුහුබැඳීම", desc: "ඔබගේ ඉල්ලුම්පත්‍රවල වත්මන් තත්ත්වය (පූරණය වෙමින් පවතින, අනුමත හෝ වැඩිදුර තොරතුරු අවශ්‍ය) පරීක්ෂා කරන්න." },
        { title: "දීමනා සඳහා ඉල්ලුම් කිරීම", desc: "අස්වැසුම, සමෘද්ධි සහ අනෙකුත් රජයේ දීමනා වැඩසටහන් සඳහා ලියාපදිංචි වන්න." },
        { title: "ආපදා සහන", desc: "ආපදා හානි වාර්තා කර රජයේ සහන ආධාර සඳහා ඉල්ලුම් කරන්න." },
        { title: "නිවේදන", desc: "නිල නිවේදන සහ ප්‍රජා තොරතුරු පිළිබඳව යාවත්කාලීනව සිටින්න." }
      ],
      heroDesc: "ග්‍රාමීය පරිපාලන සේවාවන් වෙත පහසුවෙන් ප්‍රවේශ වීමට ඔබට බලය ලබා දෙයි. ඔබේ ග්‍රාම නිලධාරීවරයා සමඟ සම්බන්ධ වී ක්ලික් කිරීම් කිහිපයකින් ඔබේ නිල අවශ්‍යතා ඉටු කරගන්න."
    },
    TA: {
      about: "எங்களைப் பற்றி",
      services: "சேவைகள்",
      login: "உள்நுழைக",
      register: "பதிவு செய்க",
      aboutTitle: "SmartGN பற்றி",
      aboutDesc: "SmartGN என்பது பாரம்பரிய கிராம நிலதாரி சேவையை அதிவேகமான, வெளிப்படையான மற்றும் பயனர் நட்பு அனுபவமாக மாற்றுவதற்காக வடிவமைக்கப்பட்ட ஒரு நவீன டிஜிட்டல் முயற்சியாகும். ஒவ்வொரு குடிமகனும் தங்கள் வீட்டில் இருந்தபடியே அத்தியாவசிய சேவைகளைப் பெறுவதை உறுதி செய்வதற்காக கிராம அளவிலான நிர்வாகத்திற்கும் குடிமக்களுக்கும் இடையிலான இடைவெளியை நவீன தொழில்நுட்பத்தின் மூலம் குறைப்பதே எங்கள் நோக்கமாகும்.",
      objectivesTitle: "எங்கள் நோக்கங்கள்",
      servicesTitle: "நீங்கள் பெறக்கூடிய சேவைகள்",
      servicesList: [
        { title: "சான்றிதழ்களைக் கோருங்கள்", desc: "டிஜிட்டல் சரிபார்ப்புடன் நற்சான்றிதழ்கள், வருமானச் சான்றிதழ்கள் மற்றும் பிற சான்றிதழ்களுக்கு விண்ணப்பிக்கவும்." },
        { title: "சந்திப்புகளை முன்பதிவு செய்க", desc: "வசதியான நேரங்களில் உங்கள் கிராம நிலதாரி அதிகாரியுடன் சந்திப்புகளைத் திட்டமிடுங்கள்." },
        { title: "கோரிக்கைகளைக் கண்காணிக்கவும்", desc: "உங்கள் விண்ணப்பங்களின் நிலையைக் கண்டறியவும் (நிலுவையில் உள்ளதா, அங்கீகரிக்கப்பட்டதா அல்லது கூடுதல் தகவல் தேவையா)." },
        { title: "கொடுப்பனவுகளுக்கு விண்ணப்பிக்கவும்", desc: "அஸ்வெசும, சமூர்த்தி மற்றும் பிற அரசு கொடுப்பனவு திட்டங்களுக்கு பதிவு செய்யவும்." },
        { title: "பேரழிவு நிவாரணம்", desc: "பேரழிவு சேதங்களை அறிக்கை செய்து, அரசு நிவாரண உதவிகளுக்கு விண்ணப்பங்கள் அனுப்பவும்." },
        { title: "அறிவிப்புகள்", desc: "அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் சமூகச் செய்திகளுடன் உடனுக்குடன் இணைந்திருங்கள்." }
      ],
      heroDesc: "கிராம நிர்வாகச் சேவைகளுக்கான தடையற்ற அணுகலை உங்களுக்கு வழங்குகிறது. உங்கள் கிராம நிலதாரி அதிகாரியுடன் இணைந்து உங்கள் அதிகாரப்பூர்வ தேவைகளை சில கிளிக்குகளில் நிர்வகிக்கவும்."
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col items-stretch border border-[red] text-center">
       <header className="flex justify-between items-center py-3 px-16 bg-[#EBF8FF] border border-[blue] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
         <div className="flex flex-col items-start text-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img 
            src={logoImage} 
            alt="SmartGN Logo" 
            className="w-70 h-auto border border-[red]"
            />
        </div>

        <nav className="flex items-center gap-9 border border-[red]">   
            <a href="#home" className="flex items-center gap-2 no-underline text-sm font-semibold text-slate-600 py-1.5 px-1 transition-all duration-200">  
                <img src={homeIcon} alt="Home" className="w-auto h-5" />
                {t.home}
            </a>

            <a href="#about" className="flex items-center gap-2 no-underline text-sm font-semibold text-slate-600 py-1.5 px-1 transition-all duration-200">
                <img src={aboutIcon} alt="About" className="w-auto h-5" />
                {navTranslations[lang].about}
            </a>

             <a href="#services" className="flex items-center gap-2 no-underline text-sm font-semibold text-slate-600 py-1.5 px-1 transition-all duration-200">
            <img src={servicesIcon} alt="Services" className="w-auto h-5" />
            {navTranslations[lang].services}
          </a>
        </nav>

        <LanguageSelector />
       </header>
    </div>
  )
}

export default LandingPage