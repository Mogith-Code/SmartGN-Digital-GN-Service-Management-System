import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function OfficerProfile({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session parameters (defaults to Kamal Perera if not provided)
  const successUser = location.state?.successUser || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || '200324511540'

  // Banner display toggle
  const [showAlert, setShowAlert] = useState(true)

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState('VIEW')

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

  // Editable fields state
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editFullName, setEditFullName] = useState('')
  const [editDivision, setEditDivision] = useState('')
  const [editServiceTime, setEditServiceTime] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editProfilePhoto, setEditProfilePhoto] = useState(null)
  const [editIdCardFront, setEditIdCardFront] = useState(null)
  const [editIdCardBack, setEditIdCardBack] = useState(null)
