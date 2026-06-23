import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function PendingCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state if available
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  const localDict = {
    EN: {
      title: "Pending Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      currentStage: "Current Stage:",
      trackStatus: "Track status",
      back: "Back",
      trackingRequest: "Tracking pending request for",
      stages: {
        verification: "Verification in progress",
        signature: "Pending Grama Niladhari Signature",
        audit: "Document Audit Stage"
      }
    },
    SI: {
      title: "ක්‍රියාත්මක වෙමින් පවතින සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      currentStage: "පවතින පියවර:",
      trackStatus: "තත්ත්වය පරීක්ෂා කරන්න",
      back: "ආපසු",
      trackingRequest: "ක්‍රියාත්මක වන සහතිකයේ තත්ත්වය පරීක්ෂා කරමින්",
      stages: {
        verification: "සත්‍යාපනය වෙමින් පවතී",
        signature: "ග්‍රාම නිලධාරී අත්සන සඳහා රැඳී පවතී",
        audit: "ලේඛන විගණන අදියර"
      }
    },
    TA: {
      title: "நிலுவையிலுள்ள சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      currentStage: "தற்போதைய நிலை:",
      trackStatus: "நிலையை கண்காணிக்கவும்",
      back: "திரும்புக",
      trackingRequest: "நிலுவையிலுள்ள கோரிக்கையைக் கண்காணிக்கிறது",
      stages: {
        verification: "சரிபார்ப்பு செயல்பாட்டில் உள்ளது",
        signature: "கிராம நிலதாரி கையொப்பத்திற்காக காத்திருக்கிறது",
        audit: "ஆவண தணிக்கை நிலை"
      }
    }
  }

  const d = localDict[lang] || localDict.EN

  // Alternating mock pending list
  const pendingList = [
    {
      id: 1,
      type: 'Character Certificate',
      requestedDate: '15/06/2026',
      purpose: 'For certify residence',
      stageKey: 'verification',
      isActive: true, // First card has the amber active background
    },
    {
      id: 2,
      type: 'Income Certificate',
      requestedDate: '18/06/2026',
      purpose: 'Higher Education Scholarship',
      stageKey: 'signature',
      isActive: false,
    },
    {
      id: 3,
      type: 'Character Certificate',
      requestedDate: '22/06/2026',
      purpose: 'Visa Application',
      stageKey: 'audit',
      isActive: false,
    },
  ]

  const handleTrackStatus = (item) => {
    alert(`${d.trackingRequest} ${item.type} (ID: ${item.id})...`)
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      {/* 1. Header */}
      <AfterlogNavbar />

      {/* 2. Main Layout */}
      <div className="flex flex-1 w-full">
        {/* Sidebar Nav */}
        <RSidebar />

        {/* Main Panel Content */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto relative">
          
          {/* Back button */}
          <div className="flex justify-start items-center mb-4">
            <button 
              className="flex items-center gap-1.5 py-2 px-4 border border-[#cbd5e1] bg-white text-[#475569] rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#f1f5f9] hover:text-[#1e293b]" 
              onClick={() => navigate('/dashboard/resident/certificates', { state: { successUser, division: userDivision } })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {d.back}
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">{d.title}</h2>

          {/* Pending Requests List */}
          <div className="flex flex-col gap-4">
            {pendingList.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-4 ${
                  item.isActive 
                    ? 'bg-[#fefce8] border-[1.5px] border-[#fef08a]' 
                    : 'bg-white border border-[#2D37481F]'
                }`}
              >
                {/* Left Area: Certificate Details */}
                <div className="text-left max-w-full md:max-w-[70%]">
                  <h4 className="text-[16px] font-bold text-[#1B365D] mb-3">
                    {item.type}
                  </h4>
                  
                  <div className="flex flex-col gap-1 text-[13.5px]">
                    <div>
                      <span className="text-[#475569] font-medium">{d.requestedDate}: </span>
                      <span className="text-[#1e293b] font-semibold">{item.requestedDate}</span>
                    </div>
                    <div>
                      <span className="text-[#475569] font-medium">{d.purpose}: </span>
                      <span className="text-[#1e293b] font-semibold">{item.purpose}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[#d97706] font-bold text-[13.5px]">{d.currentStage}</span>
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[12.5px]">
                        {d.stages[item.stageKey] || item.stageKey}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Status & Action Button */}
                <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto justify-between md:justify-start">
                  <span className="text-[13px] font-bold text-[#d97706] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    PENDING
                  </span>
                  
                  <button 
                    onClick={() => handleTrackStatus(item)}
                    className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {d.trackStatus}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Help Trigger */}
          <button 
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]" 
            aria-label="Help Trigger" 
            onClick={onOpenHelp}
          >
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  )
}

export default PendingCertificates
