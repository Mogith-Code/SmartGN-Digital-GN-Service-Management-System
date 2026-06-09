import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'

function ResidentProfile({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve default username and division from navigation state if available
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || 'Colombo'
  const firstNameFromSession = successUser.split(' ')[0]

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true)
