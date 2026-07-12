import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'
import Footer from '../Components/Common/Footer'

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

export default OfficerAllowances;
