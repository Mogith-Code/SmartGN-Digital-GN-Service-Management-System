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

export default ResidentAllowances;
