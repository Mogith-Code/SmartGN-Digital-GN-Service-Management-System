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

  const d = localDict[lang] || localDict.EN

  const handleEditRequest = (item) => {
    alert(`${d.editingRequest} ${item.type} (ID: ${item.id})...`)
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* 1. Header */}
      <AfterlogNavbar />

      {/* 2. Main Layout Grid */}
      <div className="flex gap-[20px] flex-1">
        {/* Sidebar Nav */}
        <div className="flex bg-[#FFFFFF]">
          <RSidebar />
        </div>

        {/* Main Panel Content */}
        <main className="w-full bg-[#FFFFFF] border-l border-[#2D37482D] p-6 sm:p-8 md:p-10 relative">
          
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

          {/* Rejected Requests List */}
          <div className="flex flex-col gap-4">
            {rejectedList.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-4 ${
                  item.isActive 
                    ? 'bg-[#fdf8f0] border-[1.5px] border-[#fedc9b]' 
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
                    <div className="mt-2">
                      <span className="text-[#ef4444] font-bold block mb-1">{d.reasonForRejection}</span>
                      <span className="text-[#334155] font-medium text-[13px] leading-relaxed">{item.reason}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Approved Date & Actions Row */}
                <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto justify-between md:justify-start">
                  <span className="text-[13px] font-semibold text-[#64748b]">
                    {item.approvedDate}
                  </span>
                  
                  <button 
                    onClick={() => handleEditRequest(item)}
                    className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    {d.editRequest}
                  </button>
                </div>
              </div>
            ))}
          </div>


