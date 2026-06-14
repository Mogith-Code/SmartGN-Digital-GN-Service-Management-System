import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'
import Footer from '../Components/Common/Footer'

function ResidentProfile({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve default username and division from navigation state if available
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || 'Colombo'
  const firstNameFromSession = successUser.split(' ')[0]

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true)

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState('VIEW')

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: 'Nimal',
    lastName: 'Perera',
    fullName: 'Dissanayake Mudiyanselage Nimal Perera',
    nic: '200324511540',
    occupation: 'Farmer',
    email: 'Nimal.Perera@example.com',
    mobile: '0703564478',
    address: '123 Main Street, Colombo',
    division: 'Colombo, Borella',
    dob: '28/05/2000',
    gender: 'Male',
    householdNumber: '123456',
    profilePhoto: null,
    nicFront: null,
    nicBack: null
  })
  // Form Field States (Edit Mode)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editFullName, setEditFullName] = useState('')
  const [editOccupation, setEditOccupation] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editDob, setEditDob] = useState('')
  const [editGender, setEditGender] = useState('')
  const [editHouseholdNumber, setEditHouseholdNumber] = useState('')
  const [editProfilePhoto, setEditProfilePhoto] = useState(null)
  const [editNicFront, setEditNicFront] = useState(null)
  const [editNicBack, setEditNicBack] = useState(null)

  const [familyCount, setFamilyCount] = useState(5) // default count

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('smartgn_resident_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Seed default profile data
      const defaultProfile = {
        firstName: 'Nimal',
        lastName: 'Perera',
        fullName: 'Dissanayake Mudiyanselage Nimal Perera',
        nic: '200324511540',
        occupation: 'Farmer',
        email: 'Nimal.Perera@example.com',
        mobile: '0703564478',
        address: '123 Main Street, Colombo',
        division: 'Colombo, Borella',
        dob: '28/05/2000',
        gender: 'Male',
        householdNumber: '123456',
        profilePhoto: null,
        nicFront: null,
        nicBack: null
      }
      localStorage.setItem('smartgn_resident_profile', JSON.stringify(defaultProfile))
      setProfile(defaultProfile)
    }

    // Load family members to show dynamic count
    const savedFamily = localStorage.getItem('smartgn_family_members')
    if (savedFamily) {
      const familyList = JSON.parse(savedFamily)
      setFamilyCount(familyList.length)
    }
  }, [])

  // Populate form fields when entering Edit Mode
  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName)
    setEditLastName(profile.lastName)
    setEditFullName(profile.fullName)
    setEditOccupation(profile.occupation)
    setEditEmail(profile.email)
    setEditMobile(profile.mobile)
    setEditAddress(profile.address)
    setEditDob(profile.dob)
    setEditGender(profile.gender)
    setEditHouseholdNumber(profile.householdNumber)
    setEditProfilePhoto(profile.profilePhoto)
    setEditNicFront(profile.nicFront)
    setEditNicBack(profile.nicBack)
    setViewMode('EDIT')
  }
