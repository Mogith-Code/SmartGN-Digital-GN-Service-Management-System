import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function ResidentAllowances({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division from navigation state if available
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'
  const applicantNic = localStorage.getItem('smartgn_user_id') || '200324511540'

  // Allowance Requests State
  const [requests, setRequests] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form Field States
  const [applicantName, setApplicantName] = useState(successUser)
  const [applicantNicState, setApplicantNicState] = useState(applicantNic)
  const [purpose, setPurpose] = useState('For certify residence')
  const [income, setIncome] = useState('')
  const [remarks, setRemarks] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Secure Bank Details State
  const [bankName, setBankName] = useState('Bank of Ceylon')
  const [bankBranch, setBankBranch] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [accountHolder, setAccountHolder] = useState(successUser)

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
      setApplicantNicState(parsed.nic || applicantNic)
      setAccountHolder(parsed.fullName || `${parsed.firstName} ${parsed.lastName}`)
    }
    loadRequests()
  }, [])

  // Calculate dynamic stats
  const pendingCount = requests.filter(item => item.status === 'Pending').length
  const approvedCount = requests.filter(item => item.status === 'Approved').length
  const rejectedCount = requests.filter(item => item.status === 'Rejected').length

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
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          {/* Back button */}
          <button 
            className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1B365D] font-semibold transition-all mb-6 self-start bg-transparent border-0 cursor-pointer"
            onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] mb-6 text-left">
            Allowance Programs
          </h2>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            {/* Pending */}
            <div className="bg-white border border-[#2D37482D] rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Pending Requests</span>
                <span className="text-2xl font-bold text-[#1B365D]">{pendingCount}</span>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-white border border-[#2D37482D] rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Approved Requests</span>
                <span className="text-2xl font-bold text-[#1B365D]">{approvedCount}</span>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white border border-[#2D37482D] rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Rejected Requests</span>
                <span className="text-2xl font-bold text-[#1B365D]">{rejectedCount}</span>
              </div>
            </div>
          </div>

          {/* Program Request list */}
          <div className="bg-white border border-[#2D37482D] rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-6">
              Available Allowance Programs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Aswesuma', desc: 'Social safety net program aiming to help low-income families.', icon: '🇱🇰' },
                { name: 'Samurdhi', desc: 'National welfare initiative designed to alleviate poverty.', icon: '🌾' },
                { name: 'Elderly Support', desc: 'Financial assistance for senior citizens above the age of 70.', icon: '👵' },
                { name: 'Disability Allowance', desc: 'Financial relief support to assist differently-abled citizens.', icon: '♿' },
                { name: 'Kidney Disease Support', desc: 'Welfare fund targeting medical support for kidney patients.', icon: '🩺' }
              ].map((prog) => (
                <div key={prog.name} className="flex flex-col justify-between p-5 bg-[#F8FAFC] border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{prog.icon}</span>
                      <span className="bg-[#1B365D]/10 text-[#1B365D] text-xs px-2.5 py-1 rounded-full font-bold">LKR Cleared</span>
                    </div>
                    <h4 className="text-base font-bold text-[#1B365D] mb-2">{prog.name}</h4>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">{prog.desc}</p>
                  </div>
                  <button 
                    className="w-full mt-auto bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 border-0 cursor-pointer transition-colors text-sm" 
                    onClick={() => handleOpenApply(prog.name)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* History tracking status */}
          <div className="bg-white border border-[#2D37482D] rounded-2xl p-6 text-left">
            <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-6">
              Application & Payment History
            </h3>

            {requests.length === 0 ? (
              <div className="py-8 text-center text-gray-500 font-medium text-sm">
                No allowance applications submitted yet.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {requests.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[#005BBD] text-lg mt-0.5">★</span>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-[#1a2e56] text-base">{item.program}</span>
                          <span className="text-xs text-[#64748b] mt-1">Purpose: {item.purpose}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border
                          ${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'}`}
                        >
                          {item.status === 'Approved' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                          {item.status === 'Rejected' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                          {item.status === 'Pending' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 14 12"></polyline>
                            </svg>
                          )}
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {item.status === 'Approved' && item.paymentStatus === 'Paid' && (
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-start gap-4 text-left transition-all">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                        <div className="text-xs sm:text-sm text-[#065f46] leading-relaxed">
                          <strong className="block text-emerald-800 font-bold mb-1">Secure Allowance Funds Disbursed</strong>
                          Your Grama Niladhari office has securely transferred <strong className="font-bold">Rs. {item.paymentAmount ? parseFloat(item.paymentAmount).toLocaleString() : '5,000'}.00</strong> to your verified <strong className="font-bold">{item.bankDetails?.bankName} ({item.bankDetails?.accountNumber})</strong> account on <span className="font-medium">{item.paymentTransferredAt}</span>. Transaction Reference: <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-xs">{item.paymentTransactionRef}</code>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

export default ResidentAllowances;
