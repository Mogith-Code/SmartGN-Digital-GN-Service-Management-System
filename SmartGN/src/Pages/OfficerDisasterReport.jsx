import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerDisasterReports({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

   // Retrieve username and officerId from navigation state or localStorage
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'
  const firstName = successUser.split(' ')[0]

  // State to manage list of disasters
  const [disasters, setDisasters] = useState([])
  const [selectedDisaster, setSelectedDisaster] = useState(null)

   // State for taking action modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSeverity, setModalSeverity] = useState('high severity')
  const [modalStatus, setModalStatus] = useState('Pending')
  const [modalRemarks, setModalRemarks] = useState('')

  const loadDisasters = async () => {
    try {
      const response = await fetch('/api/disasters/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load disasters.')
      const data = await response.json()
      const formatted = data.map(item => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: item.resident_name || 'Resident',
        date: item.request_date ? item.request_date.split('T')[0] : '',
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || 'None specified',
        status: item.status,
        remarks: item.officer_remarks || ''
      }))
      setDisasters(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_disaster_reports')
      if (saved) setDisasters(JSON.parse(saved))
    }
  }

  // Load disasters on mount
  useEffect(() => {
    loadDisasters()
  }, [])

  // Handle open modal
  const handleOpenActionModal = (disaster) => {
    setSelectedDisaster(disaster)
    setModalSeverity(disaster.severity)
    setModalStatus(disaster.status || 'Pending')
    setModalRemarks(disaster.remarks || '')
    setIsModalOpen(true)
  }

  // Handle submit action in modal
  const handleSaveAction = async (e) => {
    e.preventDefault()
    if (!selectedDisaster) return

    try {
      const response = await fetch(`/api/disasters/${selectedDisaster.id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: modalStatus,
          severity: modalSeverity,
          officerRemarks: modalRemarks
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update report.')
      }







