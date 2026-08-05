import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/translate";
import { getAuthHeaders, getImageUrl } from "../utils/api";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import profileIcon from "../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import backIcon from "../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function ResidentProfile({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  // Ref for scrolling to top
  const topRef = useRef(null);

  const RprofileTranslations = {
    EN: {
      alert:
        "Please upload a high-quality image of your National Identity Card",
      title: "My profile",
      updateSuccess: "Profile updated successfully!",
      updateError: "Failed to update profile. Please try again.",
      fillRequired: "Please fill in all required fields.",
      gnCardTitle: "Your Assigned Grama Niladhari (GN Officer)",
      gnBadge: "Official Division Officer",
      gnNameLabel: "Officer Name",
      gnIdLabel: "GN Officer ID",
      gnDivisionLabel: "Gramaseva Division",
      gnMobileLabel: "Contact Mobile",
      gnEmailLabel: "Email Address",
      gnSecretariatLabel: "Divisional Secretariat",
      gnDistrictLabel: "District & Province",
      bookAppointmentBtn: "Book Appointment",
      callOfficerBtn: "Call Officer",
      emailOfficerBtn: "Send Email",
      noOfficerFound: "No GN Officer registered for your division yet.",
      noOfficerSubtext: "For official assistance or inquiries, please contact your local Divisional Secretariat.",
      copied: "Copied!",
    },
    SI: {
      alert:
        "කරුණාකර ඔබේ ජාතික හැඳුනුම්පත් කාඩ්පතේ උසස් තත්ත්වයේ රූපයක් උඩුගත කරන්න",
      title: "මගේ පැතිකඩ",
      updateSuccess: "පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදී!",
      updateError:
        "පැතිකඩ යාවත්කාලීන කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      fillRequired: "කරුණාකර සියලු අවශ්‍ය ක්ෂේත්‍ර පුරවන්න.",
      gnCardTitle: "ඔබගේ පවරන ලද ග්‍රාම නිලධාරී තොරතුරු",
      gnBadge: "නිල කොට්ඨාස නිලධාරී",
      gnNameLabel: "නිලධාරියාගේ නම",
      gnIdLabel: "ග්‍රාම නිලධාරී අංකය",
      gnDivisionLabel: "ග්‍රාම නිලධාරී කොට්ඨාසය",
      gnMobileLabel: "දුරකථන අංකය",
      gnEmailLabel: "විද්‍යුත් තැපෑල",
      gnSecretariatLabel: "ප්‍රාදේශීය ලේකම් කාර්යාලය",
      gnDistrictLabel: "දිස්ත්‍රික්කය සහ පළාත",
      bookAppointmentBtn: "වේලාවක් වෙන්කර ගන්න",
      callOfficerBtn: "ඇමතුමක් ලබා ගන්න",
      emailOfficerBtn: "විද්‍යුත් තැපෑලක් යවන්න",
      noOfficerFound: "ඔබගේ කොට්ඨාසයට තවම ග්‍රාම නිලධාරියෙකු ලියාපදිංචි වී නොමැත.",
      noOfficerSubtext: "නිල සහාය සඳහා, කරුණාකර ඔබගේ ප්‍රාදේශීය ලේකම් කාර්යාලය අමතන්න.",
      copied: "පිටපත් විය!",
    },
    TA: {
      alert:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் உயர் தரமான படத்தை பதிவேற்றவும்",
      title: "என் சுயவிவரம்",
      updateSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      updateError:
        "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      fillRequired: "தயவுசெய்து தேவையான அனைத்து புலங்களையும் நிரப்பவும்.",
      gnCardTitle: "உங்கள் நியமிக்கப்பட்ட கிராம நிலதாரி விவரங்கள்",
      gnBadge: "அதிகாரப்பூர்வ பிரிவு அதிகாரி",
      gnNameLabel: "அதிகாரியின் பெயர்",
      gnIdLabel: "கி.நி. அடையாள எண்",
      gnDivisionLabel: "கிராம நிலதாரி பிரிவு",
      gnMobileLabel: "தொடர்பு எண்",
      gnEmailLabel: "மின்னஞ்சல் முகவரி",
      gnSecretariatLabel: "பிரதேச செயலகம்",
      gnDistrictLabel: "மாவட்டம் மற்றும் மாகாணம்",
      bookAppointmentBtn: "சந்திப்பை பதிவு செய்க",
      callOfficerBtn: "அழைக்கவும்",
      emailOfficerBtn: "மின்னஞ்சல் அனுப்பவும்",
      noOfficerFound: "உங்கள் பிரிவுக்கு இன்னும் கிராம நிலதாரி பதிவு செய்யப்படவில்லை.",
      noOfficerSubtext: "அதிகாரப்பூர்வ உதவிக்கு, தயவுசெய்து உங்கள் பிரதேச செயலகத்தை தொடர்பு கொள்ளவும்.",
      copied: "நகலெடுக்கப்பட்டது!",
    },
  };

  const t = RprofileTranslations[lang] || RprofileTranslations.EN;

  // Scroll to top function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Retrieve default username and division from navigation state if available
  const userDivision = location.state?.division || "Colombo";

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // Success Toast Notification state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Direct Photo Upload ref for VIEW mode
  const directPhotoInputRef = useRef(null);

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState("VIEW");

  // Assigned GN Officer State
  const [gnOfficer, setGnOfficer] = useState(null);
  const [gnLoading, setGnLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopyText = (text, fieldName) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    nic: "",
    occupation: "",
    email: "",
    mobile: "",
    homeAddress: "",
    division: "",
    divisionId: "",
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
  const [editHomeAddress, setEditHomeAddress] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editHouseholdNumber, setEditHouseholdNumber] = useState("");
  const [editProfilePhoto, setEditProfilePhoto] = useState(null);
  const [editNicFront, setEditNicFront] = useState(null);
  const [editNicBack, setEditNicBack] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Family count - Fetch from API instead of localStorage
  const [familyCount, setFamilyCount] = useState(0);

  // Handle Cancel - go back to VIEW mode
  const handleCancel = () => {
    setViewMode("VIEW");
    scrollToTop();
  };

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
          if (data.gn_officer) {
            setGnOfficer(data.gn_officer);
          }
          localStorage.setItem(
            "smartgn_resident_profile",
            JSON.stringify(mapped),
          );
        } else {
          throw new Error("API error");
        }
      } catch {
        const savedProfile = localStorage.getItem("smartgn_resident_profile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      }
    };

    fetchProfile();

    const fetchGnOfficer = async () => {
      try {
        setGnLoading(true);
        const res = await fetch("/api/residents/gn-officer", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.gn_officer) {
            setGnOfficer(data.gn_officer);
          }
        }
      } catch (err) {
        console.warn("Could not fetch GN officer details:", err);
      } finally {
        setGnLoading(false);
      }
    };

    fetchGnOfficer();

    const fetchFamilyCount = async () => {
      try {
        const res = await fetch("/api/residents/family", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const familyMembers = await res.json();
          setFamilyCount(familyMembers.length);
        } else {
          const savedFamily = localStorage.getItem("smartgn_family_members");
          if (savedFamily) {
            const familyList = JSON.parse(savedFamily);
            setFamilyCount(familyList.length);
          }
        }
      } catch (err) {
        console.warn("Could not fetch family count:", err);
        const savedFamily = localStorage.getItem("smartgn_family_members");
        if (savedFamily) {
          const familyList = JSON.parse(savedFamily);
          setFamilyCount(familyList.length);
        }
      }
    };

    fetchFamilyCount();
  }, []);

  const areNicImagesMissing = () => {
    return !profile.nicFront || !profile.nicBack;
  };

  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName);
    setEditLastName(profile.lastName);
    setEditFullName(profile.fullName);
    setEditOccupation(profile.occupation);
    setEditEmail(profile.email);
    setEditMobile(profile.mobile);
    setEditHomeAddress(profile.homeAddress);
    setEditDob(profile.dob);
    setEditGender(profile.gender);
    setEditHouseholdNumber(profile.householdNumber);
    setEditProfilePhoto(profile.profilePhoto);
    setEditNicFront(profile.nicFront);
    setEditNicBack(profile.nicBack);
    setViewMode("EDIT");
    scrollToTop();
  };

  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
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

  const handleDirectPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const optimisticProfile = { ...profile, profilePhoto: base64 };
      setProfile(optimisticProfile);

      try {
        const response = await fetch("/api/residents/profile", {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            profilePhoto: base64,
          }),
        });

        if (response.ok) {
          const serverData = await response.json();
          const photoUrl = serverData.profile_photo_path || base64;
          const finalProfile = { ...optimisticProfile, profilePhoto: photoUrl };
          setProfile(finalProfile);
          localStorage.setItem(
            "smartgn_resident_profile",
            JSON.stringify(finalProfile),
          );
          window.dispatchEvent(new Event("profileUpdated"));
          setSuccessMessage("Profile photo updated successfully!");
          setShowSuccessToast(true);
          scrollToTop();
        } else {
          const errData = await response.json();
          alert(errData.error || "Failed to update profile photo.");
        }
      } catch (err) {
        console.error("Direct photo upload error:", err);
        alert("Network error updating photo.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (target) => {
    if (target === "profilePhoto") {
      setEditProfilePhoto(null);
    } else if (target === "nicFront") {
      setEditNicFront(null);
    } else if (target === "nicBack") {
      setEditNicBack(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editFirstName || !editLastName || !editEmail || !editMobile) {
      alert(t.fillRequired);
      return;
    }

    setIsSubmitting(true);

    const updateData = {
      firstName: editFirstName,
      lastName: editLastName,
      fullName: editFullName,
      mobile: editMobile,
      occupation: editOccupation,
      homeAddress: editHomeAddress,
      dob: editDob,
      gender: editGender,
      householdNumber: editHouseholdNumber,
      profilePhoto: editProfilePhoto || null,
      nicFront: editNicFront || null,
      nicBack: editNicBack || null,
    };

    try {
      const response = await fetch("/api/residents/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || t.updateError);
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const updatedProfile = {
          ...profile,
          firstName: data.data?.first_name || editFirstName,
          lastName: data.data?.last_name || editLastName,
          fullName: data.data?.full_name || editFullName,
          occupation: data.data?.occupation || editOccupation,
          email: data.data?.email || editEmail,
          mobile: data.data?.mobile_no || editMobile,
          homeAddress: data.data?.home_address || editHomeAddress,
          dob: data.data?.date_of_birth || editDob || profile.dob,
          gender: data.data?.gender || editGender || profile.gender,
          householdNumber:
            data.data?.household_number ||
            editHouseholdNumber ||
            profile.householdNumber,
          division: data.data?.division_name || profile.division,
          nic: data.data?.r_nic || profile.nic,
          profilePhoto: data.data?.profile_photo_path || null,
          nicFront: data.data?.nic_front_path || null,
          nicBack: data.data?.nic_back_path || null,
        };

        setProfile(updatedProfile);
        localStorage.setItem(
          "smartgn_resident_profile",
          JSON.stringify(updatedProfile),
        );

        setEditProfilePhoto(updatedProfile.profilePhoto);
        setEditNicFront(updatedProfile.nicFront);
        setEditNicBack(updatedProfile.nicBack);

        if (updatedProfile.nicFront && updatedProfile.nicBack) {
          setShowAlert(false);
        } else {
          setShowAlert(true);
        }

        setSuccessMessage(
          "Your profile information and photo have been updated successfully!",
        );
        setShowSuccessToast(true);
        setViewMode("VIEW");
        window.dispatchEvent(new Event("profileUpdated"));
        scrollToTop();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || t.updateError);
    } finally {
      setIsSubmitting(false);
    }
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

          {viewMode === "VIEW" && (
            <>
              {/* ── NIC upload alert - Same as ResidentDashboard ── */}
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

              {/* ── Header ── */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-[20px] mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] border-b border-[#2D37482D] pb-2 sm:pb-3 md:pb-[10px]">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] font-medium text-[#1B365D] break-words max-w-full sm:max-w-[70%]">
                  {t.title}
                </h2>
              </div>

              {/* ── Success Toast ── */}
              {showSuccessToast && (
                <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mt-3 sm:mt-4 p-3 sm:p-4 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-[#065f46] shadow-sm gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[14px] sm:text-[16px] m-0 text-[#065f46]">
                        Profile Updated Successfully!
                      </p>
                      <p className="text-[11px] sm:text-[13px] text-[#047857] m-0 mt-0.5 break-words">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSuccessToast(false)}
                    className="text-[#047857] hover:text-[#065f46] bg-transparent border-0 font-bold text-lg cursor-pointer px-2 self-end sm:self-center"
                    aria-label="Close message"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ── Profile Card ── */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 md:p-[20px] bg-[#E2E8F0] border border-[#2D37482D] rounded-xl sm:rounded-2xl mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] my-4 sm:my-5 md:my-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center relative group cursor-pointer border-2 border-white shadow-sm transition-all duration-200 flex-shrink-0"
                    onClick={() =>
                      directPhotoInputRef.current &&
                      directPhotoInputRef.current.click()
                    }
                    title="Click to update profile photo"
                  >
                    {profile.profilePhoto ? (
                      <img
                        src={getImageUrl(profile.profilePhoto)}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = profileIcon;
                        }}
                      />
                    ) : (
                      <img
                        src={profileIcon}
                        alt="Default avatar"
                        className="w-full h-full object-cover p-2"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] sm:text-[11px] font-medium transition-all duration-200">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="sm:w-[18px] sm:h-[18px]"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                      <span>Update</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={directPhotoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleDirectPhotoUpload}
                  />

                  <div className="flex flex-col text-left min-w-0">
                    <h3 className="m-0 mb-0.5 sm:mb-1 text-base sm:text-lg md:text-[20px] font-bold text-[#1B365D] truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <span className="text-[12px] sm:text-[14px] text-[#64748b] font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                      {profile.nic}
                    </span>
                    <span
                      className="text-[10px] sm:text-[12px] text-[#2563eb] hover:underline cursor-pointer font-medium mt-0.5"
                      onClick={() =>
                        directPhotoInputRef.current &&
                        directPhotoInputRef.current.click()
                      }
                    >
                      📷 Change profile photo
                    </span>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:py-2.5 sm:px-5 bg-white border border-[#d97706] rounded-full text-[#d97706] text-[12px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#d97706] hover:text-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] w-full sm:w-auto justify-center"
                  onClick={handleEnterEdit}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 sm:w-[16px] sm:h-[16px]"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Edit profile
                </button>
              </div>

              {/* ── Info Grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-5 md:gap-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mb-4 sm:mb-5 md:mb-[30px]">
                <div className="border border-[#2D37484D] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-[20px] text-left shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <h3 className="m-0 mb-3 sm:mb-4 md:mb-5 text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-2 sm:pb-3">
                    Personal information
                  </h3>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Full Name:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Number of Family Members:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] flex flex-wrap items-center gap-1 sm:gap-2">
                        {familyCount}
                        <span
                          onClick={() =>
                            navigate("/ResidentDashboard/RHousehold", {
                              state: {
                                successUser: `${profile.firstName} ${profile.lastName}`,
                                division: userDivision,
                              },
                            })
                          }
                          className="cursor-pointer text-[#d97706] font-semibold hover:underline hover:font-bold text-[11px] sm:text-[13px]"
                        >
                          View family details
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Occupation:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.occupation}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Email Address:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Mobile Number:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.mobile}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Home Address:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.homeAddress}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Gramaseva Division:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.division}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Date of Birth:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.dob}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Gender:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.gender}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#64748b] font-bold uppercase mb-0.5 sm:mb-1">
                        Household Number:
                      </span>
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1e293b] break-words">
                        {profile.householdNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#2D37484D] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-left shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <h3 className="m-0 mb-3 sm:mb-4 md:mb-5 text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#1B365D] border-b border-[#f1f5f9] pb-2 sm:pb-3">
                    National Identity Card
                  </h3>

                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div className="h-[150px] sm:h-[170px] md:h-[200px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden relative">
                      {profile.nicFront ? (
                        <img
                          src={getImageUrl(profile.nicFront)}
                          alt="NIC Front"
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[#64748b] text-[12px] sm:text-[14px] font-medium">
                          Front image here
                        </span>
                      )}
                    </div>

                    <div className="h-[150px] sm:h-[170px] md:h-[200px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center overflow-hidden relative">
                      {profile.nicBack ? (
                        <img
                          src={getImageUrl(profile.nicBack)}
                          alt="NIC Back"
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[#64748b] text-[12px] sm:text-[14px] font-medium">
                          Back image here
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Assigned Grama Niladhari (GN Officer) Card ── */}
              <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-[30px] mb-6 sm:mb-8">
                <div className="border border-[#1B365D2D] rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#edf2f7] p-4 sm:p-5 md:p-6 text-left shadow-[0px_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#cbd5e1] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1B365D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        🏛️
                      </div>
                      <h3 className="m-0 text-[15px] sm:text-[17px] md:text-[18px] font-bold text-[#1B365D]">
                        {t.gnCardTitle}
                      </h3>
                    </div>
                    {gnOfficer ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] border border-[#86efac] text-[#166534] text-[11px] sm:text-[12px] font-semibold rounded-full shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                        {t.gnBadge} ({gnOfficer.status || "Active"})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-[11px] sm:text-[12px] font-semibold rounded-full">
                        ⚠️ Pending Officer Assignment
                      </span>
                    )}
                  </div>

                  {gnLoading ? (
                    <div className="py-6 flex items-center justify-center text-[#64748b] text-sm">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1B365D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading GN officer details...
                    </div>
                  ) : gnOfficer ? (
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      
                      {/* Officer Info Block */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#1B365D] shadow-md bg-[#e2e8f0] flex items-center justify-center">
                            {gnOfficer.profile_photo_path ? (
                              <img
                                src={getImageUrl(gnOfficer.profile_photo_path)}
                                alt="GN Officer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = profileIcon;
                                }}
                              />
                            ) : (
                              <img
                                src={profileIcon}
                                alt="Default GN avatar"
                                className="w-full h-full object-cover p-2"
                              />
                            )}
                          </div>
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-xs" title="Active Officer"></span>
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="m-0 text-base sm:text-lg md:text-[19px] font-bold text-[#1B365D]">
                              {gnOfficer.full_name || `${gnOfficer.first_name || ""} ${gnOfficer.last_name || ""}`}
                            </h4>
                            <span className="bg-[#1B365D15] text-[#1B365D] text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border border-[#1B365D33]">
                              {gnOfficer.gn_id || "GN Officer"}
                            </span>
                          </div>
                          <p className="m-0 text-[12px] sm:text-[13px] font-medium text-[#d97706]">
                            Grama Niladhari Officer - {gnOfficer.division_name || profile.division}
                          </p>
                          {gnOfficer.division_code && (
                            <p className="m-0 text-[11px] text-[#64748b] font-mono">
                              Division Code: <span className="font-semibold text-[#1e293b]">{gnOfficer.division_code}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto bg-white p-3.5 sm:p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                        {/* Mobile Number */}
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-[11px] text-[#64748b] font-bold uppercase tracking-wide">
                            {t.gnMobileLabel}:
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:${gnOfficer.mobile}`}
                              className="text-[13px] sm:text-[14px] font-bold text-[#2563eb] hover:underline flex items-center gap-1.5"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              {gnOfficer.mobile || "N/A"}
                            </a>
                            {gnOfficer.mobile && (
                              <button
                                onClick={() => handleCopyText(gnOfficer.mobile, "mobile")}
                                className="text-[10px] text-[#64748b] hover:text-[#1B365D] bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#cbd5e1]"
                                title="Copy Mobile Number"
                              >
                                {copiedField === "mobile" ? t.copied : "Copy"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-[11px] text-[#64748b] font-bold uppercase tracking-wide">
                            {t.gnEmailLabel}:
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`mailto:${gnOfficer.email}`}
                              className="text-[13px] sm:text-[14px] font-bold text-[#2563eb] hover:underline truncate max-w-[180px] sm:max-w-[200px] flex items-center gap-1.5"
                              title={gnOfficer.email}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              {gnOfficer.email || "N/A"}
                            </a>
                            {gnOfficer.email && (
                              <button
                                onClick={() => handleCopyText(gnOfficer.email, "email")}
                                className="text-[10px] text-[#64748b] hover:text-[#1B365D] bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#cbd5e1] flex-shrink-0"
                                title="Copy Email"
                              >
                                {copiedField === "email" ? t.copied : "Copy"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Divisional Secretariat */}
                        <div className="flex flex-col sm:col-span-2 border-t border-[#f1f5f9] pt-2 mt-1">
                          <span className="text-[10px] sm:text-[11px] text-[#64748b] font-bold uppercase tracking-wide">
                            {t.gnSecretariatLabel} & Location:
                          </span>
                          <span className="text-[12px] sm:text-[13px] font-semibold text-[#1e293b]">
                            {gnOfficer.divisional_secretariat || "Divisional Secretariat Office"}
                            {(gnOfficer.district || gnOfficer.province) && (
                              <span className="text-[#64748b] font-normal">
                                {" "}• {gnOfficer.district || ""}{gnOfficer.province ? `, ${gnOfficer.province}` : ""}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Fallback when no officer is found in database for division */
                    <div className="p-4 sm:p-5 bg-white border border-[#fde68a] rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center text-xl font-bold flex-shrink-0">
                        ℹ️
                      </div>
                      <div>
                        <h4 className="m-0 text-sm sm:text-base font-bold text-[#92400e]">
                          {t.noOfficerFound}
                        </h4>
                        <p className="m-0 text-xs text-[#b45309] mt-1">
                          Division: <span className="font-bold text-[#1e293b]">{profile.division || "Assigned Division"}</span>. {t.noOfficerSubtext}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </>
          )}

          {viewMode === "EDIT" && (
            <>
              <div
                className="flex px-[5px] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] items-center gap-[6px] sm:gap-[8px] md:gap-[10px] font-regular text-[#1B365D] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px] mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] cursor-pointer"
                onClick={handleCancel}
              >
                <img
                  src={backIcon}
                  alt="backIcon"
                  className="w-[12px] sm:w-[14px] md:w-[16px]"
                />
                back
              </div>

              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-3 sm:mt-4 md:mt-5 lg:mt-[10px] mx-3 sm:mx-4 md:mx-5 lg:mx-[30px]">
                Edit your profile
              </div>

              <div className="border border-[#2D37484D] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] transition-all duration-200">
                <form onSubmit={handleSaveProfile}>
                  <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-[#cbd5e1] flex items-center justify-center overflow-hidden bg-[#f8fafc] hover:border-[#1B365D] transition-colors duration-200">
                        {editProfilePhoto ? (
                          <img
                            src={getImageUrl(editProfilePhoto)}
                            alt="Upload profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-[#cbd5e1] sm:w-[48px] sm:h-[48px]"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        )}
                      </div>

                      {editProfilePhoto && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto("profilePhoto")}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-colors shadow-md border-2 border-white z-10"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      )}

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
                      className="mt-1 sm:mt-2 text-[11px] sm:text-[12px] md:text-[13px] text-[#d97706] font-semibold cursor-pointer hover:text-[#b8860b] transition-colors text-center"
                    >
                      {editProfilePhoto
                        ? "Change profile photo"
                        : "Upload your profile photo here"}
                    </label>
                    {editProfilePhoto && (
                      <span className="text-[10px] sm:text-xs text-green-600 mt-0.5">
                        ✅ Photo uploaded
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left">
                    <div className="flex flex-col">
                      <label
                        htmlFor="firstName"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        First Name :
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="lastName"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Last Name :
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Full Name :
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="occupation"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Occupation :
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editOccupation}
                        onChange={(e) => setEditOccupation(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Email Address :
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="mobile"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Mobile Number :
                      </label>
                      <input
                        type="text"
                        id="mobile"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="division"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Gramaseva Division :
                      </label>
                      <input
                        type="text"
                        id="division"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#64748b] cursor-not-allowed font-medium box-border"
                        value={profile.division}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                      <label
                        htmlFor="address"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Home Address :
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editHomeAddress}
                        onChange={(e) => setEditHomeAddress(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="dob"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Date of Birth :
                      </label>
                      <input
                        type="text"
                        id="dob"
                        placeholder="DD/MM/YYYY"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="gender"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Gender :
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="gender"
                          className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10 appearance-none cursor-pointer"
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value)}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="absolute right-3 pointer-events-none text-[10px] text-[#64748b]">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="householdNumber"
                        className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#334155] mb-1 sm:mb-1.5"
                      >
                        Household Number :
                      </label>
                      <input
                        type="text"
                        id="householdNumber"
                        className="w-full py-2 px-3 sm:py-2.5 sm:px-3.5 bg-white border border-[#cbd5e1] rounded-lg text-[13px] sm:text-[14px] md:text-[14.5px] text-[#334155] transition-all duration-200 box-border focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/10"
                        value={editHouseholdNumber}
                        onChange={(e) => setEditHouseholdNumber(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 md:mt-7 border-t border-[#cbd5e1] pt-4 sm:pt-5">
                    <p className="font-semibold text-[13px] sm:text-[14px] text-[#1e293b] mb-3 sm:mb-4 text-left">
                      Upload an image of your National Identity Card :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#64748b] font-semibold mb-1.5 sm:mb-2 text-left">
                          Front Image :
                        </span>
                        <div className="relative h-[140px] sm:h-[160px] md:h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden p-3 sm:p-4 hover:border-[#1B365D] transition-colors duration-200">
                          {editNicFront ? (
                            <>
                              <img
                                src={getImageUrl(editNicFront)}
                                alt="NIC Front Preview"
                                className="w-full h-full object-contain p-1 sm:p-2"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto("nicFront")}
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-colors shadow-md border-2 border-white z-10"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-[#cbd5e1] mb-1 sm:mb-2 sm:w-[24px] sm:h-[24px]"
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
                            className="mt-1 sm:mt-2 py-1 px-2 sm:py-1.5 sm:px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[10px] sm:text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white"
                          >
                            Choose file
                          </label>
                        </div>
                        {editNicFront && (
                          <span className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">
                            ✅ Front image uploaded
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#64748b] font-semibold mb-1.5 sm:mb-2 text-left">
                          Back Image :
                        </span>
                        <div className="relative h-[140px] sm:h-[160px] md:h-[180px] border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden p-3 sm:p-4 hover:border-[#1B365D] transition-colors duration-200">
                          {editNicBack ? (
                            <>
                              <img
                                src={getImageUrl(editNicBack)}
                                alt="NIC Back Preview"
                                className="w-full h-full object-contain p-1 sm:p-2"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto("nicBack")}
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-colors shadow-md border-2 border-white z-10"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-[#cbd5e1] mb-1 sm:mb-2 sm:w-[24px] sm:h-[24px]"
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
                            className="mt-1 sm:mt-2 py-1 px-2 sm:py-1.5 sm:px-3 bg-[#cbd5e1] text-[#475569] rounded-md text-[10px] sm:text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#94a3b8] hover:text-white"
                          >
                            Choose file
                          </label>
                        </div>
                        {editNicBack && (
                          <span className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">
                            ✅ Back image uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-7 md:mt-8">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg border-0 text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-[#ef4444] text-white hover:bg-[#dc2626] flex items-center justify-center gap-1.5 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      disabled={isSubmitting}
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="py-2 px-5 sm:py-2.5 sm:px-6 bg-[#1B365D] text-white border-0 rounded-lg text-[13px] sm:text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#005BBD] flex items-center justify-center gap-1.5 shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-1"
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
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="sm:w-[14px] sm:h-[14px]"
                          >
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                          </svg>
                          Update
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default ResidentProfile;
