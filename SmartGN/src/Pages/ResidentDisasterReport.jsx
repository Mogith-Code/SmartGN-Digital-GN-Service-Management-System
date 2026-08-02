import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import { addNotification } from "../utils/notifications";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function ResidentDisasterReport({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  // Ref for scrolling to top
  const topRef = useRef(null);

  const DisasterTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
      success: "Disaster report submitted successfully!",
      submitting: "Submitting...",
      submitReport: "Submit Report",
      reset: "Reset",
      close: "Close",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
      success: "ව්‍යසන වාර්තාව සාර්ථකව ඉදිරිපත් කරන ලදී!",
      submitting: "ඉදිරිපත් කරමින්...",
      submitReport: "වාර්තාව ඉදිරිපත් කරන්න",
      reset: "නැවත සකසන්න",
      close: "වසන්න",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
      success: "பேரழிவு அறிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      submitting: "சமர்ப்பிக்கிறது...",
      submitReport: "அறிக்கையை சமர்ப்பிக்கவும்",
      reset: "மீட்டமைக்கவும்",
      close: "மூடு",
    },
  };

  const t = DisasterTranslations[lang] || DisasterTranslations.EN;

  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  const [disasterType, setDisasterType] = useState("Flood");
  const [locationArea, setLocationArea] = useState("");
  const [severity, setSeverity] = useState("low severity");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [aidRequested, setAidRequested] = useState("");
  const [damageImage, setDamageImage] = useState(null);
  const [damageImageName, setDamageImageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [myDisasters, setMyDisasters] = useState([]);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  // Map display names to database ENUM values
  const getDatabaseDisasterType = (displayType) => {
    const typeMap = {
      Flood: "Flood",
      Landslide: "Landslide",
      Fire: "Fire",
      Cyclone: "Cyclone",
      "Earth Slip": "Earth_Slip", // Map "Earth Slip" to "Earth_Slip" for database
      Other: "Other",
    };
    return typeMap[displayType] || displayType;
  };

  // Map database values to display names
  const getDisplayDisasterType = (dbValue) => {
    const displayMap = {
      Flood: "Flood",
      Landslide: "Landslide",
      Fire: "Fire",
      Cyclone: "Cyclone",
      Earth_Slip: "Earth Slip", // Map "Earth_Slip" back to "Earth Slip" for display
      Other: "Other",
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

  const handleDamageImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDamageImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDamageImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDamageImage = () => {
    setDamageImage(null);
    setDamageImageName("");
  };

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

  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

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

  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/disasters/resident", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to load disaster history.");
      const data = await response.json();

      // Ensure data is an array
      const disasterData = Array.isArray(data) ? data : [];

      const formatted = disasterData.map((item) => ({
        id: item.disaster_id || item.disaster_request_id,
        type: getDisplayDisasterType(item.disaster_type) || "Unknown",
        severity: item.severity || "MEDIUM",
        location: item.location || "N/A",
        reporter: successUser,
        date: item.request_date ? item.request_date.split("T")[0] : "",
        description: item.description || "No description provided",
        contact: item.contact_number || "N/A",
        aidRequested: item.aid_requested || "None specified",
        imagePath: item.image_path || null,
        status: item.status || "Pending",
        remarks: item.officer_remarks || "",
      }));
      setMyDisasters(formatted);
    } catch (err) {
      console.error("Error loading disasters:", err);
      setMyDisasters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDisasterType("Flood");
    setLocationArea("");
    setSeverity("low severity");
    setDescription("");
    setContactNumber("");
    setAidRequested("");
    setDamageImage(null);
    setDamageImageName("");
    setErrorMessage("");
    setSuccessMessage("");
    setSubmissionComplete(false);
    scrollToTop();
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
    setSubmissionComplete(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationArea || !description || !contactNumber) {
      setErrorMessage("Please fill in all required fields.");
      setSuccessMessage("");
      scrollToTop();
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    // Convert display name to database ENUM value
    const dbDisasterType = getDatabaseDisasterType(disasterType);

    try {
      const response = await fetch("/api/disasters/report", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          disasterType: dbDisasterType, // Send mapped value to database
          description,
          severity:
            severity === "low severity"
              ? "LOW"
              : severity === "medium severity"
                ? "MEDIUM"
                : "HIGH",
          location: locationArea,
          contact: contactNumber,
          aidRequested: aidRequested || null,
          imagePath: damageImage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report.");
      }

      // Set success message
      setSuccessMessage(
        `${t.success} Report ID: ${data.requestNumber || data.id || "N/A"}`,
      );
      setSubmissionComplete(true);
      setIsLoading(false);

      // Scroll to top to show success message
      scrollToTop();

      // Trigger notifications
      addNotification("officer", {
        type: "disaster",
        title: "New Disaster Report",
        message: `New ${disasterType} disaster report received from ${successUser}.`,
        link: "/OfficerDashboard/OfficerDisasterReports",
      });

      addNotification("resident", {
        type: "disaster",
        title: "Disaster Report Submitted",
        message: `Your ${disasterType} disaster report has been submitted for review.`,
        link: "/ResidentDashboard/RDisaster",
      });

      // Reload the list without resetting the form (so success message stays)
      await loadDisasters();
    } catch (err) {
      setErrorMessage(err.message || "Error submitting report.");
      setSuccessMessage("");
      setIsLoading(false);
    }
  };

  const getSeverityDisplay = (severity) => {
    const map = {
      LOW: "low severity",
      MEDIUM: "medium severity",
      HIGH: "high severity",
      CRITICAL: "critical severity",
    };
    return map[severity] || severity?.toLowerCase() || "medium severity";
  };

  const getStatusBadgeClass = (status) => {
    if (
      status === "Resolved" ||
      status === "APPROVED" ||
      status === "Approved"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (status === "PENDING" || status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    } else if (status === "REJECTED" || status === "Rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Top Ref for Scrolling */}
          <div ref={topRef}></div>

          <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
            <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
              Disaster Damage Report & Relief Application
            </h2>

            <div className="flex justify-end -mt-[70px]">
              {showAlert && areNicImagesMissing() && (
                <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="hover:underline hover:cursor-pointer"
                      onClick={() => {
                        navigate("/ResidentDashboard/profile");
                      }}
                    >
                      {t.alert}
                    </span>
                  </div>
                  <button
                    className="bg-transparent border-0 text-[#d97706] cursor-pointer p-1 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#fde68a] z-1 ml-3"
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

          {/* Success Message */}
          {successMessage && (
            <div className="mx-[30px] mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
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
            <div className="mx-[30px] mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
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
                onClick={() => setErrorMessage("")}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left m-[30px]">
            {/* Left Column: Form Card */}
            <div className="lg:col-span-7 bg-white border border-[#2D37482D] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4">
                Report Disaster Damage
              </h3>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm rounded-xl p-4 mb-6">
                Use this form to report damage caused by natural disasters to
                your property, crops, or livelihood and apply for official Grama
                Niladhari relief evaluation.
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="disasterSelect"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Type of Disaster
                    </label>
                    <select
                      id="disasterSelect"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      value={disasterType}
                      onChange={(e) => setDisasterType(e.target.value)}
                      required
                      disabled={submissionComplete}
                    >
                      <option value="Flood">Flood</option>
                      <option value="Landslide">Landslide</option>
                      <option value="Fire">Fire</option>
                      <option value="Cyclone">Storm / Cyclone</option>
                      <option value="Earth Slip">Earth Slip</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="severitySelect"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Estimated Severity
                    </label>
                    <select
                      id="severitySelect"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      required
                      disabled={submissionComplete}
                    >
                      <option value="low severity">Low Severity</option>
                      <option value="medium severity">Medium Severity</option>
                      <option value="high severity">High Severity</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="locInput"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Location / Address of Damage
                    </label>
                    <input
                      type="text"
                      id="locInput"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. 45/2 Main Road Area, Colombo"
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="contactInput"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      id="contactInput"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. 077XXXXXXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                      disabled={submissionComplete}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="descInput"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Description of Damages Sustained
                    </label>
                    <textarea
                      id="descInput"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      rows="3"
                      placeholder="Describe crop damage, structural damage, water levels, or loss..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      disabled={submissionComplete}
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="reliefInput"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Relief Aid Required (e.g. Food, Shelter, Medical,
                      Financial)
                    </label>
                    <input
                      type="text"
                      id="reliefInput"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Specify emergency items or financial help..."
                      value={aidRequested}
                      onChange={(e) => setAidRequested(e.target.value)}
                      disabled={submissionComplete}
                    />
                  </div>

                  {/* Damage Photo Upload */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2 text-left">
                    <label className="text-xs font-bold text-[#475569]">
                      Attach Affected Area / Damage Photo (Proof for GN
                      Verification)
                    </label>
                    {damageImage ? (
                      <div className="border border-emerald-300 bg-emerald-50 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={damageImage}
                            alt="Damage preview"
                            className="w-14 h-14 object-cover rounded-lg border border-emerald-200 shadow-xs"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-emerald-900 truncate max-w-[220px]">
                              {damageImageName || "affected_area_photo.jpg"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              ✓ Proof photo attached for GN verification
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeDamageImage}
                          className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-1.5 px-3 rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={submissionComplete}
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-400"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span className="text-xs text-gray-500 font-medium">
                          Upload photo of affected house / land / crops (.jpg,
                          .png)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="damageImageFile"
                          disabled={submissionComplete}
                          onChange={handleDamageImageChange}
                        />
                        <label
                          htmlFor="damageImageFile"
                          className="bg-[#005BBD]/10 hover:bg-[#005BBD]/20 text-[#005BBD] text-xs font-bold py-1.5 px-3.5 rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Choose Photo
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {errorMessage && !successMessage && (
                  <p className="text-rose-500 text-xs font-semibold m-0 text-left">
                    {errorMessage}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    {t.reset}
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
                    className="bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || submissionComplete}
                  >
                    {isLoading ? (
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
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        {t.submitReport}
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
              </form>
            </div>

            {/* Right Column: History Tracking */}
            <div className="lg:col-span-5 bg-white border border-[#2D37482D] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4">
                Your Reported Disasters History
              </h3>

              <div className="flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-1">
                {isLoading && !myDisasters.length ? (
                  <div className="py-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : myDisasters.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 font-medium text-sm border border-dashed border-gray-200 rounded-xl">
                    No reported disasters registered to your account yet.
                  </div>
                ) : (
                  myDisasters.map((disaster) => {
                    const severityDisplay = getSeverityDisplay(
                      disaster.severity,
                    );
                    const isHigh =
                      disaster.severity === "HIGH" ||
                      disaster.severity === "CRITICAL";

                    return (
                      <div
                        key={disaster.id}
                        className={`border rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-xs bg-white text-left ${
                          isHigh
                            ? "border-rose-200 bg-rose-50/30"
                            : disaster.severity === "MEDIUM"
                              ? "border-amber-200 bg-amber-50/30"
                              : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-[#1B365D] text-base">
                            {disaster.type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isHigh
                                ? "bg-rose-100 text-rose-800"
                                : disaster.severity === "MEDIUM"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {severityDisplay}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-xs text-gray-600 font-medium">
                          <div>
                            <strong>Location:</strong> {disaster.location}
                          </div>
                          <div>
                            <strong>Date:</strong> {disaster.date}
                          </div>
                          <div>
                            <strong>Relief Request:</strong>{" "}
                            {disaster.aidRequested}
                          </div>
                          <div className="mt-1 bg-slate-50 p-2 rounded text-slate-700 text-[11px] leading-relaxed">
                            {disaster.description}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                          <span className="text-[11px] text-gray-400 font-bold">
                            Status Tracking:
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${getStatusBadgeClass(disaster.status)}`}
                          >
                            {disaster.status || "Pending"}
                          </span>
                        </div>

                        {disaster.remarks && (
                          <div className="mt-1 bg-amber-50/70 border border-amber-100 rounded-lg p-3">
                            <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold mb-1">
                              Official GN Remarks & Action:
                            </div>
                            <p className="m-0 text-amber-900 text-xs leading-relaxed">
                              {disaster.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />

      <Footer />
    </div>
  );
}

export default ResidentDisasterReport;
