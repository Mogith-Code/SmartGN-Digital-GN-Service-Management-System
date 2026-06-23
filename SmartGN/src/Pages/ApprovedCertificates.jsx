import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'

function ApprovedCertificates({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve username and division/ID from navigation state if available
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Nimal Perera'
  const userDivision = location.state?.division || localStorage.getItem('smartgn_user_division') || 'Colombo'

  const localDict = {
    EN: {
      title: "Approved Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      certificateNo: "Certificate Number",
      downloadPdf: "Download PDF",
      back: "Back",
      downloadingCert: "Downloading approved certificate",
    },
    SI: {
      title: "අනුමත කරන ලද සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      certificateNo: "සහතික අංකය",
      downloadPdf: "PDF බාගන්න",
      back: "ආපසු",
      downloadingCert: "අනුමත සහතිකය බාගත කරමින්",
    },
    TA: {
      title: "அங்கீகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      certificateNo: "சான்றிதழ் எண்",
      downloadPdf: "PDF ஐப் பதிவிறக்கவும்",
      back: "திரும்புக",
      downloadingCert: "அங்கீகரிக்கப்பட்ட சான்றிதழைப் பதிவிறக்குகிறது",
    }
  }

  const d = localDict[lang] || localDict.EN

  // Alternating mock approved list
  const approvedList = [
    {
      id: 1,
      type: 'Income Certificate',
      approvedDate: '10/06/2026 02:15 p.m',
      requestedDate: '08/06/2026',
      purpose: 'Bank Loan Application',
      certificateNo: 'IC/2026/0482',
      isActive: true, // First card has the green active background
    },
    {
      id: 2,
      type: 'Character Certificate',
      approvedDate: '05/06/2026 11:30 a.m',
      requestedDate: '01/06/2026',
      purpose: 'Employment Verification',
      certificateNo: 'CC/2026/1102',
      isActive: false,
    },
  ]

  const handleDownload = (item) => {
    alert(`${d.downloadingCert} ${item.type} (No: ${item.certificateNo})...`)
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

          {/* Approved Requests List */}
          <div className="flex flex-col gap-4">
            {approvedList.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-4 ${
                  item.isActive 
                    ? 'bg-[#f0fdf4] border-[1.5px] border-[#bbf7d0]' 
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
                      <span className="text-[#475569] font-medium">{d.certificateNo}: </span>
                      <span className="bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded text-[12.5px] tracking-wide">
                        {item.certificateNo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Approved Date & Action Button */}
                <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto justify-between md:justify-start">
                  <span className="text-[13px] font-semibold text-[#64748b]">
                    {item.approvedDate}
                  </span>
                  
                  <button 
                    onClick={() => handleDownload(item)}
                    className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    {d.downloadPdf}
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

export default ApprovedCertificates
