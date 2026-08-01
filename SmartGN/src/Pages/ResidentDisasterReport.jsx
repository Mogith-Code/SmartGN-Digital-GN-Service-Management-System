import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function ResidentDisasterReport({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const DisasterTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් පත්‍රයේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
    },
  };

  const t = DisasterTranslations[lang] || DisasterTranslations.EN;

  // Retrieve username and division/ID from navigation state or localStorage
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  // Form Fields
  const [disasterType, setDisasterType] = useState("Flood");
  const [locationArea, setLocationArea] = useState("");
  const [severity, setSeverity] = useState("low severity");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [aidRequested, setAidRequested] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State for tracked disasters
  const [myDisasters, setMyDisasters] = useState([]);

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

  // ✅ Check if NIC images are missing - used for alert
  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  // ✅ Fetch profile to get NIC images
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

          // ✅ Auto-hide alert if both NIC images exist
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

  // ✅ Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Re-fetch profile when updated
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

  // Load disasters on mount
  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    try {
      const response = await fetch("/api/disasters/resident", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to load disaster history.");
      const data = await response.json();
      const formatted = data.map((item) => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: successUser,
        date: item.request_date ? item.request_date.split("T")[0] : "",
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || "None specified",
        status: item.status,
        remarks: item.officer_remarks || "",
      }));
      setMyDisasters(formatted);
    } catch (err) {
      console.error(err);
      // Fallback
      const saved = localStorage.getItem("smartgn_disaster_reports");
      if (saved) {
        const allDisasters = JSON.parse(saved);
        const filtered = allDisasters.filter(
          (item) => item.reporter === successUser,
        );
        setMyDisasters(filtered);
      }
    }
  };

  // Handle form reset
  const handleReset = () => {
    setDisasterType("Flood");
    setLocationArea("");
    setSeverity("low severity");
    setDescription("");
    setContactNumber("");
    setAidRequested("");
    setErrorMessage("");
  };

  // Handle submit new report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationArea || !description || !contactNumber) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("/api/disasters/report", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          disasterType,
          description,
          severity,
          location: locationArea,
          contact: contactNumber,
          aidRequested,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report.");
      }

      handleReset();
      loadDisasters();
      alert(
        "Disaster report submitted successfully! The Grama Niladhari division office has been notified.",
      );
    } catch (err) {
      setErrorMessage(err.message || "Error submitting report.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
            <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]  ">
              Disaster Damage Report & Relief Application
            </h2>

            {/* ✅ NIC upload alert - Check if NIC images are missing */}
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
                  {/* Type of Disaster */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="disasterSelect"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Type of Disaster
                    </label>
                    <select
                      id="disasterSelect"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
                      value={disasterType}
                      onChange={(e) => setDisasterType(e.target.value)}
                      required
                    >
                      <option value="Flood">Flood</option>
                      <option value="Landslide">Landslide / Earth Slip</option>
                      <option value="Fire">Fire</option>
                      <option value="Cyclone">Cyclone / Storm</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Drought">Drought</option>
                      <option value="Pandemic">Pandemic</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="severitySelect"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Estimated Severity
                    </label>
                    <select
                      id="severitySelect"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all bg-white"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      required
                    >
                      <option value="low severity">Low Severity</option>
                      <option value="medium severity">Medium Severity</option>
                      <option value="high severity">High Severity</option>
                    </select>
                  </div>

                  {/* Location Area */}
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
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                      placeholder="e.g. 45/2 Main Road Area, Colombo"
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      required
                    />
                  </div>

                  {/* Contact number */}
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
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                      placeholder="e.g. 077XXXXXXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="descInput"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Description of Damages Sustained
                    </label>
                    <textarea
                      id="descInput"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all resize-none"
                      rows="3"
                      placeholder="Describe crop damage, structural damage, water levels, or loss..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Relief aid */}
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
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                      placeholder="Specify emergency items or financial help..."
                      value={aidRequested}
                      onChange={(e) => setAidRequested(e.target.value)}
                    />
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
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center gap-1.5"
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
                    className="bg-[#005BBD] hover:bg-[#1B365D] text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm transition-colors flex items-center gap-1.5"
                  >
                    Submit Report
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

            {/* Right Column: History Tracking */}
            <div className="lg:col-span-5 bg-white border border-[#2D37482D] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4">
                Your Reported Disasters History
              </h3>

              <div className="flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-1">
                {myDisasters.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 font-medium text-sm border border-dashed border-gray-200 rounded-xl">
                    No reported disasters registered to your account yet.
                  </div>
                ) : (
                  myDisasters.map((disaster) => {
                    const sevLower = (disaster.severity || "").toLowerCase();
                    const cardClass = sevLower.includes("high") || sevLower.includes("critical")
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : sevLower.includes("medium")
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-[#F8FAFC] border-gray-200 text-[#1B365D]";

                    const severityTextClass = sevLower.includes("high") || sevLower.includes("critical")
                      ? "bg-rose-100 text-rose-800"
                      : sevLower.includes("medium")
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-800";

                    return (
                      <div
                        key={disaster.id}
                        className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-xs bg-white text-left"
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-[#1B365D] text-base">
                            {disaster.type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${severityTextClass}`}
                          >
                            {disaster.severity}
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
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase
                            ${
                              disaster.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : disaster.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-sky-50 text-sky-700 border-sky-200"
                            }`}
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

      {/* Floating AI Assistant Chatbot Button */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ResidentDisasterReport;
