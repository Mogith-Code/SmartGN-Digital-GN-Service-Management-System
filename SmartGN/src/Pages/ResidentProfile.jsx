import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import LanguageSelector from "../Components/Common/LanguageSelector";
import logoImage from "../assets/logo.png";
import profileIcon from "../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import backIcon from "../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Components/Common/Footer";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";

function ResidentProfile({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const RprofileTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
      title: "My profile",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් කාඩ්පතේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
      title: "මගේ පැතිකඩ",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
      title: "என் சுயவிவரம்",
    },
  };

  const t = RprofileTranslations[lang] || RprofileTranslations.EN;

  // Retrieve default username and division from navigation state if available
  const successUser = location.state?.successUser || "Nimal Perera";
  const userDivision = location.state?.division || "Colombo";
  const firstNameFromSession = successUser.split(" ")[0];

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState("VIEW");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    nic: "",
    occupation: "",
    email: "",
    mobile: "",
    homeAddress: "", // ← Changed from 'address' to 'homeAddress'
    division: "",
    divisionId: "", // ← Added divisionId
    dob: "",
    gender: "",
    householdNumber: "",
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
  });

  // Form Field States (Edit Mode)
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editHouseholdNumber, setEditHouseholdNumber] = useState("");
  const [editProfilePhoto, setEditProfilePhoto] = useState(null);
  const [editNicFront, setEditNicFront] = useState(null);
  const [editNicBack, setEditNicBack] = useState(null);

  // ✅ Family count - Fetch from API instead of localStorage
  const [familyCount, setFamilyCount] = useState(0);

  // Load profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/residents/profile", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = {
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            fullName: data.full_name || "Add your full name",
            nic: data.r_nic || "",
            occupation: data.occupation || "Add your occupation",
            email: data.email || "",
            mobile: data.mobile_no || "",
            homeAddress: data.home_address || "Add your home address",
            division: data.division_name || "",
            divisionId: data.division_id || "",
            dob: data.date_of_birth || "",
            gender: data.gender || "",
            householdNumber: data.household_number || "",
            profilePhoto: data.profile_photo_path || null,
            nicFront: data.nic_front_path || null,
            nicBack: data.nic_back_path || null,
          };
          setProfile(mapped);
          localStorage.setItem(
            "smartgn_resident_profile",
            JSON.stringify(mapped),
          );
        } else {
          throw new Error("API error");
        }
      } catch {
        // Fall back to localStorage
        const savedProfile = localStorage.getItem("smartgn_resident_profile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      }
    };

    fetchProfile();

    // ✅ Fetch family members count from API
    const fetchFamilyCount = async () => {
      try {
        const res = await fetch("/api/residents/family", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const familyMembers = await res.json();
          setFamilyCount(familyMembers.length);
        } else {
          // If API fails, try localStorage as fallback
          const savedFamily = localStorage.getItem("smartgn_family_members");
          if (savedFamily) {
            const familyList = JSON.parse(savedFamily);
            setFamilyCount(familyList.length);
          }
        }
      } catch (err) {
        console.warn("Could not fetch family count:", err);
        // Fallback to localStorage
        const savedFamily = localStorage.getItem("smartgn_family_members");
        if (savedFamily) {
          const familyList = JSON.parse(savedFamily);
          setFamilyCount(familyList.length);
        }
      }
    };

    fetchFamilyCount();
  }, []);

  // Populate form fields when entering Edit Mode
  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName);
    setEditLastName(profile.lastName);
    setEditFullName(profile.fullName);
    setEditOccupation(profile.occupation);
    setEditEmail(profile.email);
    setEditMobile(profile.mobile);
    setEditAddress(profile.address);
    setEditDob(profile.dob);
    setEditGender(profile.gender);
    setEditHouseholdNumber(profile.householdNumber);
    setEditProfilePhoto(profile.profilePhoto);
    setEditNicFront(profile.nicFront);
    setEditNicBack(profile.nicBack);
    setViewMode("EDIT");
  };
  // Handle Photo File Upload Convert to Base64
  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === "profilePhoto") {
          setEditProfilePhoto(reader.result);
        } else if (target === "nicFront") {
          setEditNicFront(reader.result);
        } else if (target === "nicBack") {
          setEditNicBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...profile,
      firstName: editFirstName,
      lastName: editLastName,
      fullName: editFullName,
      occupation: editOccupation,
      email: editEmail,
      mobile: editMobile,
      address: editAddress,
      dob: editDob,
      gender: editGender,
      householdNumber: editHouseholdNumber,
      profilePhoto: editProfilePhoto,
      nicFront: editNicFront,
      nicBack: editNicBack,
    };

    // Save to localStorage immediately
    localStorage.setItem(
      "smartgn_resident_profile",
      JSON.stringify(updatedProfile),
    );
    setProfile(updatedProfile);

    // Also save to API
    try {
      await fetch("/api/residents/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          fullName: editFullName,
          mobile: editMobile,
          occupation: editOccupation,
          homeAddress: editHomeAddress,
        }),
      });
    } catch (err) {
      console.warn("Could not sync profile update to API:", err);
    }

    setViewMode("VIEW");
    alert("Profile updated successfully.");
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* 1. Header */}
      <AfterlogNavbar />
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          {/* Main Panel Content */}

          {/* Sub-view: VIEW (My Profile Dashboard) */}
          {viewMode === "VIEW" && (
            <>
              <div className="flex justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px] border-b border-[#2D37482D] pb-[10px] items-center">
                <h2 className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D]  ">
                  {t.title}
                </h2>

                <div className="flex justify-end -mt-[70px]">
                  {/* Alert Banner */}
                  {showAlert && !profile.nicFront && !profile.nicBack && (
                    <div className="flex justify-between items-center p-[10px] bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#d97706] font-medium text-[14px] text-left z-1 ">
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

              {/* Profile Card Header */}
              <div className="flex justify-between items-center p-[20px] bg-[#E2E8F0] border border-[#2D37482D] rounded-2xl m-[30px]">
                <div className="flex items-center gap-4">
                  <div className="h-20 rounded-full overflow-hidden  flex items-center justify-center">
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={profileIcon}
                        alt="Default avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="m-0 mb-1 text-[20px] font-bold text-[#1B365D]">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <span className="text-[14px] text-[#64748b] font-medium">
                      {profile.nic}
                    </span>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 py-2.5 px-5 bg-white border border-[#d97706] rounded-full text-[#d97706] text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#d97706] hover:text-white"
                  onClick={handleEnterEdit}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit profile
                </button>
              </div>

              {/* Dynamic split panel for details and NIC */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mx-[30px] mb-[30px]">
                {/* Personal Information */}
                <div className="border border-[#2D37484D] rounded-2xl p-[20px] text-left">
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">
                    Personal information
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Full Name:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Number of Family Members:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {familyCount}
                        &nbsp; &nbsp;
                        <span
                          onClick={() =>
                            navigate("/ResidentDashboard/RHousehold", {
                              state: {
                                successUser: `${profile.firstName} ${profile.lastName}`,
                                division: userDivision,
                              },
                            })
                          }
                          className="cursor-pointer text-[#d97706] font-bold underline"
                        >
                          View family details
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Occupation:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.occupation}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Email Address:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Mobile Number:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.mobile}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Home Address:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.homeAddress}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Gramaseva Division:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.division}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Date of Birth:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.dob}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Gender:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.gender}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-[#64748b] font-bold uppercase mb-1">
                        Household Number:
                      </span>
                      <span className="text-[15px] font-semibold text-[#1e293b]">
                        {profile.householdNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* National Identity Card Display */}
                <div className="border border-[#2D37484D] rounded-2xl p-6 text-left ">
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-3">
                    National Identity Card
                  </h3>

                  <div className="flex flex-col gap-5">
                    <div className="h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                      {profile.nicFront ? (
                        <img
                          src={profile.nicFront}
                          alt="NIC Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#64748b] text-[14px] font-medium">
                          Front image here
                        </span>
                      )}
                    </div>

                    <div className="h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                      {profile.nicBack ? (
                        <img
                          src={profile.nicBack}
                          alt="NIC Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#64748b] text-[14px] font-medium">
                          Back image here
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sub-view: EDIT (Edit Profile Page View) */}
          {viewMode === "EDIT" && (
            <>
              {/* Back Button */}
              <div
                className="flex p-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-regular text-[#1B365D] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer"
                onClick={() => setViewMode("VIEW")}
              >
                <img
                  src={backIcon}
                  alt="backIcon"
                  className="w-[14px] sm:w-[16px]"
                />
                back
              </div>

              <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-4 sm:mt-5 md:mt-6 lg:my-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
                Edit your profile
              </div>

              {/* Image Upload Zone & Editor Form */}
              <div className="border border-[#2D37484D] rounded-2xl p-8 mx-[30px] mb-[30px]">
                <form onSubmit={handleSaveProfile}>
                  {/* Circular profile image upload widget */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#cbd5e1] flex items-center justify-center overflow-hidden bg-[#f8fafc] relative cursor-pointer">
                      {editProfilePhoto ? (
                        <img
                          src={editProfilePhoto}
                          alt="Upload profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-[#cbd5e1]"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      )}

                      {/* Hidden file input */}
                      <input
                        type="file"
                        id="profilePhotoFile"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handlePhotoUpload(e, "profilePhoto")}
                      />
                    </div>
                    <label
                      htmlFor="profilePhotoFile"
                      className="mt-2 text-[13px] text-[#d97706] font-semibold cursor-pointer"
                    >
                      Upload your profile photo here
                    </label>
                  </div>

                  {/* Inputs Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    <div className="flex flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        First Name :
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
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Last Name :
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

                    <div className="flex flex-col md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Full Name :
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

                    <div className="flex flex-col">
                      <label
                        htmlFor="occupation"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Occupation :
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editOccupation}
                        onChange={(e) => setEditOccupation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Email Address :
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
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Mobile Number :
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

                    <div className="flex flex-col">
                      <label
                        htmlFor="division"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Gramaseva Division :
                      </label>
                      <input
                        type="text"
                        id="division"
                        className="w-full py-2.5 px-3.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#64748b] cursor-not-allowed font-medium box-border"
                        value={profile.division}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <label
                        htmlFor="address"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Home Address :
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="dob"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Date of Birth :
                      </label>
                      <input
                        type="text"
                        id="dob"
                        placeholder="DD/MM/YYYY"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="gender"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Gender :
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="gender"
                          className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 appearance-none cursor-pointer"
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="absolute right-3.5 pointer-events-none text-[10px] text-[#64748b]">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="householdNumber"
                        className="text-[13px] font-semibold text-[#334155] mb-1.5"
                      >
                        Household Number :
                      </label>
                      <input
                        type="text"
                        id="householdNumber"
                        className="w-full py-2.5 px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editHouseholdNumber}
                        onChange={(e) => setEditHouseholdNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* NIC File Upload Area */}
                  <div className="mt-7 border-t border-[#cbd5e1] pt-5">
                    <p className="font-semibold text-[14px] text-[#1e293b] mb-4 text-left">
                      Upload an image of your National Identity Card :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#64748b] font-semibold mb-2 text-left">
                          Front Image :
                        </span>
                        <div className="h-[150px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden p-4">
                          {editNicFront ? (
                            <img
                              src={editNicFront}
                              alt="NIC Front Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-[#cbd5e1] mb-2"
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
                          )}
                          <input
                            type="file"
                            id="nicFrontFile"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handlePhotoUpload(e, "nicFront")}
                          />
                          <label
                            htmlFor="nicFrontFile"
                            className="mt-2 py-1.5 px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white"
                          >
                            Choose file
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#64748b] font-semibold mb-2 text-left">
                          Back Image :
                        </span>
                        <div className="h-[150px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden p-4">
                          {editNicBack ? (
                            <img
                              src={editNicBack}
                              alt="NIC Back Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-[#cbd5e1] mb-2"
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
                          )}
                          <input
                            type="file"
                            id="nicBackFile"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handlePhotoUpload(e, "nicBack")}
                          />
                          <label
                            htmlFor="nicBackFile"
                            className="mt-2 py-1.5 px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white"
                          >
                            Choose file
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setViewMode("VIEW")}
                      className="py-2.5 px-5 rounded-lg border-0 text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:opacity-100 flex items-center gap-1.5"
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
                      className="py-2.5 px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center gap-1.5"
                    >
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
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={() =>
          onOpenHelp ? onOpenHelp() : console.log("Help clicked")
        }
      >
        ?
      </button>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default ResidentProfile;
