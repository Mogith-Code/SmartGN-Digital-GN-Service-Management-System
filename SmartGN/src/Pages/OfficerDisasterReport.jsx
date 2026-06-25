import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../components/LanguageSelector'
import { getAuthHeaders } from '../utils/api'

function OfficerDisasterReports({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

   // Retrieve username and officerId from navigation state or localStorage
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || 'GN-BORELLA'
  const firstName = successUser.split(' ')[0]

  // State to manage list of disasters
  const [disasters, setDisasters] = useState([])
  const [selectedDisaster, setSelectedDisaster] = useState(null)

   // State for taking action modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSeverity, setModalSeverity] = useState('high severity')
  const [modalStatus, setModalStatus] = useState('Pending')
  const [modalRemarks, setModalRemarks] = useState('')


