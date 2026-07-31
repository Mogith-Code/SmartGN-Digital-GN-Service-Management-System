import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import Footer from "../Components/Common/Footer";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";

function OfficerCertificates({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Session user defaults
  const officerIdVal =
    location.state?.officerId ||
    localStorage.getItem("smartgn_user_id") ||
    "200324511540";
  const initialFilter = location.state?.activeFilter || "All";

  // Dynamic Officer Profile State
  const [profile, setProfile] = useState({
    firstName: "Kamal",
    lastName: "Perera",
    fullName: "Dissanayake Mudiyanselage Kamal Perera",
    division: "Colombo, Borella",
    serviceTime: "2",
    email: "Nirmal.Perera@example.com",
    mobile: "0703564478",
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null,
  });

  // Certificates state
  const [certs, setCerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  // Helper for Authorization Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("smartgn_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  // Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("smartgn_officer_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  // Load certificate stats and data
  const loadCertificates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load stats
      const statsResponse = await fetch("/api/certificates/officer/stats", {
        headers: getAuthHeaders(),
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        console.warn("Failed to load stats, using default values");
      }

      // Load certificates list
      const certsResponse = await fetch("/api/certificates/officer", {
        headers: getAuthHeaders(),
      });

      if (!certsResponse.ok) {
        const errorData = await certsResponse.json();
        throw new Error(errorData.error || "Failed to load certificates.");
      }

      const data = await certsResponse.json();
      setCerts(data);

      // Save to localStorage as backup
      localStorage.setItem(
        "smartgn_certificate_requests",
        JSON.stringify(data),
      );
    } catch (err) {
      console.error("API failed, loading from localStorage backup:", err);
      setError(err.message);

      // Fallback to localStorage
      const saved = localStorage.getItem("smartgn_certificate_requests");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCerts(parsed);

        // Calculate stats from saved data
        const pending = parsed.filter((c) => c.status === "Pending").length;
        const approved = parsed.filter((c) => c.status === "Approved").length;
        const rejected = parsed.filter((c) => c.status === "Rejected").length;
        setStats({ pending, approved, rejected, total: parsed.length });
      } else {
        // No data available
        setCerts([]);
        setStats({ pending: 0, approved: 0, rejected: 0, total: 0 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Approve action
  const handleApprove = async (id, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        `Are you sure you want to approve certificate request ${id}?`,
      )
    ) {
      return;
    }

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

      alert(`Certificate request ${id} approved successfully.`);
      await loadCertificates(); // Reload data
    } catch (err) {
      console.error("Error approving certificate:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Reject action
  const handleReject = async (id, e) => {
    e.stopPropagation();

    const reason = window.prompt(
      `Enter rejection reason for certificate request ${id}:`,
      "Insufficient documentation",
    );

    if (reason === null) return; // User cancelled

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason: reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject certificate.");
      }

      alert(`Certificate request ${id} has been rejected.`);
      await loadCertificates(); // Reload data
    } catch (err) {
      console.error("Error rejecting certificate:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Load more requests
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, filteredCerts.length));
  };

  // Filter & Search logic
  const filteredCerts = certs.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.nic || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "All") return matchesSearch;
    return matchesSearch && c.status === filterStatus;
  });

  // Status badge color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1">
          <div className="hidden md:block bg-white">
            <OSidebar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B365D] mx-auto"></div>
              <p className="mt-4 text-[#475569]">Loading certificates...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Header */}
      <OfficerNavbar />

      {/* Main Dashboard Layout */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar Nav */}
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Header with Filter Buttons */}
          <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
            <span className="text-xl md:text-2xl font-medium text-[#1B365D]">
              Certificate Approval
            </span>

            {/* Filter Buttons */}
            <div className="flex gap-2 bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-[13px] font-bold rounded-md border-0 cursor-pointer transition-all duration-150 ${
                    filterStatus === status
                      ? "bg-white text-[#1B365D] shadow-sm"
                      : "bg-transparent text-[#64748b] hover:text-[#1e293b]"
                  }`}
                >
                  {status}{" "}
                  {status !== "All" && `(${stats[status.toLowerCase()] || 0})`}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 m-[30px]">
            <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b] font-medium">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-[#1B365D]">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#EBF8FF] flex items-center justify-center text-[#1B365D]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b] font-medium">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b] font-medium">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.approved}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b] font-medium">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Search Box Row */}
          <div className="mb-[30px] mx-[30px]">
            <div className="flex items-center gap-4 p-4 bg-white border border-[#cbd5e1] rounded-2xl shadow-sm">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search residents by name, NIC, or tracking ID..."
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

              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#cbd5e1] bg-white text-[#475569] hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                aria-label="Refresh"
                onClick={loadCertificates}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M1 4v6h6"></path>
                  <path d="M23 20v-6h-6"></path>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p className="font-medium">Error loading data:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Certificates List */}
          <div className="flex flex-col gap-4 mb-[30px] mx-[30px]">
            {filteredCerts.length === 0 ? (
              <div className="flex items-center justify-center p-12 bg-white border border-[#cbd5e1] rounded-2xl text-[#64748b] text-[15px]">
                {searchQuery
                  ? "No certificate requests match the selected search criteria."
                  : "No certificate requests found. All caught up!"}
              </div>
            ) : (
              filteredCerts.slice(0, visibleCount).map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    navigate(`/dashboard/officer/certificates/${item.id}`, {
                      state: {
                        successUser: `${profile.firstName} ${profile.lastName}`,
                        officerId: officerIdVal,
                      },
                    })
                  }
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-[#cbd5e1] rounded-2xl p-4 md:p-6 shadow-sm hover:border-[#D69E2E] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  {/* Left: Info Card */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Icon */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EBF8FF] flex items-center justify-center text-[#1B365D] flex-shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-[15px] md:text-[17px] font-bold text-[#1B365D] m-0 truncate">
                          {item.type || "Certificate"}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] md:text-[13.5px] text-[#475569]">
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
                          <strong className="truncate max-w-[120px]">
                            {item.name}
                          </strong>
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
                          </svg>
                          <span className="truncate max-w-[100px]">
                            {item.nic}
                          </span>
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
                          {item.submittedDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-0.5 truncate">
                        {item.purpose}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div
                    className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.status === "Pending" ? (
                      <>
                        <button
                          onClick={(e) => handleApprove(item.id, e)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 px-4 py-2 rounded-full text-[12px] md:text-[13.5px] font-bold cursor-pointer flex items-center gap-1 transition-colors duration-150 flex-1 sm:flex-none"
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
                          className="bg-transparent hover:bg-red-50 text-red-600 border border-red-600 px-4 py-2 rounded-full text-[12px] md:text-[13.5px] font-bold cursor-pointer flex items-center gap-1 transition-colors duration-150 flex-1 sm:flex-none"
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
                                successUser: `${profile.firstName} ${profile.lastName}`,
                                officerId: officerIdVal,
                              },
                            },
                          )
                        }
                        className="bg-transparent hover:bg-gray-50 text-[#475569] border border-[#cbd5e1] px-4 py-2 rounded-full text-[12px] md:text-[13px] font-semibold cursor-pointer flex-1 sm:flex-none"
                      >
                        View Details ➔
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
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

      {/* Help Button */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default OfficerCertificates;
