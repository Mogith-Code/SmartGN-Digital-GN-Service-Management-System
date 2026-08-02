import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { addNotification } from "../utils/notifications";
import { encryptId } from "../utils/encryption";
import Footer from "../Components/Common/Footer";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import ChatbotButton from "../Components/Common/ChatbotButton";

function OfficerCertificateDetails({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Ref for scrolling to top
  const topRef = useRef(null);

  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Kamal Perera";
  const officerIdVal =
    location.state?.officerId ||
    localStorage.getItem("smartgn_user_id") ||
    "GN-001";

  const [profile, setProfile] = useState({
    firstName: "Kamal",
    lastName: "Perera",
    fullName: "Kamal Perera",
    division: "",
  });

  const [certRequest, setCertRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [addressCheck, setAddressCheck] = useState(true);
  const [nicCheck, setNicCheck] = useState(true);
  const [documentAuditCheck, setDocumentAuditCheck] = useState(false);
  const [signatureMatch, setSignatureMatch] = useState(false);
  const [billsVerified, setBillsVerified] = useState(false);
  const [personalKnown, setPersonalKnown] = useState("No");
  const [personalKnownSince, setPersonalKnownSince] = useState("");
  const [natureOfOtherEvidences, setNatureOfOtherEvidences] = useState("");
  const [convictedByCourt, setConvictedByCourt] = useState("No");
  const [convictedDetails, setConvictedDetails] = useState("");
  const [publicActivitiesInterest, setPublicActivitiesInterest] =
    useState("No");
  const [publicActivitiesDetails, setPublicActivitiesDetails] = useState("");
  const [character, setCharacter] = useState("Good");
  const [remarks, setRemarks] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [verifiedAnnualIncome, setVerifiedAnnualIncome] = useState("");
  const [docPreviewModal, setDocPreviewModal] = useState({
    isOpen: false,
    title: "",
    url: "",
  });

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("smartgn_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  // Close reject modal
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setError(null);
  };

  // Open reject modal
  const handleOpenRejectModal = () => {
    setShowRejectModal(true);
    setRejectReason("");
  };

  // Close confirm modal
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Handle Cancel - navigate back to certificates page with scroll to top
  const handleCancel = () => {
    navigate("/OfficerDashboard/certificates");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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
            firstName: data.first_name || "Kamal",
            lastName: data.last_name || "Perera",
            fullName: data.full_name || "Kamal Perera",
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

  const loadCertDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/certificates/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to load certificate details.",
        );
      }
      const data = await response.json();

      const details = data.details || {};

      const formatted = {
        id: data.request_id || data.id,
        request_id: data.request_id || data.id,
        type:
          data.certificate_type === "INCOME"
            ? "Income Certificate"
            : "Character Certificate",
        certificate_type: data.certificate_type,
        status: data.status || "Pending",
        name: data.resident_name || details.fullName || "Resident",
        purpose: data.purpose || details.purpose,
        submittedDate: data.request_date ? data.request_date.split("T")[0] : "",
        division: data.division || profile.division || "N/A",
        nic: data.resident_nic || details.nicNumber || "N/A",
        address: data.resident_address || details.address || "N/A",
        details: details,
        // Character fields
        divisionalSecretariat: details.divisionalSecretariat || "",
        gnDivisionNumber: details.gnDivisionNumber || "",
        sex: details.sex || "",
        age: details.age || "",
        civilStatus: details.civilStatus || "",
        nationality: details.nationality || "Sri Lankan",
        religion: details.religion || "",
        occupation: details.occupation || "",
        villagePeriod: details.villagePeriod || "",
        electoralRegister: details.electoralRegister || "",
        fatherName: details.fatherName || "",
        fatherAddress: details.fatherAddress || "",
        gnPeriod: details.gnPeriod || "",
        natureOfOtherEvidences: details.natureOfOtherEvidences || "",
        convictedByCourt: details.convictedByCourt || "No",
        convictedDetails: details.convictedDetails || "",
        publicActivitiesInterest: details.publicActivitiesInterest || "No",
        publicActivitiesDetails: details.publicActivitiesDetails || "",
        character: details.character || "Good",
        remarks: details.remarks || "",
        personalKnown: details.personalKnown || "No",
        personalKnownSince: details.personalKnownSince || "",
        certificateNo: data.certificate_number || details.certificateNo || "",
        // Income fields
        incomeStream: details.incomeStream || "",
        landOwnerName: details.landOwnerName || "",
        landAmount: details.landAmount || "",
        ownerIdentity: details.ownerIdentity || "",
        amountObtained: details.amountObtained || "",
        expenses: details.expenses || "",
        pricePerKg: details.pricePerKg || "",
        totalIncome: details.totalIncome || "",
        annualIncome: details.annualIncome || "",
        businessName: details.businessName || "",
        businessNature: details.businessNature || "",
        taxReceiptNumber: details.taxReceiptNumber || "",
        dailyMonthlyIncome: details.dailyMonthlyIncome || "",
        businessAnnualIncome: details.businessAnnualIncome || "",
        netIncome: details.netIncome || "",
        dailySalary: details.dailySalary || "",
        hoursWorked: details.hoursWorked || "",
        monthlyIncome: details.monthlyIncome || "",
        laborerAnnualIncome: details.laborerAnnualIncome || "",
        verifiedAnnualIncome:
          details.verifiedAnnualIncome || details.annualIncome || "",
        signatureUrl: details.signatureUrl || "",
        birthCertUrl: details.birthCertUrl || "",
        officerName: details.officerName || data.approved_by || "",
        issuedDate: data.issued_date || "",
        approvedAt: data.approved_at || "",
        gnRemarks: data.gn_remarks || "",
        rejectionReason: data.rejection_reason || "",
      };

      setCertRequest(formatted);

      // Set officer assessment fields
      setPersonalKnown(formatted.personalKnown);
      setPersonalKnownSince(formatted.personalKnownSince);
      setNatureOfOtherEvidences(
        formatted.natureOfOtherEvidences || "Utility Bill",
      );
      setConvictedByCourt(formatted.convictedByCourt);
      setConvictedDetails(formatted.convictedDetails);
      setPublicActivitiesInterest(formatted.publicActivitiesInterest);
      setPublicActivitiesDetails(formatted.publicActivitiesDetails);
      setCharacter(formatted.character);
      setRemarks(formatted.remarks);
      setCertificateNo(
        formatted.certificateNo ||
          (formatted.certificate_type === "INCOME"
            ? `INC-${Date.now()}`
            : `CHA-${Date.now()}`),
      );
      setVerifiedAnnualIncome(
        formatted.verifiedAnnualIncome || formatted.annualIncome || "",
      );

      if (formatted.status === "Approved" || formatted.status === "APPROVED") {
        setDocumentAuditCheck(true);
        setSignatureMatch(true);
        setBillsVerified(true);
      }
    } catch (err) {
      console.error("Error loading certificate details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertDetails();
  }, [id]);

  // Show confirm modal before approving
  const handleApproveClick = () => {
    if (!signatureMatch || !billsVerified) {
      setShowConfirmModal(true);
    } else {
      handleApprove();
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    const payload = {
      status: "APPROVED",
      personalKnown,
      personalKnownSince,
      natureOfOtherEvidences,
      convictedByCourt,
      convictedDetails,
      publicActivitiesInterest,
      publicActivitiesDetails,
      character,
      remarks,
      certificateNo,
      verifiedAnnualIncome,
      officerName: profile.fullName,
    };

    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve certificate.");
      }

      const result = await response.json();

      // Set success message
      setSuccessMessage(`✅ Certificate request ${id} approved successfully!`);
      scrollToTop();

      // Add notification
      addNotification("resident", {
        type: "certificate",
        title: "Certificate Approved",
        message: `Your ${certRequest.type} has been approved by ${profile.fullName}.`,
        link: "/ResidentDashboard/certificates",
      });

      // Refresh the data
      await loadCertDetails();

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/OfficerDashboard/certificates");
      }, 2500);
    } catch (err) {
      console.error("Error approving certificate:", err);
      setError(err.message);
      scrollToTop();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setError("Please enter a rejection reason.");
      scrollToTop();
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/certificates/${id}/action`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason: rejectReason,
          remarks: remarks,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject certificate.");
      }

      const result = await response.json();

      setShowRejectModal(false);
      setRejectReason("");

      // Set success message
      setSuccessMessage(
        `❌ Certificate request ${id} rejected. Reason: ${rejectReason}`,
      );
      scrollToTop();

      // Add notification
      addNotification("resident", {
        type: "certificate",
        title: "Certificate Rejected",
        message: `Your ${certRequest.type} was rejected. Reason: ${rejectReason}`,
        link: "/ResidentDashboard/certificates",
      });

      await loadCertDetails();

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/OfficerDashboard/certificates");
      }, 2500);
    } catch (err) {
      console.error("Error rejecting certificate:", err);
      setError(err.message);
      scrollToTop();
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 min-h-screen text-[18px] text-[#64748b] font-medium bg-[#F7FAFC]">
        Loading request details...
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <div className="flex items-center justify-center p-20 min-h-screen text-[18px] text-red-500 font-medium bg-[#F7FAFC]">
        {error}
        <button
          onClick={handleCancel}
          className="ml-4 py-2 px-6 bg-[#1B365D] text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isCharacterCert = certRequest.certificate_type === "CHARACTER";

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      <OfficerNavbar />
      <div className="flex flex-1 w-full">
        <OSidebar />
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          {/* Top Ref for Scrolling */}
          <div ref={topRef}></div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[13.5px] text-[#64748b] mb-4 font-semibold text-left">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/OfficerDashboard/certificates")}
            >
              Certificates Services
            </span>
            <span>➔</span>
            <span className="text-[#1e293b]">Request Details</span>
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
          {error && !successMessage && (
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
                <span className="font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
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

          <div className="flex justify-between items-center mb-6 text-left">
            <div>
              <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
                Request Details - {certRequest.type}
              </h2>
              <span className="text-[14.5px] text-[#64748b] font-semibold">
                Reviewing application ID: {certRequest.id}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold uppercase ${
                certRequest.status === "Approved" ||
                certRequest.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : certRequest.status === "Rejected" ||
                      certRequest.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {certRequest.status === "Pending" ||
              certRequest.status === "PENDING"
                ? "Pending Review"
                : certRequest.status}
            </span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            <div className="lg:col-span-2 bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm text-left">
              {/* Resident Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center font-bold text-lg">
                    {certRequest.name
                      ? certRequest.name.charAt(0).toUpperCase()
                      : "R"}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1B365D] m-0 flex items-center gap-2">
                      <span>{certRequest.name}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      NIC: {certRequest.nic}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details based on certificate type */}
              {isCharacterCert ? (
                <CharacterCertificateDetails certRequest={certRequest} />
              ) : (
                <IncomeCertificateDetails certRequest={certRequest} />
              )}

              {/* Document Upload Section */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-[14px] font-bold text-[#1B365D] uppercase tracking-wider mb-4 bg-blue-50/80 py-2 px-3 rounded flex items-center justify-between">
                  <span>Uploaded Resident Documents & Signature</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentItem
                    title="1. Resident Signature"
                    url={certRequest.signatureUrl}
                    fallback="Signature provided via physical registry"
                    onPreview={(url) =>
                      setDocPreviewModal({
                        isOpen: true,
                        title: "Resident Signature",
                        url,
                      })
                    }
                  />
                  <DocumentItem
                    title="2. Birth Certificate"
                    url={certRequest.birthCertUrl}
                    fallback={
                      isCharacterCert
                        ? "Stored in Household Civil Registry"
                        : "Not required for this certificate"
                    }
                    onPreview={(url) =>
                      setDocPreviewModal({
                        isOpen: true,
                        title: "Birth Certificate",
                        url,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 text-left">
              <VerificationChecklist
                addressCheck={addressCheck}
                setAddressCheck={setAddressCheck}
                nicCheck={nicCheck}
                setNicCheck={setNicCheck}
                documentAuditCheck={documentAuditCheck}
                certType={certRequest.type}
              />
              <OfficerQuickCheck
                signatureMatch={signatureMatch}
                setSignatureMatch={setSignatureMatch}
                billsVerified={billsVerified}
                setBillsVerified={setBillsVerified}
              />
            </div>
          </div>

          {/* Officer Assessment Form - Only for Pending */}
          {(certRequest.status === "Pending" ||
            certRequest.status === "PENDING") && (
            <OfficerAssessmentForm
              isCharacterCert={isCharacterCert}
              personalKnown={personalKnown}
              setPersonalKnown={setPersonalKnown}
              personalKnownSince={personalKnownSince}
              setPersonalKnownSince={setPersonalKnownSince}
              natureOfOtherEvidences={natureOfOtherEvidences}
              setNatureOfOtherEvidences={setNatureOfOtherEvidences}
              convictedByCourt={convictedByCourt}
              setConvictedByCourt={setConvictedByCourt}
              convictedDetails={convictedDetails}
              setConvictedDetails={setConvictedDetails}
              publicActivitiesInterest={publicActivitiesInterest}
              setPublicActivitiesInterest={setPublicActivitiesInterest}
              publicActivitiesDetails={publicActivitiesDetails}
              setPublicActivitiesDetails={setPublicActivitiesDetails}
              character={character}
              setCharacter={setCharacter}
              remarks={remarks}
              setRemarks={setRemarks}
              certificateNo={certificateNo}
              setCertificateNo={setCertificateNo}
              verifiedAnnualIncome={verifiedAnnualIncome}
              setVerifiedAnnualIncome={setVerifiedAnnualIncome}
              certRequest={certRequest}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mb-8 font-sans">
            <button
              onClick={handleCancel}
              className="bg-transparent hover:bg-gray-100 text-[#475569] border border-[#cbd5e1] px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer"
            >
              Cancel Review
            </button>

            {(certRequest.status === "Pending" ||
              certRequest.status === "PENDING") && (
              <>
                <button
                  onClick={handleOpenRejectModal}
                  disabled={isProcessing}
                  className="bg-transparent hover:bg-red-50 text-red-600 border border-red-600 px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer flex items-center gap-1.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Application
                </button>
                <button
                  onClick={handleApproveClick}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 px-8 py-2.5 rounded-full text-[14px] font-bold cursor-pointer flex items-center gap-1.5 shadow-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Approve Application"}
                </button>
              </>
            )}
          </div>

          <ChatbotButton onOpenHelp={onOpenHelp} />
        </main>
      </div>

      <Footer />

      {/* Confirm Modal - Replaces window.confirm */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">
                Confirm Approval
              </h3>
              <button
                onClick={handleCloseConfirmModal}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer bg-transparent border-0"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-6 h-6 text-amber-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-bold text-amber-700">
                  Quick Check Items Not Complete
                </span>
              </div>
              <p className="text-sm text-gray-600">
                You have not checked all Officer Quick Check items. Do you want
                to continue with the approval anyway?
              </p>
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">
                Rejection Reason
              </h3>
              <button
                onClick={handleCloseRejectModal}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer bg-transparent border-0"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this certificate request.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent resize-none h-24"
            />

            {error && !successMessage && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={handleCloseRejectModal}
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

      {/* Document Preview Modal */}
      {docPreviewModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative border border-slate-200 text-left animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#1B365D] m-0">
                {docPreviewModal.title}
              </h3>
              <button
                onClick={() =>
                  setDocPreviewModal({ isOpen: false, title: "", url: "" })
                }
                className="text-slate-400 hover:text-slate-700 text-xl font-bold bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl flex items-center justify-center max-h-[70vh] overflow-auto">
              {docPreviewModal.url?.startsWith("data:image") ||
              docPreviewModal.url?.startsWith("http") ? (
                <img
                  src={docPreviewModal.url}
                  alt={docPreviewModal.title}
                  className="max-h-[60vh] max-w-full object-contain rounded shadow"
                />
              ) : (
                <div className="text-center text-slate-500 py-10">
                  No document preview available
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  setDocPreviewModal({ isOpen: false, title: "", url: "" })
                }
                className="py-2 px-6 bg-[#1B365D] text-white rounded-lg text-xs font-bold hover:bg-[#005BBD] cursor-pointer border-0"
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

// ============================================================
// SUB-COMPONENTS
// ============================================================

function CharacterCertificateDetails({ certRequest }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
          Section (1) - Divisional & Personal Knowledge
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
          <div>
            <span className="text-slate-500 font-semibold block">
              District & Divisional Secretariat:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.divisionalSecretariat || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              GN Division & Number:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.gnDivisionNumber || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Personally known to GN?
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.personalKnown || "No"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              If so, since when?
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.personalKnown === "Yes"
                ? certRequest.personalKnownSince || "Since birth"
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
          Section (2) - Applicant Particulars
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block">
              Name in Full:
            </span>
            <span className="text-slate-800 font-bold">{certRequest.name}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block">
              Residential Address:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.address}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Sex:</span>
            <span className="text-slate-800 font-bold">
              {certRequest.sex || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Age:</span>
            <span className="text-slate-800 font-bold">
              {certRequest.age || "N/A"} Years
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Civil Status:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.civilStatus || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Nationality:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.nationality || "Sri Lankan"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Religion:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.religion || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Occupation:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.occupation || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              NIC Number:
            </span>
            <span className="text-slate-800 font-bold font-mono">
              {certRequest.nic}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block">Purpose:</span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded font-bold block mt-1">
              {certRequest.purpose}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[13.5px] font-bold text-[#1B365D] uppercase tracking-wider mb-3 bg-slate-50 py-1.5 px-3 rounded">
          Section (3) - Residence & Background Evidence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px] pl-2">
          <div>
            <span className="text-slate-500 font-semibold block">
              Period of residence in GN Division:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.gnPeriod || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Residence proof:
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.natureOfOtherEvidences || "Utility bills"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Convicted by Court?
            </span>
            <span
              className={`font-bold ${certRequest.convictedByCourt === "Yes" ? "text-red-600" : "text-slate-800"}`}
            >
              {certRequest.convictedByCourt === "Yes"
                ? `Yes - ${certRequest.convictedDetails}`
                : "No"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">
              Public/Social Activities?
            </span>
            <span className="text-slate-800 font-bold">
              {certRequest.publicActivitiesInterest === "Yes"
                ? `Yes - ${certRequest.publicActivitiesDetails}`
                : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeCertificateDetails({ certRequest }) {
  const details = certRequest.details || {};
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
            Full Name
          </span>
          <span className="text-[14.5px] font-bold text-[#1e293b]">
            {certRequest.name}
          </span>
        </div>
        <div>
          <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
            NIC Number
          </span>
          <span className="text-[14.5px] font-bold text-[#1e293b]">
            {certRequest.nic}
          </span>
        </div>
      </div>
      <div>
        <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
          Address
        </span>
        <span className="text-[14.5px] font-bold text-[#1e293b]">
          {certRequest.address}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
            GN Division
          </span>
          <span className="text-[14.5px] font-bold text-[#1e293b]">
            {certRequest.gnDivisionNumber || certRequest.division}
          </span>
        </div>
        <div>
          <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
            Income Stream
          </span>
          <span className="text-[14.5px] font-bold text-[#1e293b] uppercase">
            {certRequest.incomeStream || "N/A"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-1">
            Declared Annual Income
          </span>
          <span className="text-[14.5px] font-bold text-emerald-700">
            Rs. {certRequest.annualIncome || "0"}
          </span>
        </div>
      </div>
      <div>
        <span className="block text-[12px] text-[#64748b] font-bold uppercase mb-2">
          Purpose
        </span>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[13.5px] text-[#1E3A8A] font-medium">
          "{certRequest.purpose}"
        </div>
      </div>
    </div>
  );
}

function VerificationChecklist({
  addressCheck,
  setAddressCheck,
  nicCheck,
  setNicCheck,
  documentAuditCheck,
  certType,
}) {
  return (
    <div className="bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-sm">
      <h3 className="text-[15.5px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3 mb-4 m-0">
        Verification Checklist
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <input
            type="checkbox"
            checked={addressCheck}
            onChange={(e) => setAddressCheck(e.target.checked)}
            className="mt-1 cursor-pointer w-4 h-4 accent-emerald-600 rounded"
          />
          <div>
            <span className="block text-[13.5px] font-bold text-[#1e293b]">
              Address Verified
            </span>
            <span className="text-[11.5px] text-[#64748b]">
              Cross-checked with voter registry
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <input
            type="checkbox"
            checked={nicCheck}
            onChange={(e) => setNicCheck(e.target.checked)}
            className="mt-1 cursor-pointer w-4 h-4 accent-emerald-600 rounded"
          />
          <div>
            <span className="block text-[13.5px] font-bold text-[#1e293b]">
              NIC Verified
            </span>
            <span className="text-[11.5px] text-[#64748b]">
              Authenticated via DRP API
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-bold mt-0.5 flex-shrink-0 ${documentAuditCheck ? "bg-emerald-600" : "bg-amber-500"}`}
          >
            {documentAuditCheck ? "✓" : "!"}
          </div>
          <div>
            <span className="block text-[13.5px] font-bold text-[#1e293b]">
              {certType} Audit
            </span>
            <span className="text-[11.5px] text-[#64748b]">
              {documentAuditCheck
                ? "Completed document review"
                : "Requires document audit"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfficerQuickCheck({
  signatureMatch,
  setSignatureMatch,
  billsVerified,
  setBillsVerified,
}) {
  return (
    <div className="border border-dashed border-[#fedc9b] bg-[#fdf8f0] p-5 rounded-2xl">
      <h4 className="m-0 mb-4 text-[12px] uppercase text-[#854d0e] font-extrabold tracking-wide">
        Officer Quick Check
      </h4>
      <div className="flex flex-col gap-3.5">
        <label className="flex gap-2.5 items-center cursor-pointer text-[13.5px] text-[#1e293b] font-bold">
          <input
            type="checkbox"
            checked={signatureMatch}
            onChange={(e) => setSignatureMatch(e.target.checked)}
            className="w-4 h-4 accent-[#1B365D]"
          />
          <span>Signature matches record</span>
        </label>
        <label className="flex gap-2.5 items-center cursor-pointer text-[13.5px] text-[#1e293b] font-bold">
          <input
            type="checkbox"
            checked={billsVerified}
            onChange={(e) => setBillsVerified(e.target.checked)}
            className="w-4 h-4 accent-[#1B365D]"
          />
          <span>Supporting bills verified</span>
        </label>
      </div>
    </div>
  );
}

function DocumentItem({ title, url, fallback, onPreview }) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
      <div>
        <span className="text-slate-500 font-bold text-xs uppercase block mb-1">
          {title}
        </span>
        {url ? (
          <div className="mt-2 bg-white p-2 border border-slate-200 rounded-lg flex items-center justify-between">
            {url.startsWith("data:image") ? (
              <img
                src={url}
                alt={title}
                className="h-14 max-w-[160px] object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onPreview(url)}
              />
            ) : (
              <div className="h-12 w-12 bg-blue-100 text-blue-800 font-bold text-xs rounded flex items-center justify-center">
                PDF
              </div>
            )}
            <button
              onClick={() => onPreview(url)}
              className="text-xs bg-[#1B365D] text-white px-2.5 py-1 rounded font-semibold hover:bg-[#005BBD] cursor-pointer border-0"
            >
              🔍 Inspect
            </button>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs font-semibold rounded border border-amber-200">
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerAssessmentForm({
  isCharacterCert,
  personalKnown,
  setPersonalKnown,
  personalKnownSince,
  setPersonalKnownSince,
  natureOfOtherEvidences,
  setNatureOfOtherEvidences,
  convictedByCourt,
  setConvictedByCourt,
  convictedDetails,
  setConvictedDetails,
  publicActivitiesInterest,
  setPublicActivitiesInterest,
  publicActivitiesDetails,
  setPublicActivitiesDetails,
  character,
  setCharacter,
  remarks,
  setRemarks,
  certificateNo,
  setCertificateNo,
  verifiedAnnualIncome,
  setVerifiedAnnualIncome,
  certRequest,
}) {
  return (
    <div className="bg-white border border-[#fedc9b] rounded-2xl p-8 shadow-md text-left mb-8 animate-in fade-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 border-b border-[#fedc9b]/40 pb-4 mb-6 font-sans">
        <span className="text-xl">✍️</span>
        <h3 className="text-[17px] font-bold text-[#854d0e] m-0">
          Grama Niladhari Official Assessment Form
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13.5px] font-sans">
        {isCharacterCert ? (
          <>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Is applicant personally known to you?
              </label>
              <select
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                value={personalKnown}
                onChange={(e) => setPersonalKnown(e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                If yes, since when?
              </label>
              <input
                type="text"
                placeholder="e.g. 3 years, Birth"
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                value={personalKnownSince}
                onChange={(e) => setPersonalKnownSince(e.target.value)}
                disabled={personalKnown === "No"}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Proof of Residence Evidence Checked
              </label>
              <input
                type="text"
                placeholder="e.g. Utility Bills / Voter List"
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                value={natureOfOtherEvidences}
                onChange={(e) => setNatureOfOtherEvidences(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Any record of conviction in Court?
              </label>
              <select
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                value={convictedByCourt}
                onChange={(e) => setConvictedByCourt(e.target.value)}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="font-bold text-[#334155] mb-1.5">
                Conviction Details (if applicable)
              </label>
              <input
                type="text"
                placeholder="Write details if any"
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                value={convictedDetails}
                onChange={(e) => setConvictedDetails(e.target.value)}
                disabled={convictedByCourt === "No"}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Interest in social work/community?
              </label>
              <select
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white"
                value={publicActivitiesInterest}
                onChange={(e) => setPublicActivitiesInterest(e.target.value)}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Public activities details
              </label>
              <input
                type="text"
                placeholder="Describe activities"
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
                value={publicActivitiesDetails}
                onChange={(e) => setPublicActivitiesDetails(e.target.value)}
                disabled={publicActivitiesInterest === "No"}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Overall Character Assessment
              </label>
              <select
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg bg-white font-bold"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              >
                <option value="Good">Good</option>
                <option value="Exemplary">Exemplary</option>
                <option value="Satisfactory">Satisfactory</option>
                <option value="Unsatisfactory">Unsatisfactory</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Certificate Serial Number
              </label>
              <input
                type="text"
                className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg font-bold"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Verified Annual Income (Rs.)
              </label>
              <input
                type="number"
                placeholder="Enter verified annual income"
                className="w-full py-2.5 px-3.5 border border-[#cbd5e1] rounded-lg font-bold text-emerald-800"
                value={verifiedAnnualIncome}
                onChange={(e) => setVerifiedAnnualIncome(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-[#334155] mb-1.5">
                Certificate Serial Number
              </label>
              <input
                type="text"
                className="w-full py-2.5 px-3.5 border border-[#cbd5e1] rounded-lg font-bold"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <span className="font-bold text-[#334155] block mb-2">
                Supporting Documents Audited:
              </span>
              <div className="flex flex-wrap gap-5 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-emerald-600 rounded"
                    defaultChecked={certRequest?.incomeStream === "Paddy"}
                  />{" "}
                  License/Permit/Grant sheet
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-emerald-600 rounded"
                    defaultChecked={certRequest?.incomeStream === "Business"}
                  />{" "}
                  Business Registration
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#475569]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-emerald-600 rounded"
                    defaultChecked={certRequest?.incomeStream === "Laborer"}
                  />{" "}
                  Salary Slip / Declaration
                </label>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col md:col-span-2">
          <label className="font-bold text-[#334155] mb-1.5">
            Grama Niladhari Remarks & Assessment Notes
          </label>
          <textarea
            rows="3"
            placeholder="Enter additional remarks"
            className="w-full py-2 px-3 border border-[#cbd5e1] rounded-lg"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default OfficerCertificateDetails;
