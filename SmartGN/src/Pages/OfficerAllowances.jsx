import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerAllowances({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user defaults
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || '200324511540'

  // States
  const [requests, setRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  
  // Bank transfer simulation states
  const [verifyingBankId, setVerifyingBankId] = useState(null)
  const [bankVerifiedMap, setBankVerifiedMap] = useState({})
  const [transferringId, setTransferringId] = useState(null)
  const [transferStep, setTransferStep] = useState(0) // 0: Idle, 1: Connecting, 2: clearing, 3: Completed
  const [transferAmount, setTransferAmount] = useState('5000')

  // Receipt Modal State
  const [showReceiptId, setShowReceiptId] = useState(null)
  const [receiptRequest, setReceiptRequest] = useState(null)

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/allowances/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load allowance requests queue.')
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
          applicantName: item.resident_name || 'Resident',
          nic: item.resident_nic,
          income: item.income_details || '',
          submittedDate: item.application_date ? new Date(item.application_date).toISOString().split('T')[0] : '2026-05-15'
        }
      })
      setRequests(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_allowance_requests')
      if (saved) setRequests(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Approve action
  const handleApprove = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/allowances/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'APPROVED' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve allowance request.')
      }

      alert(`Allowance request ${id} has been Approved.`)
      loadRequests()
    } catch (err) {
      alert(err.message || 'Error approving allowance request.')
    }
  }

  // Reject action
  const handleReject = async (id, e) => {
    e.stopPropagation()
    const confirmReject = window.confirm("Are you sure you want to reject this allowance request?")
    if (confirmReject) {
      try {
        const response = await fetch(`/api/allowances/${id}/status`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: 'REJECTED' })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to reject allowance request.')
        }

        alert(`Allowance request ${id} has been Rejected.`)
        loadRequests()
      } catch (err) {
        alert(err.message || 'Error rejecting allowance request.')
      }
    }
  }

  // Mock Bank Account Verification
  const handleVerifyBank = (id, applicantName, e) => {
    e.stopPropagation()
    setVerifyingBankId(id)
    setTimeout(() => {
      setBankVerifiedMap(prev => ({ ...prev, [id]: true }))
      setVerifyingBankId(null)
      alert(`Bank Account Registry matched and verified successfully for ${applicantName}!`)
    }, 1000)
  }

  // Secure cleared transfer simulation
  const handleSecureTransfer = (id, item, e) => {
    e.stopPropagation()
    if (!bankVerifiedMap[id]) {
      alert("Please verify the bank account registry with the Central Bank registry first.")
      return
    }

    setTransferringId(id)
    setTransferStep(1) // Connecting

    setTimeout(() => {
      setTransferStep(2) // clearing

      setTimeout(() => {
        setTransferStep(3) // Completed

        setTimeout(async () => {
          try {
            const response = await fetch(`/api/allowances/${id}/disburse`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                disburseAmount: parseFloat(transferAmount)
              })
            })

            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.error || 'Failed to disburse funds.')
            }

            const resData = await response.json()
            await loadRequests()
            setTransferringId(null)
            setTransferStep(0)
            alert('RTGS Secure Funds Disbursed successfully.')

            const completedItem = {
              id: id,
              program: item.program,
              status: 'Approved',
              paymentStatus: 'Paid',
              paymentAmount: resData.transaction.amount,
              paymentTransferredAt: new Date(resData.transaction.timestamp).toLocaleString(),
              paymentTransactionRef: resData.transaction.txnRef,
              applicantName: item.applicantName,
              bankDetails: item.bankDetails
            }
            setReceiptRequest(completedItem)
            setShowReceiptId(id)
          } catch (err) {
            alert(err.message || 'Error disbursing allowance funds.')
            setTransferringId(null)
            setTransferStep(0)
          }
        }, 800)
      }, 1000)
    }, 800)
  }

  // View existing receipt
  const viewReceipt = (item, e) => {
    e.stopPropagation()
    setReceiptRequest(item)
    setShowReceiptId(item.id)
  }

  // Filter & Search logic
  const filteredRequests = requests.filter(r => {
    const applicant = r.applicantName || r.bankDetails?.accountHolderName || 'Resident'
    const matchesSearch = applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(r.id).includes(searchQuery)
    
    if (filterStatus === 'All') return matchesSearch
    return matchesSearch && r.status === filterStatus
  })

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

      {/* 2. Main Dashboard Layout */}
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

            <button className="menu-btn active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button className="menu-btn" onClick={() => navigate('/dashboard/officer/disasters', { state: { successUser, officerId: officerIdVal } })}>
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 className="content-greeting" style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Allowance Programs</h2>
              <span style={{ fontSize: '14.5px', color: '#64748b' }}>Analyze, verify and securely disburse funds to registered allowance applications.</span>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterStatus === status ? '#ffffff' : 'transparent',
                    color: filterStatus === status ? '#1a2e56' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: filterStatus === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search by resident name, program (e.g. Aswesuma) or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                fontSize: '14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* List of Applications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredRequests.map((item) => {
              const applicant = item.applicantName || item.bankDetails?.accountHolderName || 'Resident'
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isExpanded ? '1.5px solid #fedc9b' : '1px solid #cbd5e1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Collapsed Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      padding: '24px 32px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px' }}>★</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1a2e56' }}>
                            {item.program}
                          </h4>
                          <span
                            className={`badge-status ${item.status.toLowerCase()}`}
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '50px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {item.status}
                          </span>
                          
                          {item.status === 'Approved' && (
                            <span
                              className={`badge-status ${item.paymentStatus === 'Paid' ? 'approved' : 'pending'}`}
                              style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '50px',
                                textTransform: 'uppercase'
                              }}
                            >
                              {item.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                          <span>Applicant: <strong>{applicant}</strong></span>
                          <span>NIC: <strong>{item.nic || '200324511540'}</strong></span>
                          <span>Submitted: <strong>{item.submittedDate || '2024-03-28'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '18px', color: '#64748b' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div style={{ padding: '0 32px 32px 32px', borderTop: '1px solid #cbd5e1', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', paddingTop: '24px' }}>
                        
                        {/* Left column details */}
                        <div>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '14.5px', color: '#1a2e56', fontWeight: '800' }}>Application details</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#334155' }}>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Purpose:</span> {item.purpose}
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Monthly Household Income:</span> Rs. {parseFloat(item.income || '20000').toLocaleString()}.00
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Remarks:</span> {item.remarks || 'No remarks provided.'}
                            </div>
                            
                            {/* NEW: Interactive Mock PDF Document Viewer Card */}
                            <div style={{ marginTop: '16px' }}>
                              <span style={{ display: 'block', color: '#64748b', fontWeight: '750', marginBottom: '8px', fontSize: '13px' }}>Submitted PDF Document:</span>
                              <div 
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s ease' }} 
                                onClick={() => alert(`Simulating secure document viewer for SmartGN-AL-${item.id}... Loading 'Proof_of_Income_Cert.pdf' (1.4MB)... Verified CBSL Signature.`)}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a2e56'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                              >
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' }}>
                                  PDF
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', textAlign: 'left' }}>
                                  <span style={{ display: 'block', fontWeight: '750', color: '#1e293b' }}>Proof_of_Income_Cert.pdf</span>
                                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>1.4 MB • Utility bill & Income Statement</span>
                                </div>
                                <span style={{ color: '#1a2e56', fontWeight: '800', fontSize: '12px' }}>View PDF ➔</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Reject/Approve Controls */}
                          {item.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                              <button
                                onClick={(e) => handleReject(item.id, e)}
                                style={{
                                  background: '#ffffff',
                                  color: '#ef4444',
                                  border: '1.5px solid #ef4444',
                                  padding: '8px 24px',
                                  borderRadius: '50px',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject Application
                              </button>
                              <button
                                onClick={(e) => handleApprove(item.id, e)}
                                style={{
                                  background: '#10b981',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '10px 24px',
                                  borderRadius: '50px',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve Application
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right column secure bank details & payment clearance */}
                        <div style={{ borderLeft: '1.5px solid #e2e8f0', paddingLeft: '40px' }}>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '14.5px', color: '#1a2e56', fontWeight: '800' }}>Payment & Transfer Console</h4>
                          
                          {item.bankDetails ? (
                            /* HIGHLY STYLED PREMIUM BANK CARD */
                            <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ display: 'block', fontSize: '11px', color: '#047857', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Payment Account</span>
                                <span style={{ fontSize: '11px', background: '#34d399', color: '#064e3b', fontWeight: '850', padding: '2px 8px', borderRadius: '50px' }}>CBSL matched</span>
                              </div>
                              <div style={{ fontSize: '13.5px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Bank Name:</span> <strong>{item.bankDetails.bankName}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Branch:</span> <strong>{item.bankDetails.branch}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>A/C Number:</span> <strong style={{ fontFamily: 'monospace', fontSize: '14px' }}>{item.bankDetails.accountNumber}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #c6f6d5', paddingTop: '8px', marginTop: '2px' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Account Holder:</span> <strong>{item.bankDetails.accountHolderName}</strong></div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '16px', color: '#e11d48', fontSize: '13px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fda4af', marginBottom: '20px' }}>
                              Resident has not provided bank account details yet. Money cannot be transferred.
                            </div>
                          )}

                          {/* Bank Actions */}
                          {item.status === 'Approved' && item.bankDetails && (
                            <div>
                              {item.paymentStatus === 'Unpaid' ? (
                                <>
                                  {/* Not verified state */}
                                  {!bankVerifiedMap[item.id] ? (
                                    <button
                                      onClick={(e) => handleVerifyBank(item.id, applicant, e)}
                                      disabled={verifyingBankId === item.id}
                                      style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '13.5px',
                                        fontWeight: '800',
                                        borderRadius: '8px',
                                        background: '#1a2e56',
                                        color: '#ffffff',
                                        border: 'none',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {verifyingBankId === item.id ? 'Connecting Central Registry...' : '🔍 Verify Bank Account Registry'}
                                    </button>
                                  ) : (
                                    /* Verified state & Disburse panel */
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '13.5px', fontWeight: '800', marginBottom: '14px' }}>
                                        <span>✓ Account Registry Status: verified</span>
                                      </div>

                                      {/* Amount select input */}
                                      <div style={{ marginBottom: '16px' }}>
                                        <label htmlFor={`amount-${item.id}`} style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#475569', marginBottom: '6px' }}>Transfer Amount (LKR) :</label>
                                        <input
                                          type="number"
                                          id={`amount-${item.id}`}
                                          className="register-control"
                                          value={transferAmount}
                                          onChange={(e) => setTransferAmount(e.target.value)}
                                          style={{ padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
                                        />
                                      </div>

                                      {/* Secure Disburse button */}
                                      <button
                                        onClick={(e) => handleSecureTransfer(item.id, item, e)}
                                        disabled={transferringId === item.id}
                                        style={{
                                          width: '100%',
                                          padding: '12px',
                                          fontSize: '13.5px',
                                          fontWeight: '800',
                                          borderRadius: '8px',
                                          background: '#10b981',
                                          color: '#ffffff',
                                          border: 'none',
                                          cursor: 'pointer',
                                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                        }}
                                      >
                                        {transferringId === item.id ? (
                                          <span>
                                            {transferStep === 1 && 'RTGS: Handshaking clearing gateway...'}
                                            {transferStep === 2 && 'RTGS: Disbursing secure cleared funds...'}
                                            {transferStep === 3 && 'RTGS: Finalizing transaction records...'}
                                          </span>
                                        ) : (
                                          '🔒 Securely Transfer Funds via RTGS'
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                /* Paid state logs & view receipt trigger */
                                <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '16px', color: '#065f46' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '800', fontSize: '13.5px' }}>
                                    <span>✓ Funds successfully Disbursed</span>
                                  </div>
                                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                    <div><span style={{ color: '#047857' }}>Transferred:</span> <strong>Rs. {item.paymentAmount}.00</strong></div>
                                    <div><span style={{ color: '#047857' }}>Cleared Date:</span> <strong>{item.paymentTransferredAt}</strong></div>
                                    <div><span style={{ color: '#047857' }}>Secure Ref:</span> <code>{item.paymentTransactionRef}</code></div>
                                  </div>
                                  
                                  {/* VIEW SECURED RECEIPT LINK */}
                                  <button
                                    onClick={(e) => viewReceipt(item, e)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#047857',
                                      fontWeight: '800',
                                      fontSize: '12.5px',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    🧾 View Payment Receipt
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {item.status !== 'Approved' && (
                            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Approved requests can clearing secure money transfers instantly.</span>
                          )}

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )
            })}

            {filteredRequests.length === 0 && (
              <div style={{ padding: '48px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '15px' }}>
                No allowance applications match the selected filters.
              </div>
            )}
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

      {/* 4. Payment Portal Secure Transfer Receipt Modal */}
      {showReceiptId && receiptRequest && (
        <div className="modal-backdrop-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-form-card animate-zoom-in" style={{ maxWidth: '460px', width: '90%', padding: '32px', borderRadius: '24px', border: '1.5px solid #10b981', backgroundColor: '#ffffff', color: '#1e293b', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.12)' }}>
            
            {/* Header: CBSL Seal */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2.5px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', backgroundColor: '#fdf8f0', color: '#d97706', fontSize: '24px', fontWeight: '800' }}>
                🇱🇰
              </div>
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '850', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Central Bank of Sri Lanka
              </h3>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '750', display: 'block', marginTop: '3px', letterSpacing: '0.2px' }}>
                RTGS SECURED CLEARING SYSTEM • SYSTEM RECEIPT
              </span>
            </div>

            {/* Receipt Details Box */}
            <div style={{ borderTop: '2px dashed #cbd5e1', borderBottom: '2px dashed #cbd5e1', padding: '16px 0', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Transaction Status:</span>
                <span style={{ color: '#047857', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ● Cleared & Settled
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Transaction Ref:</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '13.5px', color: '#1e293b' }}>
                  {receiptRequest.paymentTransactionRef}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Disbursed Date:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.paymentTransferredAt}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Allowance Program:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.program}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Applicant Name:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.applicantName || receiptRequest.bankDetails?.accountHolderName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Destination Bank:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.bankName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Branch Office:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.branch}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Credit Account:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.accountNumber}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: '#1a2e56', fontWeight: '800', fontSize: '14px' }}>Settled Amount:</span>
                <strong style={{ color: '#10b981', fontSize: '17px', fontWeight: '900' }}>
                  Rs. {receiptRequest.paymentAmount?.toLocaleString()}.00
                </strong>
              </div>
            </div>

            {/* Official seal mark */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', opacity: 0.85 }}>
              <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'left' }}>
                <span style={{ display: 'block', fontWeight: '800', color: '#475569' }}>DIVISIONAL CLEARANCE GATEWAY</span>
                 Colombo Divisional Secretariat, Sri Lanka
              </div>
              <div style={{ border: '2.5px solid #10b981', borderRadius: '8px', color: '#10b981', fontSize: '10px', fontWeight: '900', padding: '3px 8px', textTransform: 'uppercase', transform: 'rotate(-4deg)', letterSpacing: '1px' }}>
                ★ SmartGN APPROVED ★
              </div>
            </div>


