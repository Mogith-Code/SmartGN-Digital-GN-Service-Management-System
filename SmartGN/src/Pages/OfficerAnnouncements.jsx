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
      setAnnouncements(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_announcements')
      if (saved) setAnnouncements(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  // Create Announcement Handlers
  const handleOpenCreate = () => {
    setTitle('')
    setCategory('General')
    setContent('')
    setIsUrgent(false)
    setEditingId(null)
    setViewMode('CREATE')
  }

  const handlePublish = async (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      alert('Please fill in all required fields.')
      return
    }

    try {
      const response = await fetch('/api/announcements/publish', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          description: content,
          type: isUrgent ? 'Urgent' : category
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to publish announcement.')
      }

      setShowSuccessBanner(true)
      setViewMode('DASHBOARD')
      loadAnnouncements()
    } catch (err) {
      alert(err.message || 'Error publishing announcement.')
    }
  }

  // Edit Announcement Handlers
  const handleOpenEdit = (item) => {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setContent(item.content)
    setIsUrgent(item.status === 'Urgent')
    setViewMode('EDIT')
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      alert('Please fill in all required fields.')
      return
    }

    try {
      const response = await fetch(`/api/announcements/${editingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          description: content,
          type: isUrgent ? 'Urgent' : category
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update announcement.')
      }

      setViewMode('DASHBOARD')
      loadAnnouncements()
      alert('Announcement updated successfully.')
    } catch (err) {
      alert(err.message || 'Error updating announcement.')
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement permanently?')
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/announcements/${editingId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to delete announcement.')
        }

        setViewMode('DASHBOARD')
        loadAnnouncements()
        alert('Announcement deleted successfully.')
      } catch (err) {
        alert(err.message || 'Error deleting announcement.')
      }
    }
  }

  // Restore Archived Announcement
  const handleRestore = async (id, titleText) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: titleText,
          description: 'Restored Announcement content.',
          type: 'Live'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to restore announcement.')
      }

      alert(`"${titleText}" has been restored to Live status.`)
      loadAnnouncements()
    } catch (err) {
      alert(err.message || 'Error restoring announcement.')
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Officer Navbar */}
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Officer Sidebar */}
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        {/* Content Panel */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          
          {/* Back button */}
          {(viewMode === 'CREATE' || viewMode === 'EDIT') && (
            <button 
              className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1B365D] font-semibold transition-all mb-6 self-start bg-transparent border-0 cursor-pointer"
              onClick={() => setViewMode('DASHBOARD')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Dashboard
            </button>
          )}
}

export default OfficerAnnouncements
