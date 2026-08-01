import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import { addNotification } from '../utils/notifications'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'
import Footer from '../Components/Common/Footer'
import ChatbotButton from '../Components/Common/ChatbotButton'

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

    const updatedAnnItem = {
      id: editingId || `ANN-${Date.now()}`,
      announcement_id: editingId || `ANN-${Date.now()}`,
      title,
      category: isUrgent ? 'General' : category,
      type: isUrgent ? 'Urgent' : category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content,
      description: content,
      status: isUrgent ? 'Urgent' : 'Live'
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
        console.warn('Backend API announcement notice:', data.error)
      }
    } catch (err) {
      console.warn('API error, saving announcement locally:', err)
    }

    // Sync to localStorage store
    const localStore = JSON.parse(localStorage.getItem('smartgn_announcements') || '[]')
    const updatedStore = [updatedAnnItem, ...localStore.filter(a => a.id !== updatedAnnItem.id && a.announcement_id !== updatedAnnItem.id)]
    localStorage.setItem('smartgn_announcements', JSON.stringify(updatedStore))
    window.dispatchEvent(new Event('announcementsUpdated'))

    addNotification('resident', {
      type: 'announcement',
      title: `New Announcement: ${title}`,
      message: `Published by Grama Niladhari Office: ${content.substring(0, 80)}${content.length > 80 ? '...' : ''}`,
      link: '/ResidentDashboard'
    })

    setShowSuccessBanner(true)
    setViewMode('DASHBOARD')
    loadAnnouncements()
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

    const updatedAnnItem = {
      id: editingId,
      announcement_id: editingId,
      title,
      category: isUrgent ? 'General' : category,
      type: isUrgent ? 'Urgent' : category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content,
      description: content,
      status: isUrgent ? 'Urgent' : 'Live'
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
        console.warn('Backend announcement update note:', data.error)
      }
    } catch (err) {
      console.warn('API error on save, saving locally:', err)
    }

    // Sync to localStorage store
    const localStore = JSON.parse(localStorage.getItem('smartgn_announcements') || '[]')
    const updatedStore = localStore.map(item => (item.id === editingId || item.announcement_id === editingId ? { ...item, ...updatedAnnItem } : item))
    localStorage.setItem('smartgn_announcements', JSON.stringify(updatedStore))
    window.dispatchEvent(new Event('announcementsUpdated'))

    addNotification('resident', {
      type: 'announcement',
      title: `Updated Announcement: ${title}`,
      message: `Updated by Grama Niladhari Office: ${content.substring(0, 80)}${content.length > 80 ? '...' : ''}`,
      link: '/ResidentDashboard'
    })

    setViewMode('DASHBOARD')
    loadAnnouncements()
    alert('Announcement updated successfully.')
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

          {/* Sub-view: DASHBOARD (Dashboard Announcement Lists) */}
          {viewMode === 'DASHBOARD' && (
            <>
              {/* Success alert published block */}
              {showSuccessBanner && (
                <div className="bg-emerald-600 border border-emerald-700 text-white rounded-xl p-4 mb-6 flex justify-between items-center text-left shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <div>
                      <span className="font-bold block">Announcement Published Successfully!</span>
                      <span className="text-xs opacity-90">Your announcement is now live for all registered residents in the GN division.</span>
                    </div>
                  </div>
                  <button 
                    className="bg-transparent border-0 text-white hover:opacity-85 text-xl cursor-pointer" 
                    onClick={() => setShowSuccessBanner(false)} 
                    aria-label="Close Alert"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Title & Publish Trigger Action Row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-left">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] m-0">
                    Announcements Dashboard
                  </h2>
                  <p className="text-sm text-[#64748b] mt-1 font-semibold">
                    Manage and track all public notifications sent to the community.
                  </p>
                </div>
                
                <button 
                  onClick={handleOpenCreate} 
                  className="bg-[#1B365D] hover:bg-[#005BBD] text-white border-0 py-2.5 px-5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create New Announcement
                </button>
              </div>

              {/* Active Announcements List */}
              <div className="flex flex-col gap-5 text-left">
                {announcements.length === 0 ? (
                  <div className="py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 font-medium">
                    No active announcements currently live.
                  </div>
                ) : (
                  announcements.map((item) => {
                    const isUrgentType = item.status === 'Urgent'
                    const isArchivedType = item.status === 'Archived'
                    
                    const borderLeftColor = isUrgentType 
                      ? 'border-rose-500' 
                      : isArchivedType 
                        ? 'border-gray-400' 
                        : 'border-emerald-500'

                    return (
                      <div 
                        key={item.id} 
                        className={`border-l-4 ${borderLeftColor} bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-300`}
                      >
                        <div className="flex-1">
                          {/* Status Badge Bullet */}
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className={`w-2.5 h-2.5 rounded-full 
                              ${isUrgentType ? 'bg-rose-500' : isArchivedType ? 'bg-gray-400' : 'bg-emerald-500'}`}
                            ></span>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider
                              ${isUrgentType ? 'text-rose-500' : isArchivedType ? 'text-gray-500' : 'text-emerald-500'}`}
                            >
                              {isUrgentType ? '! Urgent' : isArchivedType ? 'Archived' : 'Live'}
                            </span>
                          </div>

                          {/* Title & Meta Info */}
                          <h3 className="text-base font-bold text-gray-800 m-0 mb-1.5">{item.title}</h3>
                          <p className="text-xs text-gray-500 font-semibold mb-3">
                            <span className="text-amber-600 font-bold uppercase mr-1.5">[{item.category}]</span> 
                            {item.date}
                          </p>

                          {/* Content text */}
                          <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-normal m-0">{item.content}</p>
                        </div>

                        {/* Right Action Button */}
                        {!isArchivedType ? (
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="bg-sky-50 hover:bg-sky-100 text-[#005BBD] border border-[#005BBD]/30 py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 self-start md:self-auto min-w-[90px]"
                            title="Edit announcement"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            Edit
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRestore(item.id, item.title)}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 self-start md:self-auto min-w-[90px]"
                            title="Restore announcement to Live feed"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="23 4 23 10 17 10"></polyline>
                              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            Restore
                          </button>
                        )}

                      </div>
                    )
                  })
                )}
              </div>

              {/* Bottom Load */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowPreviousAnnouncements(!showPreviousAnnouncements)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border-0 py-2.5 px-6 rounded-full text-xs sm:text-sm cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  Load Previous Announcements
                  <span className={`transform transition-transform duration-250 ${showPreviousAnnouncements ? 'rotate-180' : 'none'}`}>▼</span>
                </button>

                {showPreviousAnnouncements && (
                  <div className="mt-5 p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-[#F8FAFC] text-gray-500 font-bold text-xs sm:text-sm">
                    No older announcements archived in the history folder currently.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Sub-view: CREATE (Create Announcement View Form) */}
          {viewMode === 'CREATE' && (
            <>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] mb-6 text-left">
                Create Announcement
              </h2>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl text-left">
                <form onSubmit={handlePublish} className="flex flex-col gap-5">
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apptTitle" className="text-xs font-bold text-[#475569]">Title *</label>
                    <input 
                      type="text" 
                      id="apptTitle"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white" 
                      placeholder="Announcement title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apptCategory" className="text-xs font-bold text-[#475569]">Category *</label>
                    <input 
                      type="text" 
                      id="apptCategory"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white" 
                      placeholder="e.g. Health, Utilities, Education"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apptContent" className="text-xs font-bold text-[#475569]">Content *</label>
                    <textarea 
                      id="apptContent"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white resize-none" 
                      rows="5"
                      placeholder="Write your announcement content..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{ height: '140px' }}
                      required
                    />
                  </div>

                  {/* Checkbox Urgent Toggle */}
                  <div className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      id="urgentCheck" 
                      className="w-4 h-4 cursor-pointer"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                    />
                    <label htmlFor="urgentCheck" className="text-xs sm:text-sm font-bold text-[#475569] cursor-pointer">
                      Mark as urgent announcement
                    </label>
                  </div>

                  {/* Form Action Publish Buttons */}
                  <div className="flex items-center justify-start border-t border-gray-155 pt-4 mt-2">
                    <button 
                      type="submit" 
                      className="bg-[#1B365D] hover:bg-[#005BBD] text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Publish Announcement
                    </button>
                  </div>

                </form>
              </div>
            </>
          )}

           {/* Sub-view: EDIT (Edit/Delete Announcement Form View) */}
          {viewMode === 'EDIT' && (
            <>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] mb-6 text-left">
                Edit Announcement
              </h2>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl text-left">
                <form onSubmit={handleSaveChanges} className="flex flex-col gap-5">
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="editTitle" className="text-xs font-bold text-[#475569]">Title *</label>
                    <input 
                      type="text" 
                      id="editTitle"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="editCategory" className="text-xs font-bold text-[#475569]">Category *</label>
                    <input 
                      type="text" 
                      id="editCategory"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="editContent" className="text-xs font-bold text-[#475569]">Content *</label>
                    <textarea 
                      id="editContent"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white resize-none" 
                      rows="5"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{ height: '140px' }}
                      required
                    />
                  </div>

                  {/* Checkbox Urgent Toggle */}
                  <div className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      id="editUrgentCheck" 
                      className="w-4 h-4 cursor-pointer"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                    />
                    <label htmlFor="editUrgentCheck" className="text-xs sm:text-sm font-bold text-[#475569] cursor-pointer">
                      Mark as urgent announcement
                    </label>
                  </div>

                  {/* Form Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-gray-155 pt-4 mt-2">
                    <button 
                      type="button" 
                      onClick={handleDelete} 
                      className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete Announcement
                    </button>

                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setViewMode('DASHBOARD')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Floating AI Assistant Chatbot Button */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default OfficerAnnouncements
