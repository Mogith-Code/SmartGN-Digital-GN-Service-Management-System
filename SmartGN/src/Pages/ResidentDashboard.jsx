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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = getAuthHeaders()
        
        // 1. Fetch certificates
        const certRes = await fetch('/api/certificates/resident', { headers })
        const certs = certRes.ok ? await certRes.json() : []

        // 2. Fetch allowances
        const allowRes = await fetch('/api/allowances/resident', { headers })
        const allowances = allowRes.ok ? await allowRes.json() : []

        // 3. Fetch appointments
        const apptRes = await fetch('/api/appointments/resident', { headers })
        const appts = apptRes.ok ? await apptRes.json() : []

        // Calculate pending and approved counts
        const pendingCerts = certs.filter(c => c.status === 'PENDING').length
        const pendingAllows = allowances.filter(a => a.status === 'PENDING').length
        const pendingAppts = appts.filter(a => a.status === 'PENDING').length
        setPendingRequestsCount(pendingCerts + pendingAllows + pendingAppts)

        const approvedCerts = certs.filter(c => c.status === 'APPROVED').length
        const approvedAllows = allowances.filter(a => a.status === 'APPROVED').length
        setApprovedRequestsCount(approvedCerts + approvedAllows)

        const confirmedAppts = appts.filter(a => a.status === 'CONFIRMED').length
        setUpcomingAppointmentsCount(confirmedAppts)

      } catch (err) {
        console.error('Error loading resident dashboard stats:', err)
      }
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements/feed')
        if (response.ok) {
          const data = await response.json()
          setAnnouncements(data.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching announcements feed:', err)
      }
    }

    fetchDashboardData()
    fetchAnnouncements()
  }, [])
  
