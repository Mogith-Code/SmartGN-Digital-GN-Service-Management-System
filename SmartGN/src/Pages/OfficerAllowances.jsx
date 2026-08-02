import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import { addNotification } from "../utils/notifications";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function OfficerAllowances({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Ref for scrolling to top
  const topRef = useRef(null);

  // Session user defaults
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Kamal Perera";
  const officerIdVal =
    location.state?.officerId ||
    localStorage.getItem("smartgn_user_id") ||
    "200324511540";

  // States
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Bank transfer simulation states
  const [verifyingBankId, setVerifyingBankId] = useState(null);
  const [bankVerifiedMap, setBankVerifiedMap] = useState({});
  const [transferringId, setTransferringId] = useState(null);
  const [transferStep, setTransferStep] = useState(0);
  const [transferAmount, setTransferAmount] = useState("5000");

  // Receipt Modal State
  const [showReceiptId, setShowReceiptId] = useState(null);
  const [receiptRequest, setReceiptRequest] = useState(null);

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  // Close error message
  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  // Close reject reason modal
  const closeRejectReasonModal = () => {
    setShowRejectReasonModal(false);
    setRejectReason("");
    setConfirmId(null);
  };

  // Map database values to display names
  const getDisplayAllowanceType = (dbValue) => {
    const displayMap = {
      Aswesuma: "Aswesuma",
      Samurdhi: "Samurdhi",
      Elderly: "Elderly",
      Disability: "Disability",
      Kidney: "Kidney Disease",
    };
    return displayMap[dbValue] || dbValue;
  };

  const loadRequests = async () => {
    try {
      const response = await fetch("/api/allowances/officer", {
        headers: getAuthHeaders(),
      });
      if (!response.ok)
        throw new Error("Failed to load allowance requests queue.");
      const data = await response.json();
      const formatted = data.map((item) => {
        let bankDetailsObj = null;
        try {
          bankDetailsObj =
            typeof item.bank_details === "string"
              ? JSON.parse(item.bank_details)
              : item.bank_details;
        } catch (e) {
          bankDetailsObj = item.bank_details;
        }

        return {
          id: item.allowance_id,
          program: getDisplayAllowanceType(item.allowance_type),
          purpose: item.income_details
            ? item.income_details.substring(0, 100)
            : "",
          status:
            item.status === "PENDING"
              ? "Pending"
              : item.status === "APPROVED"
                ? "Approved"
                : "Rejected",
          bankDetails: bankDetailsObj,
          paymentStatus: item.payment_status === "PAID" ? "Paid" : "Unpaid",
          paymentAmount: item.cleared_amount,
          paymentTransferredAt: item.cleared_time
            ? new Date(item.cleared_time).toLocaleString()
            : "",
          paymentTransactionRef: item.txn_reference,
          applicantName: item.resident_name || "Resident",
          nic: item.resident_nic,
          income: item.income_details || "",
          submittedDate: item.application_date
            ? new Date(item.application_date).toISOString().split("T")[0]
            : "2026-05-15",
        };
      });
      setRequests(formatted);
    } catch (err) {
      console.error(err);
      const saved = localStorage.getItem("smartgn_allowance_requests");
      if (saved) setRequests(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Get counts for each status
  const getStatusCounts = () => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { total, pending, approved, rejected };
  };

  const counts = getStatusCounts();

  // Open confirm modal for approve
  const openApproveConfirm = (id, e) => {
    e.stopPropagation();
    setConfirmId(id);
    setModalType("approve");
    setModalTitle("Confirm Approval");
    setModalMessage("Are you sure you want to approve this allowance request?");
    setShowConfirmModal(true);
  };

  // Open reject reason modal
  const openRejectReasonModal = (id, e) => {
    e.stopPropagation();
    setConfirmId(id);
    setRejectReason("");
    setShowRejectReasonModal(true);
  };

  // Handle confirm approve
  const handleConfirmApprove = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/allowances/${confirmId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve allowance request.");
      }

      setSuccessMessage(
        `✅ Allowance request ${confirmId} has been Approved successfully!`,
      );
      scrollToTop();
      await loadRequests();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message || "Error approving request.");
      scrollToTop();
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsProcessing(false);
      setConfirmId(null);
      setModalType("");
    }
  };

  // Handle confirm reject with reason
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage("⚠️ Please enter a reason for rejection.");
      scrollToTop();
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    setShowRejectReasonModal(false);
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/allowances/${confirmId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason: rejectReason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject allowance request.");
      }

      setSuccessMessage(
        `❌ Allowance request ${confirmId} has been Rejected. Reason: ${rejectReason}`,
      );
      scrollToTop();
      await loadRequests();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message || "Error rejecting request.");
      scrollToTop();
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsProcessing(false);
      setConfirmId(null);
      setRejectReason("");
    }
  };

  // Close confirm modal
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmId(null);
    setModalType("");
  };

  // Mock Bank Account Verification
  const handleVerifyBank = (id, applicantName, e) => {
    e.stopPropagation();
    setVerifyingBankId(id);
    setTimeout(() => {
      setBankVerifiedMap((prev) => ({ ...prev, [id]: true }));
      setVerifyingBankId(null);
      setSuccessMessage(
        `✅ Bank Account Registry verified successfully for ${applicantName}!`,
      );
      scrollToTop();
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    }, 1000);
  };

  // Secure cleared transfer simulation
  const handleSecureTransfer = (id, item, e) => {
    e.stopPropagation();
    if (!bankVerifiedMap[id]) {
      setErrorMessage(
        "⚠️ Please verify the bank account registry with the Central Bank registry first.",
      );
      scrollToTop();
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setTransferringId(id);
    setTransferStep(1);

    setTimeout(() => {
      setTransferStep(2);

      setTimeout(() => {
        setTransferStep(3);

        setTimeout(async () => {
          try {
            const response = await fetch(`/api/allowances/${id}/disburse`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({
                disburseAmount: parseFloat(transferAmount),
              }),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to disburse funds.");
            }

            const resData = await response.json();
            await loadRequests();
            setTransferringId(null);
            setTransferStep(0);

            // Dispatch real-time notifications
            addNotification("resident", {
              type: "allowance",
              title: "Allowance Funds Disbursed",
              message: `Your LKR ${transferAmount} allowance payment for ${item.program} has been processed. (Ref: ${resData.transaction.txnRef})`,
              link: "/ResidentDashboard/allowances",
            });

            addNotification("admin", {
              type: "allowance",
              title: "Allowance Payment Cleared",
              message: `RTGS funds transfer of LKR ${transferAmount} completed for ${item.program}.`,
              link: "/admin",
            });

            setSuccessMessage(
              `✅ RTGS Secure Funds Disbursed successfully. Amount: LKR ${transferAmount}`,
            );
            scrollToTop();
            setTimeout(() => {
              setSuccessMessage("");
            }, 5000);

            const completedItem = {
              id: id,
              program: item.program,
              status: "Approved",
              paymentStatus: "Paid",
              paymentAmount: resData.transaction.amount,
              paymentTransferredAt: new Date(
                resData.transaction.timestamp,
              ).toLocaleString(),
              paymentTransactionRef: resData.transaction.txnRef,
              applicantName: item.applicantName,
              bankDetails: item.bankDetails,
            };
            setReceiptRequest(completedItem);
            setShowReceiptId(id);
          } catch (err) {
            setErrorMessage(err.message || "Error disbursing allowance funds.");
            scrollToTop();
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
            setTransferringId(null);
            setTransferStep(0);
          }
        }, 800);
      }, 1000);
    }, 800);
  };

  // View existing receipt
  const viewReceipt = (item, e) => {
    e.stopPropagation();
    setReceiptRequest(item);
    setShowReceiptId(item.id);
  };

  // Filter & Search logic
  const filteredRequests = requests.filter((r) => {
    const applicant =
      r.applicantName || r.bankDetails?.accountHolderName || "Resident";
    const matchesSearch =
      applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.id).includes(searchQuery);

    if (filterStatus === "All") return matchesSearch;
    return matchesSearch && r.status === filterStatus;
  });

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Officer Navbar */}
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Officer Sidebar */}
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        {/* Content Panel */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          {/* Top Ref for Scrolling */}
          <div ref={topRef}></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] m-0">
                Allowance Programs Queue
              </h2>
              <p className="text-sm text-[#64748b] mt-1">
                Analyze, verify and securely disburse funds to registered
                allowance applications.
              </p>
            </div>

            {/* Filter Buttons with Counts */}
            <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-gray-200 self-start md:self-auto">
              {[
                { key: "All", label: "All", count: counts.total },
                { key: "Pending", label: "Pending", count: counts.pending },
                { key: "Approved", label: "Approved", count: counts.approved },
                { key: "Rejected", label: "Rejected", count: counts.rejected },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg border-0 cursor-pointer transition-all duration-150 flex items-center gap-1.5
                    ${filterStatus === key ? "bg-white text-[#1B365D] shadow-xs" : "bg-transparent text-gray-500 hover:text-gray-900"}`}
                >
                  {label}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      filterStatus === key
                        ? "bg-[#1B365D]/10 text-[#1B365D]"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
              <button
                onClick={closeSuccessMessage}
                className="text-green-700 hover:text-green-900 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-green-200 transition-colors"
                aria-label="Close success message"
              >
                <svg
                  width="20"
                  height="20"
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

          {/* Error Message */}
          {errorMessage && !successMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{errorMessage}</span>
              </div>
              <button
                onClick={closeErrorMessage}
                className="text-red-700 hover:text-red-900 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-red-200 transition-colors"
                aria-label="Close error message"
              >
                <svg
                  width="20"
                  height="20"
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

          {/* Search Box */}
          <div className="relative mb-6 text-left">
            <input
              type="text"
              placeholder="Search by resident name, program (e.g. Aswesuma) or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              className="absolute left-4 top-3.5"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* List of Applications */}
          <div className="flex flex-col gap-4 text-left">
            {filteredRequests.map((item) => {
              const applicant =
                item.applicantName ||
                item.bankDetails?.accountHolderName ||
                "Resident";
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200
                    ${isExpanded ? "border-[#d97706]/40 shadow-md" : "border-gray-200 shadow-xs hover:border-gray-300"}`}
                >
                  {/* Collapsed Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-5 sm:p-6 flex justify-between items-center cursor-pointer text-left select-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#005BBD] text-xl">★</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="margin-0 text-base font-bold text-[#1B365D]">
                            {item.program}
                          </h4>

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border
                            ${
                              item.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "Rejected"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.status === "Approved" && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border
                              ${item.paymentStatus === "Paid" ? "bg-emerald-500 text-white border-emerald-500" : "bg-amber-500 text-white border-amber-500"}`}
                            >
                              {item.paymentStatus === "Paid"
                                ? "Paid"
                                : "Unpaid"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            Applicant:{" "}
                            <strong className="text-gray-700">
                              {applicant}
                            </strong>
                          </span>
                          <span>
                            NIC:{" "}
                            <strong className="text-gray-700">
                              {item.nic || "200324511540"}
                            </strong>
                          </span>
                          <span>
                            Submitted:{" "}
                            <strong className="text-gray-700">
                              {item.submittedDate}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-lg text-gray-400 font-bold transition-transform duration-200">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-8 sm:pb-8 border-t border-gray-100 bg-[#F8FAFC]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                        {/* Left Column details */}
                        <div className="flex flex-col gap-4">
                          <h4 className="text-sm font-bold text-[#1B365D] border-b border-gray-200 pb-1.5">
                            Application Information
                          </h4>

                          <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-700">
                            <div>
                              <span className="font-semibold text-gray-400">
                                Purpose:
                              </span>{" "}
                              {item.purpose}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-400">
                                Monthly Household Income:
                              </span>{" "}
                              LKR{" "}
                              {parseFloat(
                                item.income || "20000",
                              ).toLocaleString()}
                              .00
                            </div>
                            <div>
                              <span className="font-semibold text-gray-400">
                                Remarks:
                              </span>{" "}
                              {item.remarks || "No remarks provided."}
                            </div>

                            {/* PDF Document Viewer Card */}
                            <div className="mt-3">
                              <span className="block text-xs font-bold text-gray-400 mb-2">
                                Supporting PDF Document:
                              </span>
                              <div
                                onClick={() => {
                                  setSuccessMessage(
                                    `🔍 Secure document viewer for SmartGN-AL-${item.id}... Verified CBSL Signature.`,
                                  );
                                  setTimeout(() => setSuccessMessage(""), 3000);
                                }}
                                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3.5 cursor-pointer hover:border-[#1B365D] transition-colors"
                              >
                                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                                  PDF
                                </div>
                                <div className="flex-1 text-left">
                                  <span className="block font-bold text-gray-800 text-xs sm:text-sm truncate">
                                    Proof_of_Income_Cert.pdf
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    1.4 MB • Certified Statement
                                  </span>
                                </div>
                                <span className="text-[#005BBD] font-bold text-xs flex-shrink-0">
                                  View PDF ➔
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Controls */}
                          {item.status === "Pending" && (
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={(e) =>
                                  openRejectReasonModal(item.id, e)
                                }
                                disabled={isProcessing}
                                className="bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-600 py-2 px-5 rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject Application
                              </button>
                              <button
                                onClick={(e) => openApproveConfirm(item.id, e)}
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-2 px-6 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Approve Application
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right Column bank details & payment clearance */}
                        <div className="lg:border-l lg:border-gray-200 lg:pl-8 flex flex-col gap-4">
                          <h4 className="text-sm font-bold text-[#1B365D] border-b border-gray-200 pb-1.5">
                            Payment & Transfer Console
                          </h4>

                          {item.bankDetails ? (
                            /* Premium Bank Card */
                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">
                                  Verified Payment Account
                                </span>
                                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                                  CBSL Registered
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-700 flex flex-col gap-1.5">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-medium">
                                    Bank Name:
                                  </span>{" "}
                                  <strong className="font-semibold text-gray-800">
                                    {item.bankDetails.bankName}
                                  </strong>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-medium">
                                    Branch:
                                  </span>{" "}
                                  <strong className="font-semibold text-gray-800">
                                    {item.bankDetails.branch}
                                  </strong>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-medium">
                                    A/C Number:
                                  </span>{" "}
                                  <strong className="font-mono text-gray-800">
                                    {item.bankDetails.accountNumber}
                                  </strong>
                                </div>
                                <div className="flex justify-between border-t border-emerald-100 pt-2 mt-1">
                                  <span className="text-gray-400 font-medium">
                                    Account Holder:
                                  </span>{" "}
                                  <strong className="font-semibold text-gray-800">
                                    {item.bankDetails.accountHolderName}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                              Resident has not provided bank account details
                              yet. Money cannot be transferred.
                            </div>
                          )}

                          {/* Bank Actions */}
                          {item.status === "Approved" && item.bankDetails && (
                            <div className="flex flex-col gap-3">
                              {item.paymentStatus === "Unpaid" ? (
                                <>
                                  {!bankVerifiedMap[item.id] ? (
                                    <button
                                      onClick={(e) =>
                                        handleVerifyBank(item.id, applicant, e)
                                      }
                                      disabled={
                                        verifyingBankId === item.id ||
                                        isProcessing
                                      }
                                      className="w-full bg-[#1B365D] hover:bg-[#005BBD] disabled:bg-gray-400 text-white border-0 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {verifyingBankId === item.id
                                        ? "Connecting Central Registry..."
                                        : "🔍 Verify Bank Account Registry"}
                                    </button>
                                  ) : (
                                    <div className="flex flex-col gap-3 text-left">
                                      <div className="text-xs sm:text-sm text-emerald-700 font-bold flex items-center gap-1.5">
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
                                        Bank Account Registry Verified
                                      </div>

                                      {/* Amount select input */}
                                      <div className="flex flex-col gap-1.5">
                                        <label
                                          htmlFor={`amount-${item.id}`}
                                          className="text-xs font-bold text-gray-500"
                                        >
                                          Transfer Amount (LKR)
                                        </label>
                                        <input
                                          type="number"
                                          id={`amount-${item.id}`}
                                          value={transferAmount}
                                          onChange={(e) =>
                                            setTransferAmount(e.target.value)
                                          }
                                          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all w-full bg-white"
                                        />
                                      </div>

                                      {/* Secure Disburse button */}
                                      <button
                                        onClick={(e) =>
                                          handleSecureTransfer(item.id, item, e)
                                        }
                                        disabled={
                                          transferringId === item.id ||
                                          isProcessing
                                        }
                                        className="w-full bg-emerald-600 hover:bg-emerald-750 disabled:bg-gray-400 text-white border-0 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {transferringId === item.id ? (
                                          <span>
                                            {transferStep === 1 &&
                                              "RTGS: Handshaking clearing gateway..."}
                                            {transferStep === 2 &&
                                              "RTGS: Disbursing secure cleared funds..."}
                                            {transferStep === 3 &&
                                              "RTGS: Finalizing transaction records..."}
                                          </span>
                                        ) : (
                                          "🔒 Securely Transfer Funds via RTGS"
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                /* Paid state logs & view receipt trigger */
                                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex flex-col gap-3">
                                  <div className="text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-1.5">
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
                                    Funds successfully Disbursed
                                  </div>
                                  <div className="text-xs text-gray-600 flex flex-col gap-1 text-left">
                                    <div>
                                      Transferred:{" "}
                                      <strong className="text-gray-800">
                                        LKR{" "}
                                        {parseFloat(
                                          item.paymentAmount || "5000",
                                        ).toLocaleString()}
                                        .00
                                      </strong>
                                    </div>
                                    <div>
                                      Cleared Date:{" "}
                                      <strong className="text-gray-800">
                                        {item.paymentTransferredAt}
                                      </strong>
                                    </div>
                                    <div>
                                      Secure Ref:{" "}
                                      <code className="bg-emerald-100 text-emerald-900 px-1 rounded font-mono font-bold">
                                        {item.paymentTransactionRef}
                                      </code>
                                    </div>
                                  </div>

                                  <button
                                    onClick={(e) => viewReceipt(item, e)}
                                    className="bg-transparent border-0 text-[#005BBD] hover:text-[#1B365D] font-bold text-xs cursor-pointer p-0 self-start flex items-center gap-1"
                                  >
                                    🧾 View Payment Receipt
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {item.status !== "Approved" && (
                            <span className="text-xs text-gray-400">
                              Approved requests can clearing secure money
                              transfers instantly.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredRequests.length === 0 && (
              <div className="py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 font-medium">
                No allowance applications match the selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Approve Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">{modalTitle}</h3>
              <button
                onClick={closeConfirmModal}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer bg-transparent border-0"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-6 h-6 text-emerald-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-bold text-emerald-700">
                  Approve Request
                </span>
              </div>
              <p className="text-sm text-gray-600">{modalMessage}</p>
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectReasonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">
                Rejection Reason
              </h3>
              <button
                onClick={closeRejectReasonModal}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer bg-transparent border-0"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this allowance request.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent resize-none h-24"
            />

            {errorMessage && !successMessage && (
              <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={closeRejectReasonModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Portal Secure Transfer Receipt Modal */}
      {showReceiptId && receiptRequest && (
        <div className="fixed inset-0 bg-[#0f172a]/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-500 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl flex flex-col relative text-center">
            {/* Seal */}
            <div className="w-14 h-14 rounded-full border-2 border-amber-600 bg-amber-50/50 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              🇱🇰
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-[#1a2e56] uppercase tracking-wider m-0">
              Central Bank of Sri Lanka
            </h3>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">
              RTGS SECURED CLEARING SYSTEM • SYSTEM RECEIPT
            </span>

            {/* Receipt Details */}
            <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4 my-4 flex flex-col gap-2.5 text-xs text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">
                  Transaction Status:
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  Clearing Settled
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Transaction Ref:
                </span>
                <strong className="font-mono text-gray-800 text-[12px]">
                  {receiptRequest.paymentTransactionRef}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Disbursed Date:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.paymentTransferredAt}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Allowance Program:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.program}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Applicant Name:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.applicantName}
                </strong>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-2.5 mt-0.5">
                <span className="text-gray-400 font-semibold">
                  Destination Bank:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.bankDetails?.bankName}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Branch Office:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.bankDetails?.branch}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">
                  Credit Account:
                </span>
                <strong className="text-gray-800">
                  {receiptRequest.bankDetails?.accountNumber}
                </strong>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3 mt-1.5">
                <span className="text-sm font-bold text-[#1B365D]">
                  Settled Amount:
                </span>
                <strong className="text-[#10b981] text-base font-extrabold">
                  LKR{" "}
                  {parseFloat(
                    receiptRequest.paymentAmount || "5000",
                  ).toLocaleString()}
                  .00
                </strong>
              </div>
            </div>

            {/* Divisional clearances sign */}
            <div className="flex justify-between items-center mb-6 text-left opacity-90">
              <div className="text-[9px] text-gray-400 leading-normal">
                <span className="block font-bold text-gray-600 uppercase">
                  DIVISIONAL CLEARANCE GATEWAY
                </span>
                Colombo Divisional Secretariat, Sri Lanka
              </div>
              <div className="border border-emerald-500 rounded text-emerald-600 text-[9px] font-extrabold px-2 py-0.5 uppercase rotate-[-3deg] tracking-wider flex-shrink-0">
                SmartGN Approved
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSuccessMessage(
                    "📥 Downloading secured CBSL digitally signed receipt...",
                  );
                  setTimeout(() => setSuccessMessage(""), 3000);
                }}
                className="flex-1 bg-white hover:bg-gray-50 text-[#1a2e56] border border-[#1a2e56] py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Download PDF
              </button>

              <button
                onClick={() => {
                  setShowReceiptId(null);
                  setReceiptRequest(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-2 px-4 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Help Trigger */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default OfficerAllowances;
