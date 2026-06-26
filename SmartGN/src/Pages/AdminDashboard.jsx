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
}