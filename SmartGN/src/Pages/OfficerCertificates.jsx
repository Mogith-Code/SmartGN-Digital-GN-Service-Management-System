import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'
import logoImage from '../assets/logo.png'
import Footer from '../Components/Common/Footer'

function OfficerCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user defaults
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || '200324511540'
  const initialFilter = location.state?.activeFilter || 'All'

  // Dynamic Officer Profile State
  const [profile, setProfile] = useState({
    firstName: 'Kamal',
    lastName: 'Perera',
    fullName: 'Dissanayake Mudiyanselage Kamal Perera',
    division: 'Colombo, Borella',
    serviceTime: '2',
    email: 'Nirmal.Perera@example.com',
    mobile: '0703564478',
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null
  })

  // Certificates list state
  const [certs, setCerts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState(initialFilter) // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [visibleCount, setVisibleCount] = useState(3) // Seed has 3 items initially

  // Local inline helper for Authorization Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('smartgn_token')
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  }

  // Load profile from localStorage (to display header name/avatar correctly)
  useEffect(() => {
    const saved = localStorage.getItem('smartgn_officer_profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    }
  }, [])

  const loadCerts = async () => {
    try {
      const response = await fetch('/api/certificates/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load certificates.')
      const data = await response.json()
      
      const formatted = data.map(item => ({
        id: item.request_id || item.id,
        type: item.certificate_type === 'INCOME' ? 'Income Certificate' : 'Character Certificate',
        status: item.status === 'PENDING' ? 'Pending' : item.status === 'APPROVED' ? 'Approved' : 'Rejected',
        name: item.resident_name || 'Resident',
        purpose: item.purpose,
        submittedDate: item.request_date ? item.request_date.split('T')[0] : '',
        division: item.division || 'Colombo',
        nic: item.resident_nic,
        address: item.resident_address || ''
      }))
      setCerts(formatted)
      localStorage.setItem('smartgn_certificate_requests', JSON.stringify(formatted))
    } catch (err) {
      console.error('API failed, loading mock certificates:', err)
      const saved = localStorage.getItem('smartgn_certificate_requests')
      if (saved) {
        setCerts(JSON.parse(saved))
      } else {
        const defaultRequests = [
          {
            id: 'REQ-2026-001',
            type: 'Income Certificate',
            status: 'Pending',
            name: 'Nimal Perera',
            purpose: 'Higher Education Scholarship',
            submittedDate: '2026-06-15',
            division: 'Colombo, Borella',
            nic: '199512345678',
            address: 'No. 12, Main Street, Borella'
          },
          {
            id: 'REQ-2026-002',
            type: 'Character Certificate',
            status: 'Approved',
            name: 'Sunil Shantha',
            purpose: 'Bank Loan Application',
            submittedDate: '2026-06-10',
            division: 'Colombo, Borella',
            nic: '199087654321',
            address: 'No. 45, Flower Road, Borella'
          },
          {
            id: 'REQ-2026-003',
            type: 'Character Certificate',
            status: 'Rejected',
            name: 'Kamal Silva',
            purpose: 'Visa Application',
            submittedDate: '2026-06-12',
            division: 'Colombo, Borella',
            nic: '199834567890',
            address: 'No. 78, Temple Lane, Borella'
          }
        ]
        localStorage.setItem('smartgn_certificate_requests', JSON.stringify(defaultRequests))
        setCerts(defaultRequests)
      }
    }
  }

  useEffect(() => {
    loadCerts()
  }, [])

  // Approve action directly from list
  const handleApprove = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'APPROVED' })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve certificate.')
      }
      alert(`Certificate request ${id} approved successfully.`)
      loadCerts()
    } catch (err) {
      console.error('API failed, executing local fallback:', err)
      const updated = certs.map(c => c.id === id ? { ...c, status: 'Approved' } : c)
      setCerts(updated)
      localStorage.setItem('smartgn_certificate_requests', JSON.stringify(updated))
      alert(`Certificate request ${id} approved successfully (local fallback).`)
    }
  }
}