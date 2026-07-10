import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'
import Footer from '../Components/Common/Footer'

function OfficerAnnouncements({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and officerId from navigation state if available (defaults to Kamal Perera)
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || '200324511540'

  // Announcements lists state
  const [announcements, setAnnouncements] = useState([])
  const [viewMode, setViewMode] = useState('DASHBOARD') // 'DASHBOARD' | 'CREATE' | 'EDIT'
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [showPreviousAnnouncements, setShowPreviousAnnouncements] = useState(false)

  // Form Field States
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [editingId, setEditingId] = useState(null)
}

export default OfficerAnnouncements
