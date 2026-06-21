import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function Chatbot({ isOpen, onClose }) {
  const location = useLocation()
  const path = location.pathname
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your official SmartGN Assistant. How can I help you today?"
    }
  ])

  onst [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Scroll to bottom on new message or when typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Context-aware trigger on route change
  useEffect(() => {
    if (!isOpen) return

    let pageName = ''
    let helpMsg = ''
    
    if (path.includes('/certificates/apply-income')) {
      pageName = 'Apply Income Certificate'
      helpMsg = "I see you are applying for an Income Certificate. Make sure you select your correct income stream (Paddy, Business, or Laborer). Also note that a 1.27% government commission fee applies. How can I assist you with this form?"
    } else if (path.includes('/certificates/apply-character')) {
      pageName = 'Apply Character Certificate'
      helpMsg = "I see you are applying for a Character Certificate. Please ensure your profile has high-quality images of your NIC (front & back) uploaded before submitting. What details would you like to verify?"
    } else if (path.includes('/household') || path.includes('/RHousehold')) {
      pageName = 'Household Registry'
      helpMsg = "You are on the Family details page. You can add or edit your household member profiles here. Let me know if you need help finding your household number or editing relationships!"
    } else if (path.includes('/appointment') || path.includes('/RAppointment')) {
      pageName = 'Appointments Scheduling'
      helpMsg = "You are on the Appointments page. Here you can request slot booking with your GN officer. Operating hours are weekdays 9:00 AM - 4:00 PM. Let me know if you need booking instructions!"
    } else if (path.includes('/certificates/rejected')) {
      pageName = 'Rejected Certificates'
      helpMsg = "You are viewing rejected certificates. You can click on the list entries to view the rejection comments from your GN officer. Let's see how we can correct the documents and re-apply."
    }