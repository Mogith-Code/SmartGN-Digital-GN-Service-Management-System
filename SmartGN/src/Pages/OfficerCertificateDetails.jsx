import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { addNotification } from '../utils/notifications'
import Footer from '../Components/Common/Footer'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'

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

  // Official Assessment Fields (Editable by Officer)
  const [personalKnown, setPersonalKnown] = useState('No')
  const [personalKnownSince, setPersonalKnownSince] = useState('')
  const [natureOfOtherEvidences, setNatureOfOtherEvidences] = useState('')
  const [convictedByCourt, setConvictedByCourt] = useState('No')
  const [convictedDetails, setConvictedDetails] = useState('')
  const [publicActivitiesInterest, setPublicActivitiesInterest] = useState('No')
  const [publicActivitiesDetails, setPublicActivitiesDetails] = useState('')
  const [character, setCharacter] = useState('Good')
  const [remarks, setRemarks] = useState('')
  const [certificateNo, setCertificateNo] = useState('')
  const [verifiedAnnualIncome, setVerifiedAnnualIncome] = useState('')

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
          type: found.certificate_type === 'INCOME' ? 'Income Certificate' : 'Character Certificate',
          status: found.status === 'PENDING' ? 'Pending' : found.status === 'APPROVED' ? 'Approved' : found.status === 'REJECTED' ? 'Rejected' : found.status,
          name: found.resident_name || found.name || 'Resident',
          purpose: found.purpose,
          submittedDate: found.request_date ? found.request_date.split('T')[0] : (found.submittedDate || ''),
          division: found.division || 'Colombo',
          nic: found.resident_nic || found.nic || '789456123V',
          address: found.resident_address || found.address || '',
          
          // Custom fields populated if present
          divisionalSecretariat: found.divisionalSecretariat || '',
          gnDivisionNumber: found.gnDivisionNumber || '',
          sex: found.sex || '',
          age: found.age || '',
          civilStatus: found.civilStatus || '',
          nationality: found.nationality || 'Sri Lankan',
          religion: found.religion || '',
          occupation: found.occupation || '',
          villagePeriod: found.villagePeriod || '',
          electoralRegister: found.electoralRegister || '',
          fatherName: found.fatherName || '',
          fatherAddress: found.fatherAddress || '',
          gnPeriod: found.gnPeriod || '',
          natureOfOtherEvidences: found.natureOfOtherEvidences || '',
          convictedByCourt: found.convictedByCourt || 'No',
          convictedDetails: found.convictedDetails || '',
          publicActivitiesInterest: found.publicActivitiesInterest || 'No',
          publicActivitiesDetails: found.publicActivitiesDetails || '',
          character: found.character || 'Good',
          remarks: found.remarks || '',
          personalKnown: found.personalKnown || 'No',
          personalKnownSince: found.personalKnownSince || '',
          certificateNo: found.certificateNo || '',

          // Income fields
          incomeStream: found.incomeStream || '',
          landOwnerName: found.landOwnerName || '',
          landAmount: found.landAmount || '',
          grantSheetNumber: found.grantSheetNumber || '',
          ownerIdentity: found.ownerIdentity || '',
          amountObtained: found.amountObtained || '',
          expenses: found.expenses || '',
          pricePerKg: found.pricePerKg || '',
          totalIncome: found.totalIncome || '',
          annualIncome: found.annualIncome || '',
          businessName: found.businessName || '',
          businessNature: found.businessNature || '',
          businessFileName: found.businessFileName || '',
          taxReceiptNumber: found.taxReceiptNumber || '',
          dailyMonthlyIncome: found.dailyMonthlyIncome || '',
          businessAnnualIncome: found.businessAnnualIncome || '',
          netIncome: found.netIncome || '',
          dailySalary: found.dailySalary || '',
          hoursWorked: found.hoursWorked || '',
          monthlyIncome: found.monthlyIncome || '',
          laborerAnnualIncome: found.laborerAnnualIncome || '',
          verifiedAnnualIncome: found.verifiedAnnualIncome || found.annualIncome || ''
        }
        setCertRequest(formatted)
        
        // Seed official state
        const isIncome = formatted.type === 'Income Certificate' || formatted.certificate_type === 'INCOME';
        setPersonalKnown(formatted.personalKnown)
        setPersonalKnownSince(formatted.personalKnownSince)
        setNatureOfOtherEvidences(formatted.natureOfOtherEvidences || 'Utility Bill')
        setConvictedByCourt(formatted.convictedByCourt)
        setConvictedDetails(formatted.convictedDetails)
        setPublicActivitiesInterest(formatted.publicActivitiesInterest)
        setPublicActivitiesDetails(formatted.publicActivitiesDetails)
        setCharacter(formatted.character)
        setRemarks(formatted.remarks)
        setCertificateNo(formatted.certificateNo || (isIncome ? `IC/2026/${Math.floor(1000 + Math.random() * 9000)}` : `CC/2026/${Math.floor(1000 + Math.random() * 9000)}`))
        setVerifiedAnnualIncome(formatted.verifiedAnnualIncome || formatted.annualIncome || '')

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
        
        const isIncome = found.type === 'Income Certificate' || found.certificate_type === 'INCOME' || found.certificateType === 'INCOME';
        setPersonalKnown(found.personalKnown || 'No')
        setPersonalKnownSince(found.personalKnownSince || '')
        setNatureOfOtherEvidences(found.natureOfOtherEvidences || 'Utility Bill')
        setConvictedByCourt(found.convictedByCourt || 'No')
        setConvictedDetails(found.convictedDetails || '')
        setPublicActivitiesInterest(found.publicActivitiesInterest || 'No')
        setPublicActivitiesDetails(found.publicActivitiesDetails || '')
        setCharacter(found.character || 'Good')
        setRemarks(found.remarks || '')
        setCertificateNo(found.certificateNo || (isIncome ? `IC/2026/${Math.floor(1000 + Math.random() * 9000)}` : `CC/2026/${Math.floor(1000 + Math.random() * 9000)}`))
        setVerifiedAnnualIncome(found.verifiedAnnualIncome || found.annualIncome || '')

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

    const payload = {
      status: 'APPROVED',
      personalKnown,
      personalKnownSince,
      natureOfOtherEvidences,
      convictedByCourt,
      convictedDetails,
      publicActivitiesInterest,
      publicActivitiesDetails,
      character,
      remarks,
      certificateNo,
      verifiedAnnualIncome,
      approvedDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      officerName: `${profile.firstName} ${profile.lastName}`
    }

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve certificate.')
      }

      addNotification('resident', {
        type: 'certificate',
        title: 'Certificate Request Approved',
        message: `Your ${certRequest?.type || 'Certificate'} request (${id}) has been approved by Grama Niladhari.`,
        link: '/ResidentDashboard/certificates/approved'
      })

      setCertRequest(prev => prev ? { ...prev, status: 'Approved' } : null)
      setDocumentAuditCheck(true)
      alert(`Certificate request ${id} has been Approved and Issued successfully!`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    } catch (err) {
      console.warn('API failed, executing local fallback update:', err.message)
      
      // Update Officer local fallback list
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) {
        const list = JSON.parse(saved)
        const updated = list.map(c => (c.id === id || c.request_id === id) ? { ...c, ...payload, status: 'APPROVED' } : c)
        localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      }

      // Update Resident local fallback list
      const residentSaved = localStorage.getItem('smartgn_certificates')
      if (residentSaved) {
        const resList = JSON.parse(residentSaved)
        const updatedRes = resList.map(c => (c.id === id || c.request_id === id) ? { ...c, ...payload, status: 'APPROVED' } : c)
        localStorage.setItem('smartgn_certificates', JSON.stringify(updatedRes))
      }

      addNotification('resident', {
        type: 'certificate',
        title: 'Certificate Request Approved',
        message: `Your ${certRequest?.type || 'Certificate'} request (${id}) has been approved by Grama Niladhari.`,
        link: '/ResidentDashboard/certificates/approved'
      })

      setCertRequest(prev => prev ? { ...prev, status: 'Approved' } : null)
      setDocumentAuditCheck(true)
      alert(`Certificate request ${id} has been Approved and Issued successfully! (offline data synced)`)
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

      addNotification('resident', {
        type: 'certificate',
        title: 'Certificate Request Rejected',
        message: `Your ${certRequest?.type || 'Certificate'} request (${id}) has been rejected. Reason: ${reason || 'Incomplete supporting documents.'}`,
        link: '/ResidentDashboard/certificates/rejected'
      })

      setCertRequest(prev => prev ? { ...prev, status: 'Rejected' } : null)
      alert(`Certificate request ${id} has been Rejected.`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    } catch (err) {
      console.warn('API failed, executing local fallback reject:', err.message)
      
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) {
        const list = JSON.parse(saved)
        const updated = list.map(c => (c.id === id || c.request_id === id) ? { ...c, status: 'REJECTED', rejectionReason: reason || 'Incomplete supporting documents.' } : c)
        localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      }

      const residentSaved = localStorage.getItem('smartgn_certificates')
      if (residentSaved) {
        const resList = JSON.parse(residentSaved)
        const updatedRes = resList.map(c => (c.id === id || c.request_id === id) ? { ...c, status: 'REJECTED', rejectionReason: reason || 'Incomplete supporting documents.' } : c)
        localStorage.setItem('smartgn_certificates', JSON.stringify(updatedRes))
      }

      addNotification('resident', {
        type: 'certificate',
        title: 'Certificate Request Rejected',
        message: `Your ${certRequest?.type || 'Certificate'} request (${id}) has been rejected. Reason: ${reason || 'Incomplete supporting documents.'}`,
        link: '/ResidentDashboard/certificates/rejected'
      })

      setCertRequest(prev => prev ? { ...prev, status: 'Rejected' } : null)
      alert(`Certificate request ${id} has been Rejected. (offline data synced)`)
      navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })
    }
  }

  const isCharacterCert = certRequest.type === 'Character Certificate' || certRequest.certificate_type === 'CHARACTER';

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      
      {/* 1. Header */}
      <OfficerNavbar />

      {/* 2. Main Dashboard Layout */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar Nav */}
        <OSidebar />

        {/* Main Panel Content */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-[13.5px] text-[#64748b] mb-4 font-semibold text-left">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}>Certificates Services</span>
            <span>➔</span>
            <span className="text-[#1e293b]">Request Details</span>
          </div>

          {/* Heading Row */}
          <div className="flex justify-between items-center mb-6 text-left">
            <div>
              <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
                Request Details - {certRequest.type}
              </h2>
              <span className="text-[14.5px] text-[#64748b] font-semibold">
                Reviewing application ID: {certRequest.id}
              </span>
            </div>

            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold uppercase ${
              certRequest.status === 'Approved' || certRequest.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              certRequest.status === 'Rejected' || certRequest.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {certRequest.status === 'Pending' ? 'Pending Review' : certRequest.status}
            </span>
          </div>

          {/* Two Column Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            
            {/* Left Card: Applicant Info (Col span 2) */}
            <div className="lg:col-span-2 bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm text-left">
              <div className="flex items-center gap-3.5 border-b border-[#f1f5f9] pb-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#EBF8FF] flex items-center justify-center text-[#1B365D]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-[#1B365D] m-0">Applicant Information Form Details</h3>
              </div>

              {!isCharacterCert ? (
                // Income Certificate / Default View
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Full Name</span>
                      <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.name}</span>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">NIC Number</span>
                      <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.nic || '789456123V'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Residential Address</span>
                    <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.address || '45/2, Temple Road, Maharagama.'}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Grama Niladhari Division</span>
                      <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.gnDivisionNumber || certRequest.division}</span>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Submission Date</span>
                      <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.submittedDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Income Stream / Category</span>
                      <span className="text-[14.5px] font-bold text-[#1e293b] uppercase">
                        {certRequest.incomeStream === 'Paddy' ? 'Paddy / Agriculture' : (certRequest.incomeStream === 'Business' ? 'Business / Commercial' : (certRequest.incomeStream === 'Laborer' ? 'Carpenter / Laborer / Services' : 'Other'))}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Declared Annual Income</span>
                      <span className="text-[14.5px] font-bold text-emerald-700">
                        Rs. {certRequest.annualIncome || '0'}
                      </span>
                    </div>
                  </div>

                  {certRequest.incomeStream === 'Paddy' && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="text-[14px] font-bold text-[#1B365D] uppercase tracking-wider mb-3">Paddy / Agriculture Stream Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
                        <div>
                          <span className="text-slate-500 font-semibold block">Land Owner Name:</span>
                          <span className="text-slate-800 font-bold">{certRequest.landOwnerName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Amount of Land:</span>
                          <span className="text-slate-800 font-bold">{certRequest.landAmount || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Applicant Ownership Identity:</span>
                          <span className="text-slate-800 font-bold">{certRequest.ownerIdentity || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Amount of Paddy Obtained:</span>
                          <span className="text-slate-800 font-bold">{certRequest.amountObtained || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Price per Kg:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.pricePerKg || '0'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Expenses:</span>
                          <span className="text-slate-800 font-bold text-red-600">Rs. {certRequest.expenses || '0'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Total Crop Income:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.totalIncome || '0'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {certRequest.incomeStream === 'Business' && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="text-[14px] font-bold text-[#1B365D] uppercase tracking-wider mb-3">Business / Commercial Stream Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
                        <div>
                          <span className="text-slate-500 font-semibold block">Business Name:</span>
                          <span className="text-slate-800 font-bold">{certRequest.businessName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Nature of Business:</span>
                          <span className="text-slate-800 font-bold">{certRequest.businessNature || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Tax Receipt Number:</span>
                          <span className="text-slate-800 font-bold">{certRequest.taxReceiptNumber || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Daily/Monthly Income:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.dailyMonthlyIncome || '0'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Net Income:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.netIncome || '0'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {certRequest.incomeStream === 'Laborer' && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="text-[14px] font-bold text-[#1B365D] uppercase tracking-wider mb-3">Carpenter / Masonry / Hired Laborer Stream Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
                        <div>
                          <span className="text-slate-500 font-semibold block">Daily Salary / Rate:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.dailySalary || '0'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Hours worked per week:</span>
                          <span className="text-slate-800 font-bold">{certRequest.hoursWorked || '0'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Monthly Income:</span>
                          <span className="text-slate-800 font-bold">Rs. {certRequest.monthlyIncome || '0'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-2">Purpose of Request</span>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[13.5px] text-[#1E3A8A] font-medium leading-relaxed">
                      "{certRequest.purpose || 'Required for official purposes.'}"
                    </div>
                  </div>
                </div>
              ) : (
                // Full Official Template Sections for Character Certificates
                <div className="flex flex-col gap-6">
                  
                  {/* SECTION 1 */}
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
                      Section (1) - Divisional & Personal Knowledge
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
                      <div>
                        <span className="text-slate-500 font-semibold block">(a) District & Divisional Secretariat:</span>
                        <span className="text-slate-800 font-bold">{certRequest.divisionalSecretariat || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(b) Grama Niladhari Division & Number:</span>
                        <span className="text-slate-800 font-bold">{certRequest.gnDivisionNumber || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(c) Personally known to Grama Niladhari?</span>
                        <span className="text-slate-800 font-bold">{certRequest.personalKnown || "No"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(d) If so, since when?</span>
                        <span className="text-slate-800 font-bold">{certRequest.personalKnown === 'Yes' ? (certRequest.personalKnownSince || "Since birth") : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 */}
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
                      Section (2) - Applicant Particulars
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-semibold block">(a) Name in Full:</span>
                        <span className="text-slate-800 font-bold">{certRequest.name}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-semibold block">(b) Residential Address:</span>
                        <span className="text-slate-800 font-bold">{certRequest.address}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(c) Sex:</span>
                        <span className="text-slate-800 font-bold">{certRequest.sex || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(d) Age:</span>
                        <span className="text-slate-800 font-bold">{certRequest.age || "(Not specified)"} Years</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(e) Civil Status:</span>
                        <span className="text-slate-800 font-bold">{certRequest.civilStatus || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(f) Sri Lankan Nationality:</span>
                        <span className="text-slate-800 font-bold">{certRequest.nationality || "Sri Lankan"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(g) Religion:</span>
                        <span className="text-slate-800 font-bold">{certRequest.religion || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(h) Present Occupation:</span>
                        <span className="text-slate-800 font-bold">{certRequest.occupation || "Student / Unemployed"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(i) Period of Residence in Village:</span>
                        <span className="text-slate-800 font-bold">{certRequest.villagePeriod || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(j) National Identity Card No:</span>
                        <span className="text-slate-800 font-bold font-mono text-[14px]">{certRequest.nic}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-semibold block">(k) Electoral Register Particulars:</span>
                        <span className="text-slate-800 font-bold">{certRequest.electoralRegister || "Registered"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(l) Father's Name:</span>
                        <span className="text-slate-800 font-bold">{certRequest.fatherName || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(m) Father's Address:</span>
                        <span className="text-slate-800 font-bold">{certRequest.fatherAddress || "(Not specified)"}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-semibold block">(n) Purpose of Certificate:</span>
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded font-bold block mt-1">{certRequest.purpose}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3 */}
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
                      Section (3) - Residence & Background Evidence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
                      <div>
                        <span className="text-slate-500 font-semibold block">(a) Period of residence in GN Division:</span>
                        <span className="text-slate-800 font-bold">{certRequest.gnPeriod || "(Not specified)"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(b) Nature of residence proof:</span>
                        <span className="text-slate-800 font-bold">{certRequest.natureOfOtherEvidences || "Utility bills, GN registry"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(c) Convicted by Court of Law?</span>
                        <span className={`font-bold ${certRequest.convictedByCourt === 'Yes' ? 'text-red-600' : 'text-slate-800'}`}>
                          {certRequest.convictedByCourt === 'Yes' ? `Yes - ${certRequest.convictedDetails}` : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">(d) Interested in public/social activities?</span>
                        <span className="text-slate-800 font-bold">
                          {certRequest.publicActivitiesInterest === 'Yes' ? `Yes - ${certRequest.publicActivitiesDetails}` : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Right Column Checks & History */}
            <div className="flex flex-col gap-6 text-left">
              
              {/* Verification Checklist Card */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3 mb-4 m-0">
                  Verification Checklist
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-start">
                    <input
                      type="checkbox"
                      checked={addressCheck}
                      onChange={(e) => setAddressCheck(e.target.checked)}
                      className="mt-1 cursor-pointer w-4 h-4 accent-emerald-600 rounded"
                    />
                    <div>
                      <span className="block text-[13.5px] font-bold text-[#1e293b]">Address Verified</span>
                      <span className="text-[11.5px] text-[#64748b]">Cross-checked with voter registry</span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <input
                      type="checkbox"
                      checked={nicCheck}
                      onChange={(e) => setNicCheck(e.target.checked)}
                      className="mt-1 cursor-pointer w-4 h-4 accent-emerald-600 rounded"
                    />
                    <div>
                      <span className="block text-[13.5px] font-bold text-[#1e293b]">NIC Verified</span>
                      <span className="text-[11.5px] text-[#64748b]">Authenticated via DRP API</span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-bold mt-0.5 flex-shrink-0 ${
                      documentAuditCheck ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}>
                      {documentAuditCheck ? '✓' : '!'}
                    </div>
                    <div>
                      <span className="block text-[13.5px] font-bold text-[#1e293b]">
                        {certRequest.type.split(' ')[0]} Audit
                      </span>
                      <span className="text-[11.5px] text-[#64748b]">
                        {documentAuditCheck ? 'Completed document review' : 'Requires document audit'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous History Card */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3 mb-4 m-0">
                  Previous History
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-[#f8fafc] border border-gray-100 p-3.5 rounded-xl">
                    <div className="text-[13px]">
                      <span className="block font-bold text-[#1e293b]">Residence Cert</span>
                      <span className="text-[#64748b] text-[12px]">Sept 2025 • Ref #4412</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-green-100 text-green-700 uppercase">Issued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Assessment Card (GN Form fields for character cert) */}
          {isCharacterCert && (certRequest.status === 'Pending' || certRequest.status === 'PENDING') && (
            <div className="bg-white border border-[#fedc9b] rounded-2xl p-8 shadow-md text-left mb-8 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2 border-b border-[#fedc9b]/40 pb-4 mb-6 font-sans">
                <span className="text-xl">✍️</span>
                <h3 className="text-[17px] font-bold text-[#854d0e] m-0">Grama Niladhari Official Assessment Form</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13.5px] font-sans">
                
                {/* 1. Personally Known */}
                <div className="flex flex-col">
                  <label htmlFor="assessKnown" className="font-bold text-[#334155] mb-1.5">Is applicant personally known to you? :</label>
                  <select 
                    id="assessKnown" 
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                    value={personalKnown}
                    onChange={(e) => setPersonalKnown(e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* 2. Known Since */}
                <div className="flex flex-col">
                  <label htmlFor="assessSince" className="font-bold text-[#334155] mb-1.5">If yes, since when? (e.g. 3 years, Birth) :</label>
                  <input 
                    type="text" 
                    id="assessSince" 
                    placeholder="Specify period"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={personalKnownSince}
                    onChange={(e) => setPersonalKnownSince(e.target.value)}
                    disabled={personalKnown === 'No'}
                  />
                </div>

                {/* 3. Evidence of Residence */}
                <div className="flex flex-col">
                  <label htmlFor="assessEvidence" className="font-bold text-[#334155] mb-1.5">Proof of Residence Evidence Checked :</label>
                  <input 
                    type="text" 
                    id="assessEvidence" 
                    placeholder="e.g. Utility Bills / Voter List Registry"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={natureOfOtherEvidences}
                    onChange={(e) => setNatureOfOtherEvidences(e.target.value)}
                  />
                </div>

                {/* 4. Court Conviction */}
                <div className="flex flex-col">
                  <label htmlFor="assessConvicted" className="font-bold text-[#334155] mb-1.5">Any record of conviction in Court? :</label>
                  <select 
                    id="assessConvicted" 
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                    value={convictedByCourt}
                    onChange={(e) => setConvictedByCourt(e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* 5. Conviction Details */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="assessConvictDetails" className="font-bold text-[#334155] mb-1.5">Conviction Details (if applicable) :</label>
                  <input 
                    type="text" 
                    id="assessConvictDetails" 
                    placeholder="Write details if any"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={convictedDetails}
                    onChange={(e) => setConvictedDetails(e.target.value)}
                    disabled={convictedByCourt === 'No'}
                  />
                </div>

                {/* 6. Public Activities */}
                <div className="flex flex-col">
                  <label htmlFor="assessPublic" className="font-bold text-[#334155] mb-1.5">Applicant interest in social work/community? :</label>
                  <select 
                    id="assessPublic" 
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                    value={publicActivitiesInterest}
                    onChange={(e) => setPublicActivitiesInterest(e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* 7. Public Details */}
                <div className="flex flex-col">
                  <label htmlFor="assessPublicDetails" className="font-bold text-[#334155] mb-1.5">Public activities details :</label>
                  <input 
                    type="text" 
                    placeholder="Describe activities"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={publicActivitiesDetails}
                    onChange={(e) => setPublicActivitiesDetails(e.target.value)}
                    disabled={publicActivitiesInterest === 'No'}
                  />
                </div>

                {/* 8. Character Evaluation */}
                <div className="flex flex-col">
                  <label htmlFor="assessCharacter" className="font-bold text-[#334155] mb-1.5">Overall Character Assessment :</label>
                  <select 
                    id="assessCharacter" 
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white font-bold text-slate-800"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                  >
                    <option value="Good">Good</option>
                    <option value="Exemplary">Exemplary</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Unsatisfactory">Unsatisfactory</option>
                  </select>
                </div>

                {/* 9. Serial Number */}
                <div className="flex flex-col">
                  <label htmlFor="assessSerial" className="font-bold text-[#334155] mb-1.5">Generated Certificate Serial Number :</label>
                  <input 
                    type="text" 
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg font-bold text-slate-800"
                    value={certificateNo}
                    onChange={(e) => setCertificateNo(e.target.value)}
                  />
                </div>

                {/* 10. Remarks */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="assessRemarks" className="font-bold text-[#334155] mb-1.5">Grama Niladhari Remarks & Assessment Notes :</label>
                  <textarea 
                    rows="3" 
                    placeholder="Enter additional remarks"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Official Assessment Card (GN Form fields for income cert) */}
          {!isCharacterCert && (certRequest.status === 'Pending' || certRequest.status === 'PENDING') && (
            <div className="bg-white border border-[#fedc9b] rounded-2xl p-8 shadow-md text-left mb-8 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2 border-b border-[#fedc9b]/40 pb-4 mb-6 font-sans">
                <span className="text-xl">✍️</span>
                <h3 className="text-[17px] font-bold text-[#854d0e] m-0">Grama Niladhari Official Income Verification Form</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13.5px] font-sans">
                
                {/* 1. Verified Annual Income */}
                <div className="flex flex-col">
                  <label htmlFor="assessVerifiedIncome" className="font-bold text-[#334155] mb-1.5">Verified Annual Income (Rs.) :</label>
                  <input 
                    type="number" 
                    id="assessVerifiedIncome" 
                    placeholder="Verify and enter the verified annual income"
                    className="w-full py-2.5 px-3.5 border border-[#cbd5e1] rounded-lg font-bold text-emerald-800"
                    value={verifiedAnnualIncome}
                    onChange={(e) => setVerifiedAnnualIncome(e.target.value)}
                  />
                </div>

                {/* 2. Certificate Serial Number */}
                <div className="flex flex-col">
                  <label htmlFor="assessSerial" className="font-bold text-[#334155] mb-1.5">Generated Certificate Serial Number :</label>
                  <input 
                    type="text" 
                    className="w-full py-2.5 px-3.5 border border-[#cbd5e1] rounded-lg font-bold text-slate-800"
                    value={certificateNo}
                    onChange={(e) => setCertificateNo(e.target.value)}
                  />
                </div>

                {/* 3. Document Audited checklist */}
                <div className="flex flex-col md:col-span-2">
                  <span className="font-bold text-[#334155] block mb-2">Supporting Documents Audited:</span>
                  <div className="flex flex-wrap gap-5 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-emerald-600 rounded" 
                        defaultChecked={certRequest.incomeStream === 'Paddy'}
                      />
                      <span>License/Permit/Grant sheet copy</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-emerald-600 rounded" 
                        defaultChecked={certRequest.incomeStream === 'Business'}
                      />
                      <span>Business Registration Copy</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-emerald-600 rounded" 
                        defaultChecked={certRequest.incomeStream === 'Business'}
                      />
                      <span>Pradeshiya Sabha Tax Receipt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-emerald-600 rounded" 
                        defaultChecked={certRequest.incomeStream === 'Laborer'}
                      />
                      <span>Salary Slip / Income Declaration</span>
                    </label>
                  </div>
                </div>

                {/* 4. Remarks */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="assessRemarks" className="font-bold text-[#334155] mb-1.5">Grama Niladhari Remarks & Assessment Notes :</label>
                  <textarea 
                    rows="3" 
                    placeholder="Enter assessment remarks for this income certificate (e.g. Verified with land records / trade registers)"
                    className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Bottom Card: Supporting Documents */}
          <div className="bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm text-left mb-8">
            <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">📎</span>
                <h3 className="text-[17px] font-bold text-[#1B365D] m-0">Supporting Documents</h3>
              </div>
              <button 
                onClick={() => alert("Downloading all supportive files securely...")}
                className="bg-transparent hover:bg-gray-50 border-0 text-[#1B365D] hover:text-[#005BBD] font-bold text-[13.5px] cursor-pointer flex items-center gap-1.5 transition-colors duration-150"
              >
                📥 Download All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Documents Grid (Col span 2) */}
              <div className="lg:col-span-2 flex gap-5 flex-wrap">
                {/* Document 1 */}
                <div className="w-[200px] border border-[#cbd5e1] rounded-xl overflow-hidden bg-[#f8fafc] shadow-sm">
                  <div className="h-[110px] bg-slate-200 flex items-center justify-center text-[#94a3b8] text-[28px] border-b border-[#cbd5e1] relative">
                    📄
                    <span className="absolute left-2 top-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">PDF • 1.2MB</span>
                  </div>
                  <div className="p-3 text-[13px]">
                    <span className="block font-bold text-[#1e293b] truncate">Proof of Residence</span>
                    <span className="text-[#64748b] text-[11.5px]">Utility Bill - March 2026</span>
                  </div>
                </div>

                {/* Document 2 (only for Income Certs) */}
                {!isCharacterCert && (
                  <div className="w-[200px] border border-[#cbd5e1] rounded-xl overflow-hidden bg-[#f8fafc] shadow-sm">
                    <div className="h-[110px] bg-slate-200 flex items-center justify-center text-[#94a3b8] text-[28px] border-b border-[#cbd5e1] relative">
                      🖼️
                      <span className="absolute left-2 top-2 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">JPG • 2.5MB</span>
                    </div>
                    <div className="p-3 text-[13px]">
                      <span className="block font-bold text-[#1e293b] truncate">Income Declaration</span>
                      <span className="text-[#64748b] text-[11.5px]">Signed & Notarized</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Officer Quick Check Box (Col span 1) */}
              <div className="border border-dashed border-[#fedc9b] bg-[#fdf8f0] p-5 rounded-2xl">
                <h4 className="m-0 mb-4 text-[12px] uppercase text-[#854d0e] font-extrabold tracking-wide">
                  Officer Quick Check
                </h4>

                <div className="flex flex-col gap-3.5">
                  <label className="flex gap-2.5 items-center cursor-pointer text-[13.5px] text-[#1e293b] font-bold">
                    <input
                      type="checkbox"
                      checked={signatureMatch}
                      onChange={(e) => setSignatureMatch(e.target.checked)}
                      className="w-4 h-4 accent-[#1B365D]"
                    />
                    <span>Signature matches record</span>
                  </label>

                  <label className="flex gap-2.5 items-center cursor-pointer text-[13.5px] text-[#1e293b] font-bold">
                    <input
                      type="checkbox"
                      checked={billsVerified}
                      onChange={(e) => setBillsVerified(e.target.checked)}
                      className="w-4 h-4 accent-[#1B365D]"
                    />
                    <span>Supporting bills verified</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row Buttons: Approve & Reject */}
          <div className="flex gap-4 justify-end mb-8 font-sans">
            <button
              onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}
              className="bg-transparent hover:bg-gray-100 text-[#475569] border border-[#cbd5e1] px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer"
            >
              Cancel Review
            </button>

            {(certRequest.status === 'Pending' || certRequest.status === 'PENDING') && (
              <>
                <button
                  onClick={handleReject}
                  className="bg-transparent hover:bg-red-50 text-red-600 border border-red-600 px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer flex items-center gap-1.5 transition-colors duration-150"
                >
                  Reject Application
                </button>

                <button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 px-8 py-2.5 rounded-full text-[14px] font-bold cursor-pointer flex items-center gap-1.5 shadow-md transition-colors duration-150"
                >
                  Approve Application
                </button>
              </>
            )}
          </div>

          {/* Floating Help Trigger */}
          <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  )
}

export default OfficerCertificateDetails
