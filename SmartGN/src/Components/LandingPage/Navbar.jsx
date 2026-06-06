import React from 'react'
import {useState,useEffect,useRef} from 'react'; 
import { translations, useLanguage } from '../../utils/translate'
import LanguageSelector from '../Common/LanguageSelector'
import logoImage from '../../assets/logo.png'
import homeIcon from '../../assets/home_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import aboutIcon from '../../assets/info_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import servicesIcon from '../../assets/accessibility_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import menuIcon from '../../assets/menu_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'

function Navbar() {
  
  // LANGUAGE & TRANSLATION SETUP
  // Get current language and translation function from custom hook
  const { lang } = useLanguage()
  const t = translations[lang]
      
  // Navigation translations for different languages (EN, SI, TA)
  const navTranslations = {
    EN: { about: "About", services: "Services" },
    SI: { about: "අපි ගැන", services: "සේවාවන්" },
    TA: { about: "எங்களைப் பற்றி", services: "சேவைகள்" }
  };
    
  // Navigation links data array - stores name, icon, and href for each nav item
  const navLinks = [
    { name: t.home, icon: homeIcon, href: '#home' },
    { name: navTranslations[lang].about, icon: aboutIcon, href: '#about' },
    { name: navTranslations[lang].services, icon: servicesIcon, href: '#services' }
  ];

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
    
  return (
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
            )
           )
          }
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
          )
        }
      
        {/* VERTICAL NAVIGATION SIDEBAR - Slides in from left on mobile      */}
        <div 
          ref={mobileMenuRef}
          className={`fixed top-0 left-0 w-50 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Navigation menu"
          role="navigation">

          {/* Sidebar Header - Title section */}
          <div className="px-8 py-4 border-b border-[#2D37481D]">
            <h2 className="text-[1rem] text-left font-medium text-[#2c5f8a]"> Navigation <br /> Menu </h2>
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
              )
             )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar