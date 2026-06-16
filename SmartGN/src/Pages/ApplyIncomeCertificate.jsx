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
}
