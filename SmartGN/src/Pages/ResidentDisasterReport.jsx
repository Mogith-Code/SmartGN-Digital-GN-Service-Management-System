import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'


function ResidentDisasterReport({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  // Form Fields
  const [disasterType, setDisasterType] = useState('Flood')
  const [locationArea, setLocationArea] = useState('')
  const [severity, setSeverity] = useState('low severity')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [aidRequested, setAidRequested] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // State for tracked disasters
  const [myDisasters, setMyDisasters] = useState([])

  // Load disasters on mount
  useEffect(() => {
    loadDisasters()
  }, [])

  const loadDisasters = async () => {
    try {
      const response = await fetch('/api/disasters/resident', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load disaster history.')
      const data = await response.json()
      const formatted = data.map(item => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: successUser,
        date: item.request_date ? item.request_date.split('T')[0] : '',
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || 'None specified',
        status: item.status,
        remarks: item.officer_remarks || ''
      }))
      setMyDisasters(formatted)
    } catch (err) {
      console.error(err)
      // Fallback
      const saved = localStorage.getItem('smartgn_disaster_reports')
      if (saved) {
        const allDisasters = JSON.parse(saved)
        const filtered = allDisasters.filter(item => item.reporter === successUser)
        setMyDisasters(filtered)
      }
    }
  }

  // Handle form reset
  const handleReset = () => {
    setDisasterType('Flood')
    setLocationArea('')
    setSeverity('low severity')
    setDescription('')
    setContactNumber('')
    setAidRequested('')
    setErrorMessage('')
  }

  // Handle submit new report
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!locationArea || !description || !contactNumber) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setErrorMessage('')

    try {
      const response = await fetch('/api/disasters/report', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          disasterType,
          description,
          severity,
          location: locationArea,
          contact: contactNumber,
          aidRequested
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report.')
      }

      handleReset()
      loadDisasters()
      alert('Disaster report submitted successfully! The Grama Niladhari division office has been notified.')
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting report.')
    }
  }

export default ResidentDisasterReport;
