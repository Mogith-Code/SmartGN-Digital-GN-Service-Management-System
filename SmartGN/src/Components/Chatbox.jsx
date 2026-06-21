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
}