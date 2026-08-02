import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import logo from "../assets/logo.png";

function ApprovedCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  const localDict = {
    EN: {
      title: "Approved Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      certificateNo: "Certificate Number",
      downloadPdf: "View / Print Certificate",
      back: "Back",
      noApproved: "No approved certificates ready for download yet.",
      applyHint: "Apply for a certificate and request Grama Niladhari review.",
      loading: "Loading approved requests...",
      error: "Error loading certificates",
      retry: "Retry",
      approvedDate: "Approved Date",
      issuedDate: "Issued Date",
      expiryDate: "Expiry Date",
    },
    SI: {
      title: "අනුමත කරන ලද සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      certificateNo: "සහතික අංකය",
      downloadPdf: "සහතිකය මුද්‍රණය කරන්න",
      back: "ආපසු",
      noApproved: "අනුමත සහතික තවමත් බාගත කිරීමට සූදානම් නැත.",
      applyHint: "සහතිකයක් සඳහා අයදුම් කර ග්‍රාම නිලධාරී සමාලෝචනයක් ඉල්ලන්න.",
      loading: "අනුමත ඉල්ලීම් පූරණය වෙමින්...",
      error: "සහතික පූරණය කිරීමේ දෝෂයකි",
      retry: "නැවත උත්සාහ කරන්න",
      approvedDate: "අනුමත කළ දිනය",
      issuedDate: "නිකුත් කළ දිනය",
      expiryDate: "කල් ඉකුත් වන දිනය",
    },
    TA: {
      title: "அங்கீகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      certificateNo: "சான்றிதழ் எண்",
      downloadPdf: "சான்றிதழை அச்சிடுக",
      back: "திரும்புக",
      noApproved:
        "அங்கீகரிக்கப்பட்ட சான்றிதழ்கள் இன்னும் பதிவிறக்க தயாராக இல்லை.",
      applyHint:
        "சான்றிதழுக்கு விண்ணப்பித்து கிராம நிலதாரி மதிப்பாய்வைக் கோருங்கள்.",
      loading: "அங்கீகரிக்கப்பட்ட கோரிக்கைகள் ஏற்றப்படுகின்றன...",
      error: "சான்றிதழ்களை ஏற்றுவதில் பிழை",
      retry: "மீண்டும் முயற்சிக்கவும்",
      approvedDate: "அங்கீகரிக்கப்பட்ட தேதி",
      issuedDate: "வழங்கப்பட்ட தேதி",
      expiryDate: "காலாவதி தேதி",
    },
  };

  const d = localDict[lang] || localDict.EN;

  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("smartgn_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  const loadApproved = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await fetch("/api/certificates/resident", { headers });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load certificates");
      }
      const data = await response.json();
      const approved = data.filter(
        (c) => c.status === "APPROVED" || c.status === "Approved",
      );
      setApprovedList(approved);
    } catch (err) {
      console.error("Error loading approved certificates:", err);
      setError(err.message);
      setApprovedList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApproved();
  }, []);

  const handleDownload = (item) => {
    setSelectedCert(item);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=800");
    const printContent = document.getElementById(
      "printable-certificate-area",
    ).innerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Grama Niladhari Certificate - ${selectedCert.certificate_number || "Approved"}</title>
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
            .branding-logo { height: 60px; margin-bottom: 8px; object-fit: contain; }
            .branding-title { font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
            .branding-subtitle { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
            .double-line { border-bottom: 4px double #334155; margin: 15px 0 25px 0; }
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
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 6px; font-size: 14.5px; vertical-align: top; }
            .border-dashed-bottom { border-bottom: 1px dashed #475569; }
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
            .cert-clause { font-size: 14px; margin-top: 30px; line-height: 1.7; }
            .signatures-row { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-line { border-bottom: 1px solid #475569; width: 220px; margin-bottom: 5px; }
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
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getDetails = (item) => {
    return item.details || {};
  };

  const renderCharacterCertificate = (item) => {
    const details = getDetails(item);
    const certNumber = item.certificate_number || "N/A";
    const issuedDate = item.issued_date || new Date().toLocaleDateString();
    const expiryDate =
      item.expiry_date ||
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return (
      <div
        id="printable-certificate-area"
        className="bg-white mx-auto border-2 border-slate-300 shadow-md p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[1050px]"
      >
        {/* Header */}
        <div className="branding-header text-center flex flex-col items-center">
          <img
            src={logo}
            alt="SmartGN Logo"
            className="branding-logo h-14 mb-2 object-contain"
          />
          <h1 className="branding-title text-[20px] font-sans font-extrabold uppercase text-[#1B365D]">
            SmartGN
          </h1>
          <span className="branding-subtitle text-[11px] font-sans font-semibold text-slate-500 uppercase">
            Digital Grama Niladhari Service Management System
          </span>
          <div className="double-line w-full border-b-[3px] border-slate-400 mt-4"></div>
        </div>

        <div className="text-center mb-8 font-sans">
          <h2 className="text-[17px] font-bold text-slate-800 m-0 uppercase">
            Certificate on Residence and Character
          </h2>
          <span className="text-[12.5px] font-bold text-slate-700 block mt-2">
            Certificate Serial No: {certNumber}
          </span>
          <p className="text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif">
            This certificate is valid only for 06 months from the date of issue.
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
                <td className="w-[50%] py-1 font-bold">
                  (a) District and Divisional Secretary's Division:
                </td>
                <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                  {details.divisionalSecretariat || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (b) Grama Niladhari Division and Number:
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.gnDivisionNumber || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (c) Whether applicant is personally known to Grama Niladhari?
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.personalKnown || "No"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(d) If so, since when?</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.personalKnown === "Yes"
                    ? details.personalKnownSince || "Since Birth"
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <div className="section-title">(2) Information about Applicant</div>
          <table className="w-full text-[13.5px]">
            <tbody>
              <tr>
                <td className="w-[30%] py-1 font-bold">(a) Name:</td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.fullName || item.resident_name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(b) Address:</td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.address || item.resident_address || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(c) Sex:</td>
                <td className="w-[30%] py-1 border-dashed-bottom italic text-slate-800">
                  {details.sex || "N/A"}
                </td>
                <td className="w-[15%] py-1 font-bold text-center">(d) Age:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.age || "N/A"} Years
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(e) Civil Status:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.civilStatus || "N/A"}
                </td>
                <td className="py-1 font-bold text-center">(f) Sri Lankan:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.nationality || "Sri Lankan"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(g) Religion:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.religion || "N/A"}
                </td>
                <td className="py-1 font-bold text-center">(h) Occupation:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.occupation || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (i) Residence Period in Village:
                </td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.villagePeriod || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (j) National Identity Card No:
                </td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800 font-bold"
                >
                  {item.resident_nic || details.nicNumber || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (k) Electoral Register Particulars:
                </td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.electoralRegister || "Registered"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(l) Name of the Father:</td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.fatherName || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(m) Address of the Father:</td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800"
                >
                  {details.fatherAddress || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(n) Purpose for Certificate:</td>
                <td
                  colSpan="3"
                  className="py-1 border-dashed-bottom italic text-slate-800 font-bold"
                >
                  {item.purpose || details.purpose || "N/A"}
                </td>
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
                <td className="w-[50%] py-1 font-bold">
                  (a) Period of residence in GN Division:
                </td>
                <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                  {details.gnPeriod || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (b) Nature of other evidences in proof:
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.natureOfOtherEvidences || "Utility Bill"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (c) Whether convicted by a Court of Law:
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.convictedByCourt === "Yes"
                    ? `Yes - ${details.convictedDetails}`
                    : "No"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  (d) Whether interested in public activities / social work:
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.publicActivitiesInterest === "Yes"
                    ? `Yes - ${details.publicActivitiesDetails}`
                    : "No"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">(e) Character:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">
                  {details.character || "Good"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4 */}
        <div className="mb-10">
          <div className="section-title">(4) Grama Niladhari Remarks</div>
          <div className="remarks-box">
            {item.gn_remarks || details.remarks || "No additional remarks."}
          </div>
        </div>

        <div className="cert-clause mt-8 pt-4 border-t border-slate-200 text-[14px]">
          <p>
            It is hereby certified that the above particulars are correct to the
            best of my knowledge, that he/she is a citizen of Sri Lanka by
            descent/registration, his/her certificate of Registration Number is{" "}
            <span className="font-bold">{certNumber}</span> and that it has been
            issued by{" "}
            <span className="font-bold">
              Grama Niladhari Division {details.gnDivisionNumber || "N/A"}
            </span>
            .
          </p>
          <p className="mt-2 text-[12px] text-slate-600">
            <span className="font-bold">Date of Issue:</span> {issuedDate}{" "}
            &nbsp;|&nbsp; <span className="font-bold">Valid Until:</span>{" "}
            {expiryDate}
          </p>
        </div>

        <div className="signatures-row mt-14 flex justify-between items-end">
          <div>
            <span className="block text-[12px] text-slate-500 font-bold">
              DATE OF ISSUE:
            </span>
            <span className="text-[13.5px] font-bold border-b border-slate-300 w-36 block pb-1">
              {issuedDate}
            </span>
          </div>
          <div className="text-center">
            <div className="sig-line w-52 border-b border-slate-400 pb-1 mb-1 italic text-slate-500 text-[12px] font-sans font-bold">
              {details.officerName || item.approved_by || "Grama Niladhari"}
            </div>
            <span className="block text-[11px] text-slate-500 font-bold uppercase">
              Grama Niladhari Signature & Seal
            </span>
          </div>
        </div>

        <div className="footer-info absolute bottom-4 left-10 right-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans">
          <span>This is a computer-generated document.</span>
          <span>Contact: SmartGN Support</span>
        </div>
      </div>
    );
  };

  const renderIncomeCertificate = (item) => {
    const details = getDetails(item);
    const certNumber = item.certificate_number || "N/A";
    const issuedDate = item.issued_date || new Date().toLocaleDateString();
    const expiryDate =
      item.expiry_date ||
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const incomeStream = details.incomeStream || "Laborer";

    return (
      <div
        id="printable-certificate-area"
        className="bg-white mx-auto border-2 border-slate-300 shadow-md p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[1050px]"
      >
        <div className="branding-header text-center flex flex-col items-center">
          <img
            src={logo}
            alt="SmartGN Logo"
            className="branding-logo h-14 mb-2 object-contain"
          />
          <h1 className="branding-title text-[20px] font-sans font-extrabold uppercase text-[#1B365D]">
            SmartGN
          </h1>
          <span className="branding-subtitle text-[11px] font-sans font-semibold text-slate-500 uppercase">
            Digital Grama Niladhari Service Management System
          </span>
          <div className="double-line w-full border-b-[3px] border-slate-400 mt-4"></div>
        </div>

        <div className="text-center mb-8 font-sans">
          <h2 className="text-[17px] font-bold text-slate-800 m-0 uppercase">
            Certificate on Income issued by the Grama Niladhari
          </h2>
          <span className="text-[12.5px] font-bold text-slate-700 block mt-2">
            Certificate Serial No: {certNumber}
          </span>
          <p className="text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif">
            A commission of 1.27% of the value of the income certificate is
            charged by the government.
          </p>
        </div>

        <div className="mb-6">
          <div className="section-title">(1) General Information</div>
          <table className="w-full text-[13.5px]">
            <tbody>
              <tr>
                <td className="w-[50%] py-1 font-bold">
                  Applicant's Full Name:
                </td>
                <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                  {details.fullName || item.resident_name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">
                  Grama Niladhari Division and Number:
                </td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.gnDivisionNumber || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Residential Address:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {details.address || item.resident_address || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">National Identity Card No:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">
                  {item.resident_nic || details.nicNumber || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Income Stream / Category:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold uppercase">
                  {incomeStream === "Paddy"
                    ? "Paddy / Agriculture"
                    : incomeStream === "Business"
                      ? "Business / Commercial"
                      : incomeStream === "Laborer"
                        ? "Carpenter / Laborer / Services"
                        : incomeStream || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Purpose of Certificate:</td>
                <td className="py-1 border-dashed-bottom italic text-slate-800">
                  {item.purpose || details.purpose || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <div className="section-title">(2) Income Stream Breakdown</div>
          {incomeStream === "Paddy" && (
            <table className="w-full text-[13.5px]">
              <tbody>
                <tr>
                  <td className="w-[50%] py-1 font-bold">Land Owner Name:</td>
                  <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                    {details.landOwnerName || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Amount of Land:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.landAmount || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Identity as Owner:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.ownerIdentity || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Produce Obtained:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.amountObtained || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Price per Kg (Rs.):</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    Rs. {details.pricePerKg || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Expenses incurred (Rs.):</td>
                  <td className="py-1 border-dashed-bottom italic text-red-600">
                    Rs. {details.expenses || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Total Income (Rs.):</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">
                    Rs. {details.totalIncome || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold text-[#1B365D]">
                    Verified Annual Income (Rs.):
                  </td>
                  <td className="py-1 border-dashed-bottom text-[#1B365D] font-bold text-[14px]">
                    Rs.{" "}
                    {details.verifiedAnnualIncome ||
                      details.annualIncome ||
                      "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          {incomeStream === "Business" && (
            <table className="w-full text-[13.5px]">
              <tbody>
                <tr>
                  <td className="w-[50%] py-1 font-bold">
                    Name of the Business:
                  </td>
                  <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                    {details.businessName || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Nature of Business:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.businessNature || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Tax Receipt Number:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.taxReceiptNumber || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">
                    Daily/Monthly Income (Rs.):
                  </td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    Rs. {details.dailyMonthlyIncome || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Net Business Income (Rs.):</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">
                    Rs. {details.netIncome || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold text-[#1B365D]">
                    Verified Annual Income (Rs.):
                  </td>
                  <td className="py-1 border-dashed-bottom text-[#1B365D] font-bold text-[14px]">
                    Rs.{" "}
                    {details.verifiedAnnualIncome ||
                      details.businessAnnualIncome ||
                      "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          {incomeStream === "Laborer" && (
            <table className="w-full text-[13.5px]">
              <tbody>
                <tr>
                  <td className="w-[50%] py-1 font-bold">
                    Daily Salary / Rate (Rs.):
                  </td>
                  <td className="w-[50%] py-1 border-dashed-bottom italic text-slate-800">
                    Rs. {details.dailySalary || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Hours worked per week:</td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800">
                    {details.hoursWorked || "0"} hours
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">
                    Average Monthly Income (Rs.):
                  </td>
                  <td className="py-1 border-dashed-bottom italic text-slate-800 font-bold">
                    Rs. {details.monthlyIncome || "0"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold text-[#1B365D]">
                    Verified Annual Income (Rs.):
                  </td>
                  <td className="py-1 border-dashed-bottom text-[#1B365D] font-bold text-[14px]">
                    Rs.{" "}
                    {details.verifiedAnnualIncome ||
                      details.laborerAnnualIncome ||
                      "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-10">
          <div className="section-title">(3) Grama Niladhari Remarks</div>
          <div className="remarks-box">
            {item.gn_remarks || details.remarks || "No additional remarks."}
          </div>
        </div>

        <div className="cert-clause mt-8 pt-4 border-t border-slate-200 text-[14px]">
          <p>
            It is hereby certified that the above particulars are correct to the
            best of my knowledge and belief, and that the applicant's verified
            annual income is{" "}
            <span className="font-bold">
              Rs.{" "}
              {details.verifiedAnnualIncome ||
                details.annualIncome ||
                details.businessAnnualIncome ||
                details.laborerAnnualIncome ||
                "0"}
            </span>
            . This certificate has been issued by{" "}
            <span className="font-bold">
              Grama Niladhari Division {details.gnDivisionNumber || "N/A"}
            </span>
            .
          </p>
          <p className="mt-2 text-[12px] text-slate-600">
            <span className="font-bold">Date of Issue:</span> {issuedDate}{" "}
            &nbsp;|&nbsp; <span className="font-bold">Valid Until:</span>{" "}
            {expiryDate}
          </p>
        </div>

        <div className="signatures-row mt-14 flex justify-between items-end">
          <div>
            <span className="block text-[12px] text-slate-500 font-bold">
              DATE OF ISSUE:
            </span>
            <span className="text-[13.5px] font-bold border-b border-slate-300 w-36 block pb-1">
              {issuedDate}
            </span>
          </div>
          <div className="text-center">
            <div className="sig-line w-52 border-b border-slate-400 pb-1 mb-1 italic text-slate-500 text-[12px] font-sans font-bold">
              {details.officerName || item.approved_by || "Grama Niladhari"}
            </div>
            <span className="block text-[11px] text-slate-500 font-bold uppercase">
              Grama Niladhari Signature & Seal
            </span>
          </div>
        </div>

        <div className="footer-info absolute bottom-4 left-10 right-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans">
          <span>This is a computer-generated document.</span>
          <span>Contact: SmartGN Support</span>
        </div>
      </div>
    );
  };

  const renderCertificateContent = (item) => {
    const isIncome =
      item.certificate_type === "INCOME" || item.type === "Income Certificate";
    return isIncome
      ? renderIncomeCertificate(item)
      : renderCharacterCertificate(item);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      <AfterlogNavbar />
      <div className="flex flex-1 w-full">
        <RSidebar />
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto relative">
          <button
            className="flex items-center gap-1.5 py-2 px-4 border border-[#cbd5e1] bg-white text-[#475569] rounded-lg text-[14px] font-medium cursor-pointer hover:bg-[#f1f5f9] mb-4"
            onClick={() => navigate("/ResidentDashboard/certificates")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {d.back}
          </button>

          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">
            {d.title}
          </h2>

          {loading ? (
            <div className="text-center py-20 text-[#64748b] text-[15px] font-medium">
              {d.loading}
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 rounded-2xl p-12 text-center">
              <p className="text-red-500 text-[15px] font-semibold">
                {d.error}: {error}
              </p>
              <button
                onClick={loadApproved}
                className="mt-4 py-2 px-6 bg-[#1B365D] text-white rounded-lg text-[14px] font-semibold hover:bg-[#005BBD]"
              >
                {d.retry}
              </button>
            </div>
          ) : approvedList.length === 0 ? (
            <div className="bg-white border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center text-[#64748b] text-[15px] font-semibold shadow-sm">
              {d.noApproved}
              <div className="mt-4 text-[13px] font-normal">{d.applyHint}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {approvedList.map((item) => {
                const details = item.details || {};
                return (
                  <div
                    key={item.request_id || item.id}
                    className="rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-4 bg-[#f0fdf4] border-[1.5px] border-[#bbf7d0]"
                  >
                    <div className="text-left max-w-full md:max-w-[70%] font-sans">
                      <h4 className="text-[16px] font-bold text-[#1B365D] mb-3">
                        {item.certificate_type === "INCOME"
                          ? "Income Certificate"
                          : "Character Certificate"}
                      </h4>
                      <div className="flex flex-col gap-1 text-[13.5px]">
                        <div>
                          <span className="text-[#475569] font-medium">
                            {d.requestedDate}:{" "}
                          </span>
                          <span className="text-[#1e293b] font-semibold">
                            {item.request_date || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#475569] font-medium">
                            {d.purpose}:{" "}
                          </span>
                          <span className="text-[#1e293b] font-semibold">
                            {item.purpose || details.purpose || "N/A"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[#475569] font-medium">
                            {d.certificateNo}:{" "}
                          </span>
                          <span className="bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded text-[12.5px] tracking-wide">
                            {item.certificate_number || "N/A"}
                          </span>
                        </div>
                        {item.issued_date && (
                          <div className="text-[12px] text-[#64748b]">
                            <span className="font-medium">{d.issuedDate}:</span>{" "}
                            {item.issued_date}
                          </div>
                        )}
                        {item.expiry_date && (
                          <div className="text-[12px] text-[#64748b]">
                            <span className="font-medium">{d.expiryDate}:</span>{" "}
                            {item.expiry_date}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto">
                      <span className="text-[13px] font-semibold text-[#64748b]">
                        {d.approvedDate}:{" "}
                        {item.approved_at
                          ? new Date(item.approved_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 shadow-sm"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        {d.downloadPdf}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
            onClick={onOpenHelp}
          >
            ?
          </button>
        </main >
      </div >
    <Footer />

  {
    isPreviewOpen && selectedCert && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 border border-slate-200">
          <div className="bg-[#1B365D] text-white py-4 px-6 flex justify-between items-center font-sans">
            <span className="font-bold text-[16px] tracking-wide">
              Approved Official Document
            </span>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="p-8 md:p-12 overflow-y-auto bg-slate-100 flex-1 max-h-[70vh]">
            {renderCertificateContent(selectedCert)}
          </div>
          <div className="bg-slate-50 border-t border-slate-200 py-3 px-6 flex justify-end gap-3 font-sans">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-[#475569] border-0 rounded-lg text-[13px] font-bold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-lg text-[13px] font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    )
  }
    </div >
  );
}

export default ApprovedCertificates;
