import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'

const loginTranslations = {
  EN: {
    title: "Welcome Back",
    subtitle: "Sign in to access your digital service portal",
    roleLabel: "Select your role",
    citizen: "Citizen",
    officer: "Grama Niladhari",
    admin: "Admin / DS",
    nicLabel: "NIC Number",
    nicPlaceholder: "Enter NIC (e.g., 199512345678)",
    emailLabel: "Email Address",
    emailPlaceholder: "name@division.gov.lk",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    loginBtn: "Sign In Securely",
    backBtn: "Back to Home",
    forgotPass: "Forgot password?",
    noAccount: "New to SmartGN? Register your profile.",
    errorRequired: "Please enter both credentials.",
    successMsg: "Signing in securely..."
  },
  SI: {
    title: "නැවත සාදරයෙන් පිළිගනිමු",
    subtitle: "ඩිජිටල් සේවා ද්වාරයට පිවිසීමට ඇතුල් වන්න",
    roleLabel: "ඔබගේ භූමිකාව තෝරන්න",
    citizen: "පුරවැසියා",
    officer: "ග්‍රාම නිලධාරී",
    admin: "පරිපාලක / ප්‍රා.ලේ",
    nicLabel: "ජාතික හැඳුනුම්පත් අංකය (NIC)",
    nicPlaceholder: "ජා.හැ.අංකය ඇතුළත් කරන්න (උදා: 199512345678)",
    emailLabel: "විද්‍යුත් තැපැල් ලිපිනය",
    emailPlaceholder: "name@division.gov.lk",
    passwordLabel: "මුරපදය",
    passwordPlaceholder: "••••••••",
    loginBtn: "ආරක්ෂිතව ඇතුල් වන්න",
    backBtn: "මුල් පිටුවට",
    forgotPass: "මුරපදය අමතකද?",
    noAccount: "SmartGN වෙත අලුත්ද? ලියාපදිංචි වන්න.",
    errorRequired: "කරුණාකර අක්තපත්‍ර දෙකම ඇතුළත් කරන්න.",
    successMsg: "ආරක්ෂිතව ඇතුල් වෙමින් පවතී..."
  },
  TA: {
    title: "மீண்டும் வருக",
    subtitle: "டிஜிட்டல் சேவை போர்ட்டலை அணுக உள்நுழையவும்",
    roleLabel: "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
    citizen: "குடிமகன்",
    officer: "கிராம நிலதாரி",
    admin: "நிர்வாகி / பி.செ",
    nicLabel: "தேசிய அடையாள அட்டை எண் (NIC)",
    nicPlaceholder: "அடையாள அட்டை எண் (எ.கா. 199512345678)",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "name@division.gov.lk",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "••••••••",
    loginBtn: "பாதுகாப்பாக உள்நுழைக",
    backBtn: "முகப்பிற்குச் செல்ல",
    forgotPass: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    noAccount: "SmartGN க்கு புதியவரா? பதிவு செய்யுங்கள்.",
    errorRequired: "தயவுசெய்து இரண்டு விபரங்களையும் உள்ளிடவும்.",
    successMsg: "பாதுகாப்பாக உள்நுழைகிறது..."
  }
};

