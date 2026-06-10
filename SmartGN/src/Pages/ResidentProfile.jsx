import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'

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

          {/* User Profile Info - Dynamic updates from profile */}
          <div className="user-profile-info">
            <div className="user-text-details">
              <span className="user-division">{profile.nic}</span>
              <span className="user-name">{profile.firstName} {profile.lastName}</span>
            </div>
            <div className="user-avatar-circle" style={{ overflow: 'hidden' }}>
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      {/* 2. Main Layout */}
      <div className="dashboard-main-layout">
        
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <button className="menu-btn" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.home}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/household', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="menu-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>
        
        {/* Main Panel Content */}
        <main className="dashboard-content">
          
          {/* Alert Banner */}
          {showAlert && !profile.nicFront && !profile.nicBack && (
            <div className="dashboard-alert-banner">
              <div className="alert-text-wrapper">
                <span>Please upload a high-quality image of your National Identity Card</span>
              </div>
              <button className="alert-close-btn" onClick={() => setShowAlert(false)} aria-label="Close Warning">
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
              <h2 className="content-greeting" style={{ marginBottom: '24px' }}>My profile</h2>

              {/* Profile Card Header */}
              <div className="profile-overview-card" style={{ marginBottom: '24px' }}>
                <div className="profile-overview-left">
                  <div className="profile-overview-avatar">
                    {profile.profilePhoto ? (
                      <img src={profile.profilePhoto} alt="Profile avatar" className="profile-photo-img" />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-placeholder-svg">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div className="profile-overview-details">
                    <h3 className="profile-overview-name">{profile.firstName} {profile.lastName}</h3>
                    <span className="profile-overview-id">{profile.nic}</span>
                  </div>
                </div>
                <button className="btn-edit-profile-action" onClick={handleEnterEdit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pencil-icon">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit profile
                </button>
              </div>

              {/* Dynamic split panel for details and NIC */}
              <div className="profile-details-split">
                
                {/* Personal Information */}
                <div className="profile-details-card">
                  <h3 className="profile-card-title">Personal information</h3>
                  <div className="profile-info-list">
                    <div className="profile-info-item">
                      <span className="profile-info-label">Full Name:</span>
                      <span className="profile-info-value">{profile.fullName}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Number of Family Members:</span>
                      <span className="profile-info-value">
                        {familyCount} &nbsp; 
                        <span 
                          className="view-family-details-link" 
                          onClick={() => navigate('/dashboard/resident/household', { state: { successUser: `${profile.firstName} ${profile.lastName}`, division: userDivision } })}
                          style={{ cursor: 'pointer', color: '#d97706', fontWeight: '700', textDecoration: 'underline' }}
                        >
                          View family details
                        </span>
                      </span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Occupation:</span>
                      <span className="profile-info-value">{profile.occupation}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Email Address:</span>
                      <span className="profile-info-value">{profile.email}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Mobile Number:</span>
                      <span className="profile-info-value">{profile.mobile}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Home Address:</span>
                      <span className="profile-info-value">{profile.address}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Gramaseva Division:</span>
                      <span className="profile-info-value">{profile.division}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Date of Birth:</span>
                      <span className="profile-info-value">{profile.dob}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Gender:</span>
                      <span className="profile-info-value">{profile.gender}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">Household Number:</span>
                      <span className="profile-info-value">{profile.householdNumber}</span>
                    </div>
                  </div>
                </div>

                {/* National Identity Card Display */}
                <div className="profile-details-card">
                  <h3 className="profile-card-title">National Identity Card</h3>
                  
                  <div className="nic-preview-list">
                    <div className="nic-preview-box">
                      {profile.nicFront ? (
                        <img src={profile.nicFront} alt="NIC Front" className="nic-preview-img" />
                      ) : (
                        <span className="nic-preview-placeholder-text">Front image here</span>
                      )}
                    </div>

                    <div className="nic-preview-box">
                      {profile.nicBack ? (
                        <img src={profile.nicBack} alt="NIC Back" className="nic-preview-img" />
                      ) : (
                        <span className="nic-preview-placeholder-text">Back image here</span>
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
              <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
                <button className="btn-back" onClick={() => setViewMode('VIEW')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Edit your profile</h2>

              {/* Image Upload Zone & Editor Form */}
              <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
                <form onSubmit={handleSaveProfile}>
                  
                  {/* Circular profile image upload widget */}
                  <div className="profile-photo-upload-section">
                    <div className="profile-photo-upload-container">
                      {editProfilePhoto ? (
                        <img src={editProfilePhoto} alt="Upload profile" className="profile-photo-upload-preview" />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="profile-photo-upload-placeholder">
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
                    <label htmlFor="profilePhotoFile" className="profile-photo-upload-label">
                      Upload your profile photo here
                    </label>
                  </div>

                  {/* Inputs Form Grid */}
                  <div className="register-grid">
                    
                    <div className="form-group">
                      <label htmlFor="firstName">First Name :</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="register-control" 
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name :</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="register-control" 
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label htmlFor="fullName">Full Name :</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        className="register-control" 
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="occupation">Occupation :</label>
                      <input 
                        type="text" 
                        id="occupation" 
                        className="register-control" 
                        value={editOccupation}
                        onChange={(e) => setEditOccupation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address :</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="register-control" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number :</label>
                      <input 
                        type="text" 
                        id="mobile" 
                        className="register-control" 
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="division">Gramaseva Division :</label>
                      <input 
                        type="text" 
                        id="division" 
                        className="register-control" 
                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b', fontWeight: '500' }}
                        value={profile.division}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label htmlFor="address">Home Address :</label>
                      <input 
                        type="text" 
                        id="address" 
                        className="register-control" 
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dob">Date of Birth :</label>
                      <input 
                        type="text" 
                        id="dob" 
                        placeholder="DD/MM/YYYY"
                        className="register-control" 
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Gender :</label>
                      <div className="select-wrapper">
                        <select 
                          id="gender" 
                          className="register-control register-select"
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="householdNumber">Household Number :</label>
                      <input 
                        type="text" 
                        id="householdNumber" 
                        className="register-control" 
                        value={editHouseholdNumber}
                        onChange={(e) => setEditHouseholdNumber(e.target.value)}
                        required
                      />
                    </div>

                  </div>

                  {/* NIC File Upload Area */}
                  <div className="profile-nic-upload-section" style={{ marginTop: '28px', borderTop: '1.5px solid #e2e8f0', paddingTop: '20px' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '16px', textAlign: 'left' }}>
                      Upload an image of your National Identity Card :
                    </p>

                    <div className="profile-nic-dropzone-grid">
                      <div className="nic-dropzone-item">
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Front Image :</span>
                        <div className="nic-upload-dashed-card">
                          {editNicFront ? (
                            <img src={editNicFront} alt="NIC Front Preview" className="nic-upload-preview-img" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nic-upload-placeholder-icon">
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
                          <label htmlFor="nicFrontFile" className="nic-upload-select-btn">Choose file</label>
                        </div>
                      </div>

                      <div className="nic-dropzone-item">
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Back Image :</span>
                        <div className="nic-upload-dashed-card">
                          {editNicBack ? (
                            <img src={editNicBack} alt="NIC Back Preview" className="nic-upload-preview-img" />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nic-upload-placeholder-icon">
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
                          <label htmlFor="nicBackFile" className="nic-upload-select-btn">Choose file</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="form-action-row" style={{ marginTop: '32px', justifyContent: 'flex-end', gap: '16px' }}>
                    <button type="button" className="btn-form-reset" onClick={() => setViewMode('VIEW')} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ef4444', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>
                    
                    <button type="submit" className="btn-form-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
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
          <button className="floating-dashboard-help" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="landing-footer" style={{ padding: '16px 64px', borderTop: 'none' }}>
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default ResidentProfile


