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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/household', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/appointments', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/allowances', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>
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

          {/* Sub-view: VIEW (Profile Dashboard View) */}
          {viewMode === 'VIEW' && (
            <>
              {/* Dismissible Alert Banner */}
              {showAlert && (!profile.idCardFront || !profile.idCardBack) && (
                <div className="dashboard-alert-banner">
                  <div className="alert-text-wrapper">
                    <span>Please upload a high-quality image of your GN Identity Card</span>
                  </div>
                  <button className="alert-close-btn" onClick={() => setShowAlert(false)} aria-label="Close Alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}

              {/* Title Greeting */}
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 className="content-greeting" style={{ margin: 0 }}>My profile</h2>
              </div>

              {/* Profile Header Box Card */}
              <div className="allowance-status-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 36px', background: '#e8edf3', border: '1px solid #cbd5e1', borderRadius: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyItems: 'center', overflow: 'hidden', border: '2.5px solid #ffffff' }}>
                    {profile.profilePhoto ? (
                      <img src={profile.profilePhoto} alt="Kamal Perera" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" style={{ margin: 'auto' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#1a2e56' }}>{profile.firstName} {profile.lastName}</h3>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{profile.division.split(',')[0]}</span>
                  </div>
                </div>
              
                <button 
                  onClick={handleEnterEdit}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px', border: '1.5px solid #d97706', background: '#ffffff', color: '#d97706', fontSize: '13px', fontWeight: '750', cursor: 'pointer', boxShadow: '0 2px 8px rgba(217, 119, 6, 0.05)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit profile
                </button>
              </div>

              {/* Main Content Layout Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '32px', alignItems: 'start' }}>
                
                {/* Left Card: Personal information */}
                <div className="dashboard-announcements-card" style={{ padding: '32px', textAlign: 'left' }}>
                  <h3 className="card-inner-title" style={{ fontSize: '16px', marginBottom: '24px' }}>Personal information</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</span>
                      <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>{profile.fullName}</span>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Gramaseva Division</span>
                      <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>{profile.division}</span>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Service time within current division</span>
                      <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>{profile.serviceTime} Years</span>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</span>
                      <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>{profile.email}</span>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Mobile Number</span>
                      <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>{profile.mobile}</span>
                    </div>
                  </div>
                </div>

                {/* Right Cards: Grama Niladhari Identity Card uploads */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                  <h3 className="card-inner-title" style={{ fontSize: '16px', margin: '0' }}>Grama Niladhari Identity Card</h3>
                  
                  {/* Front card image slot */}
                  <div className="announcement-row-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', borderRadius: '16px', overflow: 'hidden', border: '2px dashed #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={handleEnterEdit}>
                    {profile.idCardFront ? (
                      <img src={profile.idCardFront} alt="ID Front preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#475569', fontSize: '14.5px', fontWeight: '750' }}>Front image here</span>
                    )}
                  </div>

                  {/* Back card image slot */}
                  <div className="announcement-row-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', borderRadius: '16px', overflow: 'hidden', border: '2px dashed #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={handleEnterEdit}>
                    {profile.idCardBack ? (
                      <img src={profile.idCardBack} alt="ID Back preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#475569', fontSize: '14.5px', fontWeight: '750' }}>Back image here</span>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Sub-view: EDIT (Edit profile details & dropzone uploader) */}
          {viewMode === 'EDIT' && (
            <>
              {/* Back chevron trigger */}
              <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
                <button className="btn-back" onClick={() => setViewMode('VIEW')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              </div>

              <h2 className="content-greeting" style={{ marginBottom: '24px', textAlign: 'left' }}>Edit Profile</h2>

              <div className="dashboard-announcements-card" style={{ padding: '36px' }}>
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
                    
                    {/* Left Form Inputs */}
                    <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Avatar circular preview dropzone */}
                      <div className="form-group" style={{ alignItems: 'flex-start' }}>
                        <label style={{ fontWeight: '700', color: '#334155', fontSize: '13px', marginBottom: '8px' }}>Profile Picture</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                            {editProfilePhoto ? (
                              <img src={editProfilePhoto} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            )}
                          </div>
                          
                          <label className="nic-upload-select-btn" style={{ borderRadius: '6px', padding: '8px 14px', fontSize: '12.5px', cursor: 'pointer' }}>
                            Choose Photo
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }} 
                              onChange={(e) => handlePhotoUpload(e, 'profilePhoto')} 
                            />
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="firstName" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>First Name *</label>
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
                          <label htmlFor="lastName" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Last Name *</label>
                          <input 
                            type="text" 
                            id="lastName" 
                            className="register-control" 
                            value={editLastName} 
                            onChange={(e) => setEditLastName(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="fullName" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Full Name *</label>
                        <input 
                          type="text" 
                          id="fullName" 
                          className="register-control" 
                          value={editFullName} 
                          onChange={(e) => setEditFullName(e.target.value)} 
                          required 
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="division" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Gramaseva Division *</label>
                          <input 
                            type="text" 
                            id="division" 
                            className="register-control" 
                            value={editDivision} 
                            onChange={(e) => setEditDivision(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="serviceTime" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Service Time (Years) *</label>
                          <input 
                            type="number" 
                            id="serviceTime" 
                            className="register-control" 
                            value={editServiceTime} 
                            onChange={(e) => setEditServiceTime(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Email Address *</label>
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
                        <label htmlFor="mobile" style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>Mobile Number *</label>
                        <input 
                          type="text" 
                          id="mobile" 
                          className="register-control" 
                          value={editMobile} 
                          onChange={(e) => setEditMobile(e.target.value)} 
                          required 
                        />
                      </div>

                    </div>

                    {/* Right Form ID Card Uploaders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                      <label style={{ fontWeight: '700', color: '#334155', fontSize: '13px' }}>GN Identity Card Images</label>
                      
                      {/* Front Dropzone card */}
                      <div className="form-group">
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Identity Card (Front)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', border: '2px dashed #cbd5e1', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#f8fafc' }}>
                          {editIdCardFront ? (
                            <>
                              <img src={editIdCardFront} alt="GN ID Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => setEditIdCardFront(null)} style={{ position: 'absolute', right: '10px', top: '10px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10.5px', cursor: 'pointer', fontWeight: '800' }}>Remove</button>
                            </>
                          ) : (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '20px', gap: '8px' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                              </svg>
                              <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: '750' }}>Upload Front Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={(e) => handlePhotoUpload(e, 'idCardFront')} 
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Back Dropzone card */}
                      <div className="form-group">
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Identity Card (Back)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', border: '2px dashed #cbd5e1', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#f8fafc' }}>
                          {editIdCardBack ? (
                            <>
                              <img src={editIdCardBack} alt="GN ID Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => setEditIdCardBack(null)} style={{ position: 'absolute', right: '10px', top: '10px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10.5px', cursor: 'pointer', fontWeight: '800' }}>Remove</button>
                            </>
                          ) : (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '20px', gap: '8px' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                              </svg>
                              <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: '750' }}>Upload Back Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={(e) => handlePhotoUpload(e, 'idCardBack')} 
                              />
                            </label>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Form Action Controls */}
                  <div className="form-action-row" style={{ marginTop: '36px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button type="button" className="btn-form-reset" onClick={() => setViewMode('VIEW')} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>
                    <button type="submit" className="btn-form-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '160px', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Update Profile
                    </button>
                  </div>

                </form>
              </div>
            </>
          )}

          {/* Floating Help Button Widget */}
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

export default OfficerProfile


              
