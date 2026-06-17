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
}