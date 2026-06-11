import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function OfficerProfile({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session parameters (defaults to Kamal Perera if not provided)
  const successUser = location.state?.successUser || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || '200324511540'

  // Banner display toggle
  const [showAlert, setShowAlert] = useState(true)

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState('VIEW')

  // Dynamic Officer Profile State
  const [profile, setProfile] = useState({
    firstName: 'Kamal',
    lastName: 'Perera',
    fullName: 'Dissanayake Mudiyanselage Kamal Perera',
    division: 'Colombo, Borella',
    serviceTime: '2',
    email: 'Nirmal.Perera@example.com',
    mobile: '0703564478',
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null
  })

  // Editable fields state
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editFullName, setEditFullName] = useState('')
  const [editDivision, setEditDivision] = useState('')
  const [editServiceTime, setEditServiceTime] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editProfilePhoto, setEditProfilePhoto] = useState(null)
  const [editIdCardFront, setEditIdCardFront] = useState(null)
  const [editIdCardBack, setEditIdCardBack] = useState(null)

  // Initialize and load from localStorage
  useEffect(() => {
   const saved = localStorage.getItem('smartgn_officer_profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    } else {
      const defaultProfile = {
        firstName: 'Kamal',
        lastName: 'Perera',
        fullName: 'Dissanayake Mudiyanselage Kamal Perera',
        division: 'Colombo, Borella',
        serviceTime: '2',
        email: 'Nirmal.Perera@example.com',
        mobile: '0703564478',
        profilePhoto: null,
        idCardFront: null,
        idCardBack: null
      }
      localStorage.setItem('smartgn_officer_profile', JSON.stringify(defaultProfile))
      setProfile(defaultProfile)
    }
  }, [])

  // Enter edit mode uploader
  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName)
    setEditLastName(profile.lastName)
    setEditFullName(profile.fullName)
    setEditDivision(profile.division)
    setEditServiceTime(profile.serviceTime)
    setEditEmail(profile.email)
    setEditMobile(profile.mobile)
    setEditProfilePhoto(profile.profilePhoto)
    setEditIdCardFront(profile.idCardFront)
    setEditIdCardBack(profile.idCardBack)
    setViewMode('EDIT')
  }

  // Handle Photo uploads (Base64 uploader)
  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (target === 'profilePhoto') {
          setEditProfilePhoto(reader.result)
        } else if (target === 'idCardFront') {
          setEditIdCardFront(reader.result)
        } else if (target === 'idCardBack') {
          setEditIdCardBack(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle saving the updated profile info
  const handleSaveProfile = (e) => {
    e.preventDefault()

    const updatedProfile = {
      firstName: editFirstName,
      lastName: editLastName,
      fullName: editFullName,
      division: editDivision,
      serviceTime: editServiceTime,
      email: editEmail,
      mobile: editMobile,
      profilePhoto: editProfilePhoto,
      idCardFront: editIdCardFront,
      idCardBack: editIdCardBack
    }

    localStorage.setItem('smartgn_officer_profile', JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setViewMode('VIEW')
    alert('GN Profile details updated successfully.')
  }

  return (
    <div className="dashboard-container">

      {/* 1. Header */}
      <header className="dashboard-header">
        <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">{t.tagline}</p>
        </div>

        <div className="header-right">
          <LanguageSelector />

          {/* Notifications */}
          <div className="notification-bell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="bell-badge">2</span>
          </div>
          {/* User Profile Info */}
          <div className="user-profile-info">
            <div className="user-text-details">
              <span className="user-division">{officerIdVal}</span>
              <span className="user-name">{profile.firstName} {profile.lastName}</span>
            </div>
            <div className="user-avatar-circle">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="User Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
          </div>
        </div>
      </header>

