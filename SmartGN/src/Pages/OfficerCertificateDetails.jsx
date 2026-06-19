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

  useEffect(() => {
    loadCertDetails()
  }, [id])

  if (!certRequest) {
    return (
      <div className="flex items-center justify-center p-20 min-h-screen text-[18px] text-[#64748b] font-medium bg-[#F7FAFC]">
        Loading request details...
      </div>
    )
  }

  const handleApprove = async () => {
    if (!signatureMatch || !billsVerified) {
      const confirmApprove = window.confirm("You have not checked all Officer Quick Check items. Do you still want to approve this application?")
      if (!confirmApprove) return
    }

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'APPROVED' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve certificate.')
      }

      setCertRequest(prev => prev ? { ...prev, status: 'Approved' } : null)
      setDocumentAuditCheck(true)
      alert(`Certificate request ${id} has been Approved and Issued successfully!`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    } catch (err) {
      console.error('API failed, executing local fallback:', err)
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) {
        const list = JSON.parse(saved)
        const updated = list.map(c => (c.id === id || c.request_id === id) ? { ...c, status: 'Approved' } : c)
        localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      }
      setCertRequest(prev => prev ? { ...prev, status: 'Approved' } : null)
      setDocumentAuditCheck(true)
      alert(`Certificate request ${id} has been Approved and Issued successfully! (local fallback)`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    }
  }

  const handleReject = async () => {
    const reason = window.prompt("Please enter the reason for rejection:")
    if (reason === null) return // cancelled prompt
    
    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason || 'Incomplete supporting documents.' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject certificate.')
      }

      setCertRequest(prev => prev ? { ...prev, status: 'Rejected' } : null)
      alert(`Certificate request ${id} has been Rejected.`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    } catch (err) {
      console.error('API failed, executing local fallback:', err)
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) {
        const list = JSON.parse(saved)
        const updated = list.map(c => (c.id === id || c.request_id === id) ? { ...c, status: 'Rejected', rejectionReason: reason || 'Incomplete supporting documents.' } : c)
        localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      }
      setCertRequest(prev => prev ? { ...prev, status: 'Rejected' } : null)
      alert(`Certificate request ${id} has been Rejected. (local fallback)`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      
      {/* 1. Header */}
      <header className="flex justify-between items-center px-10 py-4 bg-white border-b border-[#cbd5e1] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] sticky top-0 z-50">
        <div className="w-28 sm:w-32 md:w-40 lg:w-48 cursor-pointer flex flex-col items-start gap-1" onClick={() => navigate('/')}>
          <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto object-contain" />
          <p className="text-[10px] text-[#718096] font-normal leading-none">{t.tagline}</p>
        </div>

        <div className="flex items-center gap-6">
          <LanguageSelector />

          {/* Notifications */}
          <div className="relative cursor-pointer text-[#475569]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-[#64748b] font-medium">{officerIdVal}</span>
              <span className="text-[14px] font-semibold text-[#1e293b]">{profile.firstName} {profile.lastName}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="User Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
          </div>
        </div>
      </header>
