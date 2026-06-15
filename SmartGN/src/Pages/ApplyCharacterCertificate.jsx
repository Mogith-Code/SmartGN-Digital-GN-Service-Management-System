import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function ApplyCharacterCertificate({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  // Form Field States
  const [divisionalSecretariat, setDivisionalSecretariat] = useState('')
  const [gnDivisionNumber, setGnDivisionNumber] = useState('')
  const [fullName, setFullName] = useState(successUser)
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  const [sex, setSex] = useState('')
  const [civilStatus, setCivilStatus] = useState('')
  const [nationality, setNationality] = useState('Sri Lankan')
  const [religion, setReligion] = useState('')
  const [occupation, setOccupation] = useState('')
  const [villagePeriod, setVillagePeriod] = useState('')
  const [electoralRegister, setElectoralRegister] = useState('')
  const [nicNumber, setNicNumber] = useState(userDivision.length === 12 || userDivision.length === 10 ? userDivision : '')
  const [fatherNameAddress1, setFatherNameAddress1] = useState('')
  const [fatherNameAddress2, setFatherNameAddress2] = useState('')
  const [purpose, setPurpose] = useState('')
  const [gnPeriod, setGnPeriod] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = () => {
    setDivisionalSecretariat('')
    setGnDivisionNumber('')
    setFullName('')
    setAge('')
    setAddress('')
    setSex('')
    setCivilStatus('')
    setNationality('Sri Lankan')
    setReligion('')
    setOccupation('')
    setVillagePeriod('')
    setElectoralRegister('')
    setNicNumber('')
    setFatherNameAddress1('')
    setFatherNameAddress2('')
    setPurpose('')
    setGnPeriod('')
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!divisionalSecretariat || !gnDivisionNumber || !fullName || !age || !address || !sex || !civilStatus || !nationality || !religion || !nicNumber || !purpose || !gnPeriod) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setErrorMessage('')
    
    try {
      const token = localStorage.getItem('smartgn_token')
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
      const response = await fetch('/api/certificates/apply', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          certificateType: 'CHARACTER',
          purpose: purpose,
          requestDate: new Date().toISOString().split('T')[0],
          supportingDocs: []
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit certificate application')
      }

      alert('Character certificate application submitted successfully!')
      navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })
    } catch (err) {
      setErrorMessage(err.message || 'Error connecting to backend server.')
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      
      {/* 1. Header */}
      <AfterlogNavbar />

      {/* 2. Main Layout Grid */}
      <div className="flex gap-[20px] flex-1">
        
        {/* Sidebar Nav */}
        <div className="flex bg-[#FFFFFF]">
          <RSidebar />
        </div>

        {/* Main Panel Content */}
        <main className="w-full bg-[#FFFFFF] border-l border-[#2D37482D] p-6 sm:p-8 md:p-10 relative">
          
          {/* Back button */}
          <div className="flex justify-start items-center mb-4">
            <button className="flex items-center gap-1.5 py-2 px-4 border border-[#cbd5e1] bg-white text-[#475569] rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#f1f5f9] hover:text-[#1e293b]" onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">Application for Character Certificates</h2>

          {/* Form Container Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            
            {/* Warning block note */}
            <div className="flex items-center justify-between py-4 px-6 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-semibold text-[14px] mb-6 text-left">
              <span>This certificate is issued by the Grama Niladhari of the division in which the applicant resides is valid only for 06 months from the date issued.</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* Row 1 */}
                <div className="flex flex-col">
                  <label htmlFor="divSecretariat" className="text-[13px] font-semibold text-[#334155] mb-1.5">District and Divisional Secretary's Division :</label>
                  <input 
                    type="text" 
                    id="divSecretariat" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={divisionalSecretariat}
                    onChange={(e) => setDivisionalSecretariat(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="gnDivNumber" className="text-[13px] font-semibold text-[#334155] mb-1.5">Grama Niladhari Division and Number :</label>
                  <input 
                    type="text" 
                    id="gnDivNumber" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={gnDivisionNumber}
                    onChange={(e) => setGnDivisionNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Row 2 */}
                <div className="flex flex-col">
                  <label htmlFor="fullName" className="text-[13px] font-semibold text-[#334155] mb-1.5">Name :</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="age" className="text-[13px] font-semibold text-[#334155] mb-1.5">Age :</label>
                  <input 
                    type="text" 
                    id="age" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3 - Full Width */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="address" className="text-[13px] font-semibold text-[#334155] mb-1.5">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Row 4 */}
                <div className="flex flex-col">
                  <label htmlFor="sex" className="text-[13px] font-semibold text-[#334155] mb-1.5">Sex :</label>
                  <input 
                    type="text" 
                    id="sex" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="civilStatus" className="text-[13px] font-semibold text-[#334155] mb-1.5">Civil Status :</label>
                  <input 
                    type="text" 
                    id="civilStatus" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    required
                  />
                </div>

                {/* Row 5 */}
                <div className="flex flex-col">
                  <label htmlFor="nationality" className="text-[13px] font-semibold text-[#334155] mb-1.5">Whether Sri Lankan :</label>
                  <input 
                    type="text" 
                    id="nationality" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="religion" className="text-[13px] font-semibold text-[#334155] mb-1.5">Religion :</label>
                  <input 
                    type="text" 
                    id="religion" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    required
                  />
                </div>

                {/* Row 6 */}
                <div className="flex flex-col">
                  <label htmlFor="occupation" className="text-[13px] font-semibold text-[#334155] mb-1.5">Present Occupation :</label>
                  <input 
                    type="text" 
                    id="occupation" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="villagePeriod" className="text-[13px] font-semibold text-[#334155] mb-1.5">Period of residence in the village :</label>
                  <input 
                    type="text" 
                    id="villagePeriod" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={villagePeriod}
                    onChange={(e) => setVillagePeriod(e.target.value)}
                  />
                </div>

                {/* Row 7 */}
                <div className="flex flex-col">
                  <label htmlFor="electoral" className="text-[13px] font-semibold text-[#334155] mb-1.5">Number of the Electoral Register and Particulars of Registration :</label>
                  <input 
                    type="text" 
                    id="electoral" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={electoralRegister}
                    onChange={(e) => setElectoralRegister(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="nic" className="text-[13px] font-semibold text-[#334155] mb-1.5">National Identity Card No. :</label>
                  <input 
                    type="text" 
                    id="nic" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={nicNumber}
                    onChange={(e) => setNicNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Row 8 - Full Width Father details (Dual stacked input) */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="fatherDetails" className="text-[13px] font-semibold text-[#334155] mb-1.5">Name and Address of the Father :</label>
                  <input 
                    type="text" 
                    id="fatherDetails" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 mb-3" 
                    placeholder="Father's Name"
                    value={fatherNameAddress1}
                    onChange={(e) => setFatherNameAddress1(e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    placeholder="Father's Address"
                    value={fatherNameAddress2}
                    onChange={(e) => setFatherNameAddress2(e.target.value)}
                  />
                </div>

                {/* Row 9 - Full Width Purpose */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="purpose" className="text-[13px] font-semibold text-[#334155] mb-1.5">Purpose for which the certificate is required :</label>
                  <input 
                    type="text" 
                    id="purpose" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                {/* Row 10 - GN Period (Left column) */}
                <div className="flex flex-col">
                  <label htmlFor="gnPeriod" className="text-[13px] font-semibold text-[#334155] mb-1.5">Period of residence in the Grama Niladhari Division :</label>
                  <input 
                    type="text" 
                    id="gnPeriod" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={gnPeriod}
                    onChange={(e) => setGnPeriod(e.target.value)}
                    required
                  />
                </div>

              </div>

              {errorMessage && (
                <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0', textAlign: 'left' }}>
                  {errorMessage}
                </p>
              )}

              {/* Submit / Reset Actions Row */}
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" className="py-2.5 px-5 rounded-lg border-0 text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 flex items-center gap-1.5" onClick={handleReset}>
                  Reset
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                </button>
                
                <button type="submit" className="py-2.5 px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center gap-1.5">
                  Submit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>

            </form>
          </div>

