import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import pendingIcon from "../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import rejectedIcon from "../assets/cancel_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function ResidentCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const CertificateTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
      title: "Certificates",
      pending: "Pending certificate requests",
      approved: "Approved certificate requests",
      rejected: "Rejected certificate requests",
      requestTypes: "Certificate types you can request",
      character: "Character certificates",
      income: "Income certificates",
      applyHere: "Apply here",
      statusTitle: "Requested certificates status",
      loading: "Loading requests...",
      noRequests: "No certificate requests registered to your account yet.",
      purpose: "Purpose",
      viewProfile: "View Profile",
      profileUpdated: "Profile updated successfully",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
      title: "සහතික",
      pending: "බලාපොරොත්තු වන සහතික ඉල්ලීම්",
      approved: "අනුමත කරන ලද සහතික ඉල්ලීම්",
      rejected: "ප්‍රතික්ෂේප කරන ලද සහතික ඉල්ලීම්",
      requestTypes: "ඔබට ඉල්ලිය හැකි සහතික වර්ග",
      character: "චරිත සහතික",
      income: "ආදායම් සහතික",
      applyHere: "මෙතැනින් අයදුම් කරන්න",
      statusTitle: "ඉල්ලූ සහතික තත්ත්වය",
      loading: "ඉල්ලීම් පූරණය වෙමින්...",
      noRequests: "ඔබගේ ගිණුමට තවමත් සහතික ඉල්ලීම් ලියාපදිංචි කර නොමැත.",
      purpose: "අරමුණ",
      viewProfile: "පැතිකඩ බලන්න",
      profileUpdated: "පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදී",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
      title: "சான்றிதழ்கள்",
      pending: "நிலுவையில் உள்ள சான்றிதழ் கோரிக்கைகள்",
      approved: "அங்கீகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      rejected: "நிராகரிக்கப்பட்ட சான்றிதழ் கோரிக்கைகள்",
      requestTypes: "நீங்கள் கோரக்கூடிய சான்றிதழ் வகைகள்",
      character: "குணநலச் சான்றிதழ்",
      income: "வருமானச் சான்றிதழ்",
      applyHere: "இங்கே விண்ணப்பிக்கவும்",
      statusTitle: "கோரப்பட்ட சான்றிதழ் நிலை",
      loading: "கோரிக்கைகள் ஏற்றப்படுகின்றன...",
      noRequests:
        "உங்கள் கணக்கில் இதுவரை சான்றிதழ் கோரிக்கைகள் பதிவு செய்யப்படவில்லை.",
      purpose: "நோக்கம்",
      viewProfile: "சுயவிவரத்தைக் காண்க",
      profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    },
  };

  const t = CertificateTranslations[lang] || CertificateTranslations.EN;

  const [showAlert, setShowAlert] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    nic: "",
    nicFront: null,
    nicBack: null,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("smartgn_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  // Fetch profile to check NIC images
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/residents/profile", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          fullName: data.full_name || "",
          nic: data.r_nic || "",
          nicFront: data.nic_front_path || null,
          nicBack: data.nic_back_path || null,
        });
        if (data.nic_front_path && data.nic_back_path) {
          setShowAlert(false);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Fetch certificate requests
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await fetch("/api/certificates/resident", {
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load certificates.");
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error loading certificates:", err);
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    loadRequests();
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Calculate counts
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  const cards = [
    {
      id: 1,
      icon: pendingIcon,
      alt: "pendingIcon",
      title: t.pending,
      count: pendingCount,
      navpath: "/ResidentDashboard/certificates/pending",
    },
    {
      id: 2,
      icon: approvedIcon,
      alt: "approvedIcon",
      title: t.approved,
      count: approvedCount,
      navpath: "/ResidentDashboard/certificates/approved",
    },
    {
      id: 3,
      icon: rejectedIcon,
      alt: "rejectedIcon",
      title: t.rejected,
      count: rejectedCount,
      navpath: "/ResidentDashboard/certificates/rejected",
    },
  ];

  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* ── Alert Banner - ABOVE HEADER ── */}
          {showAlert && areNicImagesMissing() && (
            <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
              <div className="flex flex-wrap items-center justify-between p-2 sm:p-2.5 md:p-[10px] bg-[#fef3c7] border border-[#fde68a] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-lg sm:rounded-xl text-[#d97706] font-medium text-[11px] sm:text-xs md:text-sm lg:text-[14px] text-left w-full transition-shadow duration-300">
                <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                  <span
                    className="hover:underline hover:cursor-pointer truncate"
                    onClick={() => {
                      navigate("/ResidentDashboard/profile");
                    }}
                  >
                    {t.alert}
                  </span>
                </div>
                <button
                  className="bg-transparent border-0 text-[#d97706] cursor-pointer p-0.5 sm:p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] flex-shrink-0 ml-1 sm:ml-2"
                  onClick={() => setShowAlert(false)}
                  aria-label="Close Warning"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-[16px] sm:h-[16px]"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
              {t.title}
            </h2>
          </div>

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-102 transition-all duration-100 cursor-pointer w-full"
                onClick={() =>
                  navigate(card.navpath, {
                    state: { successUser: profile.fullName },
                  })
                }
              >
                <img
                  src={card.icon}
                  alt={card.alt}
                  className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] object-contain"
                />
                <div className="flex flex-col items-center w-full">
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-regular text-[#2D3748] text-center leading-tight break-words max-w-full px-0.5">
                    {card.title}
                  </span>
                  <span className="text-[18px] sm:text-[20px] font-medium text-[#2D3748]">
                    {loading ? "..." : card.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Request Types ── */}
          <div className="bg-white border border-[#2D37482D] rounded-[10px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] font-bold text-[#1B365D] mb-3 sm:mb-4 text-left">
              {t.requestTypes}
            </h3>

            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Character Certificate - Align Right */}
              <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 w-full">
                <span className="text-[13px] sm:text-[14px] md:text-[14.5px] font-semibold text-[#2D3748] text-left break-words flex-1">
                  {t.character}
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[13px] sm:text-[14px] cursor-pointer transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  onClick={() =>
                    navigate("/ResidentDashboard/certificates/apply-character")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mr-0.5 sm:mr-1"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  {t.applyHere}
                </span>
              </div>

              {/* Income Certificate - Align Right */}
              <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 w-full">
                <span className="text-[13px] sm:text-[14px] md:text-[14.5px] font-semibold text-[#2D3748] text-left break-words flex-1">
                  {t.income}
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[13px] sm:text-[14px] cursor-pointer transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  onClick={() =>
                    navigate("/ResidentDashboard/certificates/apply-income")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mr-0.5 sm:mr-1"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  {t.applyHere}
                </span>
              </div>
            </div>
          </div>

          {/* ── Status List ── */}
          <div className="bg-white border border-[#2D37482D] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-[10px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-4 sm:mb-5 md:mb-[30px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] flex flex-col transition-shadow duration-300">
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] font-bold text-[#1B365D] mb-3 sm:mb-4 text-left">
              {t.statusTitle}
            </h3>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {loading ? (
                <div className="text-center py-5 text-[#64748b] text-[13px] sm:text-[14px]">
                  {t.loading}
                </div>
              ) : error ? (
                <div className="text-center py-5 text-red-500 text-[13px] sm:text-[14px]">
                  Error: {error}
                </div>
              ) : requests.length === 0 ? (
                <div className="flex items-center justify-center p-6 sm:p-8 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl text-[#64748b] text-[12px] sm:text-[13px] font-semibold text-center">
                  {t.noRequests}
                </div>
              ) : (
                requests.slice(0, 5).map((req) => (
                  <div
                    key={req.request_id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-[#f8fafc] border border-[#2D374813] rounded-xl gap-2 sm:gap-3"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2"
                          className="sm:w-[18px] sm:h-[18px]"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[14.5px] font-semibold text-[#1e293b] text-left capitalize break-words">
                        {req.certificate_type?.toLowerCase() || "Certificate"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-left">
                      <span className="text-[12px] sm:text-[13px] text-[#64748b] break-words">
                        {t.purpose}: {req.purpose || "N/A"}
                      </span>
                      <span
                        className={`inline-flex items-center self-start px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-[12px] font-bold whitespace-nowrap ${
                          req.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : req.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status === "APPROVED" && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-0.5 sm:mr-1"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {req.status === "REJECTED" && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-0.5 sm:mr-1"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                        {req.status === "PENDING" && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-0.5 sm:mr-1"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        )}
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {!loading && requests.length > 5 && (
                <div className="text-center mt-2">
                  <button
                    onClick={() =>
                      navigate("/ResidentDashboard/certificates/pending")
                    }
                    className="text-[#1B365D] hover:text-[#005BBD] text-[12px] sm:text-[13px] font-semibold cursor-pointer bg-transparent border-0"
                  >
                    View all {requests.length} requests →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default ResidentCertificates;
