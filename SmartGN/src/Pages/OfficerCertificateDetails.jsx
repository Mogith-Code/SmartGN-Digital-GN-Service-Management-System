import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'
import Footer from '../Components/Common/Footer'

function OfficerCertificateDetails({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user details
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || '200324511540'

  // States
  const [profile, setProfile] = useState({
    firstName: 'Kamal',
    lastName: 'Perera',
    fullName: 'Dissanayake Mudiyanselage Kamal Perera',
    division: 'Colombo, Borella',
    serviceTime: '2',
    email: 'Nirmal.Perera@example.com',
    mobile: '0703564478',
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null
  })
  
  const [certRequest, setCertRequest] = useState(null)
  const [addressCheck, setAddressCheck] = useState(true)
  const [nicCheck, setNicCheck] = useState(true)
  const [documentAuditCheck, setDocumentAuditCheck] = useState(false)
  
  // Officer Quick Check states
  const [signatureMatch, setSignatureMatch] = useState(false)
  const [billsVerified, setBillsVerified] = useState(false)

  // Local helper for Authorization Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('smartgn_token')
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  }

  // Load profile from localStorage (for dynamic header display)
  useEffect(() => {
    const saved = localStorage.getItem('smartgn_officer_profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    }
  }, [])

  const loadCertDetails = async () => {
    try {
      const response = await fetch('/api/certificates/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load certificate requests.')
      const data = await response.json()
      const found = data.find(r => (r.request_id === id || r.id === id))
      if (found) {
        const formatted = {
          id: found.request_id || found.id,
          type: found.certificate_type === 'INCOME' ? 'Income Certificate' : found.certificate_type === 'CHARACTER' ? 'Character Certificate' : (found.type || 'Residence Certificate'),
          status: found.status === 'PENDING' ? 'Pending' : found.status === 'APPROVED' ? 'Approved' : found.status === 'REJECTED' ? 'Rejected' : found.status,
          name: found.resident_name || found.name || 'Resident',
          purpose: found.purpose,
          submittedDate: found.request_date ? found.request_date.split('T')[0] : (found.submittedDate || ''),
          division: found.division || 'Colombo',
          nic: found.resident_nic || found.nic || '789456123V',
          address: found.resident_address || found.address || ''
        }
        setCertRequest(formatted)
        
        if (formatted.status === 'Approved') {
          setDocumentAuditCheck(true)
          setSignatureMatch(true)
          setBillsVerified(true)
        } else if (formatted.status === 'Rejected') {
          setDocumentAuditCheck(false)
          setSignatureMatch(false)
          setBillsVerified(false)
        }

        return
      }
    } catch (err) {
      console.error('API load failed, trying local fallback:', err)
    }

    // Local Storage Lookup Fallback
    const saved = localStorage.getItem('smartgn_certificate_requests')
    if (saved) {
      const list = JSON.parse(saved)
      const found = list.find(r => (r.id === id || r.request_id === id))
      if (found) {
        setCertRequest(found)
        if (found.status === 'Approved' || found.status === 'APPROVED') {
          setDocumentAuditCheck(true)
          setSignatureMatch(true)
          setBillsVerified(true)
        } else if (found.status === 'Rejected' || found.status === 'REJECTED') {
          setDocumentAuditCheck(false)
          setSignatureMatch(false)
          setBillsVerified(false)
        }
      }
    }
  }