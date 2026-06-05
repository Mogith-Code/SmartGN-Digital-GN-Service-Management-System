import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../utils/translate'
import languageIcon from '../../assets/language_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import arrowDownIcon from '../../assets/keyboard_arrow_down_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import selectedIcon from '../../assets/check_small_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'

function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'SI', name: 'සිංහල' },
    { code: 'TA', name: 'தமிழ்' }
  ]

  const activeLanguage = languages.find(l => l.code === lang) || languages[0]

  return (
    <div className="relative flex" ref={dropdownRef}>
      <div className="flex items-center gap-[10px] max-lg:gap-[5px] border border-[#2D37488D] rounded-[150px] py-[10px] px-[30px] max-lg:py-[5px] max-lg:px-[20px] max-md:px-[10px] text-[16px] max-md:text-[14px] font-medium text-[#2D3748] cursor-pointer transition-all duration-200 hover:bg-slate-100" 
           onClick={() => setIsOpen(!isOpen)} role="button" aria-haspopup="true" aria-expanded={isOpen}>
        <img src={languageIcon} alt="Language" className="w-auto h-5" />
        <span>{activeLanguage.name}</span>
        <img src={arrowDownIcon} alt="Select Language" className={`w-auto h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /> 
      </div>

      {isOpen && (
        <ul className="absolute top-[calc(100%+8px)] right-0 min-w-[140px] bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-2 m-0 list-none z-[9999] animate-[langFadeIn_0.2s_ease]">
          {languages.map((item) => (
            <li
              key={item.code}
              className={`flex items-center justify-between px-3 py-2 text-[13.5px] font-medium text-slate-800 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-100 ${lang === item.code ? 'selected' : ''}`}
              onClick={() => {
                changeLanguage(item.code)
                setIsOpen(false)
              }}
            >
              {item.name}
              {lang === item.code && (
                <img src={selectedIcon} alt="Language" className="w-auto h-5" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelector
