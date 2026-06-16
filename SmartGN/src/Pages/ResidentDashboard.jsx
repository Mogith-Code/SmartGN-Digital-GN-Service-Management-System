import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function ResidentDashboard({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division from navigation state if available (defaults to Nimal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  
  // Extract first name for the personal greeting
  const firstName = successUser.split(' ')[0]
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true)

  // States for dynamic database counts
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [approvedRequestsCount, setApprovedRequestsCount] = useState(0)
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0)
  const [announcements, setAnnouncements] = useState([])
  