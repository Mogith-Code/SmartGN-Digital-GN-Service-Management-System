import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function ResidentAllowances({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'
  const firstName = successUser.split(' ')[0]

  // Allowance Requests State
  const [requests, setRequests] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form Field States
  const [applicantName, setApplicantName] = useState(localStorage.getItem('smartgn_user_name') || 'Nimal Perera')
  const [applicantNic, setApplicantNic] = useState(localStorage.getItem('smartgn_user_id') || '200324511540')
  const [purpose, setPurpose] = useState('For certify residence')
  const [income, setIncome] = useState('')
  const [remarks, setRemarks] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Secure Bank Details State
  const [bankName, setBankName] = useState('Bank of Ceylon')
  const [bankBranch, setBankBranch] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [accountHolder, setAccountHolder] = useState(localStorage.getItem('smartgn_user_name') || 'Nimal Perera')

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/allowances/resident', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load allowance requests.')
      const data = await response.json()
      const formatted = data.map(item => {
        let bankDetailsObj = null;
        try {
          bankDetailsObj = typeof item.bank_details === 'string' ? JSON.parse(item.bank_details) : item.bank_details;
        } catch (e) {
          bankDetailsObj = item.bank_details;
        }
        return {
          id: item.allowance_id,
          program: item.allowance_type,
          purpose: item.income_details ? item.income_details.substring(0, 100) : '',
          status: item.status === 'PENDING' ? 'Pending' : item.status === 'APPROVED' ? 'Approved' : 'Rejected',
          bankDetails: bankDetailsObj,
          paymentStatus: item.payment_status === 'PAID' ? 'Paid' : 'Unpaid',
          paymentAmount: item.cleared_amount,
          paymentTransferredAt: item.cleared_time ? new Date(item.cleared_time).toLocaleString() : '',
          paymentTransactionRef: item.txn_reference,
          income: item.cleared_amount || '',
          remarks: item.income_details || ''
        }
      })
      setRequests(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_allowance_requests')
      if (saved) setRequests(JSON.parse(saved))
    }
  }

  // Load requests on mount
  useEffect(() => {
    // Attempt to load from profile for names/NIC pre-fill
    const savedProfile = localStorage.getItem('smartgn_resident_profile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setApplicantName(parsed.fullName || `${parsed.firstName} ${parsed.lastName}`)
      setApplicantNic(parsed.nic || localStorage.getItem('smartgn_user_id') || '200324511540')
      setAccountHolder(parsed.fullName || `${parsed.firstName} ${parsed.lastName}`)
    }
    loadRequests()
  }, [])

  // Calculate dynamic stats
  const pendingCount = requests.filter(item => item.status === 'Pending').length
  const approvedCount = requests.filter(item => item.status === 'Approved').length
  const rejectedCount = requests.filter(item => item.status === 'Rejected').length

  // Main visual status list
  const visibleHistory = requests

  // Trigger Modal Open with pre-selected program
  const handleOpenApply = (programName) => {
    setSelectedProgram(programName)
    setErrorMessage('')
    setIncome('')
    setRemarks('')
    setBankBranch('')
    setBankAccount('')
    setIsModalOpen(true)
  }

  // Handle Application Submit
  const handleConfirmApplication = async (e) => {
    e.preventDefault()

    if (!income) {
      setErrorMessage('Please enter your estimated monthly household income.')
      return
    }

    if (!bankBranch || !bankAccount) {
      setErrorMessage('Please enter your complete bank account details.')
      return
    }

    setErrorMessage('')

    
    try {
      const response = await fetch('/api/allowances/apply', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          allowanceType: selectedProgram,
          incomeDetails: `Household Monthly Income: LKR ${income}. Purpose: ${purpose}. Remarks: ${remarks}`,
          bankDetails: {
            bankName,
            branch: bankBranch,
            accountNumber: bankAccount,
            accountHolderName: accountHolder
          }
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application.')
      }

      const resData = await response.json()
      setIsModalOpen(false)
      loadRequests()
      alert(`Application for ${selectedProgram} submitted successfully! Your secure tracking ID is ${resData.allowanceId}.`)
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting application.')
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
              <span className="user-division">{applicantNic}</span>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/resident/disaster', { state: { successUser, division: userDivision } })}>
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

          <h2 className="content-greeting" style={{ marginBottom: '24px' }}>Allowance Programs</h2>

          {/* Dynamic Stats Row Widgets */}
          <div className="stats-row-grid" style={{ marginBottom: '28px' }}>
            
            {/* Card 1: Pending */}
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="stat-label">Pending allowance requests</span>
              <span className="stat-value">{pendingCount}</span>
            </div>

            {/* Card 2: Approved */}
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="stat-label">Approved allowance requests</span>
              <span className="stat-value">{approvedCount}</span>
            </div>

            {/* Card 3: Rejected */}
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <span className="stat-label">Rejected allowance requests</span>
              <span className="stat-value">{rejectedCount}</span>
            </div>

          </div>

          {/* Middle: Allowance programs you can request */}
          <div className="dashboard-announcements-card" style={{ marginBottom: '28px' }}>
            <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
              Allowance programs you can request
            </h3>

            <div className="allowance-programs-list">
              {[
                { name: 'Aswesuma' },
                { name: 'Samurdhi' },
                { name: 'Elderly Support' },
                { name: 'Disability Allowance' },
                { name: 'Kidney Disease Support' }
              ].map((prog) => (
                <div key={prog.name} className="allowance-program-item">
                  <span className="allowance-program-name">{prog.name}</span>
                  <button className="btn-allowance-apply" onClick={() => handleOpenApply(prog.name)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pencil-icon">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Requested allowances programs status */}
          <div className="appointment-summary-outer" style={{ padding: '24px' }}>
            <h3 className="card-inner-title" style={{ borderBottom: '1.5px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
              Requested allowances programs status
            </h3>

            <div className="allowance-requests-status-list">
              {visibleHistory.map((item) => (
                <div key={item.id} className="allowance-status-row-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div className="allowance-status-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, padding: 0, border: 'none' }}>
                    <div className="allowance-status-details">
                      <span className="allowance-badge-bullet">★</span>
                      <span className="allowance-status-program">{item.program}</span>
                      <span className="allowance-status-purpose">Purpose: {item.purpose}</span>
                    </div>
                    
                    <span className={`badge-status ${item.status === 'Approved' ? 'approved' : item.status === 'Rejected' ? 'rejected' : 'pending'}`}>
                      {item.status === 'Approved' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                      {item.status === 'Rejected' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}>
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                      {item.status === 'Pending' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 14 12"></polyline>
                        </svg>
                      )}
                      {item.status}
                    </span>
                  </div>

                  {item.status === 'Approved' && item.paymentStatus === 'Paid' && (
                    <div className="secure-payment-transfer-alert animate-zoom-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '14px 18px', marginTop: '6px', textAlign: 'left', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)' }}>
                      <div className="payment-alert-icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <div style={{ fontSize: '13px', color: '#065f46' }}>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: '#047857', marginBottom: '3px', fontWeight: '800' }}>Secure Allowance Funds Transferred</strong>
                        Grama Niladhari Kamal Perera has securely transferred <strong>Rs. {item.paymentAmount || '5,000'}.00</strong> to your verified <strong>{item.bankDetails?.bankName} ({item.bankDetails?.accountNumber})</strong> account at <strong>{item.paymentTransferredAt}</strong>. Secured Transaction Ref: <code>{item.paymentTransactionRef}</code>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Popup Modal form overlay */}
          {isModalOpen && (
            <div className="modal-backdrop-overlay">
              <div className="modal-form-card animate-zoom-in">
                <div className="modal-header-row">
                  <h3 className="modal-form-title">Apply for {selectedProgram}</h3>
                  <button className="modal-close-btn-x" onClick={() => setIsModalOpen(false)} aria-label="Close form">➔</button>
                </div>

                <form onSubmit={handleConfirmApplication} style={{ marginTop: '20px' }}>
                  <div className="register-grid">
                    
                    <div className="form-group col-span-2">
                      <label htmlFor="modalApplicantName">Applicant Full Name :</label>
                      <input 
                        type="text" 
                        id="modalApplicantName" 
                        className="register-control" 
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modalNic">NIC Number :</label>
                      <input 
                        type="text" 
                        id="modalNic" 
                        className="register-control" 
                        value={applicantNic}
                        onChange={(e) => setApplicantNic(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modalPurpose">Application Purpose :</label>
                      <div className="select-wrapper">
                        <select 
                          id="modalPurpose" 
                          className="register-control register-select"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          required
                        >
                          <option value="For certify residence">For certify residence</option>
                          <option value="For income verification">For income verification</option>
                          <option value="For livelihood support">For livelihood support</option>
                          <option value="For medical support">For medical support</option>
                          <option value="For emergency disaster relief">For emergency disaster relief</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="modalIncome">Monthly Household Income (LKR) :</label>
                      <input 
                        type="number" 
                        id="modalIncome" 
                        className="register-control" 
                        placeholder="e.g. 45000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label htmlFor="modalRemarks">Remarks / Supportive details :</label>
                      <textarea 
                        id="modalRemarks" 
                        rows="3" 
                        className="register-control" 
                        placeholder="Briefly state the reason you qualify..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>

                    <div className="form-group col-span-2" style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px', marginTop: '16px', textAlign: 'left' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '14.5px', color: '#1a2e56', fontWeight: '800' }}>Payment Account Details (For secured allowance money transfer)</h4>
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="modalBankName">Bank Name :</label>
                      <div className="select-wrapper">
                        <select 
                          id="modalBankName" 
                          className="register-control register-select"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          required
                        >
                          <option value="Bank of Ceylon">Bank of Ceylon</option>
                          <option value="People's Bank">People's Bank</option>
                          <option value="Commercial Bank">Commercial Bank</option>
                          <option value="Sampath Bank">Sampath Bank</option>
                          <option value="Hatton National Bank">Hatton National Bank</option>
                        </select>
                        <span className="select-arrow">▼</span>
                      </div>
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="modalBankBranch">Branch :</label>
                      <input 
                        type="text" 
                        id="modalBankBranch" 
                        className="register-control" 
                        placeholder="e.g. Colombo 03"
                        value={bankBranch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="modalBankAccount">Account Number :</label>
                      <input 
                        type="text" 
                        id="modalBankAccount" 
                        className="register-control" 
                        placeholder="e.g. 1023456789"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label htmlFor="modalAccountHolder">Account Holder Name :</label>
                      <input 
                        type="text" 
                        id="modalAccountHolder" 
                        className="register-control" 
                        placeholder="e.g. Nimal Perera"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group col-span-2" style={{ textAlign: 'left' }}>
                      <label>Attach Supporting Documents (Income cert/NIC copy) :</label>
                      <div className="nic-upload-dashed-card" style={{ height: '110px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nic-upload-placeholder-icon">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Upload supportive document (.pdf, .jpg)</span>
                        <input type="file" style={{ display: 'none' }} id="supportDocFile" />
                        <label htmlFor="supportDocFile" className="nic-upload-select-btn" style={{ padding: '4px 10px', fontSize: '11.5px' }}>Choose file</label>
                      </div>
                    </div>

                  </div>

                  {errorMessage && (
                    <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                      {errorMessage}
                    </p>
                  )}

                  <div className="form-action-row" style={{ marginTop: '24px', justifyContent: 'flex-end', gap: '16px' }}>
                    <button type="button" className="btn-form-reset" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-form-submit" style={{ minWidth: '150px' }}>
                      Confirm Application
                    </button>
                  </div>

                </form>
              </div>
            </div>
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

export default ResidentAllowances
