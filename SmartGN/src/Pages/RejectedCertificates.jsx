import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function RejectedCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state if available
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  // Alternating mock rejected list based on the screenshot (where Card 1 is the active gold-beige item)
  const rejectedList = [
    {
      id: 1,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      reason: "Uploaded Full Name doesn't match with the name in NIC",
      isActive: true, // First card has the golden-beige active background in the screenshot
    },
    {
      id: 2,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      reason: "Uploaded Full Name doesn't match with the name in NIC",
      isActive: false,
    },
    {
      id: 3,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      reason: "Uploaded Full Name doesn't match with the name in NIC",
      isActive: false,
    },
    {
      id: 4,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      reason: "Uploaded Full Name doesn't match with the name in NIC",
      isActive: false,
    },
    {
      id: 5,
      type: 'Character Certificate',
      approvedDate: '28/05/2026 09:33 a.m',
      requestedDate: '26/05/2026',
      purpose: 'For certify residence',
      reason: "Uploaded Full Name doesn't match with the name in NIC",
      isActive: false,
    },
  ]
}
