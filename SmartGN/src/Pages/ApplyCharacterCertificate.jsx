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
  