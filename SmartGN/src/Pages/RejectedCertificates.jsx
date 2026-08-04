import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function RejectedCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Retrieve username and division/ID from navigation state if available
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  const [rejectedList, setRejectedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRejected = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("smartgn_token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };
      const response = await fetch("/api/certificates/resident", { headers });
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      const rejected = data.filter(
        (c) => c.status === "REJECTED" || c.status === "Rejected",
      );
      setRejectedList(
        rejected.map((c, index) => ({
          id: c.id || c.request_id,
          type:
            c.type ||
            (c.certificate_type === "INCOME"
              ? "Income Certificate"
              : "Character Certificate"),
          requestedDate:
            c.submittedDate ||
            (c.request_date ? c.request_date.split("T")[0] : ""),
          approvedDate: c.approvedDate || "",
          purpose: c.purpose,
          reason:
            c.rejectionReason ||
            "Uploaded Full Name doesn't match with the name in NIC",
          isActive: index === 0,
        })),
      );
    } catch (err) {
      console.warn(
        "API connection offline. Loading rejected certificates from local fallback.",
      );
      setError("Failed to load from server. Using cached data.");
      const localData = localStorage.getItem("smartgn_certificates");
      if (localData) {
        const allCerts = JSON.parse(localData);
        const rejected = allCerts.filter(
          (c) => c.status === "REJECTED" || c.status === "Rejected",
        );
        setRejectedList(
          rejected.map((c, index) => ({
            id: c.id || c.request_id,
            type:
              c.type ||
              (c.certificate_type === "INCOME"
                ? "Income Certificate"
                : "Character Certificate"),
            requestedDate:
              c.submittedDate ||
              (c.request_date ? c.request_date.split("T")[0] : ""),
            approvedDate: c.approvedDate || "",
            purpose: c.purpose,
            reason:
              c.rejectionReason ||
              "Uploaded Full Name doesn't match with the name in NIC",
            isActive: index === 0,
          })),
        );
      } else {
        const defaultRejected = [
          {
            id: 1,
            type: "Character Certificate",
            approvedDate: "28/05/2026 09:33 a.m",
            requestedDate: "26/05/2026",
            purpose: "For certify residence",
            reason: "Uploaded Full Name doesn't match with the name in NIC",
            isActive: true,
          },
        ];
        localStorage.setItem(
          "smartgn_certificates",
          JSON.stringify(
            defaultRejected.map((p) => ({
              ...p,
              status: "REJECTED",
              certificate_type:
                p.type === "Income Certificate" ? "INCOME" : "CHARACTER",
              rejectionReason: p.reason,
            })),
          ),
        );
        setRejectedList(defaultRejected);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRejected();
  }, []);

  const localDict = {
    EN: {
      title: "Rejected Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      reasonForRejection: "Reason for the rejection:",
      editRequest: "Edit request",
      back: "Back",
      editingRequest: "Editing rejected request for",
      loading: "Loading rejected requests...",
      noRejected: "No rejected certificate requests found.",
      retry: "Retry",
    },
    SI: {
      title: "ප්‍රතික්ෂේපිත සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      reasonForRejection: "ප්‍රතික්ෂේප කිරීමට හේතුව:",
      editRequest: "ඉල්ලීම සංස්කරණය කරන්න",
      back: "ආපසු",
      editingRequest: "ප්‍රතික්ෂේපිත ඉල්ලීම සංස්කරණය කරමින්",
      loading: "ප්‍රතික්ෂේපිත ඉල්ලීම් පූරණය වෙමින්...",
      noRejected: "ප්‍රතික්ෂේපිත සහතික ඉල්ලීම් කිසිවක් හමු නොවීය.",
      retry: "නැවත උත්සාහ කරන්න",
    },
    TA: {
      title: "நிராகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      reasonForRejection: "நிராகரிப்பதற்கான காரணம்:",
      editRequest: "கோரிக்கையை திருத்தவும்",
      back: "திரும்புக",
      editingRequest: "நிராகரிக்கப்பட்ட கோரிக்கையை திருத்துகிறது",
      loading: "நிராகரிக்கப்பட்ட கோரிக்கைகள் ஏற்றப்படுகின்றன...",
      noRejected: "நிராகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள் எதுவும் இல்லை.",
      retry: "மீண்டும் முயற்சிக்கவும்",
    },
  };

  const d = localDict[lang] || localDict.EN;

  const handleEditRequest = (item) => {
    alert(`${d.editingRequest} ${item.type} (ID: ${item.id})...`);
  };

  const handleRetry = () => {
    loadRejected();
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Back Button - Left aligned on all screens */}
          <div className="flex justify-start mt-12 sm:mt-14 md:mt-16 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            <button
              className="flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 border border-[#cbd5e1] bg-white text-[#475569] rounded-lg text-[13px] sm:text-[14px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#f1f5f9] hover:text-[#1e293b]"
              onClick={() =>
                navigate("/ResidentDashboard/certificates", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="sm:w-[16px] sm:h-[16px]"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {d.back}
            </button>
          </div>

          {/* Title */}
          <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[10px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            {d.title}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] text-center">
              <p className="text-red-600 font-medium text-[13px] sm:text-[14px] mb-2 sm:mb-3">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl text-[12px] sm:text-sm font-semibold transition-colors"
              >
                {d.retry || "Retry"}
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 sm:py-16 md:py-20 text-[#64748b] text-[13px] sm:text-[14px] md:text-[15px] font-medium mx-4">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#1B365D] mx-auto mb-3 sm:mb-4"></div>
              {d.loading || "Loading rejected requests..."}
            </div>
          )}

          {/* No Rejected Requests */}
          {!loading && !error && rejectedList.length === 0 && (
            <div className="bg-white border border-dashed border-[#cbd5e1] rounded-xl sm:rounded-2xl p-8 sm:p-10 md:p-12 mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] text-center text-[#64748b] text-[13px] sm:text-[14px] md:text-[15px] font-semibold shadow-sm">
              {d.noRejected || "No rejected certificate requests found."}
            </div>
          )}

          {/* Rejected Requests List */}
          {!loading && !error && rejectedList.length > 0 && (
            <div className="flex flex-col gap-3 sm:gap-4 mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px]">
              {rejectedList.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-3 sm:gap-4 ${
                    item.isActive
                      ? "bg-[#fdf8f0] border-[1.5px] border-[#fedc9b]"
                      : "bg-white border border-[#2D37481F]"
                  }`}
                >
                  {/* Left Area: Certificate Details */}
                  <div className="text-left w-full md:max-w-[70%]">
                    <h4 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#1B365D] mb-2 sm:mb-3 break-words">
                      {item.type}
                    </h4>

                    <div className="flex flex-col gap-0.5 sm:gap-1 text-[12px] sm:text-[13px] md:text-[13.5px]">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                        <span className="text-[#475569] font-medium">
                          {d.requestedDate}:
                        </span>
                        <span className="text-[#1e293b] font-semibold break-words">
                          {item.requestedDate}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                        <span className="text-[#475569] font-medium">
                          {d.purpose}:
                        </span>
                        <span className="text-[#1e293b] font-semibold break-words">
                          {item.purpose}
                        </span>
                      </div>
                      <div className="mt-1.5 sm:mt-2">
                        <span className="text-[#ef4444] font-bold block text-[12px] sm:text-[13px] md:text-[14px] mb-0.5 sm:mb-1">
                          {d.reasonForRejection}
                        </span>
                        <span className="text-[#334155] font-medium text-[12px] sm:text-[13px] leading-relaxed break-words">
                          {item.reason}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Approved Date & Actions Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <span className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#64748b] whitespace-nowrap">
                      {item.approvedDate}
                    </span>

                    <button
                      onClick={() => handleEditRequest(item)}
                      className="flex items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200 w-full sm:w-auto justify-center"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="sm:w-[14px] sm:h-[14px]"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      {d.editRequest}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ChatbotButton onOpenHelp={onOpenHelp} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RejectedCertificates;