// Handle Photo File Upload Convert to Base64
  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (target === 'profilePhoto') {
          setEditProfilePhoto(reader.result)
        } else if (target === 'nicFront') {
          setEditNicFront(reader.result)
        } else if (target === 'nicBack') {
          setEditNicBack(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Save changes
  const handleSaveProfile = (e) => {
    e.preventDefault()

    const updatedProfile = {
      ...profile,
      firstName: editFirstName,
      lastName: editLastName,
      fullName: editFullName,
      occupation: editOccupation,
      email: editEmail,
      mobile: editMobile,
      address: editAddress,
      dob: editDob,
      gender: editGender,
      householdNumber: editHouseholdNumber,
      profilePhoto: editProfilePhoto,
      nicFront: editNicFront,
      nicBack: editNicBack
    }

    localStorage.setItem('smartgn_resident_profile', JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setViewMode('VIEW')
    alert('Profile updated successfully.')
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      
      {/* 1. Header */}
      <header className="flex justify-between items-center px-10 py-4 bg-white border-b border-[#cbd5e1] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] sticky top-0 z-50">
        <div className="w-28 sm:w-32 md:w-40 lg:w-48 cursor-pointer flex flex-col items-start gap-1" onClick={() => navigate('/')}>
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto object-contain" />
          <p className="text-[10px] text-[#718096] font-normal leading-none">{t.tagline}</p>
        </div>

        <div className="flex items-center gap-6">
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative cursor-pointer text-[#475569]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </div>

          {/* User Profile Info - Dynamic updates from profile */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-[#64748b] font-medium">{profile.nic}</span>
              <span className="text-[14px] font-semibold text-[#1e293b]">{profile.firstName} {profile.lastName}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar Nav */}
        <aside className="w-[280px] bg-white border-r border-[#cbd5e1] py-6 px-4 flex flex-col flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.home}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-[#1B365D] text-white text-[15px] font-semibold cursor-pointer transition-all duration-200 text-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/household', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border-0 bg-transparent text-[#475569] text-[15px] font-medium cursor-pointer transition-all duration-200 text-left hover:bg-[#f1f5f9] hover:text-[#1e293b]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>
        
        {/* Main Panel Content */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          
          {/* Alert Banner */}
          {showAlert && !profile.nicFront && !profile.nicBack && (
            <div className="flex justify-between items-center py-4 px-6 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-semibold text-[14px] mb-6 text-left">
              <div className="flex items-center gap-2">
                <span>Please upload a high-quality image of your National Identity Card</span>
              </div>
              <button className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a]" onClick={() => setShowAlert(false)} aria-label="Close Warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Sub-view: VIEW (My Profile Dashboard) */}
          {viewMode === 'VIEW' && (
            <>
              <h2 className="text-[24px] font-bold text-[#1B365D] text-left mb-6">My profile</h2>

              {/* Profile Card Header */}
              <div className="flex justify-between items-center p-6 bg-white border border-[#cbd5e1] rounded-2xl shadow-sm mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f1f5f9] border-2 border-white shadow-md flex items-center justify-center">
                    {profile.profilePhoto ? (
                      <img src={profile.profilePhoto} alt="Profile avatar" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#cbd5e1]">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="m-0 mb-1 text-[20px] font-bold text-[#1B365D]">{profile.firstName} {profile.lastName}</h3>
                    <span className="text-[14px] text-[#64748b] font-medium">{profile.nic}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 py-2.5 px-5 bg-white border border-[#d97706] rounded-full text-[#d97706] text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#d97706] hover:text-white" onClick={handleEnterEdit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit profile
                </button>
              </div>

              {/* Dynamic split panel for details and NIC */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                
                {/* Personal Information */}
                <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 text-left shadow-sm">
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">Personal information</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Full Name:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Number of Family Members:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {familyCount} &nbsp; 
                        <span 
                          onClick={() => navigate('/dashboard/resident/household', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}
                          className="cursor-pointer text-[#d97706] font-bold underline"
                        >
                          View family details
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Occupation:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.occupation}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Email Address:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Mobile Number:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.mobile}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Home Address:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.address}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Gramaseva Division:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.division}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Date of Birth:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.dob}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Gender:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.gender}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">Household Number:</span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">{profile.householdNumber}</span>
                    </div>
                  </div>
                </div>

                {/* National Identity Card Display */}
                <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 text-left shadow-sm">
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">National Identity Card</h3>
                  
                  <div className="flex flex-col gap-5">
                    <div className="h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                      {profile.nicFront ? (
                        <img src={profile.nicFront} alt="NIC Front" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#64748b] text-[14px] font-medium">Front image here</span>
                      )}
                    </div>

                    <div className="h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                      {profile.nicBack ? (
                        <img src={profile.nicBack} alt="NIC Back" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#64748b] text-[14px] font-medium">Back image here</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Sub-view: EDIT (Edit Profile Page View) */}
          {viewMode === 'EDIT' && (
            <>
              {/* Back Button */}
              <div className="flex justify-start items-center mb-4">
                <button className="flex items-center gap-1.5 py-2 px-4 border border-[#cbd5e1] bg-white text-[#475569] rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => setViewMode('VIEW')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="text-[24px] font-bold text-[#1B365D] text-left mb-6">Edit your profile</h2>

              {/* Image Upload Zone & Editor Form */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleSaveProfile}>
                  
                  {/* Circular profile image upload widget */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#cbd5e1] flex items-center justify-center overflow-hidden bg-[#f8fafc] relative cursor-pointer">
                      {editProfilePhoto ? (
                        <img src={editProfilePhoto} alt="Upload profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#cbd5e1]">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      )}
                      
                      {/* Hidden file input */}
                      <input 
                        type="file" 
                        id="profilePhotoFile" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handlePhotoUpload(e, 'profilePhoto')}
                      />
                    </div>
                    <label htmlFor="profilePhotoFile" className="mt-2 text-[13px] text-[#d97706] font-semibold cursor-pointer">
                      Upload your profile photo here
                    </label>
                  </div>

                  {/* Inputs Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    
                    <div className="flex flex-col">
                      <label htmlFor="firstName" className="text-[13px] font-semibold text-[#334155] mb-1.5">First Name :</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="lastName" className="text-[13px] font-semibold text-[#334155] mb-1.5">Last Name :</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <label htmlFor="fullName" className="text-[13px] font-semibold text-[#334155] mb-1.5">Full Name :</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="occupation" className="text-[13px] font-semibold text-[#334155] mb-1.5">Occupation :</label>
                      <input 
                        type="text" 
                        id="occupation" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editOccupation}
                        onChange={(e) => setEditOccupation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-[13px] font-semibold text-[#334155] mb-1.5">Email Address :</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="mobile" className="text-[13px] font-semibold text-[#334155] mb-1.5">Mobile Number :</label>
                      <input 
                        type="text" 
                        id="mobile" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="division" className="text-[13px] font-semibold text-[#334155] mb-1.5">Gramaseva Division :</label>
                      <input 
                        type="text" 
                        id="division" 
                        className="w-full py-2.5 px-3.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#64748b] cursor-not-allowed font-medium box-border" 
                        value={profile.division}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <label htmlFor="address" className="text-[13px] font-semibold text-[#334155] mb-1.5">Home Address :</label>
                      <input 
                        type="text" 
                        id="address" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="dob" className="text-[13px] font-semibold text-[#334155] mb-1.5">Date of Birth :</label>
                      <input 
                        type="text" 
                        id="dob" 
                        placeholder="DD/MM/YYYY"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="gender" className="text-[13px] font-semibold text-[#334155] mb-1.5">Gender :</label>
                      <div className="relative flex items-center">
                        <select 
                          id="gender" 
                          className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 appearance-none cursor-pointer"
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="absolute right-3.5 pointer-events-none text-[10px] text-[#64748b]">▼</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="householdNumber" className="text-[13px] font-semibold text-[#334155] mb-1.5">Household Number :</label>
                      <input 
                        type="text" 
                        id="householdNumber" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={editHouseholdNumber}
                        onChange={(e) => setEditHouseholdNumber(e.target.value)}
                        required
                      />
                    </div>

                  </div>

                  {/* NIC File Upload Area */}
                  <div className="mt-7 border-t border-[#cbd5e1] pt-5">
                    <p className="font-semibold text-[14px] text-[#1e293b] mb-4 text-left">
                      Upload an image of your National Identity Card :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#64748b] font-semibold mb-2 text-left">Front Image :</span>
                        <div className="h-[150px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden p-4">
                          {editNicFront ? (
                            <img src={editNicFront} alt="NIC Front Preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#cbd5e1] mb-2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          )}
                          <input 
                            type="file" 
                            id="nicFrontFile" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handlePhotoUpload(e, 'nicFront')}
                          />
                          <label htmlFor="nicFrontFile" className="mt-2 py-1.5 px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white">Choose file</label>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#64748b] font-semibold mb-2 text-left">Back Image :</span>
                        <div className="h-[150px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden p-4">
                          {editNicBack ? (
                            <img src={editNicBack} alt="NIC Back Preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#cbd5e1] mb-2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          )}
                          <input 
                            type="file" 
                            id="nicBackFile" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handlePhotoUpload(e, 'nicBack')}
                          />
                          <label htmlFor="nicBackFile" className="mt-2 py-1.5 px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white">Choose file</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={() => setViewMode('VIEW')} className="py-2.5 px-5 rounded-lg border-0 text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>
                    
                    <button type="submit" className="py-2.5 px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                      </svg>
                      Update
                    </button>
                  </div>

                </form>
              </div>
            </>
          )}

          {/* Floating Help Trigger */}
          <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]" aria-label="Help Trigger" onClick={() => onOpenHelp ? onOpenHelp() : console.log('Help clicked')}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  )
}

export default ResidentProfile;
