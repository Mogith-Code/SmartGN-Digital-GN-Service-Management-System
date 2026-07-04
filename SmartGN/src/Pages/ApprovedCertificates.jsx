import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { translations, useLanguage } from '../utils/translate'
import AfterlogNavbar from '../Components/Common/AfterlogNavbar'
import RSidebar from '../Components/Common/RSidebar'
import Footer from '../Components/Common/Footer'
import logo from '../assets/logo.png'

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
      downloadPdf: "View / Print Certificate",
      back: "Back",
      downloadingCert: "Opening approved certificate",
    },
    SI: {
      title: "අනුමත කරන ලද සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      certificateNo: "සහතික අංකය",
      downloadPdf: "සහතිකය මුද්‍රණය කරන්න",
      back: "ආපසු",
      downloadingCert: "අනුමත සහතිකය විවෘත කරමින්",
    },
    TA: {
      title: "அங்கீகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      certificateNo: "சான்றிதழ் எண்",
      downloadPdf: "சான்றிதழை அச்சிடுக",
      back: "திரும்புக",
      downloadingCert: "அங்கீகரிக்கப்பட்ட சான்றிதழைத் திறக்கிறது",
    }
  }

  const d = localDict[lang] || localDict.EN

  // State
  const [approvedList, setApprovedList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const loadApproved = async () => {
    try {
      const token = localStorage.getItem('smartgn_token')
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
      const response = await fetch('/api/certificates/resident', { headers })
      if (!response.ok) throw new Error('API failed')
      const data = await response.json()
      const approved = data.filter(c => c.status === 'APPROVED' || c.status === 'Approved')
      setApprovedList(approved)
    } catch (err) {
      console.warn('API connection offline. Loading approved certificates from local fallback.')
      const localData = localStorage.getItem('smartgn_certificates')
      if (localData) {
        const allCerts = JSON.parse(localData)
        const approved = allCerts.filter(c => c.status === 'APPROVED' || c.status === 'Approved')
        setApprovedList(approved)
      } else {
        const defaultApproved = [
          {
            id: 'REQ-CC-2026-9872',
            request_id: 'REQ-CC-2026-9872',
            type: 'Character Certificate',
            certificate_type: 'CHARACTER',
            approvedDate: '04/07/2026 12:45 p.m',
            requestedDate: '01/07/2026',
            purpose: 'Employment Visa Verification',
            certificateNo: 'CC/2026/0492',
            fullName: 'Nimal Perera',
            name: 'Nimal Perera',
            address: 'No. 12, Temple Road, Borella, Colombo 08',
            nic: '199512345678',
            divisionalSecretariat: 'Colombo Divisional Secretariat',
            gnDivisionNumber: 'Borella East - 258',
            sex: 'Male',
            age: '31',
            civilStatus: 'Single',
            nationality: 'Sri Lankan',
            religion: 'Buddhist',
            occupation: 'Software Developer',
            villagePeriod: '15 Years',
            electoralRegister: 'No: 12, Borella District, Register 2025',
            fatherName: 'Piyal Perera',
            fatherAddress: 'No. 12, Temple Road, Borella, Colombo 08',
            gnPeriod: '15 Years',
            natureOfOtherEvidences: 'Electricity Bill - March 2026',
            convictedByCourt: 'No',
            publicActivitiesInterest: 'Yes',
            publicActivitiesDetails: 'Participated in Borella Buddhist Welfare Society activities',
            character: 'Exemplary',
            remarks: 'Applicant is personally known to me and has a clean record in the neighborhood. Recommended for requested purpose.',
            officerName: 'Kamal Perera',
            isActive: true,
          }
        ]
        localStorage.setItem('smartgn_certificates', JSON.stringify(defaultApproved))
        setApprovedList(defaultApproved)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApproved()
  }, [])

  const handleDownload = (item) => {
    setSelectedCert(item)
    setIsPreviewOpen(true)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800')
    const printContent = document.getElementById('printable-certificate-area').innerHTML
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Grama Niladhari Character Certificate - ${selectedCert.certificateNo || 'Approved'}</title>
          <style>
            body { 
              font-family: 'Times New Roman', Times, serif; 
              padding: 40px; 
              color: #1e293b; 
              line-height: 1.6; 
              background: white;
            }
            .certificate-container { 
              width: 100%; 
              max-width: 800px; 
              margin: 0 auto; 
              position: relative; 
            }
            .branding-header {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              margin-bottom: 24px;
            }
            .branding-logo {
              height: 60px;
              margin-bottom: 8px;
              object-fit: contain;
            }
            .branding-title {
              font-size: 24px;
              font-weight: 800;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .branding-subtitle {
              font-size: 11px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .double-line { 
              border-bottom: 4px double #334155; 
              margin: 15px 0 25px 0; 
            }
            .text-center { text-align: center; }
            .italic { font-style: italic; }
            .bold { font-weight: bold; }
            .section-title {
              font-family: Arial, sans-serif;
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 4px;
              margin-top: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0; 
            }
            td { 
              padding: 6px; 
              font-size: 14.5px; 
              vertical-align: top; 
            }
            .border-dashed-bottom { 
              border-bottom: 1px dashed #475569; 
            }
            .remarks-box {
              padding: 10px;
              background-color: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 6px;
              font-size: 13.5px;
              font-style: italic;
              min-height: 50px;
              margin-top: 5px;
            }
            .cert-clause {
              font-size: 14px;
              margin-top: 30px;
              line-height: 1.7;
            }
            .signatures-row {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .sig-line {
              border-bottom: 1px solid #475569;
              width: 220px;
              margin-bottom: 5px;
            }
            .footer-info { 
              display: flex; 
              justify-content: space-between; 
              font-size: 10px; 
              color: #64748b; 
              border-top: 1px solid #cbd5e1; 
              padding-top: 5px; 
              margin-top: 60px; 
              font-family: Arial, sans-serif;
            }
            @media print {
              body { padding: 0; margin: 10mm; background: white; color: black; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
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
          {loading ? (
            <div className="text-center py-20 text-[#64748b] text-[15px] font-medium">Loading approved requests...</div>
          ) : approvedList.length === 0 ? (
            <div className="bg-white border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center text-[#64748b] text-[15px] font-semibold shadow-sm">
              No approved certificates ready for print yet. Apply for a certificate and request Grama Niladhari review.
            </div>
          ) : (
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
                  <div className="text-left max-w-full md:max-w-[70%] font-sans">
                    <h4 className="text-[16px] font-bold text-[#1B365D] mb-3">
                      {item.type || 'Character Certificate'}
                    </h4>
                    
                    <div className="flex flex-col gap-1 text-[13.5px]">
                      <div>
                        <span className="text-[#475569] font-medium">{d.requestedDate}: </span>
                        <span className="text-[#1e293b] font-semibold">{item.requestedDate || '2026-06-04'}</span>
                      </div>
                      <div>
                        <span className="text-[#475569] font-medium">{d.purpose}: </span>
                        <span className="text-[#1e293b] font-semibold">{item.purpose}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[#475569] font-medium">{d.certificateNo}: </span>
                        <span className="bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded text-[12.5px] tracking-wide">
                          {item.certificateNo || 'CC/2026/0491'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Approved Date & Action Button */}
                  <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto justify-between md:justify-start font-sans">
                    <span className="text-[13px] font-semibold text-[#64748b]">
                      {item.approvedDate || '04/07/2026 12:45 p.m'}
                    </span>
                    
                    <button 
                      onClick={() => handleDownload(item)}
                      className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 shadow-sm"
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
          )}

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

      {/* 4. Official Printable Certificate Preview Modal */}
      {isPreviewOpen && selectedCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 border border-slate-200 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#1B365D] text-white py-4 px-6 flex justify-between items-center font-sans">
              <span className="font-bold text-[16px] tracking-wide">Approved Official Document Review</span>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body Container */}
            <div className="p-8 md:p-12 overflow-y-auto bg-slate-100 flex-1 max-h-[70vh]">
              
              {/* Paper Layout representation */}
              <div 
                id="printable-certificate-area" 
                className="bg-white mx-auto border-2 border-slate-300 shadow-md p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[1050px]"
              >
                
                {/* Official Branding Header */}
                <div className="branding-header text-center flex flex-col items-center">
                  <img src={logo} alt="SmartGN Logo" className="branding-logo h-14 mb-2 object-contain" />
                  <h1 className="branding-title text-[20px] font-sans font-extrabold uppercase text-[#1B365D] tracking-wider m-0">SmartGN</h1>
                  <span className="branding-subtitle text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-widest">Digital Grama Niladhari Service Management System</span>
                  <div className="double-line w-full border-b-[3px] border-slate-400 mt-4"></div>
                </div>

                <div className="text-center mb-8 font-sans">
                  <h2 className="text-[17px] font-bold text-slate-800 m-0 uppercase tracking-wide">
                    Certificate on Residence and Character issued by the Grama Niladhari
                  </h2>
                  <span className="text-[12.5px] font-bold text-slate-700 block mt-2">
                    Certificate Serial No: {selectedCert.certificateNo || 'CC/2026/0491'}
                  </span>
                  <p className="text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif leading-normal">
                    This certificate is issued by the Grama Niladhari of the division in which the applicant resides and is valid only for 06 months from the date of issue.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="mb-6">
                  <div className="section-title">
                    (1) Divisional & Grama Niladhari Division Details
                  </div>
                  <table className="w-full text-[13.5px]">
                    <tbody>
                      <tr>
                        <td className="w-[50%] py-1 font-bold">(a) District and Divisional Secretary's Division:</td>
                        <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">{selectedCert.divisionalSecretariat || "Colombo Divisional Secretariat"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(b) Grama Niladhari Division and Number:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.gnDivisionNumber || "Borella East - 258"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(c) Whether applicant is personally known to Grama Niladhari?</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.personalKnown || "Yes"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(d) If so, since when?</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.personalKnown === 'Yes' ? (selectedCert.personalKnownSince || "Since Birth") : "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2 */}
                <div className="mb-6">
                  <div className="section-title">
                    (2) Information about Applicant
                  </div>
                  <table className="w-full text-[13.5px]">
                    <tbody>
                      <tr>
                        <td className="w-[30%] py-1 font-bold">(a) Name:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.name || selectedCert.fullName}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(b) Address:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.address}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(c) Sex:</td>
                        <td className="w-[30%] py-1 border-dashed-bottom italic text-slate-800">{selectedCert.sex || "Male"}</td>
                        <td className="w-[15%] py-1 font-bold text-center">(d) Age:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.age || "31"} Years</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(e) Civil Status:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.civilStatus || "Single"}</td>
                        <td className="py-1 font-bold text-center">(f) Sri Lankan:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.nationality || "Sri Lankan"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(g) Religion:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.religion || "Buddhist"}</td>
                        <td className="py-1 font-bold text-center">(h) Occupation:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.occupation || "Software Developer"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(i) Residence Period in Village:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.villagePeriod || "15 Years"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(j) National Identity Card No:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800 font-bold">{selectedCert.nic}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(k) Electoral Register Particulars:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.electoralRegister || "Registered"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(l) Name of the Father:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.fatherName || "(Not specified)"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(m) Address of the Father:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.fatherAddress || "(Not specified)"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(n) Purpose for Certificate:</td>
                        <td colspan="3" className="py-1 border-dashed-bottom italic text-slate-800 font-bold">{selectedCert.purpose}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 3 */}
                <div className="mb-6">
                  <div className="section-title">
                    (3) Other Residence & Security Information
                  </div>
                  <table className="w-full text-[13.5px]">
                    <tbody>
                      <tr>
                        <td className="w-[50%] py-1 font-bold">(a) Period of residence in GN Division:</td>
                        <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">{selectedCert.gnPeriod || "15 Years"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(b) Nature of other evidences in proof:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.natureOfOtherEvidences || "Utility Bill"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(c) Whether convicted by a Court of Law:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.convictedByCourt === 'Yes' ? `Yes - ${selectedCert.convictedDetails}` : 'No'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(d) Whether interested in public activities / social work:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800">{selectedCert.publicActivitiesInterest === 'Yes' ? `Yes - ${selectedCert.publicActivitiesDetails}` : 'No'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">(e) Character:</td>
                        <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">{selectedCert.character || "Good"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 4 */}
                <div className="mb-10">
                  <div className="section-title">
                    (4) Grama Niladhari Remarks
                  </div>
                  <div className="remarks-box text-[13.5px] italic text-slate-600 bg-slate-50 border border-dashed border-slate-300 rounded p-3 mt-2 min-h-[50px]">
                    {selectedCert.remarks || "No additional administrative comments added by the Grama Niladhari."}
                  </div>
                </div>

                {/* Certification clause */}
                <div className="cert-clause mt-8 pt-4 border-t border-slate-200 text-[14px]">
                  <p>
                    It is hereby certified that the above particulars are correct to the best of my knowledge, that he/she is a citizen of Sri Lanka by descent/registration, his/her certificate of Registration Number is <span className="font-bold">{selectedCert.certificateNo || 'CC/2026/0491'}</span> and that it has been issued by <span className="font-bold">Grama Niladhari Division {selectedCert.gnDivisionNumber || 'Borella East'}</span>.
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="signatures-row mt-14 flex justify-between items-end">
                  <div>
                    <span className="block text-[12px] text-slate-500 font-bold">DATE OF ISSUE:</span>
                    <span className="text-[13.5px] font-bold border-b border-slate-300 w-36 block pb-1">{selectedCert.approvedDate ? selectedCert.approvedDate.split(' ')[0] : new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="text-center">
                    <div className="sig-line w-52 border-b border-slate-400 pb-1 mb-1 italic text-slate-500 text-[12px] font-sans font-bold">
                      {selectedCert.officerName || 'Kamal Perera'}
                    </div>
                    <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">Grama Niladhari Signature & Seal</span>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="footer-info absolute bottom-4 left-10 right-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans">
                  <span>This is a computer-generated document. No signature is required.</span>
                  <span>Contact: 0255731913 | Admin@gmail.com</span>
                </div>

              </div>

            </div>

            {/* Modal Action Buttons */}
            <div className="bg-slate-50 border-t border-slate-200 py-3 px-6 flex justify-end gap-3 font-sans">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-[#475569] border-0 rounded-lg text-[13px] font-bold cursor-pointer transition-all duration-200"
              >
                Close
              </button>
              
              <button 
                onClick={handlePrint}
                className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-lg text-[13px] font-bold cursor-pointer transition-all duration-200 shadow-sm flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print / Save as PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default ApprovedCertificates
