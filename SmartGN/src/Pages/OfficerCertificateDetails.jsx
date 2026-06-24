import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
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
              certRequest.status === 'Approved' ? 'bg-green-100 text-green-700' :
              certRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' :
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
                <h3 className="text-[17px] font-bold text-[#1B365D] m-0">Applicant Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Full Name</span>
                  <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.name}</span>
                </div>
                <div>
                  <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">NIC Number</span>
                  <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.nic || '789456123V'}</span>
                </div>
              </div>

              <div className="mb-5">
                <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Residential Address</span>
                <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.address || '45/2, Temple Road, Maharagama.'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Division</span>
                  <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.division}</span>
                </div>
                <div>
                  <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">Submission Date</span>
                  <span className="text-[14.5px] font-bold text-[#1e293b]">{certRequest.submittedDate}</span>
                </div>
              </div>

              <div>
                <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-2">Purpose of Request</span>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[13.5px] text-[#1E3A8A] font-medium leading-relaxed">
                  "{certRequest.purpose || 'Required for official purposes.'}"
                </div>
              </div>
            </div>

            {/* Right Card: Checks & History (Col span 1) */}
            <div className="flex flex-col gap-6 text-left">
              {/* Verification Checklist Card */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3 mb-4 m-0">
                  Verification Checklist
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Checkbox 1 */}
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

                  {/* Checkbox 2 */}
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

                  {/* Audit Check status */}
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
                {certRequest.type === 'Income Certificate' && (
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
          <div className="flex gap-4 justify-end mb-8">
            <button
              onClick={() => navigate('/dashboard/officer/certificates', { state: { successUser: `${profile.firstName} ${profile.lastName}`, officerId: officerIdVal } })}
              className="bg-transparent hover:bg-gray-100 text-[#475569] border border-[#cbd5e1] px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer"
            >
              Cancel Review
            </button>

            {certRequest.status === 'Pending' && (
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
