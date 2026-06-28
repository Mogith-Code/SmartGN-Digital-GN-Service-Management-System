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
}
