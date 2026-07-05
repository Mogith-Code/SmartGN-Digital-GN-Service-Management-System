import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerDisasterReports({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

   // Retrieve username and officerId from navigation state or localStorage
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'
  const firstName = successUser.split(' ')[0]

  // State to manage list of disasters
  const [disasters, setDisasters] = useState([])
  const [selectedDisaster, setSelectedDisaster] = useState(null)

   // State for taking action modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSeverity, setModalSeverity] = useState('high severity')
  const [modalStatus, setModalStatus] = useState('Pending')
  const [modalRemarks, setModalRemarks] = useState('')

  const loadDisasters = async () => {
    try {
      const response = await fetch('/api/disasters/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load disasters.')
      const data = await response.json()
      const formatted = data.map(item => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: item.resident_name || 'Resident',
        date: item.request_date ? item.request_date.split('T')[0] : '',
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || 'None specified',
        status: item.status,
        remarks: item.officer_remarks || ''
      }))
      setDisasters(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_disaster_reports')
      if (saved) setDisasters(JSON.parse(saved))
    }
  }

  // Load disasters on mount
  useEffect(() => {
    loadDisasters()
  }, [])

  // Handle open modal
  const handleOpenActionModal = (disaster) => {
    setSelectedDisaster(disaster)
    setModalSeverity(disaster.severity)
    setModalStatus(disaster.status || 'Pending')
    setModalRemarks(disaster.remarks || '')
    setIsModalOpen(true)
  }

  // Handle submit action in modal
  const handleSaveAction = async (e) => {
    e.preventDefault()
    if (!selectedDisaster) return

    try {
      const response = await fetch(`/api/disasters/${selectedDisaster.id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: modalStatus,
          severity: modalSeverity,
          officerRemarks: modalRemarks
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update report.')
      }

      setIsModalOpen(false)
      setSelectedDisaster(null)
      loadDisasters()
      alert('Disaster status updated successfully.')
    } catch (err) {
      alert(err.message || 'Error updating report.')
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
          {/* Language Selector */}
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

      {/* 2. Main Layout */}
      <div className="dashboard-main-layout"></div>

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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/profile', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/household', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/appointments', { state: { successUser, officerId: officerIdVal } })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

             <button className="menu-btn" onClick={() => navigate('/dashboard/officer/allowances', { state: { successUser, officerId: officerIdVal } })}>
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

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/announcements', { state: { successUser, officerId: officerIdVal } })}>
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

             <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Disaster Management</h2>

            {/* Disasters List Container */}
            <div className="disasters-list-container">
              {disasters.length === 0 ? (
                <div className="form-alert-note" style={{ textAlign: 'center' }}>
                 <span>No disaster reports filed in your division currently.</span>
                </div>
              ) : (
              disasters.map((disaster) => {
                const cardClass = disaster.severity.includes('high') 
                  ? 'high' 
                  : disaster.severity.includes('medium') 
                    ? 'medium' 
                    : 'low'

                return (
                  <div key={disaster.id} className={`disaster-card ${cardClass}`}>
                    
                    <div className="disaster-card-header">
                      <div className="disaster-card-title-group">
                        <div className={`disaster-icon-box ${cardClass}`}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <h3 className="disaster-title">{disaster.type}</h3>
                      </div>

                      <span className={`severity-badge ${cardClass}`}>
                        {disaster.severity}
                      </span>
                    </div>

                    <div className="disaster-meta-grid">
                      <div className="disaster-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{disaster.location}</span>
                      </div>

                      <div className="disaster-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Reporter: {disaster.reporter}</span>
                      </div>

                      <div className="disaster-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Date: {disaster.date}</span>
                      </div>

                      <div className="disaster-meta-item">
                        <span className={`badge-status ${disaster.status === 'Resolved' ? 'approved' : disaster.status === 'Pending' ? 'pending' : 'approved'}`} style={{ padding: '2px 10px', fontSize: '11px' }}>
                          Status: {disaster.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="action-btn-blue"
                      onClick={() => handleOpenActionModal(disaster)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details & Take Action
                    </button>
                    













                  
