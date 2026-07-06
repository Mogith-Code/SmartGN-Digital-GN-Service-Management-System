import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import logo from "../assets/logo.png";

function ApplyCharacterCertificate({ onOpenHelp }) {
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
  const [divisionalSecretariat, setDivisionalSecretariat] = useState("");
  const [gnDivisionNumber, setGnDivisionNumber] = useState("");
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
    userDivision.length === 12 || userDivision.length === 10
      ? userDivision
      : "",
  );
  const [fatherName, setFatherName] = useState("");
  const [fatherAddress, setFatherAddress] = useState("");
  const [purpose, setPurpose] = useState("");

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !divisionalSecretariat ||
      !gnDivisionNumber ||
      !fullName ||
      !age ||
      !address ||
      !sex ||
      !civilStatus ||
      !nationality ||
      !religion ||
      !nicNumber ||
      !purpose
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
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
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Failed to submit certificate application",
        );
      }

      alert("Character certificate application submitted successfully!");
      navigate("/dashboard/resident/certificates", {
        state: { successUser, division: userDivision },
      });
    } catch (err) {
      console.warn("API error, using Local Storage fallback:", err.message);

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
        "Character certificate application submitted successfully! (Stored in Local Storage)",
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
                navigate("/dashboard/resident/certificates", {
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
            Application for Character Certificates
          </h2>

          {/* Form Container Card */}
          <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
            {/* Warning block note */}
            <div className="flex items-center justify-between py-4 px-6 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-semibold text-[14px] mb-6 text-left">
              <span>
                This certificate is issued by the Grama Niladhari of the
                division in which the applicant resides is valid only for 06
                months from the date issued.
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SECTION 1 */}
              <div className="mb-8 text-left">
                <h3 className="text-[16px] font-bold text-[#1B365D] border-b border-slate-100 pb-2 mb-4">
                  Section (1) - Divisional & Office Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="divSecretariat"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (a) District and Divisional Secretary's Division{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="divSecretariat"
                      placeholder="e.g. Gampaha, Kelaniya"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={divisionalSecretariat}
                      onChange={(e) => setDivisionalSecretariat(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="gnDivNumber"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (b) Grama Niladhari Division and Number{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="gnDivNumber"
                      placeholder="e.g. Hunupitiya North - 258"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={gnDivisionNumber}
                      onChange={(e) => setGnDivisionNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="personalKnown"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (c) Whether applicant is personally known to Grama
                      Niladhari? :
                    </label>
                    <select
                      id="personalKnown"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={personalKnown}
                      onChange={(e) => setPersonalKnown(e.target.value)}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="personalKnownSince"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (d) If so, since when? (e.g. 5 years, Birth) :
                    </label>
                    <input
                      type="text"
                      id="personalKnownSince"
                      placeholder="Specify duration or leave empty"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={personalKnownSince}
                      onChange={(e) => setPersonalKnownSince(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="mb-8 text-left">
                <h3 className="text-[16px] font-bold text-[#1B365D] border-b border-slate-100 pb-2 mb-4">
                  Section (2) - Information About Applicant
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="fullName"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (a) Name in Full <span className="text-red-500">*</span> :
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
                      htmlFor="address"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (b) Address <span className="text-red-500">*</span> :
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

                  <div className="flex flex-col">
                    <label
                      htmlFor="sex"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (c) Sex <span className="text-red-500">*</span> :
                    </label>
                    <select
                      id="sex"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] focus:outline-none focus:border-[#1B365D]"
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      required
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
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (d) Age <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="number"
                      id="age"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="civilStatus"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (e) Civil Status <span className="text-red-500">*</span> :
                    </label>
                    <select
                      id="civilStatus"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] focus:outline-none focus:border-[#1B365D]"
                      value={civilStatus}
                      onChange={(e) => setCivilStatus(e.target.value)}
                      required
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
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (f) Whether Sri Lankan by descent or registration{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="religion"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (g) Religion <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="religion"
                      placeholder="e.g. Buddhist / Christian / Hindu / Islam"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="occupation"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (h) Present Occupation :
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="villagePeriod"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (i) Period of residence in the village :
                    </label>
                    <input
                      type="text"
                      id="villagePeriod"
                      placeholder="e.g. 15 Years"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={villagePeriod}
                      onChange={(e) => setVillagePeriod(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="nic"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (j) National Identity Card No.{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="nic"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label
                      htmlFor="electoral"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (k) Number of the Electoral Register and Particulars of
                      Registration :
                    </label>
                    <input
                      type="text"
                      id="electoral"
                      placeholder="e.g. No: 124/A, Gampaha District, 2024"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={electoralRegister}
                      onChange={(e) => setElectoralRegister(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="fatherName"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (l) Name of the Father :
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="fatherAddress"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (m) Address of the Father :
                    </label>
                    <input
                      type="text"
                      id="fatherAddress"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={fatherAddress}
                      onChange={(e) => setFatherAddress(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label
                      htmlFor="purpose"
                      className="text-[13px] font-semibold text-[#334155] mb-1.5"
                    >
                      (n) Purpose for which the certificate is required{" "}
                      <span className="text-red-500">*</span> :
                    </label>
                    <input
                      type="text"
                      id="purpose"
                      placeholder="e.g. Visa Application / Private Job Placement"
                      className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                    />
                  </div>
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
                  className="py-2.5 px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center gap-1.5 shadow-md"
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
                    Certificate on Residence and Character issued by the Grama
                    Niladhari
                  </h2>
                  <span className="text-[12px] font-medium text-slate-500 block mt-1">
                    Certificate ID: DRAFT-CC-PREVIEW
                  </span>
                  <p className="text-[11px] italic text-slate-500 max-w-xl mx-auto mt-2 font-serif leading-normal">
                    This certificate is issued by the Grama Niladhari of the
                    division in which the applicant resides and is valid only
                    for 06 months from the date of issue.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="mb-6">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (1) Divisional & Grama Niladhari Division Details
                  </h3>
                  <table className="w-full text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1.5 font-bold">
                          (a) District and Divisional Secretary's Division:
                        </td>
                        <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {divisionalSecretariat || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (b) Grama Niladhari Division and Number:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnDivisionNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (c) Whether applicant is personally known to Grama
                          Niladhari?
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {personalKnown}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (d) If so, since when?
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {personalKnown === "Yes"
                            ? personalKnownSince || "Since Birth"
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2 */}
                <div className="mb-6">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (2) Information about Applicant
                  </h3>
                  <table className="w-full text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/3 py-1.5 font-bold">(a) Name:</td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fullName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">(b) Address:</td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {address || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">(c) Sex:</td>
                        <td className="w-[30%] py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {sex || "(Not specified)"}
                        </td>
                        <td className="w-[15%] py-1.5 font-bold text-center">
                          (d) Age:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {age || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">(e) Civil Status:</td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {civilStatus || "(Not specified)"}
                        </td>
                        <td className="py-1.5 font-bold text-center">
                          (f) Sri Lankan:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {nationality || "Sri Lankan"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">(g) Religion:</td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {religion || "(Not specified)"}
                        </td>
                        <td className="py-1.5 font-bold text-center">
                          (h) Occupation:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {occupation || "Unemployed / Student"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (i) Residence Period in Village:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {villagePeriod || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (j) National Identity Card No:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold"
                        >
                          {nicNumber || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (k) Electoral Register Particulars:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {electoralRegister || "Registered"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (l) Name of the Father:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fatherName || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (m) Address of the Father:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic"
                        >
                          {fatherAddress || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (n) Purpose for Certificate:
                        </td>
                        <td
                          colspan="3"
                          className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-semibold"
                        >
                          {purpose || "(Not specified)"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 3 */}
                <div className="mb-6">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (3) Other Residence & Security Information
                  </h3>
                  <table className="w-full text-[13px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-1.5 font-bold">
                          (a) Period of residence in GN Division:
                        </td>
                        <td className="w-1/2 py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {gnPeriod || "(Not specified)"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (b) Nature of other evidences in proof:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {natureOfOtherEvidences || "Utility Bill"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (c) Whether convicted by a Court of Law:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {convictedByCourt === "Yes"
                            ? `Yes - ${convictedDetails}`
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">
                          (d) Whether interested in public activities / social
                          work:
                        </td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic">
                          {publicActivitiesInterest === "Yes"
                            ? `Yes - ${publicActivitiesDetails}`
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">(e) Character:</td>
                        <td className="py-1.5 border-b border-dashed border-slate-400 text-slate-700 font-sans italic font-bold">
                          {character}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 4 */}
                <div className="mb-10">
                  <h3 className="font-sans font-bold text-[13px] text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                    (4) Grama Niladhari Remarks
                  </h3>
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-600 italic text-[12px] min-h-[50px]">
                    {remarks ||
                      "No administrative remarks added in this draft."}
                  </div>
                </div>

                {/* Certification Clause */}
                <div className="mt-8 pt-4 border-t border-slate-200 text-[12.5px] leading-relaxed">
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

export default ApplyCharacterCertificate;
