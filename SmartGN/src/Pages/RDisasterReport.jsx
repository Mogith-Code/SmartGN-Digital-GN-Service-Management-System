import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function ResidentDisasterReport({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'
  const firstName = successUser.split(' ')[0]

  // Form Fields
  const [disasterType, setDisasterType] = useState('Flood')
  const [locationArea, setLocationArea] = useState('')
  const [severity, setSeverity] = useState('low severity')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [aidRequested, setAidRequested] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // State for tracked disasters
  const [myDisasters, setMyDisasters] = useState([])

  // Load disasters on mount
  useEffect(() => {
    loadDisasters()
  }, [])

  const loadDisasters = async () => {
    try {
      const response = await fetch('/api/disasters/resident', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load disaster history.')
      const data = await response.json()
      const formatted = data.map(item => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: successUser,
        date: item.request_date ? item.request_date.split('T')[0] : '',
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || 'None specified',
        status: item.status,
        remarks: item.officer_remarks || ''
      }))
      setMyDisasters(formatted)
    } catch (err) {
      console.error(err)
      // Fallback
      const saved = localStorage.getItem('smartgn_disaster_reports')
      if (saved) {
        const allDisasters = JSON.parse(saved)
        const filtered = allDisasters.filter(item => item.reporter === successUser)
        setMyDisasters(filtered)
      }
    }
  }

  // Handle form reset
  const handleReset = () => {
    setDisasterType('Flood')
    setLocationArea('')
    setSeverity('low severity')
    setDescription('')
    setContactNumber('')
    setAidRequested('')
    setErrorMessage('')
  }

  // Handle submit new report
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!locationArea || !description || !contactNumber) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setErrorMessage('')

    try {
      const response = await fetch('/api/disasters/report', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          disasterType,
          description,
          severity,
          location: locationArea,
          contact: contactNumber,
          aidRequested
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report.')
      }

      handleReset()
      loadDisasters()
      alert('Disaster report submitted successfully! The Grama Niladhari division office has been notified.')
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting report.')
    }
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
              <span className="user-division">{userDivision}</span>
              <span className="user-name">{successUser}</span>
            </div>
            <div className="user-avatar-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout Grid */}
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

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/profile', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/household', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/appointments', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/allowances', { state: { successUser, division: userDivision } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn active">
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
          
          {/* Back button */}
          <div className="form-header" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
            <button className="btn-back" onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Disaster Damage Report & Relief Application</h2>

          {/* Form and History columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column: Form Card */}
            <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
              <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
                Report Disaster Damage
              </h3>

              <div className="form-alert-note" style={{ marginBottom: '20px' }}>
                <span>Use this form to report damage caused by natural disasters to your property, crops, or livelihood and apply for official Grama Niladhari relief evaluation.</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ gap: '16px' }}>
                  
                  {/* Row 1 */}
                  <div className="form-group">
                    <label htmlFor="disasterSelect">Type of Disaster</label>
                    <div className="select-wrapper">
                      <select 
                        id="disasterSelect" 
                        className="register-control register-select"
                        value={disasterType}
                        onChange={(e) => setDisasterType(e.target.value)}
                        required
                      >
                        <option value="Flood">Flood</option>
                        <option value="Landslide">Landslide</option>
                        <option value="Fire">Fire</option>
                        <option value="Storm">Storm / Cyclone</option>
                        <option value="Earth Slip">Earth Slip</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="form-group">
                    <label htmlFor="locInput">Location / Address of Damage</label>
                    <input 
                      type="text" 
                      id="locInput"
                      className="register-control"
                      placeholder="e.g. 45/2 Main Road Area, Colombo"
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      required
                    />
                  </div>

                  
                  {/* Row 3 */}
                  <div className="form-group">
                    <label htmlFor="severitySelect">Estimated Severity</label>
                    <div className="select-wrapper">
                      <select 
                        id="severitySelect" 
                        className="register-control register-select"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        required
                      >
                        <option value="low severity">Low Severity</option>
                        <option value="medium severity">Medium Severity</option>
                        <option value="high severity">High Severity</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="form-group">
                    <label htmlFor="contactInput">Contact phone number</label>
                    <input 
                      type="text" 
                      id="contactInput"
                      className="register-control"
                      placeholder="e.g. 077XXXXXXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* Row 5 */}
                  <div className="form-group">
                    <label htmlFor="descInput">Description of damages sustained</label>
                    <textarea 
                      id="descInput"
                      className="register-control"
                      rows="3"
                      placeholder="Describe crop damage, structural damage, water levels, or loss..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: 'none', height: '80px', fontFamily: 'inherit' }}
                      required
                    ></textarea>
                  </div>

                  {/* Row 6 */}
                  <div className="form-group">
                    <label htmlFor="reliefInput">Relief Aid required (e.g. Food, Shelter, Medical, Financial)</label>
                    <input 
                      type="text" 
                      id="reliefInput"
                      className="register-control"
                      placeholder="Specify emergency items or financial help..."
                      value={aidRequested}
                      onChange={(e) => setAidRequested(e.target.value)}
                    />
                  </div>

                </div>

                {errorMessage && (
                  <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                    {errorMessage}
                  </p>
                )}

                {/* Actions Row */}
                <div className="form-action-row" style={{ marginTop: '24px' }}>
                  <button type="button" className="btn-form-reset" onClick={handleReset}>
                    Reset
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-action-icon">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                    </svg>
                  </button>
                  
                  <button type="submit" className="btn-form-submit">
                    Submit Damage Report
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-action-icon">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column: History Tracking */}
            <div className="dashboard-announcements-card" style={{ padding: '32px' }}>
              <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
                Your Reported Disasters History
              </h3>

              <div className="announcements-rows-list">
                {myDisasters.length === 0 ? (
                  <div className="announcement-row-placeholder" style={{ borderStyle: 'solid', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    No reported disasters registered to your account yet.
                  </div>
                ) : (
                  myDisasters.map((disaster) => {
                    const cardClass = disaster.severity.includes('high') 
                      ? 'high' 
                      : disaster.severity.includes('medium') 
                        ? 'medium' 
                        : 'low'

                    return (
                      <div key={disaster.id} style={{ border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: '#1a2e56' }}>{disaster.type}</span>
                          <span className={`severity-badge ${cardClass}`}>{disaster.severity}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: '#475569', fontWeight: '550' }}>
                          <div><strong>Location:</strong> {disaster.location}</div>
                          <div><strong>Date:</strong> {disaster.date}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Status Tracking:</span>
                          <span className={`badge-status ${disaster.status === 'Resolved' ? 'approved' : disaster.status === 'Pending' ? 'pending' : 'approved'}`} style={{ padding: '2px 10px', fontSize: '11px' }}>
                            {disaster.status || 'Pending'}
                          </span>
                        </div>

                        {disaster.remarks && (
                          <div className="gn-remarks-box" style={{ marginTop: '4px' }}>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#b45309', marginBottom: '2px', fontWeight: '800' }}>
                              Official GN Remarks & Action:
                            </div>
                            {disaster.remarks}
                          </div>
                        )}

                      </div>
                    )
                  })
                )}
              </div>
            </div>

          </div>

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

export default ResidentDisasterReport











