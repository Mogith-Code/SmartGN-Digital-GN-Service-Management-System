import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function Login() {
    const navigate = useNavigate()
    const { lang } = useLanguage()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const loginTranslations = {
        EN: {
            title: "Sign In to SmartGN",
            subtitle: "Access resident services, officer portals, and administrative tools.",
            identifierLabel: "NIC Number, Email, or Username",
            identifierPlaceholder: "e.g., 199912345678, officer@domain.com, or admin",
            passwordLabel: "Password",
            passwordPlaceholder: "Enter your password",
            submitButton: "Sign In",
            noAccount: "Don't have an account?",
            registerLink: "Register here as a Resident",
            backHome: "Back to Home",
        },
        SI: {
            title: "SmartGN වෙත ඇතුල් වන්න",
            subtitle: "ගම්වැසි සේවා, ග්‍රාම නිලධාරී ද්වාරය සහ පාලන මෙවලම් වෙත ප්‍රවේශ වන්න.",
            identifierLabel: "ජාතික හැඳුනුම්පත් අංකය, විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය",
            identifierPlaceholder: "උදා: 199912345678, officer@domain.com හෝ admin",
            passwordLabel: "මුරපදය",
            passwordPlaceholder: "ඔබගේ මුරපදය ඇතුළත් කරන්න",
            submitButton: "ඇතුල් වන්න",
            noAccount: "ගිණුමක් නොමැතිද?",
            registerLink: "මෙහි පදිංචිකරුවෙකු ලෙස ලියාපදිංචි වන්න",
            backHome: "මුල් පිටුවට",
        },
        TA: {
            title: "SmartGN இல் உள்நுழைக",
            subtitle: "குடியிருப்பாளர் சேவைகள், அதிகாரி போர்ட்டல் மற்றும் நிர்வாகக் கருவிகளை அணுகவும்.",
            identifierLabel: "தேசிய அடையாள அட்டை (NIC) எண், மின்னஞ்சல் அல்லது பயனர் பெயர்",
            identifierPlaceholder: "உதா: 199912345678, officer@domain.com அல்லது admin",
            passwordLabel: "கடவுச்சொல்",
            passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
            submitButton: "உள்நுழைக",
            noAccount: "கணக்கு இல்லையா?",
            registerLink: "இங்கே குடியிருப்பாளராக பதிவு செய்க",
            backHome: "முகப்பிற்குத் திரும்பு",
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
            // On success saving the information
            navigate('/')
        } catch (error) {
            console.error('Login error:', error)
            setErrorMessage(lang === 'EN' ? 'An error occurred. Please try again.' : lang === 'SI' ? 'දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.' : 'ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.')
        }
    }

    return (
        <div className="screen-fade-active">
            <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <button className="btn-back" onClick={() => navigate('/')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    {t.backHome}
                </button>
                <LanguageSelector />
            </div>

            <div className="form-title-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{t.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
                <div className="form-grid" style={{ gap: '16px' }}>
                    <div className="form-group">
                        <label htmlFor="identifier">{t.identifierLabel}</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                    <circle cx="9" cy="12" r="3"></circle>
                                    <line x1="17" y1="9" x2="17" y2="9"></line>
                                    <line x1="15" y1="15" x2="19" y2="15"></line>
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="identifier"
                                className="form-control"
                                placeholder={t.identifierPlaceholder}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t.passwordLabel}</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder={t.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {errorMessage && (
                    <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                        {errorMessage}
                    </p>
                )}

                <button type="submit" className="btn-submit" style={{ marginTop: '16px' }}>
                    {t.submitButton}
                </button>
            </form>

            <div className="account-help" style={{ marginTop: '24px', textAlign: 'center' }}>
                {t.noAccount}{' '}
                <span
                    className="link-orange"
                    onClick={() => navigate('/register')}
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {t.registerLink}
                </span>
            </div>
        </div>
    )
}

export default Login
