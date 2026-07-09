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
