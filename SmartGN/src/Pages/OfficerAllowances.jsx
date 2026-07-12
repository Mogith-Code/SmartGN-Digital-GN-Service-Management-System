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
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Officer Navbar */}
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Officer Sidebar */}
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        {/* Content Panel */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] m-0">
                Allowance Programs Queue
              </h2>
              <p className="text-sm text-[#64748b] mt-1">
                Analyze, verify and securely disburse funds to registered allowance applications.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-gray-200 self-start md:self-auto">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg border-0 cursor-pointer transition-all duration-150
                    ${filterStatus === status ? 'bg-white text-[#1B365D] shadow-xs' : 'bg-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-6 text-left">
            <input
              type="text"
              placeholder="Search by resident name, program (e.g. Aswesuma) or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" className="absolute left-4 top-3.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* List of Applications */}
          <div className="flex flex-col gap-4 text-left">
            {filteredRequests.map((item) => {
              const applicant = item.applicantName || item.bankDetails?.accountHolderName || 'Resident'
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200
                    ${isExpanded ? 'border-[#d97706]/40 shadow-md' : 'border-gray-200 shadow-xs hover:border-gray-300'}`}
                >
                  {/* Collapsed Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-5 sm:p-6 flex justify-between items-center cursor-pointer text-left select-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#005BBD] text-xl">★</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="margin-0 text-base font-bold text-[#1B365D]">
                            {item.program}
                          </h4>
                          
                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border
                            ${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'}`}
                          >
                            {item.status}
                          </span>
                          
                          {item.status === 'Approved' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border
                              ${item.paymentStatus === 'Paid' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-amber-500 text-white border-amber-500'}`}
                            >
                              {item.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Applicant: <strong className="text-gray-700">{applicant}</strong></span>
                          <span>NIC: <strong className="text-gray-700">{item.nic || '200324511540'}</strong></span>
                          <span>Submitted: <strong className="text-gray-700">{item.submittedDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span className="text-lg text-gray-400 font-bold transition-transform duration-200">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

export default OfficerAllowances;
