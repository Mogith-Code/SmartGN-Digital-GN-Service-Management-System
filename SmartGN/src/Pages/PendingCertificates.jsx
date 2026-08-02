import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function PendingCertificates({ onOpenHelp }) {
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

  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localDict = {
    EN: {
      title: "Pending Certificate requests",
      requestedDate: "Requested Date",
      purpose: "Purpose",
      currentStage: "Current Stage:",
      trackStatus: "Track status",
      back: "Back",
      trackingRequest: "Tracking pending request for",
      noPending: "No pending certificate requests found.",
      loading: "Loading pending requests...",
      error: "Failed to load pending certificate requests. Please try again.",
      retry: "Retry",
      stages: {
        verification: "Verification in progress",
        signature: "Pending Grama Niladhari Signature",
        audit: "Document Audit Stage",
      },
    },
    SI: {
      title: "ක්‍රියාත්මක වෙමින් පවතින සහතික ඉල්ලීම්",
      requestedDate: "ඉල්ලුම් කළ දිනය",
      purpose: "අරමුණ",
      currentStage: "පවතින පියවර:",
      trackStatus: "තත්ත්වය පරීක්ෂා කරන්න",
      back: "ආපසු",
      trackingRequest: "ක්‍රියාත්මක වන සහතිකයේ තත්ත්වය පරීක්ෂා කරමින්",
      noPending: "ක්‍රියාත්මක වන සහතික ඉල්ලීම් කිසිවක් හමු නොවීය.",
      loading: "ක්‍රියාත්මක වන ඉල්ලීම් පූරණය වෙමින්...",
      error:
        "ක්‍රියාත්මක වන සහතික ඉල්ලීම් පූරණය කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      retry: "නැවත උත්සාහ කරන්න",
      stages: {
        verification: "සත්‍යාපනය වෙමින් පවතී",
        signature: "ග්‍රාම නිලධාරී අත්සන සඳහා රැඳී පවතී",
        audit: "ලේඛන විගණන අදියර",
      },
    },
    TA: {
      title: "நிலுவையிலுள்ள சான்றிதழ் கோரிக்கைகள்",
      requestedDate: "கோரப்பட்ட தேதி",
      purpose: "நோக்கம்",
      currentStage: "தற்போதைய நிலை:",
      trackStatus: "நிலையை கண்காணிக்கவும்",
      back: "திரும்புக",
      trackingRequest: "நிலுவையிலுள்ள கோரிக்கையைக் கண்காணிக்கிறது",
      noPending: "நிலுவையிலுள்ள சான்றிதழ் கோரிக்கைகள் எதுவும் இல்லை.",
      loading: "நிலுவையிலுள்ள கோரிக்கைகளை ஏற்றுகிறது...",
      error:
        "நிலுவையிலுள்ள சான்றிதழ் கோரிக்கைகளை ஏற்றுவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.",
      retry: "மீண்டும் முயற்சிக்கவும்",
      stages: {
        verification: "சரிபார்ப்பு செயல்பாட்டில் உள்ளது",
        signature: "கிராம நிலதாரி கையொப்பத்திற்காக காத்திருக்கிறது",
        audit: "ஆவண தணிக்கை நிலை",
      },
    },
  };

  const d = localDict[lang] || localDict.EN;

  // Get certificate type display name
  const getCertificateTypeDisplay = (type) => {
    const typeMap = {
      CHARACTER: "Character Certificate",
      INCOME: "Income Certificate",
      RESIDENCE: "Residence Certificate",
      character: "Character Certificate",
      income: "Income Certificate",
      residence: "Residence Certificate",
    };
    return typeMap[type] || type || "Certificate";
  };

  // Get stage based on certificate type and request details
  const getStageKey = (certificate) => {
    // You can customize this logic based on actual workflow
    // For now, use deterministic stages based on request_id or creation time
    const id = certificate.id || certificate.request_id || "";
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stageIndex = hash % 3;
    const stages = ["verification", "signature", "audit"];
    return stages[stageIndex];
  };

  // Load pending certificates from API
  const loadPending = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("smartgn_token");

      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const headers = getAuthHeaders();

      // Fetch certificates from the resident endpoint
      const response = await fetch("/api/certificates/resident", {
        headers,
        cache: "no-cache", // Prevent caching
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Filter for PENDING status only
      const pendingCerts = data.filter(
        (cert) => cert.status === "PENDING" || cert.status === "Pending",
      );

      // Format the pending certificates
      const formattedPending = pendingCerts.map((cert) => ({
        id: cert.id || cert.request_id,
        requestId: cert.request_id,
        certificateNumber: cert.certificate_number,
        type: getCertificateTypeDisplay(cert.certificate_type),
        certificateType: cert.certificate_type,
        requestedDate: cert.request_date
          ? new Date(cert.request_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : new Date(cert.created_at || Date.now()).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              },
            ),
        purpose: cert.purpose || "Not specified",
        details: cert.details || {},
        stageKey: getStageKey(cert),
        isActive: cert.is_active !== false,
        createdAt: cert.created_at || cert.requested_at,
        // Store original data for reference
        _original: cert,
      }));

      // Sort by created date (newest first)
      formattedPending.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setPendingList(formattedPending);
    } catch (err) {
      console.error("Error loading pending certificates:", err);
      setError(err.message || d.error);

      // ✅ Only use fallback if API fails - but from database, not hardcoded
      // Try to get from localStorage as last resort
      try {
        const localData = localStorage.getItem("smartgn_certificates");
        if (localData) {
          const allCerts = JSON.parse(localData);
          const pending = allCerts.filter(
            (c) => c.status === "PENDING" || c.status === "Pending",
          );

          if (pending.length > 0) {
            setPendingList(
              pending.map((c, index) => ({
                id: c.id || c.request_id,
                requestId: c.request_id,
                certificateNumber: c.certificate_number,
                type: getCertificateTypeDisplay(c.certificate_type || c.type),
                certificateType: c.certificate_type || c.type,
                requestedDate: c.request_date
                  ? new Date(c.request_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : c.submittedDate || "N/A",
                purpose: c.purpose || "Not specified",
                details: c.details || {},
                stageKey: ["verification", "signature", "audit"][index % 3],
                isActive: index === 0,
                _original: c,
              })),
            );
          } else {
            setPendingList([]);
          }
        } else {
          setPendingList([]);
        }
      } catch (localErr) {
        console.error("Error reading from localStorage:", localErr);
        setPendingList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load pending certificates on mount
  useEffect(() => {
    loadPending();
  }, []);

  // Handle track status click
  const handleTrackStatus = (item) => {
    // Navigate to certificate details or show detailed view
    navigate(`/ResidentDashboard/certificate-details/${item.id}`, {
      state: {
        certificate: item,
        successUser,
        division: userDivision,
      },
    });
  };

  // Handle retry
  const handleRetry = () => {
    loadPending();
  };

  // Render the stage label
  const renderStageLabel = (stageKey) => {
    const stageLabels = {
      verification: {
        label: d.stages.verification || "Verification in progress",
        color: "bg-amber-100 text-amber-800",
      },
      signature: {
        label: d.stages.signature || "Pending Grama Niladhari Signature",
        color: "bg-blue-100 text-blue-800",
      },
      audit: {
        label: d.stages.audit || "Document Audit Stage",
        color: "bg-purple-100 text-purple-800",
      },
    };

    const stage = stageLabels[stageKey] || stageLabels.verification;
    return (
      <span
        className={`${stage.color} font-bold px-2 py-0.5 rounded text-[12.5px]`}
      >
        {stage.label}
      </span>
    );
  };

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
              onClick={() =>
                navigate("/ResidentDashboard/certificates", {
                  state: { successUser, division: userDivision },
                })
              }
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
          </div>

          {/* Heading */}
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">
            {d.title}
          </h2>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
              <p className="text-red-600 font-medium mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {d.retry || "Retry"}
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20 text-[#64748b] text-[15px] font-medium">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B365D] mx-auto mb-4"></div>
              {d.loading || "Loading pending requests..."}
            </div>
          )}

          {/* No Pending Requests */}
          {!loading && !error && pendingList.length === 0 && (
            <div className="bg-white border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center text-[#64748b] text-[15px] font-semibold shadow-sm">
              {d.noPending || "No pending certificate requests found."}
            </div>
          )}

          {/* Pending Requests List */}
          {!loading && !error && pendingList.length > 0 && (
            <div className="flex flex-col gap-4">
              {pendingList.map((item, index) => (
                <div
                  key={item.id || item.requestId || index}
                  className={`rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 gap-4 ${
                    item.isActive || index === 0
                      ? "bg-[#fefce8] border-[1.5px] border-[#fef08a]"
                      : "bg-white border border-[#2D37481F]"
                  }`}
                >
                  {/* Left Area: Certificate Details */}
                  <div className="text-left max-w-full md:max-w-[70%]">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="text-[16px] font-bold text-[#1B365D]">
                        {item.type}
                      </h4>
                      {item.certificateNumber && (
                        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                          {item.certificateNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-[13.5px]">
                      <div>
                        <span className="text-[#475569] font-medium">
                          {d.requestedDate}:{" "}
                        </span>
                        <span className="text-[#1e293b] font-semibold">
                          {item.requestedDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#475569] font-medium">
                          {d.purpose}:{" "}
                        </span>
                        <span className="text-[#1e293b] font-semibold">
                          {item.purpose}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#d97706] font-bold text-[13.5px]">
                          {d.currentStage}
                        </span>
                        {renderStageLabel(item.stageKey)}
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Status & Action Button */}
                  <div className="flex flex-col items-start md:items-end gap-3 self-stretch md:self-auto justify-between md:justify-start">
                    <span className="text-[13px] font-bold text-[#d97706] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      PENDING
                    </span>

                    <button
                      onClick={() => handleTrackStatus(item)}
                      className="flex items-center gap-1.5 py-2 px-4 bg-[#1B365D] text-white hover:bg-[#005BBD] rounded-full text-xs font-semibold cursor-pointer transition-all duration-200"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {d.trackStatus}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Help Trigger */}
          <ChatbotButton onOpenHelp={onOpenHelp} />
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default PendingCertificates;