function Login() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = loginTranslations[lang] || loginTranslations.EN;

  // Form states
  const [role, setRole] = useState('citizen'); // citizen, officer, admin
  const [identifier, setIdentifier] = useState(''); // NIC or Email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password.trim()) {
      setError(t.errorRequired);
      return;
    }

    setLoading(true);
    // Simulate API call authentication
    setTimeout(() => {
      setLoading(false);
      setSuccess(t.successMsg);
      // Redirect to RAppointment (dashboard) page after a small delay for premium UX feedback
      setTimeout(() => {
        navigate('/RAppointment');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] flex flex-col justify-between items-center relative overflow-hidden p-6 font-sans">
      
      {/* Decorative blurred background shapes for glassmorphism WOW factor */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#EBF8FF] blur-[80px] -z-10 animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#FEFCBF]/30 blur-[100px] -z-10 animate-pulse duration-[8000ms]"></div>

      {/* Header section with Logo and Language Selector */}
      <header className="w-full max-w-[1200px] flex justify-between items-center py-4 z-20">
        <div className="w-[180px] sm:w-[240px] cursor-pointer hover:opacity-95 transition-opacity" onClick={() => navigate('/')}>
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
        </div>
        <LanguageSelector />
      </header>

      {/* Main Login Card Container */}
      <main className="w-full flex justify-center items-center py-8 z-10">
        <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_12px_40px_rgba(27,54,93,0.08)] border border-slate-100 p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(27,54,93,0.12)]">
          
          {/* Header Texts */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-[28px] font-bold text-[#1B365D] tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Form Alert Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[13.5px] font-medium p-3.5 rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-600 text-[13.5px] font-medium p-3.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[13.5px] font-semibold text-slate-700">
              {t.roleLabel}
            </span>
            <div className="grid grid-cols-3 bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                className={`py-2 px-1 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  role === 'citizen'
                    ? 'bg-[#1B365D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1B365D] hover:bg-slate-200/50'
                }`}
                onClick={() => { setRole('citizen'); setIdentifier(''); setError(''); }}
              >
                {t.citizen}
              </button>
              <button
                type="button"
                className={`py-2 px-1 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  role === 'officer'
                    ? 'bg-[#1B365D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1B365D] hover:bg-slate-200/50'
                }`}
                onClick={() => { setRole('officer'); setIdentifier(''); setError(''); }}
              >
                {t.officer}
              </button>
              <button
                type="button"
                className={`py-2 px-1 text-[13px] font-semibold rounded-lg transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-[#1B365D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1B365D] hover:bg-slate-200/50'
                }`}
                onClick={() => { setRole('admin'); setIdentifier(''); setError(''); }}
              >
                {t.admin}
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Dynamic Identifier Field (NIC for Citizens, Email for others) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[13.5px] font-semibold text-slate-700">
                {role === 'citizen' ? t.nicLabel : t.emailLabel}
              </label>
              <div className="relative flex items-center">
                <input
                  type={role === 'citizen' ? 'text' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'citizen' ? t.nicPlaceholder : t.emailPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-[#1B365D] focus:bg-white rounded-xl text-[14.5px] text-slate-800 placeholder-slate-400 font-medium outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,54,93,0.1)]"
                />
                <span className="absolute right-4 text-slate-400">
                  {role === 'citizen' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[13.5px] font-semibold text-slate-700">
                  {t.passwordLabel}
                </label>
                <a href="#forgot" className="text-[12.5px] font-semibold text-[#D69E2E] hover:text-[#FFAA00] transition-colors">
                  {t.forgotPass}
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-[#1B365D] focus:bg-white rounded-xl text-[14.5px] text-slate-800 placeholder-slate-400 font-medium outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,54,93,0.1)]"
                />
                <button
                  type="button"
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-2 bg-[#1B365D] hover:bg-[#005BBD] text-white font-semibold text-[15px] rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(27,54,93,0.25)] hover:shadow-[0_6px_20px_rgba(0,91,189,0.3)] transition-all duration-300 flex items-center justify-center gap-2 ${
                loading ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span>{t.loginBtn}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <hr className="w-full border-slate-100" />
            <span className="text-[12px] font-semibold text-slate-400 tracking-wider uppercase">OR</span>
            <hr className="w-full border-slate-100" />
          </div>

          {/* Footer of card */}
          <div className="text-center flex flex-col gap-3">
            <span className="text-[13.5px] font-medium text-slate-500">
              {t.noAccount}
            </span>
            <button
              onClick={() => navigate('/')}
              className="text-[14px] font-semibold text-[#1B365D] hover:text-[#005BBD] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t.backBtn}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 z-10">
        <p className="text-[12px] text-slate-400 font-medium">
          © {new Date().getFullYear()} SmartGN. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;
