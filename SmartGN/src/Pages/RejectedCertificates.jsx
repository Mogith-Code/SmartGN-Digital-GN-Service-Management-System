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

  const localDict = {
    EN: {
      title: "Rejected Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      reasonForRejection: "Reason for the rejection:",
      editRequest: "Edit request",
      back: "Back",
      editingRequest: "Editing rejected request for",
    },
    SI: {
      title: "ප්‍රතික්ෂේපිත සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      reasonForRejection: "ප්‍රතික්ෂේප කිරීමට හේතුව:",
      editRequest: "ඉල්ලීම සංස්කරණය කරන්න",
      back: "ආපසු",
      editingRequest: "ප්‍රතික්ෂේපිත ඉල්ලීම සංස්කරණය කරමින්",
    },
    TA: {
      title: "நிராகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      reasonForRejection: "நிராகரிப்பதற்கான காரணம்:",
      editRequest: "கோரிக்கையை திருத்தவும்",
      back: "திரும்புக",
      editingRequest: "நிராகரிக்கப்பட்ட கோரிக்கையை திருத்துகிறது",
    }
  }
}

