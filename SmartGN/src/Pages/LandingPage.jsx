import React from 'react'
import {useState,useEffect,useRef} from 'react'; 
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/LanguageSelector'
import logoImage from '../assets/logo.png'
import homeIcon from '../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import aboutIcon from '../assets/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import servicesIcon from '../assets/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import menuIcon from '../assets/menu_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import Services from './Services'

// LANDING PAGE COMPONENT
// Main landing page that includes navbar, hero section, about, services and footer

function LandingPage() {

  // STATE MANAGEMENT
  // Mobile menu management state - controls the visibility of mobile sidebar.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref for mobile menu DOM element - To detect clicks outside the menu.
  const mobileMenuRef = useRef(null);

  // MOBILE MENU HANDLERS
  // Toggles the mobile sidebar menu visibility (opens/closes the menu)
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Closes the mobile sidebar menu - called when clicking outside or on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // SIDE EFFECTS (useEffect Hooks)
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
       // Check if click is outside mobile menu AND sidebar is open
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Only add event listener when sidebar is open to improve performance
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
     // Cleanup: remove event listener when component unmounts or sidebar closes
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile sidebar is open.
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Disable scrolling on body when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when sidebar closes
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup: ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]); // Re-run effect when isMobileMenuOpen changes

  // LANGUAGE & TRANSLATION SETUP
  // Get current language and translation function from custom hook
  const { lang } = useLanguage()
  const t = translations[lang]
  
  // Navigation translations for different languages (EN, SI, TA)
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

  // Navigation links data array - stores name, icon, and href for each nav item
  const navLinks = [
    { name: t.home, icon: homeIcon, href: '#home' },
    { name: navTranslations[lang].about, icon: aboutIcon, href: '#about' },
    { name: navTranslations[lang].services, icon: servicesIcon, href: '#services' }
  ];

  // COMPONENT RENDER
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col items-stretch text-center">
      <header className="flex justify-between items-center py-[20px] px-[100px] bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.2)] max-lg:px-[60px] max-md:px-[30px] py-[10px]">

        {/* DESKTOP NAVBAR - Visible on tablets and desktops (md and above)*/}
        <div className="flex w-full justify-between items-center max-md:hidden">

          {/* Logo Section - Clickable to navigate home */}
          <div className="w-[280px] max-lg:w-[200px]" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logoImage} alt="SmartGN Logo" />
          </div>

          {/* Desktop Navigation Links - Horizontal menu */}
          <nav className="flex items-center justify-between gap-20 max-lg:gap-10">   
            {navLinks.map((link) => (
              <a
                className="flex items-center gap-2.5 max-lg:gap-1.25 text-[#2D3748] font-medium text-[16px] hover:text-[#005BBD] hover:underline underline-offset-4 decoration-[#D69E2E] decoration-2 transition-colors duration-300"
                key={link.name}
                href={link.href}>
                <img className="w-auto h-5" src={link.icon} alt={`${link.name} icon`} />
                <span>{link.name}</span>
              </a>
            ))}
          </nav>
        
          {/* Language Selector Component */}
          <LanguageSelector />
        </div>

        {/* MOBILE NAVBAR - Visible only on mobile devices (max-md)            */}
        <div className="hidden max-md:w-full max-md:flex mx-md:w-full max-md:justify-between max-md:items-center max-md:justify-between">
          {/*Menu Button - Toggles mobile sidebar */}
          <button 
            className="flex flex-col gap-1.5 p-2 z-50 relative"
            onClick={toggleMobileMenu}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}>
            <img src={menuIcon} alt="Menu" className="w-auto h-6" />
          </button>

          {/* Logo Section - Clickable to navigate home */}
          <div className="max-md:w-[150px]" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logoImage} alt="SmartGN Logo" />
          </div>

          {/* Language Selector Component */}
          <LanguageSelector />

          {/* Overlay Background - Darkens page content when sidebar is open */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={closeMobileMenu}
              aria-label="Close menu overlay"
              role="presentation" />
          )}
      
          {/* VERTICAL NAVIGATION SIDEBAR - Slides in from left on mobile      */}
          <div 
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 w-50 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            aria-label="Navigation menu"
            role="navigation">

            {/* Sidebar Header - Title section */}
            <div className="px-8 py-4 border-b border-[#2D37481D]">
                <h2 className="text-[1rem] text-left font-bold text-[#2c5f8a]">
                  Navigation <br />
                  Menu
                </h2>
            </div>

            {/* Vertical Navigation Links - Optimized for mobile touch targets */}
            <div className="flex flex-col px-4">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-4 text-[#2D3748] font-medium text-[0.813rem] hover:bg-[#EBF8FF] hover:text-[#2c5f8a] transition-all duration-300 rounded-lg border-b border-gray-100"
                  style={{ animationDelay: `${index * 0.05}s` }}>
                  <img src={link.icon} alt={`${link.name} icon`} className="w-auto h-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

        {/* MAIN CONTENT SECTION - Home, About, Services will be added here    */}
        {/* TODO: Add Home, About, Services components here */}
    </div>
  )
}

export default LandingPage