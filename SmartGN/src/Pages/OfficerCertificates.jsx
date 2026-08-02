import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { encryptId } from "../utils/encryption";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";

function OfficerCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  const officerIdVal =
    location.state?.officerId ||
    localStorage.getItem("smartgn_user_id") ||
    "GN-001";
  const initialFilter = location.state?.activeFilter || "All";

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    division: "",
  });

  const [certs, setCerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("smartgn_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  // Load officer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/officer/profile", {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            fullName: data.full_name || "",
            division: data.division_name || "",
          });
          localStorage.setItem("smartgn_officer_profile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching officer profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const loadCerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/certificates/officer", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load certificates.");
      }
      const data = await response.json();

      const formatted = data.map((item) => ({
        id: item.request_id || item.id,
        type:
          item.certificate_type === "INCOME"
            ? "Income Certificate"
            : "Character Certificate",
        certificate_type: item.certificate_type,
        status:
          item.status === "PENDING"
            ? "Pending"
            : item.status === "APPROVED"
              ? "Approved"
              : "Rejected",
        name: item.resident_name || "Resident",
        purpose: item.purpose,
        submittedDate: item.request_date ? item.request_date.split("T")[0] : "",
        division: item.division || profile.division || "N/A",
        nic: item.resident_nic,
        address: item.resident_address || "",
        details: item.details || {},
      }));

      setCerts(formatted);
    } catch (err) {
      console.error("Error loading certificates:", err);
      setError(err.message);
      setCerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Approve certificate request ${id}?`)) return;

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "APPROVED" }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve certificate.");
      }
      await loadCerts();
      alert(`Certificate request ${id} approved successfully.`);
    } catch (err) {
      console.error("Error approving certificate:", err);
      alert("Failed to approve: " + err.message);
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    const reason = window.prompt(`Enter rejection reason for ${id}:`);
    if (reason === null) return;

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject certificate.");
      }
      await loadCerts();
      alert(`Certificate request ${id} rejected.`);
    } catch (err) {
      console.error("Error rejecting certificate:", err);
      alert("Failed to reject: " + err.message);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, filteredCerts.length));
  };

  const filteredCerts = certs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.nic && c.nic.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterStatus === "All") return matchesSearch;
    return matchesSearch && c.status === filterStatus;
  });

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <div className="flex justify-between text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
            <span>Certificate Approval</span>

            <div className="flex gap-2 bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-[13px] font-bold rounded-md border-0 cursor-pointer transition-all duration-150 ${filterStatus === status
                      ? "bg-white text-[#1B365D] shadow-sm"
                      : "bg-transparent text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                  {status}{" "}
                  {status !== "All" &&
                    `(${certs.filter((c) => c.status === status).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="m-[30px]">
            <div className="flex items-center gap-4 p-4 bg-white border border-[#cbd5e1] rounded-2xl shadow-sm">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, NIC, or tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-[14.5px] rounded-lg border border-[#cbd5e1] bg-white text-[#1e293b] focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 transition-all duration-200"
                />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  className="absolute left-3 top-3"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#64748b] text-[15px] font-medium">
              Loading certificate requests...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 text-[15px] font-medium">
              Error: {error}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mx-[30px]">
              {filteredCerts.slice(0, visibleCount).map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    navigate(`/dashboard/officer/certificates/${item.id}`, {
                      state: {
                        successUser: profile.fullName,
                        officerId: officerIdVal,
                      },
                    })
                  }
                  className="flex justify-between items-center bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm hover:border-[#D69E2E] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#EBF8FF] flex items-center justify-center text-[#1B365D]">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>

                    <div>
                      <div className="flex items-center gap-3.5 mb-1.5">
                        <h4 className="text-[17px] font-bold text-[#1B365D] m-0">
                          {item.type}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${item.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-[#475569]">
                        <span className="flex items-center gap-1.5">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-[#64748b]"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <strong>{item.name}</strong>
                          {item.nic && (
                            <span className="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              NIC: {item.nic}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-[#64748b]"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          Purpose: {item.purpose}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-[#64748b]"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Submitted: {item.submittedDate}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#64748b] mt-1.5 font-semibold">
                        Division: {item.division}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.status === "Pending" ? (
                      <>
                        <button
                          onClick={(e) => handleApprove(item.id, e)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 px-5 py-2.5 rounded-full text-[13.5px] font-bold cursor-pointer flex items-center gap-1.5 transition-colors duration-150"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={(e) => handleReject(item.id, e)}
                          className="bg-transparent hover:bg-red-50 text-red-600 border border-red-600 px-5 py-2.5 rounded-full text-[13.5px] font-bold cursor-pointer flex items-center gap-1.5 transition-colors duration-150"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/officer/certificates/${item.id}`,
                            {
                              state: {
                                successUser: profile.fullName,
                                officerId: officerIdVal,
                              },
                            },
                          )
                        }
                        className="bg-transparent hover:bg-gray-50 text-[#475569] border border-[#cbd5e1] px-5 py-2 rounded-full text-[13px] font-semibold cursor-pointer"
                      >
                        View Details ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredCerts.length === 0 && (
                <div className="flex items-center justify-center p-12 bg-white border border-[#cbd5e1] rounded-2xl text-[#64748b] text-[15px]">
                  No certificate requests match the selected search or filter
                  status.
                </div>
              )}
            </div>
          )}

          {filteredCerts.length > visibleCount && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="bg-[#1B365D] hover:bg-[#005BBD] text-white border-0 px-8 py-3 rounded-full text-[14.5px] font-bold cursor-pointer shadow-md transition-colors duration-150"
              >
                Load More Requests ({filteredCerts.length - visibleCount}{" "}
                remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
  <Footer />
    </div >
  );
}

export default OfficerCertificates;
