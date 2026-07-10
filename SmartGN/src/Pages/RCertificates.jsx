import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";

function ResidentCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("smartgn_token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };
      const response = await fetch("/api/certificates/resident", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to load certificates.");
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error(
        "API Connection failed, loading standalone mock certificates:",
        err,
      );
      // Standalone mockup data fallback
      const localData = localStorage.getItem("smartgn_certificates");
      if (localData) {
        setRequests(JSON.parse(localData));
      } else {
        const mockCertificates = [
          {
            request_id: 1,
            certificate_type: "CHARACTER",
            purpose: "Job Application",
            status: "PENDING",
          },
          {
            request_id: 2,
            certificate_type: "INCOME",
            purpose: "Higher Education Scholarship",
            status: "APPROVED",
          },
          {
            request_id: 3,
            certificate_type: "CHARACTER",
            purpose: "Visa Application",
            status: "REJECTED",
          },
        ];
        localStorage.setItem(
          "smartgn_certificates",
          JSON.stringify(mockCertificates),
        );
        setRequests(mockCertificates);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* 1. Header */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>
      </div>

      {/* 2. Main Layout */}
      <div className="flex flex-1 w-full">
        {/* Sidebar Nav */}
        <RSidebar />

        {/* Main Panel Content */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto relative">
          {/* Heading */}
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">
            Certificates
          </h2>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Pending */}
            <div
              className="bg-white border border-[#2D37481F] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-2 hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer"
              onClick={() =>
                navigate("/dashboard/resident/certificates/pending", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center self-start">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-[#718096] text-left">
                Pending certificate requests
              </span>
              <span className="text-[28px] font-extrabold text-[#1B365D] text-left">
                {pendingCount}
              </span>
            </div>

            {/* Card 2: Approved */}
            <div
              className="bg-white border border-[#2D37481F] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-2 hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer"
              onClick={() =>
                navigate("/dashboard/resident/certificates/approved", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center self-start">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-[#718096] text-left">
                Approved certificate requests
              </span>
              <span className="text-[28px] font-extrabold text-[#1B365D] text-left">
                {approvedCount}
              </span>
            </div>

            {/* Card 3: Rejected */}
            <div
              className="bg-white border border-[#2D37481F] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-2 hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer"
              onClick={() =>
                navigate("/dashboard/resident/certificates/rejected", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center self-start">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-[#718096] text-left">
                Rejected certificate requests
              </span>
              <span className="text-[28px] font-extrabold text-[#1B365D] text-left">
                {rejectedCount}
              </span>
            </div>
          </div>

          {/* Request Types Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            <h3 className="text-[17px] font-bold text-[#1B365D] mb-4 text-left">
              Certificate types you can request
            </h3>

            <div className="flex flex-col gap-4">
              {/* Type 1: Character Certificates */}
              <div className="flex justify-between items-center py-2">
                <span className="text-[14.5px] font-semibold text-[#2D3748] text-left">
                  Character certificates
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[14px] cursor-pointer transition-colors duration-200"
                  onClick={() =>
                    navigate(
                      "/dashboard/resident/certificates/apply-character",
                      { state: { successUser, division: userDivision } },
                    )
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
                  Apply here
                </span>
              </div>

              {/* Type 2: Income Certificates */}
              <div className="flex justify-between items-center py-4 border-t border-[#fedc9b] mt-2">
                <span className="text-[14.5px] font-semibold text-[#2D3748] text-left">
                  Income certificates
                </span>
                <span
                  className="flex items-center gap-1 text-[#D69E2E] hover:text-[#FFAA00] font-bold text-[14px] cursor-pointer transition-colors duration-200"
                  onClick={() =>
                    navigate("/dashboard/resident/certificates/apply-income", {
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
                    className="mr-1"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Apply here
                </span>
              </div>
            </div>
          </div>

          {/* Requested Status Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            <h3 className="text-[17px] font-bold text-[#1B365D] mb-4 text-left">
              Requested certificates status
            </h3>

            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="text-center py-5 text-[#64748b] text-[14px]">
                  Loading requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl text-[#64748b] text-[13px] font-semibold">
                  No certificate requests registered to your account yet.
                </div>
              ) : (
                requests.map((req) => (
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
                        {req.certificate_type.toLowerCase()} Certificate
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-left">
                      <span className="text-[13px] text-[#64748b]">
                        Purpose: {req.purpose}
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
            </div>
          </div>

          {/* Floating Help Trigger */}
          <button
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
            aria-label="Help Trigger"
            onClick={() =>
              onOpenHelp ? onOpenHelp() : console.log("Help clicked")
            }
          >
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default ResidentCertificates;
