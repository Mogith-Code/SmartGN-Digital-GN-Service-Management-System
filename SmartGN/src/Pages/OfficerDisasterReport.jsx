import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'
import Footer from '../Components/Common/Footer'

 OfficerDisasterReports({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and officerId from navigation state or localStorage
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'

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

      setIsModalOpen(false)
      setSelectedDisaster(null)
      loadDisasters()
      alert('Disaster status updated successfully.')
    } catch (err) {
      alert(err.message || 'Error updating report.')
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

        {/* Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] m-0">
              Disaster Management Queue
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              Monitor disaster reports, evaluate damage severity, and dispatch emergency relief aid.
            </p>
          </div>

          {/* Disasters List Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {disasters.length === 0 ? (
              <div className="md:col-span-2 py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 font-medium">
                No disaster reports filed in your division currently.
              </div>
            ) : (
              disasters.map((disaster) => {
                const cardClass = disaster.severity.includes('high') 
                  ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400' 
                  : disaster.severity.includes('medium') 
                    ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400' 
                    : 'border-gray-200 bg-white hover:border-gray-300'

                const severityBadgeClass = disaster.severity.includes('high')
                  ? 'bg-rose-100 text-rose-800'
                  : disaster.severity.includes('medium')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-800'

                return (
                  <div 
                    key={disaster.id} 
                    className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all shadow-xs ${cardClass}`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center 
                            ${disaster.severity.includes('high') ? 'bg-rose-100 text-rose-700' : 
                              disaster.severity.includes('medium') ? 'bg-amber-100 text-amber-700' : 
                              'bg-slate-100 text-slate-600'}`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <h3 className="text-base font-bold text-[#1B365D] m-0">{disaster.type}</h3>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${severityBadgeClass}`}>
                          {disaster.severity}
                        </span>
                      </div>