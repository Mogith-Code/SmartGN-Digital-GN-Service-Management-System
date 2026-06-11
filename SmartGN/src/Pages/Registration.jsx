import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'

const registrationTranslations = {
  EN: {
    title: "Create Resident Account",
    nicLabel: "NIC Number", 
    nicPlaceholder: "Enter NIC Number",
    householdLabel: "Household Number",
    householdPlaceholder: "Enter Household Number",
    firstNameLabel: "First Name",
    firstNamePlaceholder: "Enter First Name",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Enter Last Name",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter Email Address",
    dobLabel: "Date of Birth",
    genderLabel: "Gender",
    genderPlaceholder: "Select Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter Mobile Number",
    divisionLabel: "Select GN Division",
    divisionPlaceholder: "Select division",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter Password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm Password",
    submitButton: "Create Account",
    alreadyAccount: "Already have an account?",
    loginLink: "Login here",
    back: "Back",
    errorAllFields: "Please fill in all fields.",
    errorPasswordMatch: "Passwords do not match.",
    errorRegistrationFailed: "Registration failed. Please verify your details.",
    errorNetwork: "Network connection error. Please make sure the MySQL backend server is active."
  },
  SI: {
    title: "නේවාසික ගිණුමක් සාදන්න",
    nicLabel: "ජාතික හැඳුනුම්පත් අංකය",
    nicPlaceholder: "ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න",
    householdLabel: "ගෘහ අංකය",
    householdPlaceholder: "ගෘහ අංකය ඇතුළත් කරන්න",
    firstNameLabel: "මුල් නම",
    firstNamePlaceholder: "මුල් නම ඇතුළත් කරන්න",
    lastNameLabel: "වාසගම",
    lastNamePlaceholder: "වාසගම ඇතුළත් කරන්න",
    emailLabel: "විද්‍යුත් තැපැල් ලිපිනය",
    emailPlaceholder: "විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න",
    dobLabel: "උපන් දිනය",
    genderLabel: "ස්ත්‍රී/පුරුෂ භාවය",
    genderPlaceholder: "තෝරන්න",
    genderMale: "පුරුෂ",
    genderFemale: "ස්ත්‍රී",
    genderOther: "වෙනත්",
    mobileLabel: "ජංගම දුරකථන අංකය",
    mobilePlaceholder: "ජංගම දුරකථන අංකය ඇතුළත් කරන්න",
    divisionLabel: "ග්‍රාම නිලධාරී වසම තෝරන්න",
    divisionPlaceholder: "වසම තෝරන්න",
    passwordLabel: "මුරපදය",
    passwordPlaceholder: "මුරපදය ඇතුළත් කරන්න",
    confirmPasswordLabel: "මුරපදය තහවුරු කරන්න",
    confirmPasswordPlaceholder: "මුරපදය නැවත ඇතුළත් කරන්න",
    submitButton: "ගිණුම සාදන්න",
    alreadyAccount: "දැනටමත් ගිණුමක් තිබේද?",
    loginLink: "මෙහි ඇතුල් වන්න",
    back: "ආපසු",
    errorAllFields: "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න.",
    errorPasswordMatch: "මුරපද නොගැලපේ.",
    errorRegistrationFailed: "ලියාපදිංචි වීම අසාර්ථකයි. කරුණාකර තොරතුරු පරීක්ෂා කරන්න.",
    errorNetwork: "ජාල සම්බන්ධතා දෝෂයකි. MySQL පසුබිම් සේවාදායකය සක්‍රීය දැයි පරීක්ෂා කරන්න."
  },
  TA: {
    title: "குடியுரிமை கணக்கை உருவாக்கவும்",
    nicLabel: "தேசிய அடையாள அட்டை எண்",
    nicPlaceholder: "அடையாள அட்டை எண் உள்ளிடவும்",
    householdLabel: "வீட்டு எண்",
    householdPlaceholder: "வீட்டு எண் உள்ளிடவும்",
    firstNameLabel: "முதல் பெயர்",
    firstNamePlaceholder: "முதல் பெயர் உள்ளிடவும்",
    lastNameLabel: "இறுதிப் பெயர்",
    lastNamePlaceholder: "இறுதிப் பெயர் உள்ளிடவும்",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "மின்னஞ்சல் முகவரி உள்ளிடவும்",
    dobLabel: "பிறந்த தேதி",
    genderLabel: "பாலினம்",
    genderPlaceholder: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    genderMale: "ஆண்",
    genderFemale: "பெண்",
    genderOther: "இதர",
    mobileLabel: "கைபேசி எண்",
    mobilePlaceholder: "கைபேசி எண் உள்ளிடவும்",
    divisionLabel: "கிராம நிலதாரி பிரிவைத் தேர்ந்தெடுக்கவும்",
    divisionPlaceholder: "பிரிவைத் தேர்ந்தெடுக்கவும்",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "கடவுச்சொல் உள்ளிடவும்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
    submitButton: "கணக்கை உருவாக்கு",
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginLink: "இங்கே உள்நுழையவும்",
    back: "திரும்புக",
    errorAllFields: "தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்.",
    errorPasswordMatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
    errorRegistrationFailed: "பதிவு தோல்வியடைந்தது. விவரங்களைச் சரிபார்க்கவும்.",
    errorNetwork: "பிணைய இணைப்பு பிழை. MySQL பின்தள சேவையகம் செயலில் உள்ளதா என சரிபார்க்கவும்."
  }
}

function Register() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = registrationTranslations[lang] || registrationTranslations.EN
  
  // Registration Form States
  const [nic, setNic] = useState('')
  const [household, setHousehold] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [division, setDivision] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [divisions, setDivisions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

}
  



export default Register
