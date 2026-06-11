import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'

function Login() {
    const navigate = useNavigate()
    const { lang } = useLanguage()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const loginTranslations = {
        EN: {
            title: "Login",
            identifierLabel: "Enter your Username",
            identifierPlaceholder: "e.g., 199912345678, email, or username",
            passwordLabel: "Enter Password",
            passwordPlaceholder: "Enter your password",
            submitButton: "Login",
            noAccount: "Don't have an account ?",
            registerLink: "Register here",
            backHome: "Back",
            forgotPassword: "Forgot Password ?",
            contactSupport: "Contact Support",
        },
        SI: {
            title: "ඇතුල්වීම",
            identifierLabel: "ඔබගේ පරිශීලක නාමය ඇතුළත් කරන්න",
            identifierPlaceholder: "උදා: 199912345678, විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය",
            passwordLabel: "මුරපදය ඇතුළත් කරන්න",
            passwordPlaceholder: "ඔබගේ මුරපදය ඇතුළත් කරන්න",
            submitButton: "ඇතුල් වන්න",
            noAccount: "ගිණුමක් නොමැතිද ?",
            registerLink: "මෙහි ලියාපදිංචි වන්න",
            backHome: "ආපසු",
            forgotPassword: "මුරපදය අමතකද ?",
            contactSupport: "සහාය අමතන්න",
        },
        TA: {
            title: "உள்நுழைவு",
            identifierLabel: "உங்கள் பயனர் பெயரை உள்ளிடவும்",
            identifierPlaceholder: "உதா: 199912345678, மின்னஞ்சல் அல்லது பயனர் பெயர்",
            passwordLabel: "கடவுச்சொல்லை உள்ளிடவும்",
            passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
            submitButton: "உள்நுழைக",
            noAccount: "கணக்கு இல்லையா ?",
            registerLink: "இங்கே பதிவு செய்க",
            backHome: "பின்னால்",
            forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா ?",
            contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
        }
    }

    const t = loginTranslations[lang] || loginTranslations.EN

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        if (!identifier || !password) {
            setErrorMessage(lang === 'EN' ? 'Please fill in all fields.' : lang === 'SI' ? 'කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න.' : 'தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்.')
            return
        }

        setErrorMessage('')
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            })

            const data = await response.json()
            if (!response.ok) {
                setErrorMessage(data.error || (lang === 'EN' ? 'Invalid credentials or suspended account.' : lang === 'SI' ? 'වලංගු නොවන අක්තපත්‍ර හෝ අත්හිටුවන ලද ගිණුමකි.' : 'தவறான சான்றுகள் அல்லது இடைநிறுத்தப்பட்ட கணக்கு.'))
                return
            }

            // Store JWT token
            localStorage.setItem('smartgn_token', data.token)
            localStorage.setItem('smartgn_user_role', data.role)
            localStorage.setItem('smartgn_user_name', data.user.name)

            if (data.role === 'RESIDENT') {
                localStorage.setItem('smartgn_user_id', data.user.nic)
                localStorage.setItem('smartgn_user_division', data.user.division)
                navigate('/dashboard/resident', {
                    state: {
                        successUser: data.user.name,
                        division: data.user.division,
                        nic: data.user.nic
                    }
                })
            } else if (data.role === 'OFFICER') {
                localStorage.setItem('smartgn_user_id', data.user.id)
                localStorage.setItem('smartgn_user_division', data.user.divisionName)
                navigate('/dashboard/officer', {
                    state: {
                        successUser: data.user.name,
                        officerId: data.user.id,
                        division: data.user.divisionName
                    }
                })
            } else if (data.role === 'ADMIN') {
                localStorage.setItem('smartgn_user_id', data.user.id)
                navigate('/dashboard/admin', {
                    state: {
                        successUser: data.user.name
                    }
                })
            }
        } catch (err) {
            setErrorMessage(lang === 'EN' ? 'Network connection error. Please verify the MySQL backend is active.' : lang === 'SI' ? 'ජාල සම්බන්ධතා දෝෂයකි. MySQL පසුබිම් සේවාදායකය ක්‍රියාකාරී දැයි පරීක්ෂා කරන්න.' : 'பிணைய இணைப்பு பிழை. MySQL பின்தள சேவையகம் செயலில் உள்ளதா என சரிபார்க்கவும்.')
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 relative">
            {/* Language Selector floating in top right */}
            <div className="absolute top-6 right-8">
                <LanguageSelector />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[540px] bg-white rounded-[32px] border border-[#2D37482D] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col transition-all duration-300">
                
                {/* Card Title */}
                <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-8 tracking-tight">
                    {t.title}
                </h2>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
                    {/* Identifier field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="identifier" className="text-[14px] font-medium text-[#2D3748] text-left">
                            {t.identifierLabel}
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                            placeholder={t.identifierPlaceholder}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-[14px] font-medium text-[#2D3748] text-left">
                            {t.passwordLabel}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                            placeholder={t.passwordPlaceholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Links Row */}
                    <div className="flex justify-between items-center text-[13.5px] font-semibold text-[#D69E2E] px-1">
                        <span 
                            className="hover:text-[#FFAA00] cursor-pointer transition-colors duration-200"
                            onClick={() => console.log('Forgot password clicked')}
                        >
                            {t.forgotPassword}
                        </span>
                        <span 
                            className="hover:text-[#FFAA00] cursor-pointer transition-colors duration-200"
                            onClick={() => console.log('Contact support clicked')}
                        >
                            {t.contactSupport}
                        </span>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-[#ef4444] text-[13px] text-left mt-1">
                            {errorMessage}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-2"
                    >
                        {t.submitButton}
                    </button>
                </form>

                {/* Help / Register link */}
                <div className="text-[14px] text-gray-500 text-center mt-6">
                    {t.noAccount}{' '}
                    <span
                        className="text-[#D69E2E] hover:text-[#FFAA00] font-semibold cursor-pointer ml-1 transition-colors duration-200"
                        onClick={() => navigate('/register')}
                    >
                        {t.registerLink}
                    </span>
                </div>

                {/* Bottom Row: Back & Logo */}
                <div className="flex justify-between items-center mt-12 border-t border-[#2D37481F] pt-6">
                    {/* Back Button */}
                    <button 
                        className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D3748] text-[14px] font-medium transition-colors duration-200 cursor-pointer" 
                        onClick={() => navigate('/')}
                    >
                        <span className="text-[18px]">←</span> {t.backHome}
                    </button>

                    {/* SmartGN Logo */}
                    <div className="flex flex-col items-end">
                        <img 
                            src={logoImage} 
                            alt="SmartGN Logo" 
                            className="w-[120px] h-auto object-contain cursor-pointer" 
                            onClick={() => navigate('/')}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login

