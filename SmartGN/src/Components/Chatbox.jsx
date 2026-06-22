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

  const [inputValue, setInputValue] = useState('')
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
    } else if (path.includes('/allowances')) {
      pageName = 'Allowances'
      helpMsg = "You're browsing active allowance programs (like Aswesuma or Samurdhi). Let me know if you'd like to check eligibility or need guidance filling out the forms."
    } else if (path.includes('/profile') || path.includes('/dashboard/resident')) {
      pageName = 'My Profile'
      helpMsg = "You are on your profile dashboard. Here you can update your occupation, upload your NIC, or edit your contact details. Let me know if you have questions about editing your profile!"
    } else if (path.includes('/officer')) {
      pageName = 'Officer Portal'
      helpMsg = "Welcome, Officer! You are on the officer management board. I can help you with certificate approvals, checking resident household registries, or handling appointment requests."
    }

    if (pageName && helpMsg) {
      // Check if we already have this help message in history to avoid duplication
      setMessages(prev => {
        const alreadyHasMsg = prev.some(m => m.text === helpMsg)
        if (alreadyHasMsg) return prev
        return [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'assistant',
            text: helpMsg
          }
        ]
      })
    }
  }, [path, isOpen])

  if (!isOpen) return null

  // Guided response logic
  const getAssistantResponse = (userText) => {
    const text = userText.toLowerCase()
    
    if (text.includes('profile') || text.includes('edit my profile') || text.includes('update profile')) {
      return "To edit your profile, please follow these steps:\n\n1. Go to the 'Profile' tab in the side menu.\n2. Click the 'Edit profile' button in the top right.\n3. Update your details (e.g. name, email, mobile) and click 'Update'."
    }
    
    if (text.includes('nic') || text.includes('national identity card') || text.includes('upload card')) {
      return "To upload your NIC front and back images:\n\n1. Go to your 'Profile' tab.\n2. Click 'Edit profile'.\n3. Scroll to the bottom to upload high-quality front and back images.\n4. Click 'Update' to save the changes."
    }

    if (text.includes('income certificate') || text.includes('apply-income') || (path.includes('apply-income') && (text.includes('documents') || text.includes('upload')))) {
      return "For the Income Certificate, required documents depend on your income stream:\n\n• Paddy/Crops: Upload License, Permit, or Grant sheet copy.\n• Business: Upload Business Registration copy and Pradeshiya Sabha tax receipt.\n• Laborer/Other: No upload is mandatory, but you must enter your daily/monthly income details."
    }

    if (text.includes('commission') || text.includes('fee') || text.includes('charge')) {
      return "A government commission fee of 1.27% of the certified income value is charged when issuing an income certificate."
    }

    if (text.includes('character certificate') || text.includes('apply-character') || (path.includes('apply-character') && (text.includes('documents') || text.includes('required')))) {
      return "To apply for a Character Certificate:\n\n1. Go to Certificates -> Apply for Character Certificate.\n2. Ensure your profile has verified NIC uploads.\n3. Fill in applicant name and GN division, and submit. The officer will verify details via your household registry."
    }

    if (text.includes('re-apply') || text.includes('rejected') || text.includes('remarks') || text.includes('comment')) {
      return "If your certificate application is rejected:\n\n1. Go to Certificates -> Rejected Certificates.\n2. Check the specific comments from your GN officer.\n3. Re-apply by correcting those specific fields or uploading clear supporting documents."
    }

    if (text.includes('appointment') || text.includes('book') || text.includes('slot')) {
      return "To book an appointment:\n\n1. Go to the 'Appointments' tab in the side navigation.\n2. Select your preferred date on the calendar and select an available slot.\n3. Enter the purpose of your visit and click 'Confirm'."
    }

    if (text.includes('hours') || text.includes('operating') || text.includes('when')) {
      return "GN officers are available for appointments on weekdays (Monday - Friday) from 9:00 AM to 4:00 PM."
    }

    if (text.includes('household') || text.includes('family') || text.includes('member')) {
      return "To manage your household registry:\n\n1. Go to the 'Family' tab in the side navigation.\n2. To add a family member, click 'Add Member', enter details (Name, NIC, Relation, DOB), and click 'Save'."
    }

    if (text.includes('allowance') || text.includes('aswesuma') || text.includes('samurdhi')) {
      return "To apply for allowances:\n\n1. Go to the 'Allowances' tab in the sidebar.\n2. Browse active programs (Aswesuma, Samurdhi).\n3. Complete the digital form and submit. It will be sent to the GN emergency/welfare team for verification."
    }

    if (text.includes('disaster') || text.includes('relief')) {
      return "To report disaster damage:\n\n1. Navigate to the 'Disaster Relief' section in the sidebar.\n2. Specify the disaster type, estimate damage level, and request medical, food, or shelter aid.\n3. Click Submit to alert the emergency team."
    }

    if (text.includes('approve') || text.includes('verify') || text.includes('officer')) {
      return "Officer Guide:\n\n• Certificates: Click on pending certificates, inspect supporting documents, and select Approve or Reject (provide remarks for rejection).\n• Appointments: Accept or reschedule appointment requests under the Appointments tab."
    }

    return "I am here to help you navigate SmartGN! You can ask me about:\n\n• How to edit your profile & upload NIC\n• Requesting Income or Character certificates\n• Booking appointments & officer hours\n• Managing household members\n• Re-applying for rejected certificates"
  }

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return

    // 1. Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 2. Trigger assistant typing response
    setTimeout(() => {
      const responseText = getAssistantResponse(textToSend)
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: responseText
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 700)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue)
    }
  }

   // Get prompts dynamically based on active path
  const getQuickPrompts = (pathname) => {
    if (pathname.includes('/certificates/apply-income')) {
      return [
        "What documents do I need?",
        "Government commission fee?",
        "How to fill income details?",
        "How long does approval take?"
      ]
    }
    if (pathname.includes('/certificates/apply-character')) {
      return [
        "What details are required?",
        "Required documents?",
        "Who can apply?"
      ]
    }
    if (pathname.includes('/household') || pathname.includes('/RHousehold')) {
      return [
        "How to add a family member?",
        "What is household number?",
        "How to edit member details?"
      ]
    }
    if (pathname.includes('/appointment') || pathname.includes('/RAppointment')) {
      return [
        "How do I book a slot?",
        "What are the office hours?",
        "Can I cancel a request?"
      ]
    }
    if (pathname.includes('/certificates/rejected')) {
      return [
        "Why was my certificate rejected?",
        "How do I re-apply?",
        "How to check GN comments?"
      ]
    }
    if (pathname.includes('/profile') || pathname.includes('/dashboard/resident')) {
      return [
        "How to upload NIC images?",
        "How to edit my profile?",
        "How do I save changes?"
      ]
    }
    if (pathname.includes('/allowances')) {
      return [
        "What allowances can I apply for?",
        "Who is eligible for Aswesuma?",
        "How does verification work?"
      ]
    }
    if (pathname.includes('/officer')) {
      return [
        "How to approve certificates?",
        "Check pending appointments?",
        "Search residents?"
      ]
    }
    return [
      "How can I edit my profile?",
      "How do I request certificates?",
      "Book an appointment",
      "Report disaster damage"
    ]
  }

  const quickPrompts = getQuickPrompts(path)

  return (
    <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col z-[9999] overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005BBD] to-[#3182CE] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-sm leading-tight text-white m-0">SmartGN Assistant</h4>
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>
        <button 
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white/90 hover:text-white transition-all duration-200 cursor-pointer border-0 flex items-center justify-center" 
          onClick={onClose} 
          aria-label="Close Chatbot"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#005BBD] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#005BBD]/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                </svg>
              </div>
            )}

            <div className={`p-3 rounded-2xl shadow-sm text-[13px] leading-relaxed max-w-[78%] text-left whitespace-pre-line ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-[#005BBD] to-[#3182CE] text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#D69E2E] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D69E2E]/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}

          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#005BBD] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#005BBD]/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
              </svg>
            </div>
            <div className="bg-white text-slate-400 px-3.5 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Guided Quick Prompts Chips */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
        {quickPrompts.map((prompt, idx) => (
          <button 
            key={idx} 
            className="text-[11px] py-1.5 px-3 bg-[#EBF8FF] hover:bg-[#005BBD] text-[#005BBD] hover:text-white font-semibold rounded-full border border-[#005BBD]/15 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 text-left border-none outline-none"
            onClick={() => handleSendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-full text-[13px] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200 text-slate-800 placeholder-slate-400"
        />
        <button 
          className="w-9 h-9 rounded-full bg-[#005BBD] hover:bg-[#3182CE] flex items-center justify-center text-white transition-all duration-200 shadow-md active:scale-95 border-none cursor-pointer flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim()}
          aria-label="Send Message"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

    </div>
  )
}

export default Chatbot

