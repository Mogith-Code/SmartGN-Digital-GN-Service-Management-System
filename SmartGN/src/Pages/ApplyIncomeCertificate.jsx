import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import logo from "../assets/logo.png";

function ApplyIncomeCertificate({ onOpenHelp }) {
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

  // Form Field States
  const [fullName, setFullName] = useState(successUser);
  const [gnDivisionNumber, setGnDivisionNumber] = useState("");
  const [address, setAddress] = useState("");

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        return;
      }
    } else {
      if (!fullName || !gnDivisionNumber || !address || !purpose) {
        setErrorMessage("Please fill in all required fields.");
        return;
      }
    }

    setErrorMessage("");

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Failed to submit certificate application",
        );
      }

      alert("Income Certificate Application submitted successfully!");
      navigate("/dashboard/resident/certificates", {
        state: { successUser, division: userDivision },
      });
    } catch (err) {
      console.warn("API error, using Local Storage fallback:", err.message);

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
      };

      // Add to resident certificates store
      const resCerts = JSON.parse(
        localStorage.getItem("smartgn_certificates") || "[]",
      );
      resCerts.unshift(newRequest);
      localStorage.setItem("smartgn_certificates", JSON.stringify(resCerts));

      // Add to officer certificates store
      const offRequests = JSON.parse(
        localStorage.getItem("smartgn_certificate_requests") || "[]",
      );
      offRequests.unshift(newRequest);
      localStorage.setItem(
        "smartgn_certificate_requests",
        JSON.stringify(offRequests),
      );

      alert(
        "Income Certificate Application submitted successfully! (Stored in Local Storage)",
      );
      navigate("/dashboard/resident/certificates", {
        state: { successUser, division: userDivision },
      });
    }
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
          <div className="flex justify-between items-center mb-4">
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
              Back
            </button>

            <button
              type="button"
              className="flex items-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[14px] font-bold cursor-pointer transition-all duration-200 shadow-sm"
              onClick={() => setIsPreviewOpen(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Live Certificate Preview
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-[26px] font-bold text-[#1B365D] mb-6 text-left">
            Application for Income Certificates
          </h2>

          {/* Form Container Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            {/* Warning block note */}
            <div className="flex items-center justify-between py-4 px-6 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-semibold text-[14px] mb-6 text-left">
              <span>
                A commission of 1.27% of the value of the income certificate is
                charged by the government.
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Row 1 */}
                <div className="flex flex-col">
                  <label
                    htmlFor="fullName"
                    className="text-[13px] font-semibold text-[#334155] mb-1.5"
                  >
                    Full name of the applicant :
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="gnDivNumber"
                    className="text-[13px] font-semibold text-[#334155] mb-1.5"
                  >
                    Grama Niladhari Division and Number :
                  </label>
                  <input
                    type="text"
                    id="gnDivNumber"
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                    value={gnDivisionNumber}
                    onChange={(e) => setGnDivisionNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Row 2 - Address spans both */}
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-[13px] font-semibold text-[#334155] mb-1.5"
                  >
                    Address :
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3 - Income Stream Radio Buttons */}
                <div className="flex flex-col md:col-span-2">
                  <label className="text-[13px] font-semibold text-[#334155] mb-2">
                    Income stream :
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-[#f8fafc] p-4 rounded-xl border border-[#cbd5e1]">
                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Paddy"
                        checked={incomeStream === "Paddy"}
                        onChange={() => setIncomeStream("Paddy")}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Paddy/ Banana/ Coconut etc.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Business"
                        checked={incomeStream === "Business"}
                        onChange={() => setIncomeStream("Business")}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Businesses/ brands</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[14.5px] text-[#334155]">
                      <input
                        type="radio"
                        name="incomeStream"
                        value="Laborer"
                        checked={incomeStream === "Laborer"}
                        onChange={() => setIncomeStream("Laborer")}
                        className="w-4.5 h-4.5 text-[#1B365D]"
                      />
                      <span>Carpenter/ Masonry/ hired laborer/ Other</span>
                    </label>
                  </div>
                </div>

                {/* DYNAMIC FORM SEGMENT: Active stream Paddy/Banana/Coconut */}
                {incomeStream === "Paddy" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="landOwnerName"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Name of the land owner :
                      </label>
                      <input
                        type="text"
                        id="landOwnerName"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={landOwnerName}
                        onChange={(e) => setLandOwnerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="landAmount"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Amount of land :
                      </label>
                      <input
                        type="text"
                        id="landAmount"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={landAmount}
                        onChange={(e) => setLandAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="uploadSheet"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        License/ Permit/ Grant sheet number (Upload a certified
                        copy) :
                      </label>
                      <div className="relative border-2 border-dashed border-[#cbd5e1] rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer min-h-[100px]">
                        <input
                          type="file"
                          id="uploadSheet"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name);
                              setGrantSheetNumber(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="uploadSheet"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span className="text-[13.5px] text-[#64748b] font-medium text-center">
                            {fileName ? fileName : "Upload Certified Document"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="identityApplicant"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        The identity of the applicant as the land owner :
                      </label>
                      <input
                        type="text"
                        id="identityApplicant"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={ownerIdentity}
                        onChange={(e) => setOwnerIdentity(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="md:col-span-2 mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="amountObtained"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Amount of paddy/ banana/ coconut etc. obtained :
                      </label>
                      <input
                        type="text"
                        id="amountObtained"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={amountObtained}
                        onChange={(e) => setAmountObtained(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="expenses"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Expenses (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="expenses"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="priceKg"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Price per kilogram (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="priceKg"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="totalIncomeVal"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Total Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="totalIncomeVal"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={totalIncome}
                        onChange={(e) => setTotalIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="totalAnnual"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Total annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="totalAnnual"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                {/* DYNAMIC FORM SEGMENT: Active stream Business */}
                {incomeStream === "Business" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="businessName"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Name of the business :
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="businessNature"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Nature of the business :
                      </label>
                      <input
                        type="text"
                        id="businessNature"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={businessNature}
                        onChange={(e) => setBusinessNature(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="uploadReg"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Business registration Copy (certified copy) :
                      </label>
                      <div className="relative border-2 border-dashed border-[#cbd5e1] rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer min-h-[100px]">
                        <input
                          type="file"
                          id="uploadReg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBusinessFileName(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="uploadReg"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                          </svg>
                          <span className="text-[13.5px] text-[#64748b] font-medium text-center">
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
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Receipt number of tax paid to the Pradeshiya Sabha :
                      </label>
                      <input
                        type="text"
                        id="taxReceipt"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={taxReceiptNumber}
                        onChange={(e) => setTaxReceiptNumber(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="md:col-span-2 mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="dailyMonthlyIncome"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Daily/Monthly Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="dailyMonthlyIncome"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={dailyMonthlyIncome}
                        onChange={(e) => setDailyMonthlyIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="businessAnnualIncome"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="businessAnnualIncome"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={businessAnnualIncome}
                        onChange={(e) =>
                          setBusinessAnnualIncome(e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="netIncome"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Net income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="netIncome"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={netIncome}
                        onChange={(e) => setNetIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                {/* DYNAMIC FORM SEGMENT: Active stream Carpenter/Masonry/Laborer/Other */}
                {incomeStream === "Laborer" && (
                  <>
                    <div className="flex flex-col">
                      <label
                        htmlFor="dailySalary"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Daily Salary (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="dailySalary"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={dailySalary}
                        onChange={(e) => setDailySalary(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="hoursWorked"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Number of hours worked per week :
                      </label>
                      <input
                        type="text"
                        id="hoursWorked"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(e.target.value)}
                        required
                      />
                    </div>

                    {/* Financial details divider */}
                    <div className="md:col-span-2 mt-4 border-b border-[#cbd5e1] pb-2">
                      <h4 className="text-[15px] font-bold text-[#1B365D]">
                        Income Details:
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="monthlyIncome"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Monthly Income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="monthlyIncome"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="laborerAnnualIncome"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Annual income (Rs.) :
                      </label>
                      <input
                        type="text"
                        id="laborerAnnualIncome"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={laborerAnnualIncome}
                        onChange={(e) => setLaborerAnnualIncome(e.target.value)}
                        required
                      />
                    </div>

                    <div className="hidden md:block"></div>
                  </>
                )}

                {/* Purpose Field */}
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="requireCert"
                    className="text-[13px] font-semibold text-[#334155] mb-1.5"
                  >
                    Need to require the income certificate (Purpose) :
                  </label>
                  <input
                    type="text"
                    id="requireCert"
                    className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>
              </div>

              {errorMessage && (
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

              {/* Submit / Reset Actions Row */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="py-2.5 px-5 rounded-lg border-0 text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 flex items-center gap-1.5"
                  onClick={handleReset}
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
                  className="py-2.5 px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center gap-1.5"
                >
                  Submit
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
                </button>
              </div>
            </form>
          </div>

          {/* Floating Help Trigger */}
          <button
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
            aria-label="Help Trigger"
            onClick={onOpenHelp}
          >
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Live Official Certificate Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#1B365D] text-white py-4 px-6 flex justify-between items-center">
              <span className="font-bold text-[16px] tracking-wide">
                Official Template Draft Preview
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body Container */}
            <div className="p-8 md:p-12 overflow-y-auto bg-slate-100 flex-1 max-h-[70vh]">
              {/* Paper Layout representation */}
              <div className="bg-white mx-auto border-2 border-slate-300 shadow-md p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[1050px]">
                {/* Official Branding Header */}
                <div className="flex flex-col items-center justify-center mb-6 text-center font-sans">
                  <img
                    src={logo}
                    alt="SmartGN Logo"
                    className="h-14 mb-2 object-contain"
                  />
                  <h1 className="text-[20px] font-extrabold uppercase text-[#1B365D] tracking-wider m-0">
                    SmartGN
                  </h1>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Digital Grama Niladhari Service Management System
                  </span>
                  <div className="w-full border-b-[3px] double border-slate-400 mt-4"></div>
                </div>

                <div className="text-center mb-8 font-sans">
                  <h2 className="text-[17px] font-bold text-slate-800 m-0 uppercase tracking-wide">
                    Certificate of Income issued by the Grama Niladhari
                  </h2>
                  <span className="text-[12px] font-medium text-slate-500 block mt-1">
                    Certificate ID: DRAFT-IC-PREVIEW
                  </span>
                  <p className="text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif leading-normal">
                    This certificate is issued by the Grama Niladhari of the
                    division in which the applicant resides based on declared
                    income details.
                  </p>
                </div>

                {/* Section 1: General Details */}
                <div className="mb-6">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (1) General Information
                  </h3>
                  <table className="w-full text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1.5 font-bold">
                          Applicant's Full Name:
                        </td>
                        <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {fullName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          Grama Niladhari Division and Number:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnDivisionNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          Residential Address:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {address || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          Income Stream / Category:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                          {incomeStream === "Paddy"
                            ? "Paddy / Agriculture"
                            : incomeStream === "Business"
                              ? "Business / Commercial"
                              : "Carpenter / Laborer / Services"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          Purpose of Certificate:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {purpose || "(Not specified)"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Stream-specific Income Details */}
                <div className="mb-6">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (2) Income Stream Breakdown
                  </h3>

                  {incomeStream === "Paddy" && (
                    <table className="w-full text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1.5 font-bold">
                            Land Owner Name:
                          </td>
                          <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {landOwnerName || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">Amount of Land:</td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {landAmount || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Identity as Owner:
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {ownerIdentity || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Produce Obtained:
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {amountObtained || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Price per Kg (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {pricePerKg || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Expenses incurred (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic text-red-600">
                            Rs. {expenses || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold font-sans text-slate-800">
                            Total Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {totalIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold font-sans text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[14px]">
                            Rs. {annualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {incomeStream === "Business" && (
                    <table className="w-full text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1.5 font-bold">
                            Name of the Business:
                          </td>
                          <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {businessName || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Nature of Business:
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {businessNature || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Tax Receipt Number:
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {taxReceiptNumber || "(Not specified)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Daily/Monthly Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {dailyMonthlyIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-slate-800">
                            Net Business Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {netIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[14px]">
                            Rs. {businessAnnualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {incomeStream === "Laborer" && (
                    <table className="w-full text-[13px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-1/2 py-1.5 font-bold">
                            Daily Salary / Rate (Rs.):
                          </td>
                          <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            Rs. {dailySalary || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold">
                            Hours worked per week:
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                            {hoursWorked || "0"} hours
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-slate-800">
                            Average Monthly Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                            Rs. {monthlyIncome || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-[#1B365D]">
                            Declared Annual Income (Rs.):
                          </td>
                          <td className="py-1.5 border-b border-dashed border-slate-400 text-[#1B365D] font-sans font-extrabold text-[14px]">
                            Rs. {laborerAnnualIncome || "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Certification Clause */}
                <div className="mt-8 pt-4 border-t border-slate-200 text-[12.5px] leading-relaxed">
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

                {/* Official Signatures & Date */}
                <div className="mt-14 flex justify-between items-end font-sans">
                  <div>
                    <span className="block text-[12px] text-slate-500 font-bold">
                      DATE OF ISSUE:
                    </span>
                    <span className="text-[13.5px] font-bold border-b border-slate-300 w-36 block pb-1">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="w-52 border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px] font-serif">
                      (Computer Generated Draft)
                    </div>
                    <span className="block text-[11px] text-slate-500 font-extrabold uppercase">
                      Grama Niladhari Signature & Seal
                    </span>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="absolute bottom-4 left-10 right-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans">
                  <span>
                    This is a computer-generated document. No signature is
                    required.
                  </span>
                  <span>Contact: 0255731913 | Admin@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="bg-slate-50 border-t border-slate-200 py-3 px-6 flex justify-end gap-3">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-[#475569] border-0 rounded-lg text-[13px] font-bold cursor-pointer transition-all duration-200"
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
