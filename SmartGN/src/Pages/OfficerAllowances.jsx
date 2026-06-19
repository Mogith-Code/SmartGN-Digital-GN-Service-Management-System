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

