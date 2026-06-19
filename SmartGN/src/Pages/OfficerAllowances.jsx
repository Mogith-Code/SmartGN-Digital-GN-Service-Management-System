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

