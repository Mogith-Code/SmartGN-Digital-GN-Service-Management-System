import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import { addNotification } from "../utils/notifications";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import totalPendingIcon from "../assets/pending_actions_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import totalapprovedIcon from "../assets/assignment_turned_in_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import rejectedIcon from "../assets/cancel_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";

function ResidentAllowances({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  // Ref for scrolling to top
  const topRef = useRef(null);

  const AllowanceTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
      success: "Allowance Application Submitted Successfully!",
      submitting: "Submitting...",
      confirmApplication: "Confirm Application",
      close: "Close",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
      success: "ප්‍රතිලාභ ඉල්ලුම සාර්ථකව ඉදිරිපත් කරන ලදී!",
      submitting: "ඉදිරිපත් කරමින්...",
      confirmApplication: "ඉල්ලුම තහවුරු කරන්න",
      close: "වසන්න",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
      success: "கொடுப்பனவு விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      submitting: "சமர்ப்பிக்கிறது...",
      confirmApplication: "விண்ணப்பத்தை உறுதிப்படுத்தவும்",
      close: "மூடு",
    },
  };

  const t = AllowanceTranslations[lang] || AllowanceTranslations.EN;

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: "Nimal",
    lastName: "Perera",
    fullName: "Dissanayake Mudiyanselage Nimal Perera",
    nic: "",
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
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secure Bank Details State
  const [bankName, setBankName] = useState("Bank of Ceylon");
  const [bankBranch, setBankBranch] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountHolder, setAccountHolder] = useState(successUser);

  // Support Document File State
  const [supportDoc, setSupportDoc] = useState(null);
  const [supportDocName, setSupportDocName] = useState("");

  // Map display names to database ENUM values
  const getDatabaseAllowanceType = (displayName) => {
    const typeMap = {
      Aswesuma: "Aswesuma",
      Samurdhi: "Samurdhi",
      Elderly: "Elderly",
      Disability: "Disability",
      "Kidney Disease": "Kidney",
    };
    return typeMap[displayName] || displayName;
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

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSupportDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSupportDocName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupportDoc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSupportDoc = () => {
    setSupportDoc(null);
    setSupportDocName("");
  };

  // Check if NIC images are missing - used for alert
  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  // Fetch profile to get NIC images
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/residents/profile", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({
            ...prev,
            nic: data.r_nic || "",
            nicFront: data.nic_front_path || null,
            nicBack: data.nic_back_path || null,
          }));

          if (data.nic_front_path && data.nic_back_path) {
            setShowAlert(false);
          } else {
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile for NIC images:", error);
      }
    };

    fetchProfile();
  }, []);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      const fetchUpdatedProfile = async () => {
        try {
          const res = await fetch("/api/residents/profile", {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const data = await res.json();
            setProfile((prev) => ({
              ...prev,
              nic: data.r_nic || "",
              nicFront: data.nic_front_path || null,
              nicBack: data.nic_back_path || null,
            }));

            if (data.nic_front_path && data.nic_back_path) {
              setShowAlert(false);
            }
          }
        } catch (error) {
          console.error("Error refreshing profile:", error);
        }
      };

      fetchUpdatedProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

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
    setSuccessMessage("");
    setIncome("");
    setRemarks("");
    setBankBranch("");
    setBankAccount("");
    setSupportDoc(null);
    setSupportDocName("");
    setIsModalOpen(true);
  };

  // Handle Application Submit
  const handleConfirmApplication = async (e) => {
    e.preventDefault();

    if (!income) {
      setErrorMessage("Please enter your estimated monthly household income.");
      setSuccessMessage("");
      return;
    }

    if (!bankBranch || !bankAccount) {
      setErrorMessage("Please enter your complete bank account details.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const dbAllowanceType = getDatabaseAllowanceType(selectedProgram);

    try {
      const response = await fetch("/api/allowances/apply", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          allowanceType: dbAllowanceType,
          incomeDetails: `Household Monthly Income: LKR ${income}. Purpose: ${purpose}. Remarks: ${remarks}`,
          bankDetails: {
            bankName,
            branch: bankBranch,
            accountNumber: bankAccount,
            accountHolderName: accountHolder,
          },
          supportDoc: supportDoc,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application.");
      }

      const resData = await response.json();

      setIsModalOpen(false);
      setSuccessMessage(`${t.success} Tracking ID: ${resData.allowanceId}`);
      setIsSubmitting(false);
      scrollToTop();

      addNotification("resident", {
        type: "allowance",
        title: "Allowance Application Submitted",
        message: `Your application for ${selectedProgram} has been submitted successfully.`,
        link: "/ResidentDashboard/allowances",
      });

      addNotification("officer", {
        type: "allowance",
        title: "New Allowance Application",
        message: `${applicantName} submitted a new ${selectedProgram} application.`,
        link: "/OfficerDashboard/OfficerAllowances",
      });

      addNotification("admin", {
        type: "allowance",
        title: "Allowance Request Created",
        message: `New ${selectedProgram} allowance request logged for resident ${applicantName}.`,
        link: "/admin",
      });

      await loadRequests();
    } catch (err) {
      setErrorMessage(err.message || "Error submitting application.");
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
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
      icon: rejectedIcon,
      title: "Rejected Requests",
      count: rejectedCount,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <div ref={topRef}></div>

          {/* Alert Banner - Above Header */}
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

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
              Allowance Programs
            </h2>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-[13px] sm:text-[14px] break-words">
                  {successMessage}
                </span>
              </div>
              <button
                onClick={closeSuccessMessage}
                className="text-green-700 hover:text-green-900 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-green-200 transition-colors flex-shrink-0 self-end sm:self-center"
                aria-label="Close success message"
              >
                <svg
                  width="18"
                  height="18"
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
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-[13px] sm:text-[14px] break-words">
                  {errorMessage}
                </span>
              </div>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-700 hover:text-red-900 bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-red-200 transition-colors flex-shrink-0 self-end sm:self-center"
                aria-label="Close error message"
              >
                <svg
                  width="18"
                  height="18"
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

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center border border-[#2D37482D] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200 w-full"
              >
                <img
                  src={card.icon}
                  alt="card icon"
                  className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] object-contain"
                />

                <div className="flex flex-col items-center w-full">
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-regular text-[#2D3748] text-center leading-tight break-words max-w-full px-0.5">
                    {card.title}
                  </span>

                  <span className="text-[18px] sm:text-[20px] font-medium text-[#2D3748]">
                    {card.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Program Request list */}
          <div className="bg-white border border-[#2D37482D] rounded-[10px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 text-left mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-2 sm:pb-3 mb-4 sm:mb-6">
              Available Allowance Programs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
                  name: "Elderly",
                  desc: "Financial assistance for senior citizens above the age of 70.",
                  icon: "👵",
                },
                {
                  name: "Disability",
                  desc: "Financial relief support to assist differently-abled citizens.",
                  icon: "♿",
                },
                {
                  name: "Kidney Disease",
                  desc: "Welfare fund targeting medical support for kidney patients.",
                  icon: "🩺",
                },
              ].map((prog) => (
                <div
                  key={prog.name}
                  className="flex flex-col justify-between p-4 sm:p-5 bg-[#F8FAFC] border border-gray-200 rounded-[10px] sm:rounded-xl hover:border-gray-300 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xl sm:text-2xl">{prog.icon}</span>
                      <span className="bg-[#1B365D]/10 text-[#1B365D] text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold">
                        LKR Cleared
                      </span>
                    </div>
                    <h4 className="text-[14px] sm:text-base font-bold text-[#1B365D] mb-1.5 sm:mb-2">
                      {prog.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#64748b] leading-relaxed mb-3 sm:mb-4 break-words">
                      {prog.desc}
                    </p>
                  </div>
                  <button
                    className="w-full mt-auto bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-[10px] sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 border-0 cursor-pointer transition-colors text-[12px] sm:text-sm"
                    onClick={() => handleOpenApply(prog.name)}
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
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* History tracking status */}
          <div className="bg-white border border-[#2D37482D] rounded-[10px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 text-left mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-shadow duration-300">
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] lg:text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-2 sm:pb-3 mb-3 sm:mb-4 md:mb-6">
              Application & Payment History
            </h3>

            {requests.length === 0 ? (
              <div className="py-6 sm:py-8 text-center text-gray-500 font-medium text-[12px] sm:text-sm">
                No allowance applications submitted yet.
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                <div className="flex flex-col gap-[8px] sm:gap-[10px]">
                  {requests.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 last:border-b-0 pb-4 sm:pb-6 flex flex-col gap-3 sm:gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-[#005BBD] text-base sm:text-lg mt-0.5">
                            ★
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-[#1a2e56] text-[14px] sm:text-base break-words">
                              {item.program}
                            </span>
                            <span className="text-[11px] sm:text-xs text-[#64748b] mt-0.5 sm:mt-1 break-words">
                              Purpose: {item.purpose}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
                          <span
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-0.5 sm:gap-1 border
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
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="sm:w-[12px] sm:h-[12px]"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                            {item.status === "Rejected" && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="sm:w-[12px] sm:h-[12px]"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            )}
                            {item.status === "Pending" && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="sm:w-[12px] sm:h-[12px]"
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
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-[10px] sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 text-left transition-all">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="sm:w-[16px] sm:h-[16px]"
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
                            <div className="text-[11px] sm:text-xs md:text-sm text-[#065f46] leading-relaxed">
                              <strong className="block text-emerald-800 font-bold mb-0.5 sm:mb-1">
                                Secure Allowance Funds Disbursed
                              </strong>
                              Your Grama Niladhari office has securely
                              transferred{" "}
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
                              <code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono font-bold text-[10px] sm:text-xs">
                                {item.paymentTransactionRef}
                              </code>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[70px] md:top-[85px] bg-[#0f172a]/65 backdrop-blur-xs z-[90] flex justify-center items-start p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white border border-[#2D37482D] rounded-[16px] sm:rounded-2xl w-full max-w-2xl p-4 sm:p-6 md:p-8 shadow-2xl flex flex-col relative z-[91] my-2 sm:my-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4">
              <h3 className="text-[16px] sm:text-lg font-bold text-[#1B365D]">
                Apply for {selectedProgram}
              </h3>
              <button
                className="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl cursor-pointer disabled:opacity-50"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close form"
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleConfirmApplication}
              className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1 sm:gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="modalApplicantName"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    id="modalApplicantName"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalNic"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    NIC Number
                  </label>
                  <input
                    type="text"
                    id="modalNic"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={applicantNicState}
                    onChange={(e) => setApplicantNicState(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalPurpose"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Application Purpose
                  </label>
                  <select
                    id="modalPurpose"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    disabled={isSubmitting}
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

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalIncome"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Monthly Household Income (LKR)
                  </label>
                  <input
                    type="number"
                    id="modalIncome"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. 45000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="modalRemarks"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Remarks / Supportive details
                  </label>
                  <textarea
                    id="modalRemarks"
                    rows="2"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Briefly state the reason you qualify..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Secure Account Details */}
                <div className="sm:col-span-2 border-t border-gray-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                  <h4 className="text-[13px] sm:text-sm font-bold text-[#1B365D] mb-2 sm:mb-3">
                    Payment Account Details (For secured money transfers)
                  </h4>
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalBankName"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Bank Name
                  </label>
                  <select
                    id="modalBankName"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    disabled={isSubmitting}
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

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalBankBranch"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Branch
                  </label>
                  <input
                    type="text"
                    id="modalBankBranch"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. Colombo 03"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalBankAccount"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="modalBankAccount"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. 1023456789"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <label
                    htmlFor="modalAccountHolder"
                    className="text-[11px] sm:text-xs font-bold text-[#475569]"
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="modalAccountHolder"
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. Nimal Perera"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Upload File */}
                <div className="flex flex-col gap-1 sm:gap-1.5 sm:col-span-2 text-left">
                  <label className="text-[11px] sm:text-xs font-bold text-[#475569]">
                    Attach Supporting Documents (Income cert/NIC copy)
                  </label>
                  {supportDocName ? (
                    <div className="border border-green-300 bg-green-50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl">📄</span>
                        <div className="flex flex-col">
                          <span className="text-[11px] sm:text-xs font-bold text-green-900 truncate max-w-[200px] sm:max-w-[280px]">
                            {supportDocName}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-green-700 font-semibold">
                            Document attached & ready to submit
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSupportDoc}
                        className="text-[10px] sm:text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="sm:w-[24px] sm:h-[24px]"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium text-center">
                        Upload supportive document (.pdf, .jpg, .png)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="supportDocFile"
                        disabled={isSubmitting}
                        onChange={handleSupportDocChange}
                      />
                      <label
                        htmlFor="supportDocFile"
                        className="bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-lg border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Choose file
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <p className="text-rose-500 text-[11px] sm:text-xs font-semibold m-0 text-left">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 border-t border-gray-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                <button
                  type="button"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl border-0 cursor-pointer text-[12px] sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2 sm:py-2.5 px-5 sm:px-6 rounded-xl border-0 cursor-pointer text-[12px] sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t.submitting || "Submitting..."}
                    </>
                  ) : (
                    t.confirmApplication || "Confirm Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default ResidentAllowances;
