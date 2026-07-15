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

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          {/* Back button */}
          <button 
            className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1B365D] font-semibold transition-all mb-6 self-start bg-transparent border-0 cursor-pointer"
            onClick={() => navigate('/dashboard/resident', { state: { successUser, division: userDivision } })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] mb-6 text-left">
            Disaster Damage Report & Relief Application
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Left Column: Form Card */}
            <div className="lg:col-span-7 bg-white border border-[#2D37482D] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4">
                Report Disaster Damage
              </h3>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm rounded-xl p-4 mb-6">
                Use this form to report damage caused by natural disasters to your property, crops, or livelihood and apply for official Grama Niladhari relief evaluation.
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        

export default ResidentDisasterReport;
