import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import totalPendingIcon from "../assets/pending_actions_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import totalapprovedIcon from "../assets/assignment_turned_in_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import upcomingIcon from "../assets/event_upcoming_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function ResidentAllowances({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    fullName: "Dissanayake Mudiyanselage Nimal Perera",
    nic: "200324511540",
    occupation: "Farmer",
    email: "Nimal.Perera@example.com",
    mobile: "0703564478",
    address: "123 Main Street, Colombo",
    division: "Colombo, Borella",
    dob: "28/05/2000",
    gender: "Male",
    householdNumber: "123456",
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
  });

  // Retrieve username and division from navigation state if available
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";
  const applicantNic =
    localStorage.getItem("smartgn_user_id") || "200324511540";

  // Allowance Requests State
  const [requests, setRequests] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field States
  const [applicantName, setApplicantName] = useState(successUser);
  const [applicantNicState, setApplicantNicState] = useState(applicantNic);
  const [purpose, setPurpose] = useState("For certify residence");
  const [income, setIncome] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Secure Bank Details State
  const [bankName, setBankName] = useState("Bank of Ceylon");
  const [bankBranch, setBankBranch] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountHolder, setAccountHolder] = useState(successUser);

  const loadRequests = async () => {
    try {
      const response = await fetch("/api/allowances/resident", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to load allowance requests.");
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
          program: item.allowance_type,
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
          income: item.cleared_amount || "",
          remarks: item.income_details || "",
        };
      });
      setRequests(formatted);
    } catch (err) {
      console.error(err);
      const saved = localStorage.getItem("smartgn_allowance_requests");
      if (saved) setRequests(JSON.parse(saved));
    }
  };

  // Load requests on mount
  useEffect(() => {
    // Attempt to load from profile for names/NIC pre-fill
    const savedProfile = localStorage.getItem("smartgn_resident_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setApplicantName(
        parsed.fullName || `${parsed.firstName} ${parsed.lastName}`,
      );
      setApplicantNicState(parsed.nic || applicantNic);
      setAccountHolder(
        parsed.fullName || `${parsed.firstName} ${parsed.lastName}`,
      );
    }
    loadRequests();
  }, []);

  // Calculate dynamic stats
  const pendingCount = requests.filter(
    (item) => item.status === "Pending",
  ).length;
  const approvedCount = requests.filter(
    (item) => item.status === "Approved",
  ).length;
  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected",
  ).length;

  // Trigger Modal Open with pre-selected program
  const handleOpenApply = (programName) => {
    setSelectedProgram(programName);
    setErrorMessage("");
    setIncome("");
    setRemarks("");
    setBankBranch("");
    setBankAccount("");
    setIsModalOpen(true);
  };

  // Handle Application Submit
  const handleConfirmApplication = async (e) => {
    e.preventDefault();

    if (!income) {
      setErrorMessage("Please enter your estimated monthly household income.");
      return;
    }

    if (!bankBranch || !bankAccount) {
      setErrorMessage("Please enter your complete bank account details.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("/api/allowances/apply", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          allowanceType: selectedProgram,
          incomeDetails: `Household Monthly Income: LKR ${income}. Purpose: ${purpose}. Remarks: ${remarks}`,
          bankDetails: {
            bankName,
            branch: bankBranch,
            accountNumber: bankAccount,
            accountHolderName: accountHolder,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application.");
      }

      const resData = await response.json();
      setIsModalOpen(false);
      loadRequests();
      alert(
        `Application for ${selectedProgram} submitted successfully! Your secure tracking ID is ${resData.allowanceId}.`,
      );
    } catch (err) {
      setErrorMessage(err.message || "Error submitting application.");
    }
  };

  const cards = [
    {
      id: 1,
      icon: totalPendingIcon,
      title: "Pending Requests",
      count: pendingCount,
    },
    {
      id: 2,
      icon: totalapprovedIcon,
      title: "Approved Requests",
      count: approvedCount,
    },
    {
      id: 3,
      icon: upcomingIcon,
      title: "Rejected Requests",
      count: rejectedCount,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Back button */}
          <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
            <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]  ">
              Allowance Programs
            </h2>

            <div className="flex justify-end -mt-[70px]">
              {/* Alert Banner */}
              {showAlert && !profile.nicFront && !profile.nicBack && (
                <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1 ">
                  <div className="flex items-center gap-2">
                    <span>
                      Please upload a high-quality image of your National
                      Identity Card
                    </span>
                  </div>
                  <button
                    className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1"
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

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left m-[30px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D]"
              >
                <img src={card.icon} alt="card icon" className="w-[50px]" />

                <div className="flex flex-col items-center">
                  <span className="text-[16px] font-regular text-[#2D3748] text-center">
                    {card.title}
                  </span>

                  <span className="text-[20px] font-medium text-[#2D3748]">
                    {card.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Program Request list */}
          <div className="bg-white border border-[#2D37482D] rounded-2xl p-6 text-left mx-[30px]">
            <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-6">
              Available Allowance Programs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Aswesuma",
                  desc: "Social safety net program aiming to help low-income families.",
                  icon: "🇱🇰",
                },
                {
                  name: "Samurdhi",
                  desc: "National welfare initiative designed to alleviate poverty.",
                  icon: "🌾",
                },
                {
                  name: "Elderly Support",
                  desc: "Financial assistance for senior citizens above the age of 70.",
                  icon: "👵",
                },
                {
                  name: "Disability Allowance",
                  desc: "Financial relief support to assist differently-abled citizens.",
                  icon: "♿",
                },
                {
                  name: "Kidney Disease Support",
                  desc: "Welfare fund targeting medical support for kidney patients.",
                  icon: "🩺",
                },
              ].map((prog) => (
                <div
                  key={prog.name}
                  className="flex flex-col justify-between p-5 bg-[#F8FAFC] border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{prog.icon}</span>
                      <span className="bg-[#1B365D]/10 text-[#1B365D] text-xs px-2.5 py-1 rounded-full font-bold">
                        LKR Cleared
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#1B365D] mb-2">
                      {prog.name}
                    </h4>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                      {prog.desc}
                    </p>
                  </div>
                  <button
                    className="w-full mt-auto bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 border-0 cursor-pointer transition-colors text-sm"
                    onClick={() => handleOpenApply(prog.name)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* History tracking status */}
          <div className="bg-white border border-[#2D37482D] rounded-2xl p-6 text-left m-[30px]">
            <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-6">
              Application & Payment History
            </h3>

            {requests.length === 0 ? (
              <div className="py-8 text-center text-gray-500 font-medium text-sm">
                No allowance applications submitted yet.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {requests.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0 flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[#005BBD] text-lg mt-0.5">★</span>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-[#1a2e56] text-base">
                            {item.program}
                          </span>
                          <span className="text-xs text-[#64748b] mt-1">
                            Purpose: {item.purpose}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border
                          ${
                            item.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "Rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.status === "Approved" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                          {item.status === "Rejected" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                          {item.status === "Pending" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 14 12"></polyline>
                            </svg>
                          )}
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {item.status === "Approved" &&
                      item.paymentStatus === "Paid" && (
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-start gap-4 text-left transition-all">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                          <div className="text-xs sm:text-sm text-[#065f46] leading-relaxed">
                            <strong className="block text-emerald-800 font-bold mb-1">
                              Secure Allowance Funds Disbursed
                            </strong>
                            Your Grama Niladhari office has securely transferred{" "}
                            <strong className="font-bold">
                              Rs.{" "}
                              {item.paymentAmount
                                ? parseFloat(
                                    item.paymentAmount,
                                  ).toLocaleString()
                                : "5,000"}
                              .00
                            </strong>{" "}
                            to your verified{" "}
                            <strong className="font-bold">
                              {item.bankDetails?.bankName} (
                              {item.bankDetails?.accountNumber})
                            </strong>{" "}
                            account on{" "}
                            <span className="font-medium">
                              {item.paymentTransferredAt}
                            </span>
                            . Transaction Reference:{" "}
                            <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-xs">
                              {item.paymentTransactionRef}
                            </code>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#2D37482D] rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl flex flex-col my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">
                Apply for {selectedProgram}
              </h3>
              <button
                className="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close form"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleConfirmApplication}
              className="mt-6 flex flex-col gap-4 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="modalApplicantName"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    id="modalApplicantName"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalNic"
                    className="text-xs font-bold text-[#475569]"
                  >
                    NIC Number
                  </label>
                  <input
                    type="text"
                    id="modalNic"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    value={applicantNicState}
                    onChange={(e) => setApplicantNicState(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalPurpose"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Application Purpose
                  </label>
                  <select
                    id="modalPurpose"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  >
                    <option value="For certify residence">
                      For certify residence
                    </option>
                    <option value="For income verification">
                      For income verification
                    </option>
                    <option value="For livelihood support">
                      For livelihood support
                    </option>
                    <option value="For medical support">
                      For medical support
                    </option>
                    <option value="For emergency disaster relief">
                      For emergency disaster relief
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalIncome"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Monthly Household Income (LKR)
                  </label>
                  <input
                    type="number"
                    id="modalIncome"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    placeholder="e.g. 45000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="modalRemarks"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Remarks / Supportive details
                  </label>
                  <textarea
                    id="modalRemarks"
                    rows="2"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all resize-none"
                    placeholder="Briefly state the reason you qualify..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                {/* Secure Account Details */}
                <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
                  <h4 className="margin-0 text-sm font-bold text-[#1B365D] mb-3">
                    Payment Account Details (For secured money transfers)
                  </h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalBankName"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Bank Name
                  </label>
                  <select
                    id="modalBankName"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  >
                    <option value="Bank of Ceylon">Bank of Ceylon</option>
                    <option value="People's Bank">People's Bank</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="Hatton National Bank">
                      Hatton National Bank
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalBankBranch"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Branch
                  </label>
                  <input
                    type="text"
                    id="modalBankBranch"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    placeholder="e.g. Colombo 03"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalBankAccount"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="modalBankAccount"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    placeholder="e.g. 1023456789"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalAccountHolder"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="modalAccountHolder"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    placeholder="e.g. Nimal Perera"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    required
                  />
                </div>

                {/* Upload File */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 text-left">
                  <label className="text-xs font-bold text-[#475569]">
                    Attach Supporting Documents (Income cert/NIC copy)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F8FAFC]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span className="text-xs text-gray-500 font-medium">
                      Upload supportive document (.pdf, .jpg)
                    </span>
                    <input type="file" className="hidden" id="supportDocFile" />
                    <label
                      htmlFor="supportDocFile"
                      className="bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] text-xs font-bold py-1.5 px-3 rounded-lg border-0 cursor-pointer"
                    >
                      Choose file
                    </label>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <p className="text-rose-500 text-xs font-semibold m-0 text-left">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm"
                >
                  Confirm Application
                </button>
              </div>
            </form>
          </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ResidentAllowances;
