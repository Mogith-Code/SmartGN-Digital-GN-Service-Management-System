import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function ResidentDisasterReport({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'
  const firstName = successUser.split(' ')[0]

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