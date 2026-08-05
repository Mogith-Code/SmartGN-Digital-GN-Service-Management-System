import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import { addNotification } from "../utils/notifications";
import logo from "../assets/logo.png";

function ApplyIncomeCertificate({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Ref for scrolling to top
  const topRef = useRef(null);

  // Retrieve username and division/ID from navigation state or localStorage (defaults to Nimal Perera)
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  // Form Field States
  const [fullName, setFullName] = useState(successUser);
  const [gnDivisionNumber, setGnDivisionNumber] = useState(userDivision);
  const [address, setAddress] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");

  // Income stream
  const [incomeStream, setIncomeStream] = useState("Laborer"); // Paddy, Business, Laborer

  // Paddy/Banana/Coconut details
  const [landOwnerName, setLandOwnerName] = useState("");
  const [landAmount, setLandAmount] = useState("");
  const [grantSheetNumber, setGrantSheetNumber] = useState("");
  const [ownerIdentity, setOwnerIdentity] = useState("");

  // Paddy Financial calculations
  const [amountObtained, setAmountObtained] = useState("");
  const [expenses, setExpenses] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");

  // Businesses / brands details
  const [businessName, setBusinessName] = useState("");
  const [businessNature, setBusinessNature] = useState("");
  const [businessFileName, setBusinessFileName] = useState("");
  const [taxReceiptNumber, setTaxReceiptNumber] = useState("");

  // Business Income
  const [dailyMonthlyIncome, setDailyMonthlyIncome] = useState("");
  const [businessAnnualIncome, setBusinessAnnualIncome] = useState("");
  const [netIncome, setNetIncome] = useState("");

  // Carpenter/ Masonry/ hired laborer/ Other details
  const [dailySalary, setDailySalary] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [laborerAnnualIncome, setLaborerAnnualIncome] = useState("");

  const [purpose, setPurpose] = useState("");
  const [fileName, setFileName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setFullName("");
    setGnDivisionNumber("");
    setAddress("");
    setIncomeStream("Laborer");

    // Paddy states
    setLandOwnerName("");
    setLandAmount("");
    setGrantSheetNumber("");
    setOwnerIdentity("");
    setAmountObtained("");
    setExpenses("");
    setPricePerKg("");
    setTotalIncome("");
    setAnnualIncome("");

    // Business states
    setBusinessName("");
    setBusinessNature("");
    setBusinessFileName("");
    setTaxReceiptNumber("");
    setDailyMonthlyIncome("");
    setBusinessAnnualIncome("");
    setNetIncome("");

    // Laborer states
    setDailySalary("");
    setHoursWorked("");
    setMonthlyIncome("");
    setLaborerAnnualIncome("");

    setPurpose("");
    setFileName("");
    setErrorMessage("");
    setSuccessMessage("");
    setSubmissionComplete(false);
    scrollToTop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (incomeStream === "Paddy") {
      if (
        !fullName ||
        !gnDivisionNumber ||
        !address ||
        !landOwnerName ||
        !landAmount ||
        !ownerIdentity ||
        !amountObtained ||
        !expenses ||
        !pricePerKg ||
        !totalIncome ||
        !annualIncome ||
        !purpose
      ) {
        setErrorMessage("Please fill in all required fields.");
        setSuccessMessage("");
        scrollToTop();
        return;
      }
    } else if (incomeStream === "Business") {
      if (
        !fullName ||
        !gnDivisionNumber ||
        !address ||
        !businessName ||
        !businessNature ||
        !taxReceiptNumber ||
        !dailyMonthlyIncome ||
        !businessAnnualIncome ||
        !netIncome ||
        !purpose
      ) {
        setErrorMessage("Please fill in all required fields.");
        setSuccessMessage("");
        scrollToTop();
        return;
      }
    } else if (incomeStream === "Laborer") {
      if (
        !fullName ||
        !gnDivisionNumber ||
        !address ||
        !dailySalary ||
        !hoursWorked ||
        !monthlyIncome ||
        !laborerAnnualIncome ||
        !purpose
      ) {
        setErrorMessage("Please fill in all required fields.");
        setSuccessMessage("");
        scrollToTop();
        return;
      }
    } else {
      if (!fullName || !gnDivisionNumber || !address || !purpose) {
        setErrorMessage("Please fill in all required fields.");
        setSuccessMessage("");
        scrollToTop();
        return;
      }
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const newRequestId = `REQ-IC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const resolvedAnnualIncome =
      incomeStream === "Paddy"
        ? annualIncome
        : incomeStream === "Business"
          ? businessAnnualIncome
          : laborerAnnualIncome;

    const newRequest = {
      id: newRequestId,
      request_id: newRequestId,
      type: "Income Certificate",
      certificate_type: "INCOME",
      status: "PENDING",
      name: fullName,
      resident_name: fullName,
      division: userDivision,
      submittedDate: new Date().toISOString().split("T")[0],
      request_date: new Date().toISOString(),
      purpose: purpose,

      fullName,
      gnDivisionNumber,
      address,
      incomeStream,
      landOwnerName,
      landAmount,
      grantSheetNumber,
      ownerIdentity,
      amountObtained,
      expenses,
      pricePerKg,
      totalIncome,
      annualIncome: resolvedAnnualIncome,
      businessName,
      businessNature,
      businessFileName,
      taxReceiptNumber,
      dailyMonthlyIncome,
      businessAnnualIncome,
      netIncome,
      dailySalary,
      hoursWorked,
      monthlyIncome,
      laborerAnnualIncome,
      signatureUrl,
    };

    // ALWAYS add to resident certificates store
    const resCerts = JSON.parse(
      localStorage.getItem("smartgn_certificates") || "[]",
    );
    resCerts.unshift(newRequest);
    localStorage.setItem("smartgn_certificates", JSON.stringify(resCerts));

    // ALWAYS add to officer certificates store
    const offRequests = JSON.parse(
      localStorage.getItem("smartgn_certificate_requests") || "[]",
    );
    offRequests.unshift(newRequest);
    localStorage.setItem(
      "smartgn_certificate_requests",
      JSON.stringify(offRequests),
    );

    // Attempt backend API submission
    try {
      const token = localStorage.getItem("smartgn_token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };
      const response = await fetch("/api/certificates/apply", {
        method: "POST",
        headers,
        body: JSON.stringify({
          certificateType: "INCOME",
          purpose: purpose,
          requestDate: new Date().toISOString().split("T")[0],
          supportingDocs: [],
          fullName,
          gnDivisionNumber,
          address,
          incomeStream,
          landOwnerName,
          landAmount,
          grantSheetNumber,
          ownerIdentity,
          amountObtained,
          expenses,
          pricePerKg,
          totalIncome,
          annualIncome,
          businessName,
          businessNature,
          businessFileName,
          taxReceiptNumber,
          dailyMonthlyIncome,
          businessAnnualIncome,
          netIncome,
          dailySalary,
          hoursWorked,
          monthlyIncome,
          laborerAnnualIncome,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.certificateNumber || resData.request_id) {
          newRequest.id = resData.request_id || resData.certificateNumber;
          newRequest.request_id =
            resData.request_id || resData.certificateNumber;
        }
      }
    } catch (err) {
      console.warn("API submission warning:", err.message);
    }

    addNotification("officer", {
      type: "certificate",
      title: "New Certificate Application",
      message: `New Income Certificate application received from ${fullName}.`,
      link: "/dashboard/officer/certificates",
    });

    addNotification("resident", {
      type: "certificate",
      title: "Certificate Application Submitted",
      message: `Your Income Certificate request (${newRequest.id || newRequestId}) has been submitted for approval.`,
      link: "/ResidentDashboard/certificates/pending",
    });

    // Set success message and mark completion
    setSuccessMessage(
      `Income Certificate application submitted successfully! Request ID: ${newRequest.request_id || newRequestId}`,
    );
    setSubmissionComplete(true);
    setIsSubmitting(false);

    // Scroll to top to show success message
    scrollToTop();

    // Redirect after 2.5 seconds
    setTimeout(() => {
      navigate("/ResidentDashboard/certificates");
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <div ref={topRef}></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-12 sm:mt-14 md:mt-16 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
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
              Back
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] sm:text-[14px] font-bold cursor-pointer transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              onClick={() => setIsPreviewOpen(true)}
              disabled={submissionComplete}
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Live Certificate Preview
            </button>
          </div>

          <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[10px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            Application for Income Certificates
          </div>

          {successMessage && (
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-[13px] sm:text-[14px]">
                  {successMessage}
                </span>
              </div>
              <p className="text-[11px] sm:text-sm mt-1">
                Redirecting to certificates page...
              </p>
            </div>
          )}

          {errorMessage && !successMessage && (
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] mt-3 sm:mt-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-[13px] sm:text-[14px]">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#2D37481F] rounded-[12px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] flex flex-col">
            <div className="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 bg-[#fef3c7] border border-[#fde68a] rounded-lg sm:rounded-xl text-[#d97706] font-semibold text-[12px] sm:text-[13px] md:text-[14px] mb-4 sm:mb-6 text-left">
              <span className="break-words">
                A commission of 1.27% of the value of the income certificate is
                charged by the government.
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left">
                <div className="flex flex-col">
                  <label
                    htmlFor="fullName"
                    className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                  >
                    Full name of the applicant :
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={submissionComplete}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="gnDivNumber"
                    className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                  >
                    Grama Niladhari Division and Number :
                  </label>
                  <input
                    type="text"
                    id="gnDivNumber"
                    className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={gnDivisionNumber}
                    onChange={(e) => setGnDivisionNumber(e.target.value)}
                    required
                    disabled={submissionComplete}
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                  >
                    Address :
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={submissionComplete}
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1.5 sm:mb-2">
                    Income stream :
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 bg-[#f8fafc] p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#cbd5e1] disabled:opacity-50">
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] disabled:cursor-not-allowed">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Paddy"
                        checked={incomeStream === "Paddy"}
                        onChange={() => setIncomeStream("Paddy")}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1B365D]"
                        disabled={submissionComplete}
                      />
                      <span>Paddy/ Banana/ Coconut etc.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] disabled:cursor-not-allowed">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Business"
                        checked={incomeStream === "Business"}
                        onChange={() => setIncomeStream("Business")}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1B365D]"
                        disabled={submissionComplete}
                      />
                      <span>Businesses/ brands</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] disabled:cursor-not-allowed">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Laborer"
                        checked={incomeStream === "Laborer"}
                        onChange={() => setIncomeStream("Laborer")}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1B365D]"
                        disabled={submissionComplete}
                      />
                      <span>Carpenter/ Masonry/ hired laborer/ Other</span>
                    </label>
                  </div>
                </div>

                {incomeStream === "Paddy" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="landOwnerName"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Name of the land owner :
                      </label>
                      <input
                        type="text"
                        id="landOwnerName"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={landOwnerName}
                        onChange={(e) => setLandOwnerName(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="landAmount"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Amount of land :
                      </label>
                      <input
                        type="text"
                        id="landAmount"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={landAmount}
                        onChange={(e) => setLandAmount(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="uploadSheet"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        License/ Permit/ Grant sheet number (Upload a certified
                        copy) :
                      </label>
                      <div className="relative border-2 border-dashed border-[#cbd5e1] rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
                        <input
                          type="file"
                          id="uploadSheet"
                          className="hidden"
                          disabled={submissionComplete}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name);
                              setGrantSheetNumber(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="uploadSheet"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1.5 sm:gap-2 disabled:cursor-not-allowed"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                            className="sm:w-[24px] sm:h-[24px]"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span className="text-[12px] sm:text-[13px] md:text-[13.5px] text-[#64748b] font-medium text-center break-words max-w-full">
                            {fileName ? fileName : "Upload Certified Document"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="identityApplicant"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        The identity of the applicant as the land owner :
                      </label>
                      <input
                        type="text"
                        id="identityApplicant"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={ownerIdentity}
                        onChange={(e) => setOwnerIdentity(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="md:col-span-2 mt-3 sm:mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="amountObtained"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Amount of paddy/ banana/ coconut etc. obtained :
                      </label>
                      <input
                        type="text"
                        id="amountObtained"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={amountObtained}
                        onChange={(e) => setAmountObtained(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="expenses"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Expenses (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="expenses"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="priceKg"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Price per kilogram (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="priceKg"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="totalIncomeVal"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Total Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="totalIncomeVal"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={totalIncome}
                        onChange={(e) => setTotalIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="totalAnnual"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Total annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="totalAnnual"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                {incomeStream === "Business" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="businessName"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Name of the business :
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="businessNature"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Nature of the business :
                      </label>
                      <input
                        type="text"
                        id="businessNature"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={businessNature}
                        onChange={(e) => setBusinessNature(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="uploadReg"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Business registration Copy (certified copy) :
                      </label>
                      <div className="relative border-2 border-dashed border-[#cbd5e1] rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer min-h-[80px] sm:min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed">
                        <input
                          type="file"
                          id="uploadReg"
                          className="hidden"
                          disabled={submissionComplete}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBusinessFileName(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="uploadReg"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1.5 sm:gap-2 disabled:cursor-not-allowed"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                            className="sm:w-[24px] sm:h-[24px]"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                          </svg>
                          <span className="text-[12px] sm:text-[13px] md:text-[13.5px] text-[#64748b] font-medium text-center break-words max-w-full">
                            {businessFileName
                              ? businessFileName
                              : "Upload Business Registration Copy"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="taxReceipt"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Receipt number of tax paid to the Pradeshiya Sabha :
                      </label>
                      <input
                        type="text"
                        id="taxReceipt"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={taxReceiptNumber}
                        onChange={(e) => setTaxReceiptNumber(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="md:col-span-2 mt-3 sm:mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="dailyMonthlyIncome"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Daily/Monthly Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="dailyMonthlyIncome"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={dailyMonthlyIncome}
                        onChange={(e) => setDailyMonthlyIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="businessAnnualIncome"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="businessAnnualIncome"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={businessAnnualIncome}
                        onChange={(e) =>
                          setBusinessAnnualIncome(e.target.value)
                        }
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="netIncome"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Net income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="netIncome"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={netIncome}
                        onChange={(e) => setNetIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                {incomeStream === "Laborer" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="dailySalary"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Daily Salary (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="dailySalary"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={dailySalary}
                        onChange={(e) => setDailySalary(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="hoursWorked"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Number of hours worked per week :
                      </label>
                      <input
                        type="text"
                        id="hoursWorked"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="md:col-span-2 mt-3 sm:mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="monthlyIncome"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Monthly Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="monthlyIncome"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="laborerAnnualIncome"
                        className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="laborerAnnualIncome"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={laborerAnnualIncome}
                        onChange={(e) => setLaborerAnnualIncome(e.target.value)}
                        required
                        disabled={submissionComplete}
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="requireCert"
                    className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                  >
                    Need to require the income certificate (Purpose) :
                  </label>
                  <input
                    type="text"
                    id="requireCert"
                    className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    disabled={submissionComplete}
                  />
                </div>

                <div className="flex flex-col md:col-span-2 mt-3 sm:mt-4 p-3 sm:p-4 bg-[#f8fafc] border border-slate-200 rounded-lg sm:rounded-xl text-left">
                  <label className="block text-[12px] sm:text-[13px] md:text-[13.5px] font-bold text-[#1e293b] mb-1">
                    Upload Resident Signature{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] sm:text-[12px] text-slate-500 mb-2 sm:mb-3">
                    Please upload a clear image of your signature for Grama
                    Niladhari verification.
                  </p>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    disabled={submissionComplete}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setSignatureUrl(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-[10px] sm:text-xs text-slate-500 file:mr-2 sm:file:mr-3 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-[#1B365D] file:text-white hover:file:bg-[#005BBD] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {signatureUrl && (
                    <div className="mt-2 sm:mt-3 p-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 sm:gap-3 w-fit">
                      <img
                        src={signatureUrl}
                        alt="Signature Preview"
                        className="h-10 sm:h-12 max-w-[100px] sm:max-w-[140px] object-contain border border-slate-300 rounded p-1 bg-slate-50"
                      />
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                        ✓ Signature Uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && !successMessage && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    margin: "12px 0",
                    textAlign: "left",
                  }}
                  className="font-semibold"
                >
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  type="button"
                  className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg border-0 text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  onClick={handleReset}
                  disabled={isSubmitting || submissionComplete}
                >
                  Reset
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                  </svg>
                </button>

                <button
                  type="submit"
                  className="py-2 px-5 sm:py-2.5 sm:px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  disabled={isSubmitting || submissionComplete}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
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
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {submissionComplete && (
                <div className="flex justify-center mt-3 sm:mt-4">
                  <div className="flex items-center gap-2 text-green-600 text-[11px] sm:text-sm font-medium">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Success! Redirecting...
                  </div>
                </div>
              )}
            </form>
          </div>

          <ChatbotButton onOpenHelp={onOpenHelp} />
        </div>
      </div>

      <Footer />

      {/* Live Official Certificate Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-4 sm:my-8 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1B365D] text-white py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center">
              <span className="font-bold text-[14px] sm:text-[16px] tracking-wide">
                Official Template Draft Preview
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-lg sm:text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto bg-slate-100 flex-1 max-h-[60vh] sm:max-h-[70vh]">
              <div className="bg-white mx-auto border-2 border-slate-300 shadow-md p-6 sm:p-8 md:p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[900px] sm:min-h-[1050px]">
                {/* Official Branding Header - Only Logo */}
                <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 text-center font-sans">
                  <img
                    src={logo}
                    alt="SmartGN Logo"
                    className="h-10 sm:h-14 mb-1 sm:mb-2 object-contain"
                  />
                  <div className="w-full border-b-[3px] double border-slate-400 mt-3 sm:mt-4"></div>
                </div>

                <div className="text-center mb-6 sm:mb-8 font-sans">
                  <h2 className="text-[14px] sm:text-[17px] font-bold text-slate-800 m-0 uppercase tracking-wide">
                    Certificate of Income issued by the Grama Niladhari
                  </h2>
                  <span className="text-[10px] sm:text-[12px] font-medium text-slate-500 block mt-1">
                    Certificate ID: DRAFT-IC-PREVIEW
                  </span>
                  <p className="text-[10px] sm:text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif leading-normal">
                    This certificate is issued by the Grama Niladhari of the
                    division in which the applicant resides based on declared
                    income details.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (1) General Information
                  </h3>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                          Applicant's Full Name:
                        </td>
                        <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {fullName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          Grama Niladhari Division and Number:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnDivisionNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          Residential Address:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {address || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          Income Stream / Category:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                          {incomeStream === "Paddy"
                            ? "Paddy / Agriculture"
                            : incomeStream === "Business"
                              ? "Business / Commercial"
                              : "Carpenter / Laborer / Services"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          Purpose of Certificate:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {purpose || "(Not specified)"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (2) Income Stream Breakdown
                  </h3>

                  {incomeStream === "Paddy" && (
                    <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                            Land Owner Name:
                          </td>
                          <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {landOwnerName || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Amount of Land:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {landAmount || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Identity as Owner:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {ownerIdentity || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Produce Obtained:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {amountObtained || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Price per Kg (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {pricePerKg || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Expenses incurred (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic text-red-600">
                            Rs. {expenses || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold font-sans text-slate-800">
                            Total Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {totalIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold font-sans text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[12px] sm:text-[14px]">
                            Rs. {annualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {incomeStream === "Business" && (
                    <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                            Name of the Business:
                          </td>
                          <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {businessName || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Nature of Business:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {businessNature || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Tax Receipt Number:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {taxReceiptNumber || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Daily/Monthly Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {dailyMonthlyIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold text-slate-800">
                            Net Business Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {netIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[12px] sm:text-[14px]">
                            Rs. {businessAnnualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {incomeStream === "Laborer" && (
                    <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                            Daily Salary / Rate (Rs.):
                          </td>
                          <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {dailySalary || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold">
                            Hours worked per week:
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {hoursWorked || "0"} hours
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold text-slate-800">
                            Average Monthly Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {monthlyIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 sm:py-1.5 font-bold text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[12px] sm:text-[14px]">
                            Rs. {laborerAnnualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-200 text-[11px] sm:text-[12px] md:text-[12.5px] leading-relaxed">
                  <p>
                    It is hereby certified that the above particulars are
                    correct to the best of my knowledge and belief, and that the
                    applicant's declared annual income is
                    <span className="font-bold">
                      {" "}
                      Rs.{" "}
                      {incomeStream === "Paddy"
                        ? annualIncome
                        : incomeStream === "Business"
                          ? businessAnnualIncome
                          : laborerAnnualIncome}
                    </span>
                    . This draft is for preview purposes only.
                  </p>
                </div>

                <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 font-sans">
                  <div>
                    <span className="block text-[10px] sm:text-[12px] text-slate-500 font-bold">
                      DATE OF ISSUE:
                    </span>
                    <span className="text-[12px] sm:text-[13.5px] font-bold border-b border-slate-300 w-28 sm:w-36 block pb-1">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-center w-full sm:w-auto">
                    <div className="w-full sm:w-52 border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[10px] sm:text-[11px] font-serif">
                      (Computer Generated Draft)
                    </div>
                    <span className="block text-[10px] sm:text-[11px] text-slate-500 font-extrabold uppercase">
                      Grama Niladhari Signature & Seal
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row justify-between items-center text-[8px] sm:text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans gap-1 sm:gap-0">
                  <span>
                    This is a computer-generated document. No signature is
                    required.
                  </span>
                  <span>Contact: 0255731913 | Admin@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 py-2.5 sm:py-3 px-4 sm:px-6 flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="py-1.5 sm:py-2 px-4 sm:px-5 bg-slate-200 hover:bg-slate-300 text-[#475569] border-0 rounded-lg text-[12px] sm:text-[13px] font-bold cursor-pointer transition-all duration-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyIncomeCertificate;
