import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
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
          <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
            <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
              {t.title}
            </h2>

            <div className="flex justify-end -mt-[70px]">
              {showAlert && areNicImagesMissing() && (
                <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => {
                        navigate("/ResidentDashboard/profile");
                      }}
                    >
                      {t.alert}
                    </span>
                  </div>
                  <button
                    className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1 ml-3"
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] mt-4 sm:mt-5 md:mt-6 lg:my-[30px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-102 transition-all duration-100 cursor-pointer"
                onClick={() =>
                  navigate(card.navpath, {
                    state: { successUser: profile.fullName },
                  })
                }
              >
                <img src={card.icon} alt={card.alt} className="w-[50px]" />
                <div className="flex flex-col items-center">
                  <span className="text-[16px] font-regular text-[#2D3748] text-center">
                    {card.title}
                  </span>
                  <span className="text-[20px] font-medium text-[#2D3748]">
                    {loading ? "..." : card.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Request Types */}
          <div className="bg-white border border-[#2D37482D] rounded-2xl p-6 mb-[30px] flex flex-col mx-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
            <h3 className="text-[17px] font-bold text-[#1B365D] mb-4 text-left">
              {t.requestTypes}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[14.5px] font-semibold text-[#2D3748] text-left">
                  {t.character}
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[14px] cursor-pointer transition-colors duration-200"
                  onClick={() =>
                    navigate("/ResidentDashboard/certificates/apply-character")
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mr-1"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  {t.applyHere}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[14.5px] font-semibold text-[#2D3748] text-left">
                  {t.income}
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[14px] cursor-pointer transition-colors duration-200"
                  onClick={() =>
                    navigate("/ResidentDashboard/certificates/apply-income")
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mr-1"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  {t.applyHere}
                </span>
              </div>
            </div>
          </div>

          {/* Status List */}
          <div className="bg-white border border-[#2D37482D] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-[30px] mx-[30px] flex flex-col">
            <h3 className="text-[17px] font-bold text-[#1B365D] mb-4 text-left">
              {t.statusTitle}
            </h3>

            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="text-center py-5 text-[#64748b] text-[14px]">
                  {t.loading}
                </div>
              ) : error ? (
                <div className="text-center py-5 text-red-500 text-[14px]">
                  Error: {error}
                </div>
              ) : requests.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl text-[#64748b] text-[13px] font-semibold">
                  {t.noRequests}
                </div>
              ) : (
                requests.slice(0, 5).map((req) => (
                  <div
                    key={req.request_id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-[#f8fafc] border border-[#2D374813] rounded-xl gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </span>
                      <span className="text-[14.5px] font-semibold text-[#1e293b] text-left capitalize">
                        {req.certificate_type?.toLowerCase() || "Certificate"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-left">
                      <span className="text-[13px] text-[#64748b]">
                        {t.purpose}: {req.purpose || "N/A"}
                      </span>
                      <span
                        className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-[12px] font-bold ${
                          req.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : req.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status === "APPROVED" && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-1"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {req.status === "REJECTED" && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-1"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                        {req.status === "PENDING" && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mr-1"
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
                    className="text-[#1B365D] hover:text-[#005BBD] text-[13px] font-semibold cursor-pointer bg-transparent border-0"
                  >
                    View all {requests.length} requests →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
          aria-label="Help Trigger"
          onClick={onOpenHelp}
        >
          ?
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default ResidentCertificates;
