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

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load announcements.')
      const data = await response.json()
      const formatted = data.map(item => {
        const dateObj = new Date(item.date)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const formattedDate = `${months[dateObj.getMonth()] || 'Oct'} ${dateObj.getDate() || 24}, ${dateObj.getFullYear() || 2026} • ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

        const isUrgentType = item.type.toLowerCase() === 'urgent'
        return {
          id: item.announcement_id,
          title: item.title,
          category: isUrgentType ? 'General' : item.type,
          date: formattedDate,
          content: item.description,
          status: isUrgentType ? 'Urgent' : 'Live'
        }
      })
}

export default OfficerAnnouncements
