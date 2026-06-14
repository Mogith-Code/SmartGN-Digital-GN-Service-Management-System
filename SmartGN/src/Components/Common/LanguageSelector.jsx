// src/components/Common/LanguageSelector.jsx
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../utils/translate";
import languageIcon from "../../assets/language_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import arrowDownIcon from "../../assets/keyboard_arrow_down_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import selectedIcon from "../../assets/check_small_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = [
    { code: "EN", name: "English" },
    { code: "SI", name: "සිංහල" },
    { code: "TA", name: "தமிழ்" },
  ];

  const activeLanguage = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* ==================================================================== */}
      {/* LANGUAGE SELECTOR BUTTON */}
      {/* ==================================================================== */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px] border border-[#2D37488D] rounded-full py-1.5 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 lg:py-[10px] lg:px-[30px] text-sm sm:text-base lg:text-[16px] font-medium text-[#2D3748] cursor-pointer transition-all duration-200 hover:bg-slate-100"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Language Icon */}
        <img
          src={languageIcon}
          alt="Language"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 object-contain"
        />

        {/* Selected Language Name */}
        <span className="text-xs sm:text-sm md:text-base lg:text-[16px]">
          {activeLanguage.name}
        </span>

        {/* Dropdown Arrow Icon */}
        <img
          src={arrowDownIcon}
          alt="Select Language"
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 object-contain transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* ==================================================================== */}
      {/* LANGUAGE DROPDOWN MENU */}
      {/* ==================================================================== */}
      {isOpen && (
        <ul className="absolute top-[calc(100%+8px)] right-0 min-w-[130px] sm:min-w-[140px] md:min-w-[150px] lg:min-w-[160px] bg-white/90 sm:bg-white/80 backdrop-blur-sm sm:backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-1.5 sm:p-2 m-0 list-none z-[9999] animate-[langFadeIn_0.2s_ease]">
          {languages.map((item) => (
            <li
              key={item.code}
              className={`
                flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5
                text-xs sm:text-sm md:text-[13.5px] font-medium 
                text-slate-800 rounded-lg cursor-pointer transition-all duration-150 
                hover:bg-gray-100
                ${lang === item.code ? "bg-gray-50" : ""}
              `}
              onClick={() => {
                changeLanguage(item.code);
                setIsOpen(false);
              }}
            >
              <span>{item.name}</span>
              {lang === item.code && (
                <img
                  src={selectedIcon}
                  alt="Selected"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 object-contain text-green-500"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;
