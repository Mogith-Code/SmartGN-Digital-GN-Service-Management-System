import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import Footer from "../Components/Common/Footer";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import profileIcon from "../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import backIcon from "../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import OSidebar from "../Components/Common/OSidebar";

function OfficerProfile({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Session parameters (defaults to Kamal Perera if not provided)
  const successUser = location.state?.successUser || "Kamal Perera";
  const officerIdVal = location.state?.officerId || "200324511540";

  // Banner display toggle
  const [showAlert, setShowAlert] = useState(true);

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState("VIEW");

  // Dynamic Officer Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    division: "",
    serviceTime: "",
    email: "",
    mobile: "",
    profilePhoto: null,
    idCardFront: null,
    idCardBack: null,
  });

  // Editable fields state
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editDivision, setEditDivision] = useState("");
  const [editServiceTime, setEditServiceTime] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editProfilePhoto, setEditProfilePhoto] = useState(null);
  const [editIdCardFront, setEditIdCardFront] = useState(null);
  const [editIdCardBack, setEditIdCardBack] = useState(null);

  // Initialize and load from API
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        const token = localStorage.getItem("smartgn_token");
        const gnId = localStorage.getItem("smartgn_user_id");

        if (!token || !gnId) {
          // Fallback to localStorage
          const saved = localStorage.getItem("smartgn_officer_profile");
          if (saved) {
            setProfile(JSON.parse(saved));
          }
          return;
        }

        const response = await fetch("/api/officer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Calculate service time if available
          let serviceTime = "N/A";
          if (data.created_at) {
            const startDate = new Date(data.created_at);
            const now = new Date();
            const years = now.getFullYear() - startDate.getFullYear();
            if (years > 0) {
              serviceTime = `${years} year${years > 1 ? "s" : ""}`;
            } else {
              const months = now.getMonth() - startDate.getMonth();
              serviceTime =
                months > 0
                  ? `${months} month${months > 1 ? "s" : ""}`
                  : "Less than a month";
            }
          }

          const profileData = {
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            fullName:
              data.full_name ||
              `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            division: data.division_name || "Not Assigned",
            serviceTime: serviceTime,
            email: data.email || "",
            mobile: data.mobile || "",
            profilePhoto: data.profile_photo_path || null,
            idCardFront: data.gn_front_path || null,
            idCardBack: data.gn_back_path || null,
          };

          setProfile(profileData);
          localStorage.setItem(
            "smartgn_officer_profile",
            JSON.stringify(profileData),
          );
          localStorage.setItem(
            "smartgn_user_name",
            profileData.fullName || "GN Officer",
          );
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem("smartgn_officer_profile");
          if (saved) {
            setProfile(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error("Error fetching officer profile:", error);
        // Fallback to localStorage
        const saved = localStorage.getItem("smartgn_officer_profile");
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      }
    };

    fetchOfficerProfile();
  }, []);

  // Enter edit mode
  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName);
    setEditLastName(profile.lastName);
    setEditFullName(profile.fullName);
    setEditDivision(profile.division);
    setEditServiceTime(profile.serviceTime);
    setEditEmail(profile.email);
    setEditMobile(profile.mobile);
    setEditProfilePhoto(profile.profilePhoto);
    setEditIdCardFront(profile.idCardFront);
    setEditIdCardBack(profile.idCardBack);
    setViewMode("EDIT");
  };

  // Handle Photo uploads (Base64 uploader)
  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === "profilePhoto") {
          setEditProfilePhoto(reader.result);
        } else if (target === "idCardFront") {
          setEditIdCardFront(reader.result);
        } else if (target === "idCardBack") {
          setEditIdCardBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving the updated profile info to API
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!editFirstName || !editLastName || !editEmail || !editMobile) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("smartgn_token");
      const gnId = localStorage.getItem("smartgn_user_id");

      if (!token || !gnId) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      // ✅ Send update to backend
      const response = await fetch("/api/officer/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          fullName: editFullName,
          email: editEmail,
          mobile: editMobile,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const data = await response.json();

      // ✅ Update local state with the response
      const updatedProfileData = {
        ...profile,
        firstName: editFirstName,
        lastName: editLastName,
        fullName: editFullName,
        email: editEmail,
        mobile: editMobile,
        // Keep existing values for fields not updated via API
        division: profile.division,
        serviceTime: profile.serviceTime,
        profilePhoto: editProfilePhoto,
        idCardFront: editIdCardFront,
        idCardBack: editIdCardBack,
      };

      // Save to localStorage
      localStorage.setItem(
        "smartgn_officer_profile",
        JSON.stringify(updatedProfileData),
      );
      setProfile(updatedProfileData);
      setViewMode("VIEW");

      // Update localStorage user name
      localStorage.setItem(
        "smartgn_user_name",
        editFullName || `${editFirstName} ${editLastName}`,
      );

      alert(data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* 1. Header */}
      <OfficerNavbar />

      {/* 2. Main Layout */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {viewMode === "VIEW" && (
            <>
              <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
                <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]">
                  My profile
                </h2>

                <div className="flex justify-end -mt-[70px]">
                  {/* Alert Banner */}
                  {showAlert &&
                    (!profile.idCardFront || !profile.idCardBack) && (
                      <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="hover:underline hover:cursor-pointer"
                            onClick={() => {
                              navigate("/OfficerDashboard/profile");
                            }}
                          >
                            Please upload a high-quality image of your GN
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

              <div className="flex justify-between items-center p-[20px] bg-[#E2E8F0] border border-[#2D37482D] rounded-2xl m-[30px]">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyItems: "center",
                      overflow: "hidden",
                      border: "2.5px solid #ffffff",
                    }}
                  >
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        style={{ margin: "auto" }}
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#1a2e56",
                      }}
                    >
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      {profile.division}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleEnterEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "50px",
                    border: "1.5px solid #d97706",
                    background: "#ffffff",
                    color: "#d97706",
                    fontSize: "13px",
                    fontWeight: "750",
                    cursor: "pointer",
                  }}
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
                  Edit profile
                </button>
              </div>

              {/* Profile details - same as before */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mx-[30px] mb-[30px]">
                <div
                  className="border border-[#2D37484D] rounded-2xl p-[20px]"
                  style={{ textAlign: "left" }}
                >
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">
                    Personal information
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Full Name
                      </span>
                      <span
                        style={{
                          fontSize: "14.5px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {profile.fullName}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Gramaseva Division
                      </span>
                      <span
                        style={{
                          fontSize: "14.5px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {profile.division}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Service time
                      </span>
                      <span
                        style={{
                          fontSize: "14.5px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {profile.serviceTime}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Email Address
                      </span>
                      <span
                        style={{
                          fontSize: "14.5px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {profile.email}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Mobile Number
                      </span>
                      <span
                        style={{
                          fontSize: "14.5px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {profile.mobile}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#2D37484D] rounded-2xl p-6 text-left gap-[20px] flex flex-col">
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">
                    Grama Niladhari Identity Card
                  </h3>
                  <div
                    className="announcement-row-placeholder"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "170px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "2px dashed #cbd5e1",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                    }}
                    onClick={handleEnterEdit}
                  >
                    {profile.idCardFront ? (
                      <img
                        src={profile.idCardFront}
                        alt="ID Front"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#475569",
                          fontSize: "14.5px",
                          fontWeight: "750",
                        }}
                      >
                        Front image here
                      </span>
                    )}
                  </div>
                  <div
                    className="announcement-row-placeholder"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "170px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "2px dashed #cbd5e1",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                    }}
                    onClick={handleEnterEdit}
                  >
                    {profile.idCardBack ? (
                      <img
                        src={profile.idCardBack}
                        alt="ID Back"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#475569",
                          fontSize: "14.5px",
                          fontWeight: "750",
                        }}
                      >
                        Back image here
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === "EDIT" && (
            <>
              {/* Back button */}
              <div className="flex justify-start items-center mb-4">
                <button
                  className="flex p-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
                  onClick={() => setViewMode("VIEW")}
                >
                  <img
                    src={backIcon}
                    alt="backIcon"
                    className="w-[14px] sm:w-[16px]"
                  />
                  Back
                </button>
              </div>

              <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:my-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
                Edit your profile
              </div>

              <div className="border border-[#2D37484D] rounded-2xl p-8 mx-[30px] mb-[30px]">
                <form onSubmit={handleSaveProfile}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr",
                      gap: "40px",
                      alignItems: "start",
                    }}
                  >
                    {/* Left Form Inputs */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      {/* Avatar preview */}
                      <div
                        className="flex flex-col"
                        style={{ alignItems: "flex-start" }}
                      >
                        <label
                          style={{
                            fontWeight: "700",
                            color: "#334155",
                            fontSize: "13px",
                            marginBottom: "8px",
                          }}
                        >
                          Profile Picture
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              width: "72px",
                              height: "72px",
                              borderRadius: "50%",
                              border: "2px dashed #cbd5e1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            {editProfilePhoto ? (
                              <img
                                src={editProfilePhoto}
                                alt="Profile preview"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#64748b"
                                strokeWidth="2"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            )}
                          </div>
                          <label
                            className="py-1.5 px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white"
                            style={{
                              borderRadius: "6px",
                              padding: "8px 14px",
                              fontSize: "12.5px",
                              cursor: "pointer",
                            }}
                          >
                            Choose Photo
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handlePhotoUpload(e, "profilePhoto")
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div className="flex flex-col">
                          <label
                            htmlFor="firstName"
                            style={{
                              fontWeight: "700",
                              color: "#334155",
                              fontSize: "13px",
                            }}
                          >
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                            value={editFirstName}
                            onChange={(e) => setEditFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="lastName"
                            style={{
                              fontWeight: "700",
                              color: "#334155",
                              fontSize: "13px",
                            }}
                          >
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                            value={editLastName}
                            onChange={(e) => setEditLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="fullName"
                          style={{
                            fontWeight: "700",
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.2fr 0.8fr",
                          gap: "16px",
                        }}
                      >
                        <div className="flex flex-col">
                          <label
                            htmlFor="division"
                            style={{
                              fontWeight: "700",
                              color: "#334155",
                              fontSize: "13px",
                            }}
                          >
                            Gramaseva Division *
                          </label>
                          <input
                            type="text"
                            id="division"
                            className="w-full py-2.5 px-3.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#64748b] cursor-not-allowed font-medium box-border"
                            value={editDivision}
                            disabled
                            readOnly
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="serviceTime"
                            style={{
                              fontWeight: "700",
                              color: "#334155",
                              fontSize: "13px",
                            }}
                          >
                            Service Time (Years)
                          </label>
                          <input
                            type="text"
                            id="serviceTime"
                            className="w-full py-2.5 px-3.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#64748b] cursor-not-allowed font-medium box-border"
                            value={editServiceTime}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="email"
                          style={{
                            fontWeight: "700",
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="mobile"
                          style={{
                            fontWeight: "700",
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          Mobile Number *
                        </label>
                        <input
                          type="text"
                          id="mobile"
                          className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                          value={editMobile}
                          onChange={(e) => setEditMobile(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Right Form ID Card Uploaders */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        textAlign: "left",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "700",
                          color: "#334155",
                          fontSize: "13px",
                        }}
                      >
                        GN Identity Card Images
                      </label>

                      <div className="flex flex-col">
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: "600",
                          }}
                        >
                          Identity Card (Front)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "160px",
                            border: "2px dashed #cbd5e1",
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          {editIdCardFront ? (
                            <>
                              <img
                                src={editIdCardFront}
                                alt="GN ID Front"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setEditIdCardFront(null)}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "10px",
                                  backgroundColor: "rgba(239, 68, 68, 0.9)",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "4px 8px",
                                  fontSize: "10.5px",
                                  cursor: "pointer",
                                  fontWeight: "800",
                                }}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <label
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "20px",
                                gap: "8px",
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#64748b"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                              </svg>
                              <span
                                style={{
                                  fontSize: "12.5px",
                                  color: "#475569",
                                  fontWeight: "750",
                                }}
                              >
                                Upload Front Image
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handlePhotoUpload(e, "idCardFront")
                                }
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: "600",
                          }}
                        >
                          Identity Card (Back)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "160px",
                            border: "2px dashed #cbd5e1",
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          {editIdCardBack ? (
                            <>
                              <img
                                src={editIdCardBack}
                                alt="GN ID Back"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setEditIdCardBack(null)}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "10px",
                                  backgroundColor: "rgba(239, 68, 68, 0.9)",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "4px 8px",
                                  fontSize: "10.5px",
                                  cursor: "pointer",
                                  fontWeight: "800",
                                }}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <label
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "20px",
                                gap: "8px",
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#64748b"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                              </svg>
                              <span
                                style={{
                                  fontSize: "12.5px",
                                  color: "#475569",
                                  fontWeight: "750",
                                }}
                              >
                                Upload Back Image
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handlePhotoUpload(e, "idCardBack")
                                }
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div
                    style={{
                      marginTop: "36px",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "16px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode("VIEW")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        minWidth: "160px",
                        justifyContent: "center",
                        backgroundColor: "#1B365D",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={() =>
          onOpenHelp ? onOpenHelp() : console.log("Help clicked")
        }
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default OfficerProfile;
