import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { authenticatedFetch } from "../utils/api";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import { addNotification } from "../utils/notifications";
import logo from "../assets/logo.png";
import backIcon from "../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function ApplyCharacterCertificate({ onOpenHelp }) {
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
  const [divisionalSecretariat, setDivisionalSecretariat] = useState("");
  const [gnDivisionNumber, setGnDivisionNumber] = useState(userDivision);
  const [fullName, setFullName] = useState(successUser);
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("Sri Lankan");
  const [religion, setReligion] = useState("");
  const [occupation, setOccupation] = useState("");
  const [villagePeriod, setVillagePeriod] = useState("");
  const [electoralRegister, setElectoralRegister] = useState("");
  const [nicNumber, setNicNumber] = useState(
    localStorage.getItem("smartgn_user_id") ||
    localStorage.getItem("smartgn_user_nic") ||
    ""
  );
  const [fatherName, setFatherName] = useState("");
  const [fatherAddress, setFatherAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [birthCertUrl, setBirthCertUrl] = useState("");

  // Section 1 Additional & Section 3
  const [personalKnown, setPersonalKnown] = useState("No");
  const [personalKnownSince, setPersonalKnownSince] = useState("");
  const [gnPeriod, setGnPeriod] = useState("");
  const [natureOfOtherEvidences, setNatureOfOtherEvidences] = useState("");
  const [convictedByCourt, setConvictedByCourt] = useState("No");
  const [convictedDetails, setConvictedDetails] = useState("");
  const [publicActivitiesInterest, setPublicActivitiesInterest] =
    useState("No");
  const [publicActivitiesDetails, setPublicActivitiesDetails] = useState("");
  const [character, setCharacter] = useState("Good");
  const [remarks, setRemarks] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  // Auto-fill profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authenticatedFetch("/api/residents/profile");
        if (response.ok) {
          const data = await response.json();
          const profile = data.profile || data;
          if (profile.fullName || profile.firstName) {
            setFullName(
              profile.fullName ||
                `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
            );
          }
          if (profile.nic || profile.r_nic) {
            setNicNumber(profile.nic || profile.r_nic);
          }
          if (profile.address) {
            setAddress(profile.address);
          }
          if (profile.gender || profile.sex) {
            setSex(profile.gender || profile.sex);
          }
          if (profile.division) {
            setGnDivisionNumber(profile.division);
            setDivisionalSecretariat(profile.division);
          }
        }
      } catch (err) {
        console.warn("Auto-fill profile warning:", err);
      }
    };
    fetchProfile();
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setDivisionalSecretariat("");
    setGnDivisionNumber("");
    setFullName("");
    setAge("");
    setAddress("");
    setSex("");
    setCivilStatus("");
    setNationality("Sri Lankan");
    setReligion("");
    setOccupation("");
    setVillagePeriod("");
    setElectoralRegister("");
    setNicNumber("");
    setFatherName("");
    setFatherAddress("");
    setPurpose("");
    setPersonalKnown("No");
    setPersonalKnownSince("");
    setGnPeriod("");
    setNatureOfOtherEvidences("");
    setConvictedByCourt("No");
    setConvictedDetails("");
    setPublicActivitiesInterest("No");
    setPublicActivitiesDetails("");
    setCharacter("Good");
    setRemarks("");
    setErrorMessage("");
    setSuccessMessage("");
    setSubmissionComplete(false);
    scrollToTop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !nicNumber || !purpose) {
      setErrorMessage("Please fill in all required fields (Full Name, NIC Number, and Purpose).");
      setSuccessMessage("");
      scrollToTop();
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const newRequestId = `REQ-CC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest = {
      id: newRequestId,
      request_id: newRequestId,
      type: "Character Certificate",
      certificate_type: "CHARACTER",
      status: "Pending",
      name: fullName,
      resident_name: fullName,
      nic: nicNumber,
      resident_nic: nicNumber,
      address: address,
      resident_address: address,
      division: userDivision,
      submittedDate: new Date().toISOString().split("T")[0],
      request_date: new Date().toISOString(),
      purpose: purpose,

      // Custom template fields
      divisionalSecretariat,
      gnDivisionNumber,
      sex,
      age,
      civilStatus,
      nationality,
      religion,
      occupation,
      villagePeriod,
      electoralRegister,
      fatherName,
      fatherAddress,
      personalKnown,
      personalKnownSince,
      gnPeriod,
      natureOfOtherEvidences,
      convictedByCourt,
      convictedDetails,
      publicActivitiesInterest,
      publicActivitiesDetails,
      character,
      remarks,
      signatureUrl,
      birthCertUrl,
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
      const response = await authenticatedFetch("/api/certificates/apply", {
        method: "POST",
        body: JSON.stringify({
          certificateType: "CHARACTER",
          purpose: purpose,
          requestDate: new Date().toISOString().split("T")[0],
          supportingDocs: [],
          divisionalSecretariat,
          gnDivisionNumber,
          fullName,
          age,
          address,
          sex,
          civilStatus,
          nationality,
          religion,
          occupation,
          villagePeriod,
          nicNumber,
          electoralRegister,
          fatherName,
          fatherAddress,
          personalKnown,
          personalKnownSince,
          gnPeriod,
          natureOfOtherEvidences,
          convictedByCourt,
          convictedDetails,
          publicActivitiesInterest,
          publicActivitiesDetails,
          character,
          remarks,
          signatureUrl,
          birthCertUrl,
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
      message: `New Character Certificate application received from ${fullName}.`,
      link: "/dashboard/officer/certificates",
    });

    addNotification("resident", {
      type: "certificate",
      title: "Certificate Application Submitted",
      message: `Your Character Certificate request (${newRequest.id || newRequestId}) has been submitted for approval.`,
      link: "/ResidentDashboard/certificates/pending",
    });

    // Set success message and mark completion
    setSuccessMessage(
      `Character Certificate application submitted successfully! Request ID: ${newRequest.request_id || newRequestId}`,
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

          {/* Back Button and Preview Button - Matching Income Certificate Style */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-12 sm:mt-14 md:mt-16 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            <div
              className="flex px-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] cursor-pointer"
              onClick={() => navigate("/ResidentDashboard/certificates")}
            >
              <img
                src={backIcon}
                alt="backIcon"
                className="w-[14px] sm:w-[16px]"
              />
              back
            </div>

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

          {/* Page Title */}
          <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:mt-[10px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            Application for Character Certificates
          </div>

          {/* Success Message */}
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

          {/* Error Message */}
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

          {/* Form Container Card */}
          <div className="bg-white border border-[#2D37481F] rounded-[12px] sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] flex flex-col">
            {/* Warning block note */}
            <div className="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 bg-[#fef3c7] border border-[#fde68a] rounded-lg sm:rounded-xl text-[#d97706] font-semibold text-[12px] sm:text-[13px] md:text-[14px] mb-4 sm:mb-6 text-left">
              <span className="break-words">
                This certificate is issued by the Grama Niladhari of the
                division in which the applicant resides and is valid only for 06
                months from the date issued.
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SECTION 1 */}
              <div className="mb-6 sm:mb-8 text-left">
                <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#1B365D] border-b border-slate-100 pb-2 mb-3 sm:mb-4">
                  Section (1) - Divisional & Office Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="divSecretariat"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (a) District and Divisional Secretary's Division{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="divSecretariat"
                      placeholder="e.g. Gampaha, Kelaniya"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={divisionalSecretariat}
                      onChange={(e) => setDivisionalSecretariat(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="gnDivNumber"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (b) Grama Niladhari Division and Number{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="gnDivNumber"
                      placeholder="e.g. Hunupitiya North - 258"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={gnDivisionNumber}
                      onChange={(e) => setGnDivisionNumber(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="personalKnown"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (c) Whether applicant is personally known to Grama
                      Niladhari? :
                    </label>
                    <select
                      id="personalKnown"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={personalKnown}
                      onChange={(e) => setPersonalKnown(e.target.value)}
                      disabled={submissionComplete}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="personalKnownSince"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (d) If so, since when? (e.g. 5 years, Birth) :
                    </label>
                    <input
                      type="text"
                      id="personalKnownSince"
                      placeholder="Specify duration or leave empty"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={personalKnownSince}
                      onChange={(e) => setPersonalKnownSince(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="mb-6 sm:mb-8 text-left">
                <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#1B365D] border-b border-slate-100 pb-2 mb-3 sm:mb-4">
                  Section (2) - Information About Applicant
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="fullName"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (a) Name in Full <span className="text-red-500">*</span> :
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
                      htmlFor="address"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (b) Address <span className="text-red-500">*</span> :
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

                  <div className="flex flex-col">
                    <label
                      htmlFor="sex"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (c) Sex <span className="text-red-500">*</span> :
                    </label>
                    <select
                      id="sex"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] focus:outline-none focus:border-[#1B365D] disabled:opacity-50 disabled:cursor-not-allowed"
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      required
                      disabled={submissionComplete}
                    >
                      <option value="">-- Select Sex --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="age"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (d) Age <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="number"
                      id="age"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="civilStatus"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (e) Civil Status <span className="text-red-500">*</span> :
                    </label>
                    <select
                      id="civilStatus"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] focus:outline-none focus:border-[#1B365D] disabled:opacity-50 disabled:cursor-not-allowed"
                      value={civilStatus}
                      onChange={(e) => setCivilStatus(e.target.value)}
                      required
                      disabled={submissionComplete}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="nationality"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (f) Whether Sri Lankan by descent or registration{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="religion"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (g) Religion <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="religion"
                      placeholder="e.g. Buddhist / Christian / Hindu / Islam"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="occupation"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (h) Present Occupation :
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="villagePeriod"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (i) Period of residence in the village :
                    </label>
                    <input
                      type="text"
                      id="villagePeriod"
                      placeholder="e.g. 15 Years"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={villagePeriod}
                      onChange={(e) => setVillagePeriod(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="nic"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (j) National Identity Card No.{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="nic"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label
                      htmlFor="electoral"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (k) Number of the Electoral Register and Particulars of
                      Registration :
                    </label>
                    <input
                      type="text"
                      id="electoral"
                      placeholder="e.g. No: 124/A, Gampaha District, 2024"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={electoralRegister}
                      onChange={(e) => setElectoralRegister(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="fatherName"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (l) Name of the Father :
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="fatherAddress"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (m) Address of the Father :
                    </label>
                    <input
                      type="text"
                      id="fatherAddress"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={fatherAddress}
                      onChange={(e) => setFatherAddress(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label
                      htmlFor="purpose"
                      className="text-[12px] sm:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                    >
                      (n) Purpose for which the certificate is required{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="purpose"
                      placeholder="e.g. Visa Application / Private Job Placement"
                      className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: VERIFICATION DOCUMENTS UPLOAD */}
              <div className="bg-[#f8fafc] p-4 sm:p-5 md:p-6 border border-[#cbd5e1] rounded-lg sm:rounded-xl text-left">
                <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#1B365D] uppercase tracking-wide border-b border-[#e2e8f0] pb-2 sm:pb-2.5 mb-3 sm:mb-5 m-0 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>Section (4) - Upload Verification Documents</span>
                  <span className="text-[10px] sm:text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase font-sans">
                    Required for Grama Niladhari Verification
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Signature Upload */}
                  <div className="bg-white p-3 sm:p-4 border border-slate-200 rounded-lg sm:rounded-xl flex flex-col justify-between shadow-sm">
                    <div>
                      <label className="block text-[12px] sm:text-[13px] md:text-[13.5px] font-bold text-[#1e293b] mb-1">
                        1. Upload Resident Signature{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] sm:text-[12px] text-slate-500 mb-2 sm:mb-3">
                        Please upload a clear image of your signature on white
                        paper.
                      </p>

                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setSignatureUrl(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-[10px] sm:text-xs text-slate-500 file:mr-2 sm:file:mr-3 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-[#1B365D] file:text-white hover:file:bg-[#005BBD] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submissionComplete}
                      />
                    </div>

                    {signatureUrl && (
                      <div className="mt-2 sm:mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 sm:gap-3">
                        <img
                          src={signatureUrl}
                          alt="Signature Preview"
                          className="h-10 sm:h-12 max-w-[80px] sm:max-w-[120px] object-contain border border-slate-300 rounded bg-white p-1"
                        />
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                          ✓ Signature Uploaded
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Birth Certificate Upload */}
                  <div className="bg-white p-3 sm:p-4 border border-slate-200 rounded-lg sm:rounded-xl flex flex-col justify-between shadow-sm">
                    <div>
                      <label className="block text-[12px] sm:text-[13px] md:text-[13.5px] font-bold text-[#1e293b] mb-1">
                        2. Upload Birth Certificate{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] sm:text-[12px] text-slate-500 mb-2 sm:mb-3">
                        Upload your Birth Certificate for GN Character &
                        Identity verification.
                      </p>

                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setBirthCertUrl(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-[10px] sm:text-xs text-slate-500 file:mr-2 sm:file:mr-3 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-[10px] sm:file:text-xs file:font-semibold file:bg-[#1B365D] file:text-white hover:file:bg-[#005BBD] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submissionComplete}
                      />
                    </div>

                    {birthCertUrl && (
                      <div className="mt-2 sm:mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 sm:gap-3">
                        {birthCertUrl.startsWith("data:image") ? (
                          <img
                            src={birthCertUrl}
                            alt="Birth Certificate Preview"
                            className="h-10 sm:h-12 max-w-[80px] sm:max-w-[120px] object-contain border border-slate-300 rounded bg-white p-1"
                          />
                        ) : (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 text-blue-800 rounded flex items-center justify-center font-bold text-[10px] sm:text-xs">
                            PDF
                          </div>
                        )}
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                          ✓ Birth Certificate Uploaded
                        </span>
                      </div>
                    )}
                  </div>
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
                >
                  {errorMessage}
                </p>
              )}

              {/* Submit / Reset Actions Row */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  type="button"
                  className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg border-0 text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                  className="py-2 px-5 sm:py-2.5 sm:px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center justify-center gap-1.5 shadow-md shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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

              {/* Submission Complete Indicator */}
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
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />

      {/* Live Official Certificate Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-4 sm:my-8 border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
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

            {/* Certificate Body Container */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto bg-slate-100 flex-1 max-h-[60vh] sm:max-h-[70vh]">
              {/* Paper Layout representation */}
              <div className="bg-white mx-auto border-2 border-slate-300 shadow-md p-6 sm:p-8 md:p-10 max-w-[800px] text-left font-serif text-[#1e293b] leading-relaxed relative min-h-[900px] sm:min-h-[1050px]">
                {/* Official Branding Header - Only Logo */}
                <div className="flex flex-col items-center justify-center pb-[10px] border-b double border-slate-400 mb-[10px] text-center font-sans">
                  <img
                    src={logo}
                    alt="SmartGN Logo"
                    className="h-8 sm:h-10 object-contain"
                  />
                </div>

                <div className="mb-[20px] sm:mb-[30px] pb-[5px] border-b double border-slate-400 font-sans">
                  <h2 className="text-[13px] sm:text-[14px] md:text-[16px] text-center font-bold text-slate-800 uppercase tracking-wide">
                    Certificate on Residence and Character issued by the Grama
                    Niladhari
                  </h2>
                  <span className="text-[10px] sm:text-[12px] font-medium text-slate-500 block mt-1">
                    Certificate ID: DRAFT-CC-PREVIEW
                  </span>
                  <p className="text-[10px] sm:text-[11px] italic text-slate-500 mt-2 font-serif leading-normal">
                    This certificate is issued by the Grama Niladhari of the
                    division in which the applicant resides and is valid only
                    for 06 months from the date of issue.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (1) Divisional & Grama Niladhari Division Details
                  </h3>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                          (a) District and Divisional Secretary's Division:
                        </td>
                        <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {divisionalSecretariat || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (b) Grama Niladhari Division and Number:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnDivisionNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (c) Whether applicant is personally known to Grama
                          Niladhari?
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {personalKnown}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (d) If so, since when?
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {personalKnown === "Yes"
                            ? personalKnownSince || "Since Birth"
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2 */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (2) Information about Applicant
                  </h3>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/3 py-1 sm:py-1.5 font-bold">
                          (a) Name:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fullName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (b) Address:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {address || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">(c) Sex:</td>
                        <td className="w-[30%] py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {sex || "(Not specified)"}
                        </td>
                        <td className="w-[15%] py-1 sm:py-1.5 font-bold text-center">
                          (d) Age:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {age || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (e) Civil Status:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {civilStatus || "(Not specified)"}
                        </td>
                        <td className="py-1 sm:py-1.5 font-bold text-center">
                          (f) Sri Lankan:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {nationality || "Sri Lankan"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (g) Religion:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {religion || "(Not specified)"}
                        </td>
                        <td className="py-1 sm:py-1.5 font-bold text-center">
                          (h) Occupation:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {occupation || "Unemployed / Student"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (i) Residence Period in Village:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {villagePeriod || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (j) National Identity Card No:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold"
                        >
                          {nicNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (k) Electoral Register Particulars:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {electoralRegister || "Registered"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (l) Name of the Father:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fatherName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (m) Address of the Father:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fatherAddress || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (n) Purpose for Certificate:
                        </td>
                        <td
                          colSpan="3"
                          className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-semibold"
                        >
                          {purpose || "(Not specified)"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 3 */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (3) Other Residence & Security Information
                  </h3>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1 sm:py-1.5 font-bold">
                          (a) Period of residence in GN Division:
                        </td>
                        <td className="w-1/2 py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnPeriod || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (b) Nature of other evidences in proof:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {natureOfOtherEvidences || "Utility Bill"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (c) Whether convicted by a Court of Law:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {convictedByCourt === "Yes"
                            ? `Yes - ${convictedDetails}`
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (d) Whether interested in public activities / social
                          work:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {publicActivitiesInterest === "Yes"
                            ? `Yes - ${publicActivitiesDetails}`
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-1.5 font-bold">
                          (e) Character:
                        </td>
                        <td className="py-1 sm:py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                          {character}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 4 */}
                <div className="mb-6 sm:mb-10">
                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] md:text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (4) Grama Niladhari Remarks
                  </h3>
                  <div className="p-2 sm:p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-600 italic text-[11px] sm:text-[12px] min-h-[40px] sm:min-h-[50px]">
                    {remarks ||
                      "No administrative remarks added in this draft."}
                  </div>
                </div>

                {/* Certification Clause */}
                <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-200 text-[11px] sm:text-[12px] md:text-[12.5px] leading-relaxed">
                  <p>
                    It is hereby certified that the above particulars are
                    correct to the best of my knowledge, that he/she is a
                    citizen of Sri Lanka by descent/registration, his/her
                    certificate of Registration Number is{" "}
                    <span className="font-bold">[DRAFT-PREVIEW]</span> and that
                    it has been issued by{" "}
                    <span className="font-bold">Grama Niladhari Office</span>.
                  </p>
                </div>

                {/* Official Signatures & Date */}
                <div className="mt-8 sm:mt-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 font-sans">
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

                {/* Bottom Footer Info */}
                <div className="absolute bottom-3 sm:bottom-4 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row justify-between items-center text-[8px] sm:text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans gap-1 sm:gap-0">
                  <span>
                    This is a computer-generated document. No signature is
                    required.
                  </span>
                  <span>Contact: 0255731913 | Admin@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
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

export default ApplyCharacterCertificate;
