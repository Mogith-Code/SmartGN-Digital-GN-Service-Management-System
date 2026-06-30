import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import { authenticatedFetch } from '../utils/api'
import logoImage from '../assets/logo.png'
import Footer from '../Components/Common/Footer'
import notificationIcon from '../assets/notifications_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import accountIcon from '../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'

import dashboardIcon from '../assets/team_dashboard_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import dashboardIconActive from '../assets/team_dashboard_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import officersIcon from '../assets/person_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import officersIconActive from '../assets/person_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import residentsIcon from '../assets/home_and_garden_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import residentsIconActive from '../assets/home_and_garden_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'
import troubleshootIcon from '../assets/edit_document_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg'
import troubleshootIconActive from '../assets/edit_document_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg'

function AdminDashboard({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user details
  const successUser = location.state?.successUser || 'System Admin'

  const adminDict = {
    EN: {
      consoleTitle: "Divisional System Admin Console",
      overview: "Dashboard Overview",
      officers: "GN Officer Accounts",
      residents: "Resident Profiles",
      troubleshoot: "Troubleshoot Node",
      logout: "Log Out Admin",
      systemOverview: "System Overview",
      totalGN: "Total GN Officers",
      regResidents: "Registered Residents",
      rtgsTransfers: "RTGS Money Transfers",
      serverNode: "System Server Node",
      healthy: "Healthy",
      cleared: "Cleared Gateway",
      recentLogs: "Recent System Auditing Logs",
      officerRegistry: "GN Officer Profile Registry",
      officerSub: "Temporarily deactivate or suspend divisional officers if they cause policy troubles.",
      residentRegistry: "Resident Account Registry",
      residentSub: "Block or suspend residential profiles if they make troubles in household applications.",
      thName: "Officer Name",
      thID: "Officer ID",
      thOffice: "Divisional Office",
      thStatus: "Registry Status",
      thAction: "Actions Control",
      thResName: "Resident Name",
      thNIC: "NIC Number",
      thResOffice: "Household Division",
      thResStatus: "Active Status",
      troubleshootSub: "Flush operational caches, secure registries pipelines, and correct data inconsistencies.",
      diagnosticCenter: "Diagnostic Diagnostics Center",
      diagnosticDesc: "If residents experience latency or data mismatches during allowance applications or certificate requests, run the system optimization tool. This optimizes RTGS clearing queues and flushes temporary server assets.",
      runDiagnostic: "Run Diagnostics & Flush Cache",
      optimizing: "Optimizing Local Nodes...",
      diagnosticsSuccessAlert: "Diagnostics Sweep & Cache optimization completed successfully!"
    },
    SI: {
      consoleTitle: "කොට්ඨාස පද්ධති පරිපාලන කොන්සෝලය",
      overview: "පාලන පුවරුව",
      officers: "ග්‍රාම නිලධාරී ගිණුම්",
      residents: "ගම්වැසි ගිණුම්",
      troubleshoot: "නෝඩය දෝෂාවේක්ෂණය",
      logout: "පරිපාලක පිටවීම",
      systemOverview: "පද්ධති දළ විශ්ලේෂණය",
      totalGN: "මුළු ග්‍රාම නිලධාරීන්",
      regResidents: "ලියාපදිංචි ගම්වැසියන්",
      rtgsTransfers: "RTGS මුදල් බැර කිරීම්",
      serverNode: "පද්ධති සේවා නෝඩය",
      healthy: "නිරෝගී",
      cleared: "සම්පූර්ණයි",
      recentLogs: "මෑත කාලීන පද්ධති විගණන ලඝු-සටහන්",
      officerRegistry: "ග්‍රාම නිලධාරී පැතිකඩ ලේඛනය",
      officerSub: "ප්‍රතිපත්තිමය ගැටළු ඇති කරන්නේ නම් කොට්ඨාස නිලධාරීන් තාවකාලිකව අත්හිටුවන්න.",
      residentRegistry: "ගම්වැසි ගිණුම් ලේඛනය",
      residentSub: "නිවාස අයදුම්පත් වලදී ගැටළු ඇති කරන්නේ නම් ගම්වැසියන් තාවකාලිකව අත්හිටුවන්න.",
      thName: "නිලධාරී නම",
      thID: "නිලධාරී හැඳුනුම්පත",
      thOffice: "කොට්ඨාස කාර්යාලය",
      thStatus: "ලේඛන තත්ත්වය",
      thAction: "ක්‍රියාමාර්ග පාලනය",
      thResName: "ගම්වැසියාගේ නම",
      thNIC: "ජාතික හැඳුනුම්පත් අංකය",
      thResOffice: "නිවාස කොට්ඨාසය",
      thResStatus: "ක්‍රියාකාරී තත්ත්වය",
      troubleshootSub: "සේවා හැඹිලි මකා දමා, ලේඛන නල මාර්ග සුරක්ෂිත කර දත්ත දෝෂ නිවැරදි කරන්න.",
      diagnosticCenter: "රෝග විනිශ්චය මධ්‍යස්ථානය",
      diagnosticDesc: "දීමනා අයදුම්පත් හෝ සහතික ඉල්ලීම් වලදී ගම්වැසියන්ට ප්‍රමාදයක් හෝ දත්ත නොගැලපීමක් සිදුවුවහොත්, පද්ධති ප්‍රශස්තකරණ මෙවලම ක්‍රියාත්මක කරන්න.",
      runDiagnostic: "රෝග විනිශ්චය ධාවනය කර හැඹිලිය මකන්න",
      optimizing: "දේශීය නෝඩ් ප්‍රශස්තකරණය...",
      diagnosticsSuccessAlert: "දේශීය නෝඩ් ප්‍රශස්තකරණය සහ හැඹිලිය සාර්ථකව මකා දමන ලදී!"
    },
    TA: {
      consoleTitle: "பிரிவு கணினி நிர்வாக கன்சோல்",
      overview: "டாஷ்போர்டு மேலோட்டம்",
      officers: "கிராம நிலதாரி கணக்குகள்",
      residents: "குடியிருப்பாளர் சுயவிவரங்கள்",
      troubleshoot: "முனையைச் சரிசெய்யவும்",
      logout: "நிர்வாகி வெளியேறு",
      systemOverview: "கணினி மேலோட்டம்",
      totalGN: "மொத்த கிராம நிலதாரிகள்",
      regResidents: "பதிவு செய்யப்பட்ட குடியிருப்பாளர்கள்",
      rtgsTransfers: "RTGS பண பரிமாற்றங்கள்",
      serverNode: "கணினி சேவையக முனை",
      healthy: "ஆரோக்கியமானது",
      cleared: "பரிமாற்றம் முடிந்தது",
      recentLogs: "சமீபத்திய கணினி தணிக்கை பதிவுகள்",
      officerRegistry: "கிராம நிலதாரி சுயவிவர பதிவேடு",
      officerSub: "கொள்கை சிக்கல்களை ஏற்படுத்தினால் தற்காலிகமாக அதிகாரிகளை இடைநிறுத்துங்கள்.",
      residentRegistry: "குடியிருப்பாளர் கணக்கு பதிவேடு",
      residentSub: "வீட்டு விண்ணப்பங்களில் சிக்கல்களை ஏற்படுத்தினால் குடியிருப்பாளர்களை இடைநிறுத்துங்கள்.",
      thName: "அதிகாரி பெயர்",
      thID: "அதிகாரி ஐடி",
      thOffice: "பிரிவு அலுவலகம்",
      thStatus: "பதிவேடு நிலை",
      thAction: "நடவடிக்கை கட்டுப்பாடு",
      thResName: "குடியிருப்பாளர் பெயர்",
      thNIC: "NIC எண்",
      thResOffice: "வீட்டுப் பிரிவு",
      thResStatus: "செயலில் உள்ள நிலை",
      troubleshootSub: "இயக்க தற்காலிக சேமிப்புகளை அழித்து, தரவு முரண்பாடுகளை சரிசெய்யவும்.",
      diagnosticCenter: "நோயறிதல் மையம்",
      diagnosticDesc: "குடியிருப்பாளர்கள் கொடுப்பனவு அல்லது சான்றிதழ் விண்ணப்பங்களின் போது தாமதத்தை எதிர்கொண்டால், கணினி மேம்படுத்தல் கருவியை இயக்கவும்.",
      runDiagnostic: "நோயறிதலை இயக்கி தற்காலிக சேமிப்பை அழிக்கவும்",
      optimizing: "உள்ளூர் முனைகளை மேம்படுத்துகிறது...",
      diagnosticsSuccessAlert: "நோயறிதல் மற்றும் தற்காலிக சேமிப்பு வெற்றிகரமாக அழிக்கப்பட்டது!"
    }
  }

  const dA = adminDict[lang] || adminDict.EN

  // Tabs state: 'overview' | 'officers' | 'residents' | 'troubleshoot'
  const [activeTab, setActiveTab] = useState('overview')

  // DB list states
  const [officers, setOfficers] = useState([])
  const [residents, setResidents] = useState([])

  // Modal display states
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false)
  const [showEditOfficerModal, setShowEditOfficerModal] = useState(false)
  const [showEditResidentModal, setShowEditResidentModal] = useState(false)

  // Form states
  const [newOfficer, setNewOfficer] = useState({
    username: '', name: '', email: '', mobile: '', division: '', password: ''
  })
  const [editOfficer, setEditOfficer] = useState({
    id: '', username: '', name: '', email: '', mobile: '', division: '', status: 'Active'
  })
  const [editResident, setEditResident] = useState({
    nic: '', name: '', email: '', mobile_no: '', status: 'Active', occupation: '', household_number: ''
  })

  // Diagnostic states
  const [runningDiagnostic, setRunningDiagnostic] = useState(false)
  const [diagnosticProgress, setDiagnosticProgress] = useState(0)
  const [diagnosticLogs, setDiagnosticLogs] = useState([])

  const loadOfficers = async () => {
    try {
      const res = await authenticatedFetch('/api/auth/admin/officers')
      if (res.ok) {
        const data = await res.json()
        setOfficers(data)
      }
    } catch (err) {
      console.error('Error fetching officers:', err)
    }
  }

  const loadResidents = async () => {
    try {
      const res = await authenticatedFetch('/api/auth/admin/residents')
      if (res.ok) {
        const data = await res.json()
        setResidents(data)
      }
    } catch (err) {
      console.error('Error fetching residents:', err)
    }
  }

  useEffect(() => {
    loadOfficers()
    loadResidents()
  }, [])

  // Toggle Officer status
  const toggleOfficerStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    try {
      const res = await authenticatedFetch(`/api/auth/admin/officers/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      })
      if (res.ok) {
        alert(`Grama Niladhari Officer has been successfully ${nextStatus === 'Active' ? 'Activated' : 'Deactivated & Suspended'}.`)
        loadOfficers()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update officer status.')
      }
    } catch (error) {
      alert('Error updating officer status.')
    }
  }

  // Toggle Resident status
  const toggleResidentStatus = async (nic, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    try {
      const res = await authenticatedFetch(`/api/auth/admin/residents/${nic}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      })
      if (res.ok) {
        alert(`Resident profile has been successfully ${nextStatus === 'Active' ? 'Activated' : 'Deactivated & Suspended'}.`)
        loadResidents()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update resident status.')
      }
    } catch (error) {
      alert('Error updating resident status.')
    }
  }

  // Delete GN Officer
  const handleDeleteOfficer = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this GN Officer account? This action cannot be undone.')) return
    try {
      const res = await authenticatedFetch(`/api/auth/admin/officers/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('GN Officer account deleted successfully.')
        loadOfficers()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to delete GN Officer account.')
      }
    } catch (error) {
      alert('Error deleting GN Officer account.')
    }
  }

  // Delete Resident
  const handleDeleteResident = async (nic) => {
    if (!window.confirm('Are you sure you want to permanently delete this Resident account? This action cannot be undone.')) return
    try {
      const res = await authenticatedFetch(`/api/auth/admin/residents/${nic}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('Resident account deleted successfully.')
        loadResidents()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to delete Resident account.')
      }
    } catch (error) {
      alert('Error deleting Resident account.')
    }
  }

  // Create GN Officer
  const handleCreateOfficer = async (e) => {
    e.preventDefault()
    try {
      const res = await authenticatedFetch('/api/auth/register/officer', {
        method: 'POST',
        body: JSON.stringify(newOfficer)
      })
      if (res.ok) {
        alert('GN Officer account registered successfully.')
        setShowAddOfficerModal(false)
        setNewOfficer({ username: '', name: '', email: '', mobile: '', division: '', password: '' })
        loadOfficers()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to register GN Officer.')
      }
    } catch (error) {
      alert('Error registering GN Officer.')
    }
  }

  // Update GN Officer Details
  const handleUpdateOfficer = async (e) => {
    e.preventDefault()
    try {
      const res = await authenticatedFetch(`/api/auth/admin/officers/${editOfficer.id}`, {
        method: 'PUT',
        body: JSON.stringify(editOfficer)
      })
      if (res.ok) {
        alert('GN Officer updated successfully.')
        setShowEditOfficerModal(false)
        loadOfficers()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update GN Officer details.')
      }
    } catch (error) {
      alert('Error updating GN Officer details.')
    }
  }

  // Update Resident Details
  const handleUpdateResident = async (e) => {
    e.preventDefault()
    try {
      const res = await authenticatedFetch(`/api/auth/admin/residents/${editResident.nic}`, {
        method: 'PUT',
        body: JSON.stringify(editResident)
      })
      if (res.ok) {
        alert('Resident updated successfully.')
        setShowEditResidentModal(false)
        loadResidents()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update Resident details.')
      }
    } catch (error) {
      alert('Error updating Resident details.')
    }
  }

  // Troubleshooter Diagnostic simulation
  const startTroubleshoot = () => {
    setRunningDiagnostic(true)
    setDiagnosticProgress(0)
    setDiagnosticLogs([])

    const logSteps = [
      'RTGS-Gateway: Connecting secure fund settlement clearing nodes...',
      'Registry Audit: Fetching National Voter registries for Division Mahargama & Colombo...',
      'System Audit: Scanning active Gramaseva certifications indices...',
      'Troubleshoot: Cleaning redundant cache logs and flushed DB memory blocks...',
      'Security Sweep: Verifying signature hashes match records... No issues found.',
      'System Diagnostics: Flush Cache Success! All nodes returned clean status 200 OK.'
    ]

    let step = 0
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setDiagnosticLogs(prev => [...prev, `[INFO] ${logSteps[step]}`])
        setDiagnosticProgress(prev => Math.min(prev + 18, 100))
        step++
      } else {
        clearInterval(interval)
        setDiagnosticProgress(100)
        setRunningDiagnostic(false)
        alert('Diagnostics Sweep & Cache optimization completed successfully!')
      }
    }, 600)
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC] text-[#2D3748]">
      
      {/* 1. Header (EBF8FF background, with shadow, logo.png and notifications/profile info) */}
      <header className="flex justify-between items-center py-3 lg:py-[20px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.12)]">
        <div className="flex w-full justify-between items-center">
          {/* Logo Section */}
          <div
            className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64 cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
          </div>

          {/* Subtitle / System Console Mode */}
          <div className="hidden md:block bg-[#1B365D]/10 text-[#1B365D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            {dA.consoleTitle} - ROOT Mode
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-[20px]">
            <LanguageSelector />

            {/* Notifications Bell */}
            <div className="relative cursor-pointer flex items-center justify-center transition-colors duration-200 hover:opacity-80">
              <img
                src={notificationIcon}
                alt="Notifications"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-[30px] lg:h-[30px] object-contain"
              />
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#D69E2E] text-[#F7FAFC] text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] rounded-full flex items-center justify-center">
                3
              </span>
            </div>

            {/* User Profile Info */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px]">
              <div className="hidden xs:flex flex-col text-right">
                <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-[#D69E2E] uppercase">
                  ADMIN
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-medium text-[#2D3748]">
                  {successUser}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-[50px] xl:h-[50px] rounded-full bg-slate-200 flex items-center justify-center border-[1.5px] border-slate-300 overflow-hidden flex-shrink-0">
                <img
                  src={accountIcon}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      /* 2. Main Layout Container (Sidebar + Content) */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar Nav */}
        <aside className="w-56 sm:w-60 md:w-68 lg:w-72 xl:w-[280px] bg-white border-r border-[#2D37482D] pt-10 pr-2 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto flex-shrink-0">
          <nav className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-[5px]">
            {/* Tab: Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${
                activeTab === 'overview'
                  ? 'bg-[#005BBD] text-[#F7FAFC] shadow-md'
                  : 'bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <img
                src={activeTab === 'overview' ? dashboardIconActive : dashboardIcon}
                alt="Overview Icon"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
              />
              <span className="truncate">{dA.overview}</span>
            </button>

            {/* Tab: GN Officer Accounts */}
            <button
              onClick={() => setActiveTab('officers')}
              className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${
                activeTab === 'officers'
                  ? 'bg-[#005BBD] text-[#F7FAFC] shadow-md'
                  : 'bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <img
                src={activeTab === 'officers' ? officersIconActive : officersIcon}
                alt="Officers Icon"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
              />
              <span className="truncate">{dA.officers}</span>
            </button>

            {/* Tab: Resident Profiles */}
            <button
              onClick={() => setActiveTab('residents')}
              className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${
                activeTab === 'residents'
                  ? 'bg-[#005BBD] text-[#F7FAFC] shadow-md'
                  : 'bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <img
                src={activeTab === 'residents' ? residentsIconActive : residentsIcon}
                alt="Residents Icon"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
              />
              <span className="truncate">{dA.residents}</span>
            </button>

            {/* Tab: Troubleshoot Node */}
            <button
              onClick={() => setActiveTab('troubleshoot')}
              className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${
                activeTab === 'troubleshoot'
                  ? 'bg-[#005BBD] text-[#F7FAFC] shadow-md'
                  : 'bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <img
                src={activeTab === 'troubleshoot' ? troubleshootIconActive : troubleshootIcon}
                alt="Troubleshoot Icon"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
              />
              <span className="truncate">{dA.troubleshoot}</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-semibold text-red-600 transition-all duration-200 rounded-r-full hover:translate-x-1 hover:bg-red-50 hover:text-red-700 mt-8"
            >
              <span className="w-5 text-center flex-shrink-0">➔</span>
              <span className="truncate">{dA.logout}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-zoom-in">
              <h2 className="text-[24px] font-bold text-[#1B365D] text-left mb-6">{dA.systemOverview}</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-500 mb-1">{dA.totalGN}</span>
                  <span className="text-3xl font-extrabold text-[#1B365D]">2 Active</span>
                  <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">Colombo, Maharagama</span>
                </div>

                <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-500 mb-1">{dA.regResidents}</span>
                  <span className="text-3xl font-extrabold text-[#1B365D]">1,240</span>
                  <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">+12 New submissions</span>
                </div>

                <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-500 mb-1">{dA.rtgsTransfers}</span>
                  <span className="text-3xl font-extrabold text-[#1B365D]">Rs. 17,500</span>
                  <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">{dA.cleared}</span>
                </div>

                <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-500 mb-1">{dA.serverNode}</span>
                  <span className="text-3xl font-extrabold text-green-600">{dA.healthy}</span>
                  <span className="text-xs text-gray-500 font-semibold mt-2 bg-gray-50 px-2.5 py-1 rounded-full">DB latency: 2ms</span>
                </div>
              </div>

              {/* System alerts logs panel */}
              <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 text-left">
                <h3 className="text-lg font-bold text-[#1B365D] border-b border-[#cbd5e1] pb-3 mb-4">
                  {dA.recentLogs}
                </h3>
                <div className="font-mono text-sm text-gray-600 flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">[INFO]</span>
                    <span>[2026-06-01 12:44:02] ADMIN logged in successfully from secure clearing terminal node.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">[INFO]</span>
                    <span>[2026-06-01 12:38:15] RTGS clearing gateway disburse request dished out reference ID TXN-902847120.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">[INFO]</span>
                    <span>[2026-06-01 12:35:10] DRP API successfully authenticated resident Kamala Silva (789456123V) registry checks.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GN OFFICERS */}
          {activeTab === 'officers' && (
            <div className="animate-zoom-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="text-left">
                  <h2 className="text-[24px] font-bold text-[#1B365D] m-0">{dA.officerRegistry}</h2>
                  <span className="text-sm text-gray-500 mt-1 block">{dA.officerSub}</span>
                </div>
                <button
                  onClick={() => setShowAddOfficerModal(true)}
                  className="bg-[#D69E2E] hover:bg-[#b88523] text-white border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>➕</span> Register GN Officer
                </button>
              </div>

              <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#EBF8FF] border-b border-[#cbd5e1] text-[#1B365D] font-bold">
                        <th className="p-4 sm:p-5">{dA.thName}</th>
                        <th className="p-4 sm:p-5">Username</th>
                        <th className="p-4 sm:p-5">{dA.thOffice}</th>
                        <th className="p-4 sm:p-5">{dA.thStatus}</th>
                        <th className="p-4 sm:p-5 text-right">{dA.thAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {officers.length > 0 ? (
                        officers.map((officer, idx) => (
                          <tr key={officer.gn_id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:p-5 font-bold text-[#1B365D]">
                              <div>{officer.name}</div>
                              <div className="text-xs text-gray-500 font-normal mt-0.5">{officer.email} | {officer.mobile}</div>
                            </td>
                            <td className="p-4 sm:p-5 text-gray-600">{officer.username}</td>
                            <td className="p-4 sm:p-5 text-[#2D3748]">{officer.division_name || 'Not Assigned'}</td>
                            <td className="p-4 sm:p-5">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full text-center ${
                                officer.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {officer.status === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-right">
                              <div className="flex justify-end gap-2 items-center flex-wrap">
                                <button
                                  onClick={() => toggleOfficerStatus(officer.gn_id, officer.status)}
                                  className={`bg-transparent border-[1.5px] py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                                    officer.status === 'Active'
                                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                                      : 'border-green-600 text-green-600 hover:bg-green-50'
                                  }`}
                                >
                                  {officer.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditOfficer({
                                      id: officer.gn_id,
                                      username: officer.username,
                                      name: officer.name,
                                      email: officer.email,
                                      mobile: officer.mobile,
                                      division: officer.division_name || '',
                                      status: officer.status
                                    })
                                    setShowEditOfficerModal(true)
                                  }}
                                  className="bg-transparent border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteOfficer(officer.gn_id)}
                                  className="bg-transparent border-[1.5px] border-red-600 text-red-600 hover:bg-red-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            No Grama Niladhari Officers found in the system.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

           {/* TAB 3: RESIDENTS */}
          {activeTab === 'residents' && (
            <div className="animate-zoom-in">
              <div className="text-left mb-6">
                <h2 className="text-[24px] font-bold text-[#1B365D] m-0">{dA.residentRegistry}</h2>
                <span className="text-sm text-gray-500 mt-1 block">{dA.residentSub}</span>
              </div>

              <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#EBF8FF] border-b border-[#cbd5e1] text-[#1B365D] font-bold">
                        <th className="p-4 sm:p-5">{dA.thResName}</th>
                        <th className="p-4 sm:p-5">{dA.thNIC}</th>
                        <th className="p-4 sm:p-5">{dA.thResOffice}</th>
                        <th className="p-4 sm:p-5">{dA.thResStatus}</th>
                        <th className="p-4 sm:p-5 text-right">{dA.thAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {residents.length > 0 ? (
                        residents.map((resident, idx) => (
                          <tr key={resident.r_nic || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:p-5 font-bold text-[#1B365D]">
                              <div>{resident.name}</div>
                              <div className="text-xs text-gray-500 font-normal mt-0.5">{resident.email} | {resident.mobile_no}</div>
                            </td>
                            <td className="p-4 sm:p-5 text-gray-600">{resident.r_nic}</td>
                            <td className="p-4 sm:p-5 text-[#2D3748]">{resident.division_name || 'Not Specified'}</td>
                            <td className="p-4 sm:p-5">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full text-center ${
                                resident.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {resident.status === 'Active' ? (lang === 'EN' ? 'Active' : lang === 'SI' ? 'ක්‍රියාකාරී' : 'செயலில் உள்ளது') : (lang === 'EN' ? 'Suspended' : lang === 'SI' ? 'අත්හිටුවා ඇත' : 'இடைநிறுத்தப்பட்டுள்ளது')}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-right">
                              <div className="flex justify-end gap-2 items-center flex-wrap">
                                <button
                                  onClick={() => toggleResidentStatus(resident.r_nic, resident.status)}
                                  className={`bg-transparent border-[1.5px] py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                                    resident.status === 'Active'
                                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                                      : 'border-green-600 text-green-600 hover:bg-green-50'
                                  }`}
                                >
                                  {resident.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditResident({
                                      nic: resident.r_nic,
                                      name: resident.name,
                                      email: resident.email,
                                      mobile_no: resident.mobile_no,
                                      status: resident.status,
                                      occupation: resident.occupation || '',
                                      household_number: resident.household_number || ''
                                    })
                                    setShowEditResidentModal(true)
                                  }}
                                  className="bg-transparent border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteResident(resident.r_nic)}
                                  className="bg-transparent border-[1.5px] border-red-600 text-red-600 hover:bg-red-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            No Registered Residents found in the system.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TROUBLESHOOT */}
          {activeTab === 'troubleshoot' && (
            <div className="animate-zoom-in">
              <div className="text-left mb-6">
                <h2 className="text-[24px] font-bold text-[#1B365D] m-0">{dA.troubleshoot}</h2>
                <span className="text-sm text-gray-500 mt-1 block">{dA.troubleshootSub}</span>
              </div>

              <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-8 text-left">
                <h3 className="text-lg font-bold text-[#1B365D] mb-3">{dA.diagnosticCenter}</h3>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {dA.diagnosticDesc}
                </p>

                {/* Progress Bar */}
                {runningDiagnostic && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-[#D69E2E] font-bold mb-2">
                      <span>{lang === 'EN' ? 'Running Security Diagnostics & Flush cache...' : lang === 'SI' ? 'ආරක්ෂක රෝග විනිශ්චය ධාවනය වේ...' : 'பாதுகாப்பு நோயறிதல் இயங்குகிறது...'}</span>
                      <span>{diagnosticProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#D69E2E] transition-all duration-300 rounded-full" style={{ width: `${diagnosticProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Live Logs console */}
                {diagnosticLogs.length > 0 && (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 font-mono text-xs text-sky-400 h-44 overflow-y-auto mb-6 flex flex-col gap-1.5 shadow-inner">
                    {diagnosticLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-slate-500">[{idx+1}]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={startTroubleshoot}
                  disabled={runningDiagnostic}
                  className={`border-none py-3 px-8 rounded-full text-sm font-bold text-white transition-all shadow-md flex items-center gap-1.5 ${
                    runningDiagnostic
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#D69E2E] hover:bg-[#b88523] cursor-pointer'
                  }`}
                >
                  {runningDiagnostic ? dA.optimizing : `🔧 ${dA.runDiagnostic}`}
                </button>
              </div>
            </div>
          )}

          {/* Floating Help Trigger */}
          <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#1B365D] hover:bg-[#005BBD] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer transition-all duration-200 border-none z-50 hover:scale-105" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* Modals overlays */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
          <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
            <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">Register GN Officer</h3>
            <form onSubmit={handleCreateOfficer}>
              <div className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500">Username</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                    value={newOfficer.username}
                    onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
                  />
                  </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                    value={newOfficer.name}
                    onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                  />
                </div>
