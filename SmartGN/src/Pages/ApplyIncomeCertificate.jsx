import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function ApplyIncomeCertificate({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  // Form Field States
  const [fullName, setFullName] = useState(successUser)
  const [gnDivisionNumber, setGnDivisionNumber] = useState('')
  const [address, setAddress] = useState('')
  
  // Income stream
  const [incomeStream, setIncomeStream] = useState('Laborer') // Paddy, Business, Laborer
  
  // Paddy/Banana/Coconut details
  const [landOwnerName, setLandOwnerName] = useState('')
  const [landAmount, setLandAmount] = useState('')
  const [grantSheetNumber, setGrantSheetNumber] = useState('')
  const [ownerIdentity, setOwnerIdentity] = useState('')
  
  // Paddy Financial calculations
  const [amountObtained, setAmountObtained] = useState('')
  const [expenses, setExpenses] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [totalIncome, setTotalIncome] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  
  // Businesses / brands details
  const [businessName, setBusinessName] = useState('')
  const [businessNature, setBusinessNature] = useState('')
  const [businessFileName, setBusinessFileName] = useState('')
  const [taxReceiptNumber, setTaxReceiptNumber] = useState('')
  
  // Business Income
  const [dailyMonthlyIncome, setDailyMonthlyIncome] = useState('')
  const [businessAnnualIncome, setBusinessAnnualIncome] = useState('')
  const [netIncome, setNetIncome] = useState('')

  // Carpenter/ Masonry/ hired laborer/ Other details
  const [dailySalary, setDailySalary] = useState('')
  const [hoursWorked, setHoursWorked] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [laborerAnnualIncome, setLaborerAnnualIncome] = useState('')
  
  const [purpose, setPurpose] = useState('')
  const [fileName, setFileName] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const handleReset = () => {
    setFullName('')
    setGnDivisionNumber('')
    setAddress('')
    setIncomeStream('Laborer')
    
    // Paddy states
    setLandOwnerName('')
    setLandAmount('')
    setGrantSheetNumber('')
    setOwnerIdentity('')
    setAmountObtained('')
    setExpenses('')
    setPricePerKg('')
    setTotalIncome('')
    setAnnualIncome('')
    
    // Business states
    setBusinessName('')
    setBusinessNature('')
    setBusinessFileName('')
    setTaxReceiptNumber('')
    setDailyMonthlyIncome('')
    setBusinessAnnualIncome('')
    setNetIncome('')

    // Laborer states
    setDailySalary('')
    setHoursWorked('')
    setMonthlyIncome('')
    setLaborerAnnualIncome('')
    
    setPurpose('')
    setFileName('')
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (incomeStream === 'Paddy') {
      if (!fullName || !gnDivisionNumber || !address || !landOwnerName || !landAmount || !ownerIdentity || !amountObtained || !expenses || !pricePerKg || !totalIncome || !annualIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else if (incomeStream === 'Business') {
      if (!fullName || !gnDivisionNumber || !address || !businessName || !businessNature || !taxReceiptNumber || !dailyMonthlyIncome || !businessAnnualIncome || !netIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else if (incomeStream === 'Laborer') {
      if (!fullName || !gnDivisionNumber || !address || !dailySalary || !hoursWorked || !monthlyIncome || !laborerAnnualIncome || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
    } else {
      if (!fullName || !gnDivisionNumber || !address || !purpose) {
        setErrorMessage('Please fill in all required fields.')
        return
      }
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
          certificateType: 'INCOME',
          purpose: purpose,
          requestDate: new Date().toISOString().split('T')[0],
          supportingDocs: []
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit certificate application')
      }

      alert('Income Certificate Application submitted successfully!')
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
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">Application for Income Certificates</h2>

          {/* Form Container Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            
            {/* Warning block note */}
            <div className="flex items-center justify-between py-4 px-6 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-semibold text-[14px] mb-6 text-left">
              <span>A commission of 1.27% of the value of the income certificate is charged by the government.</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* Row 1 */}
                <div className="flex flex-col">
                  <label htmlFor="fullName" className="text-[13px] font-semibold text-[#334155] mb-1.5">Full name of the applicant :</label>
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

                {/* Row 2 - Address spans both */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="address" className="text-[13px] font-semibold text-[#334155] mb-1.5">Address :</label>
                  <input 
                    type="text" 
                    id="address" 
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3 - Income Stream Radio Buttons */}
                <div className="flex flex-col md:col-span-2">
                  <label className="text-[13px] font-semibold text-[#334155] mb-2">Income stream :</label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-[#f8fafc] p-4 rounded-xl border border-[#cbd5e1]">
                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Paddy" 
                        checked={incomeStream === 'Paddy'}
                        onChange={() => setIncomeStream('Paddy')}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Paddy/ Banana/ Coconut etc.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Business" 
                        checked={incomeStream === 'Business'}
                        onChange={() => setIncomeStream('Business')}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Businesses/ brands</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input 
                        type="radio" 
                        name="incomeStream" 
                        value="Laborer" 
                        checked={incomeStream === 'Laborer'}
                        onChange={() => setIncomeStream('Laborer')}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Carpenter/ Masonry/ hired laborer/ Other</span>
                    </label>
                  </div>
                </div>

                {/* DYNAMIC FORM SEGMENT: Active stream Paddy/Banana/Coconut */}
                {incomeStream === 'Paddy' && (
                  <>
                    <div className="flex flex-col">
                      <label htmlFor="landOwnerName" className="text-[13px] font-semibold text-[#334155] mb-1.5">Name of the land owner :</label>
                      <input 
                        type="text" 
                        id="landOwnerName" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={landOwnerName}
                        onChange={(e) => setLandOwnerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="landAmount" className="text-[13px] font-semibold text-[#334155] mb-1.5">Amount of land :</label>
                      <input 
                        type="text" 
                        id="landAmount" 
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10" 
                        value={landAmount}
                        onChange={(e) => setLandAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="uploadSheet" className="text-[13px] font-semibold text-[#334155] mb-1.5">License/ Permit/ Grant sheet number (Upload a certified copy) :</label>
                      <div className="relative border-2 border-dashed border-[#cbd5e1] rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer min-h-[100px]">
                        <input 
                          type="file" 
                          id="uploadSheet"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name)
                              setGrantSheetNumber(e.target.files[0].name)
                            }
                          }}
                        />
                        <label htmlFor="uploadSheet" className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span className="text-[13.5px] text-[#64748b] font-medium text-center">
                            {fileName ? fileName : 'Upload Certified Document'}
                          </span>
                        </label>
                      </div>
                    </div>
                