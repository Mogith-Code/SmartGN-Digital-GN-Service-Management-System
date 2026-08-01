import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/translate";
import { addNotification } from "../utils/notifications";
import LanguageSelector from "../Components/Common/LanguageSelector";
import logoImage from "../assets/logo.png";

const registrationTranslations = {
  EN: {
    title: "Create Resident Account",
    nicLabel: "NIC Number",
    nicPlaceholder: "Enter NIC Number",
    householdLabel: "Household Number",
    householdPlaceholder: "Enter Household Number",
    firstNameLabel: "First Name",
    firstNamePlaceholder: "Enter First Name",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Enter Last Name",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter Email Address",
    dobLabel: "Date of Birth",
    genderLabel: "Gender",
    genderPlaceholder: "Select Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter Mobile Number",
    divisionLabel: "Select GN Division",
    divisionPlaceholder: "Select division",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter Password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm Password",
    submitButton: "Create Account",
    alreadyAccount: "Already have an account?",
    loginLink: "Login here",
    back: "Back",
    errorAllFields: "Please fill in all fields.",
    errorInvalidEmail: "Please enter a valid email address.",
    errorPasswordComplexity:
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character (!@#$%^&*).",
    errorPasswordMatch: "Passwords do not match.",
    errorRegistrationFailed: "Registration failed. Please verify your details.",
    errorNetwork:
      "Network connection error. Please make sure the MySQL backend server is active.",
    householdCreated: "New household created successfully!",
    otpTitle: "Verify Email Address",
    otpDescription: "We've sent a 6-digit verification code to",
    otpLabel: "Enter 6-Digit OTP Code",
    otpVerifyButton: "Verify & Activate",
    otpResendCode: "Resend Code",
    otpResending: "Resending...",
    otpBackToRegister: "Back to Register",
    otpErrorInvalid: "Please enter a valid 6-digit code.",
    otpResendSuccess: "Verification code resent successfully!",
  },
  SI: {
    title: "නේවාසික ගිණුමක් සාදන්න",
    nicLabel: "ජාතික හැඳුනුම්පත් අංකය",
    nicPlaceholder: "ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න",
    householdLabel: "ගෘහ අංකය",
    householdPlaceholder: "ගෘහ අංකය ඇතුළත් කරන්න",
    firstNameLabel: "මුල් නම",
    firstNamePlaceholder: "මුල් නම ඇතුළත් කරන්න",
    lastNameLabel: "වාසගම",
    lastNamePlaceholder: "වාසගම ඇතුළත් කරන්න",
    emailLabel: "විද්‍යුත් තැපැල් ලිපිනය",
    emailPlaceholder: "විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න",
    dobLabel: "උපන් දිනය",
    genderLabel: "ස්ත්‍රී/පුරුෂ භාවය",
    genderPlaceholder: "තෝරන්න",
    genderMale: "පුරුෂ",
    genderFemale: "ස්ත්‍රී",
    genderOther: "වෙනත්",
    mobileLabel: "ජංගම දුරකථන අංකය",
    mobilePlaceholder: "ජංගම දුරකථන අංකය ඇතුළත් කරන්න",
    divisionLabel: "ග්‍රාම නිලධාරී වසම තෝරන්න",
    divisionPlaceholder: "වසම තෝරන්න",
    passwordLabel: "මුරපදය",
    passwordPlaceholder: "මුරපදය ඇතුළත් කරන්න",
    confirmPasswordLabel: "මුරපදය තහවුරු කරන්න",
    confirmPasswordPlaceholder: "මුරපදය නැවත ඇතුළත් කරන්න",
    submitButton: "ගිණුම සාදන්න",
    alreadyAccount: "දැනටමත් ගිණුමක් තිබේද?",
    loginLink: "මෙහි ඇතුල් වන්න",
    back: "ආපසු",
    errorAllFields: "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න.",
    errorInvalidEmail: "කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.",
    errorPasswordComplexity:
      "මුරපදය අවම වශයෙන් අක්ෂර 8ක් විය යුතු අතර ඉංග්‍රීසි කැපිටල්, සිම්පල් අකුරු, අංකයක් සහ විශේෂ අක්ෂරයක් ඇතුළත් විය යුතුය.",
    errorPasswordMatch: "මුරපද නොගැලපේ.",
    errorRegistrationFailed:
      "ලියාපදිංචි වීම අසාර්ථකයි. කරුණාකර තොරතුරු පරීක්ෂා කරන්න.",
    errorNetwork:
      "ජාල සම්බන්ධතා දෝෂයකි. MySQL පසුබිම් සේවාදායකය සක්‍රීය දැයි පරීක්ෂා කරන්න.",
    householdCreated: "නව ගෘහය සාර්ථකව සාදන ලදී!",
    otpTitle: "විද්‍යුත් තැපැල් ලිපිනය තහවුරු කරන්න",
    otpDescription: "අපි ඉලක්කම් 6ක තහවුරු කිරීමේ කේතයක් මෙහි යවා ඇත:",
    otpLabel: "ඉලක්කම් 6ක OTP කේතය ඇතුළත් කරන්න",
    otpVerifyButton: "තහවුරු කර සක්‍රීය කරන්න",
    otpResendCode: "කේතය නැවත එවන්න",
    otpResending: "නැවත යවමින්...",
    otpBackToRegister: "ලියාපදිංචියට ආපසු යන්න",
    otpErrorInvalid: "කරුණාකර වලංගු ඉලක්කම් 6ක කේතයක් ඇතුළත් කරන්න.",
    otpResendSuccess: "තහවුරු කිරීමේ කේතය සාර්ථකව නැවත එවන ලදී!",
  },
  TA: {
    title: "குடியுரிமை கணக்கை உருவாக்கவும்",
    nicLabel: "தேசிய அடையாள அட்டை எண்",
    nicPlaceholder: "அடையாள அட்டை எண் உள்ளிடவும்",
    householdLabel: "வீட்டு எண்",
    householdPlaceholder: "வீட்டு எண் உள்ளிடவும்",
    firstNameLabel: "முதல் பெயர்",
    firstNamePlaceholder: "முதல் பெயர் உள்ளிடவும்",
    lastNameLabel: "இறுதிப் பெயர்",
    lastNamePlaceholder: "இறுதிப் பெயர் உள்ளிடவும்",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "மின்னஞ்சல் முகவரி உள்ளிடவும்",
    dobLabel: "பிறந்த தேதி",
    genderLabel: "பாலினம்",
    genderPlaceholder: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    genderMale: "ஆண்",
    genderFemale: "பெண்",
    genderOther: "இதர",
    mobileLabel: "கைபேசி எண்",
    mobilePlaceholder: "கைபேசி எண் உள்ளிடவும்",
    divisionLabel: "கிராம நிலதாரி பிரிவைத் தேர்ந்தெடுக்கவும்",
    divisionPlaceholder: "பிரிவைத் தேர்ந்தெடுக்கவும்",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "கடவுச்சொல் உள்ளிடவும்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
    submitButton: "கணக்கை உருவாக்கு",
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginLink: "இங்கே உள்நுழையவும்",
    back: "திரும்புக",
    errorAllFields: "தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்.",
    errorInvalidEmail: "தயவுசெய்து செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    errorPasswordComplexity:
      "கடவுச்சொல் குறைந்தது 8 எழுத்துகளைக் கொண்டிருக்க வேண்டும் மற்றும் பெரிய எழுத்து, சிறிய எழுத்து, எண் மற்றும் சிறப்பு எழுத்துகளைக் கொண்டிருக்க வேண்டும்.",
    errorPasswordMatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
    errorRegistrationFailed:
      "பதிவு தோல்வியடைந்தது. விவரங்களைச் சரிபார்க்கவும்.",
    errorNetwork:
      "பிணைய இணைப்பு பிழை. MySQL பின்தள சேவையகம் செயலில் உள்ளதா என சரிபார்க்கவும்.",
    householdCreated: "புதிய வீடு வெற்றிகரமாக உருவாக்கப்பட்டது!",
    otpTitle: "மின்னஞ்சல் முகவரியைச் சரிபார்க்கவும்",
    otpDescription: "நாங்கள் 6 இலக்க சரிபார்ப்புக் குறியீட்டை அனுப்பியுள்ளோம்:",
    otpLabel: "6 இலக்க OTP குறியீட்டை உள்ளிடவும்",
    otpVerifyButton: "சரிபார்த்து செயல்படுத்து",
    otpResendCode: "குறியீட்டை மீண்டும் அனுப்பவும்",
    otpResending: "மீண்டும் அனுப்புகிறது...",
    otpBackToRegister: "பதிவுக்குத் திரும்புக",
    otpErrorInvalid: "தயவுசெய்து சரியான 6 இலக்க குறியீட்டை உள்ளிடவும்.",
    otpResendSuccess:
      "சரிபார்ப்புக் குறியீடு வெற்றிகரமாக மீண்டும் அனுப்பப்பட்டது!",
  },
};

function Register() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = registrationTranslations[lang] || registrationTranslations.EN;

  // Registration states
  const [nic, setNic] = useState("");
  const [household, setHousehold] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [division, setDivision] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");
  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const divisionDropdownRef = useRef(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [divisions, setDivisions] = useState([]);

  // Close division dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divisionDropdownRef.current && !divisionDropdownRef.current.contains(event.target)) {
        setIsDivisionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 2FA States
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationNic, setVerificationNic] = useState("");
  const [householdCreatedState, setHouseholdCreatedState] = useState(false);


  // Timer state for OTP Resend
  const [timerCount, setTimerCount] = useState(0);

  // Refs for OTP Input focuses
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch("/api/auth/divisions");
        if (response.ok) {
          const data = await response.json();
          setDivisions(data.map((d) => d.name));
        } else {
          setDivisions(["Colombo Borella", "Colombo Fort", "Kandy Central"]);
        }
      } catch (err) {
        console.error("Error fetching divisions:", err);
        setDivisions(["Colombo Borella", "Colombo Fort", "Kandy Central"]);
      }
    };
    fetchDivisions();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let interval;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerCount]);

  // Focus helper on entering OTP state
  useEffect(() => {
    if (showOtpVerify && inputRefs[0].current) {
      setTimeout(() => inputRefs[0].current.focus(), 100);
    }
  }, [showOtpVerify]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !nic ||
      !household ||
      !firstName ||
      !lastName ||
      !email ||
      !dob ||
      !gender ||
      !mobile ||
      !division ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage(t.errorAllFields);
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(t.errorInvalidEmail);
      return;
    }

    // Validate Password Complexity (At least 8 chars, uppercase, lowercase, number, special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(t.errorPasswordComplexity);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t.errorPasswordMatch);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const bodyPayload = {
        nic,
        firstName: firstName,
        lastName: lastName,
        dob,
        password,
        gender,
        mobile,
        email,
        householdNumber: household,
        division: division,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t.errorRegistrationFailed);
        setIsSubmitting(false);
        return;
      }

      setErrorMessage("");
      setResendSuccessMessage("");
      setVerificationEmail(email);
      setVerificationNic(nic);
      setHouseholdCreatedState(data.householdCreated || false);

      // Dispatch essential admin notification
      addNotification("admin", {
        type: "user",
        title: "New Resident Registered",
        message: `New Resident ${firstName} ${lastName} (NIC: ${nic}) registered under GN Division: ${division}.`,
        link: "/dashboard/admin",
      });

      // Save user details to localStorage
      if (data.token) {
        localStorage.setItem("smartgn_token", data.token);
      }
      localStorage.setItem("smartgn_user_name", `${firstName} ${lastName}`);
      localStorage.setItem("smartgn_user_division", division);
      localStorage.setItem("smartgn_user_role", "RESIDENT");
      localStorage.setItem("smartgn_user_id", nic);

      // Direct navigation to registration success page
      navigate("/success", {
        state: {
          successUser: `${firstName} ${lastName} (NIC: ${nic})`,
          isRegister: true,
          householdCreated: data.householdCreated || false,
        },
      });
      setIsSubmitting(false);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(t.errorNetwork);
      setIsSubmitting(false);
    }
  };

  const handleOtpDigitChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

    // Shift focus right
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current.focus();
      const newDigits = [...otpDigits];
      newDigits[index - 1] = "";
      setOtpDigits(newDigits);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return; // must be exactly 6 digits

    const chars = pasteData.split("");
    setOtpDigits(chars);
    inputRefs[5].current.focus();
  };

  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    const otpValue = otpDigits.join("");
    if (otpValue.length !== 6) {
      setErrorMessage(t.otpErrorInvalid);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verificationEmail,
          nic: verificationNic,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t.otpErrorInvalid);
        setIsSubmitting(false);
        return;
      }

      setErrorMessage("");
      setIsSubmitting(false);

      // Navigate to success
      navigate("/success", {
        state: {
          successUser: `${firstName} ${lastName} (NIC: ${nic})`,
          isRegister: true,
          householdCreated: householdCreatedState,
          message:
            "Account created and verified. Two-Factor Authentication (2FA) is now active.",
        },
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      setErrorMessage(t.errorNetwork);
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timerCount > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage("");
    setResendSuccessMessage("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verificationEmail,
          purpose: "REGISTRATION",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to resend code.");
        setIsResending(false);
        return;
      }

      setResendSuccessMessage(t.otpResendSuccess);
      setTimerCount(60); // reset cooldown
      setOtpDigits(["", "", "", "", "", ""]);

      setIsResending(false);
      if (inputRefs[0].current) inputRefs[0].current.focus();
    } catch (err) {
      console.error("Resend error:", err);
      setErrorMessage(t.errorNetwork);
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 relative">
      {/* Language Selector */}
      <div className="absolute top-6 right-8">
        <LanguageSelector />
      </div>

      {/* Registration / OTP Card */}
      <div className="w-full max-w-[700px] bg-white rounded-[32px] border border-[#2D37482D] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col transition-all duration-300">
        {/* VIEW 1: OTP VERIFICATION SCREEN */}
        {showOtpVerify ? (
          <>
            <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-4 tracking-tight">
              {t.otpTitle}
            </h2>
            <p className="text-[14px] text-gray-500 text-center mb-8">
              {t.otpDescription}{" "}
              <strong className="text-[#1B365D]">{verificationEmail}</strong>
            </p>

            <form
              onSubmit={handleOtpVerifySubmit}
              className="flex flex-col gap-6 items-center"
            >
              <label className="text-[14px] font-medium text-[#2D3748] text-center w-full">
                {t.otpLabel}
              </label>

              {/* 6 Digit Inputs */}
              <div
                className="flex gap-2 md:gap-4 my-2 justify-center"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    maxLength="1"
                    id={`otp-input-${idx}`}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-[22px] font-bold bg-[#EBF1F6] border border-[#2D37482D] rounded-[12px] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200 text-[#1B365D]"
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {/* Email Sent Notice */}
              <div className="w-full max-w-[440px] px-4 py-3 bg-[#ECFDF5] border-2 border-[#10B981]/40 rounded-xl shadow-sm my-1 text-left">
                <div className="flex items-center gap-2 text-[#065F46] font-bold text-xs uppercase tracking-wider mb-1">
                  <span>📧 Verification Email Sent</span>
                </div>
                <p className="text-[13px] text-[#047857] font-medium m-0 leading-relaxed">
                  A 6-digit OTP has been sent to <strong>{verificationEmail}</strong>. Please check your inbox (and spam folder) and enter the code above.
                </p>
              </div>

              {/* Messages */}
              {errorMessage && (
                <p className="text-[#ef4444] text-[13.5px] text-center mt-1">
                  {errorMessage}
                </p>
              )}
              {resendSuccessMessage && (
                <p className="text-[#10b981] text-[13.5px] text-center mt-1 font-medium">
                  {resendSuccessMessage}
                </p>
              )}

              {/* Action Buttons */}
              <button
                type="submit"
                className={`w-full max-w-[400px] py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-4 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : t.otpVerifyButton}
              </button>
            </form>

            {/* Resend & Back actions */}
            <div className="flex flex-col items-center gap-4 mt-8 border-t border-[#2D37481F] pt-6 w-full">
              <button
                onClick={handleResendOtp}
                className={`text-[14px] font-semibold transition-all duration-200 ${
                  timerCount > 0 || isResending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#D69E2E] hover:text-[#FFAA00] cursor-pointer"
                }`}
                disabled={timerCount > 0 || isResending}
              >
                {isResending
                  ? t.otpResending
                  : timerCount > 0
                    ? `${t.otpResendCode} (${timerCount}s)`
                    : t.otpResendCode}
              </button>

              <button
                onClick={() => {
                  setShowOtpVerify(false);
                  setOtpDigits(["", "", "", "", "", ""]);
                  setErrorMessage("");
                  setResendSuccessMessage("");
                }}
                className="text-[13.5px] text-gray-500 hover:text-[#1B365D] font-medium transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                ← {t.otpBackToRegister}
              </button>
            </div>
          </>
        ) : (
          /* VIEW 2: NORMAL SIGNUP FORM */
          <>
            <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-8 tracking-tight">
              {t.title}
            </h2>

            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NIC Number */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nic"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.nicLabel}
                  </label>
                  <input
                    type="text"
                    id="nic"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.nicPlaceholder}
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Household Number */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="household"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.householdLabel}
                  </label>
                  <input
                    type="text"
                    id="household"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.householdPlaceholder}
                    value={household}
                    onChange={(e) => setHousehold(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.firstNameLabel}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.firstNamePlaceholder}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.lastNameLabel}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.lastNamePlaceholder}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="dob"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.dobLabel}
                  </label>
                  <input
                    type="date"
                    id="dob"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="gender"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.genderLabel}
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="" disabled hidden>
                        {t.genderPlaceholder}
                      </option>
                      <option value="Male">{t.genderMale}</option>
                      <option value="Female">{t.genderFemale}</option>
                      <option value="Other">{t.genderOther}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="mobile"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.mobileLabel}
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.mobilePlaceholder}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Searchable GN Division */}
                <div className="flex flex-col gap-2 relative" ref={divisionDropdownRef}>
                  <label
                    htmlFor="division"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.divisionLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="division"
                      className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                      placeholder="Search GN division name..."
                      value={isDivisionDropdownOpen ? divisionSearch : (division || divisionSearch)}
                      onFocus={() => {
                        setIsDivisionDropdownOpen(true);
                        setDivisionSearch("");
                      }}
                      onChange={(e) => {
                        setDivisionSearch(e.target.value);
                        setDivision(e.target.value);
                        setIsDivisionDropdownOpen(true);
                      }}
                      disabled={isSubmitting}
                      required
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  {isDivisionDropdownOpen && (
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-[#005BBD]/30 rounded-[8px] shadow-lg max-h-48 overflow-y-auto z-50 text-left divide-y divide-gray-100">
                      {divisions
                        .filter((divName) =>
                          divName.toLowerCase().includes(divisionSearch.toLowerCase())
                        )
                        .map((divName, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setDivision(divName);
                              setDivisionSearch(divName);
                              setIsDivisionDropdownOpen(false);
                            }}
                            className="px-4 py-2.5 hover:bg-[#EBF1F6] cursor-pointer text-[14px] text-[#2D3748] font-medium transition-colors flex justify-between items-center"
                          >
                            <span>{divName}</span>
                            {division === divName && (
                              <span className="text-[#005BBD] font-bold text-xs">✓ Selected</span>
                            )}
                          </div>
                        ))}
                      {divisions.filter((divName) =>
                        divName.toLowerCase().includes(divisionSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-xs text-gray-400 italic">
                          No matching GN division found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full pl-4 pr-12 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#1B365D] cursor-pointer bg-transparent border-none outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[14px] font-medium text-[#2D3748] text-left"
                  >
                    {t.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full pl-4 pr-12 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                      placeholder={t.confirmPasswordPlaceholder}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#1B365D] cursor-pointer bg-transparent border-none outline-none"
                      title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-[#ef4444] text-[13px] text-left mt-1">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : t.submitButton}
              </button>
            </form>

            {/* Already have an account link */}
            <div className="text-[14px] text-gray-500 text-center mt-6">
              {t.alreadyAccount}{" "}
              <span
                className="text-[#D69E2E] hover:text-[#FFAA00] font-semibold cursor-pointer ml-1 transition-colors duration-200"
                onClick={() => navigate("/login")}
              >
                {t.loginLink}
              </span>
            </div>

            {/* Bottom Row: Back & Logo */}
            <div className="flex justify-between items-center mt-8 border-t border-[#2D37481F] pt-6">
              <button
                className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D3748] text-[14px] font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                <span className="text-[18px]">←</span> {t.back}
              </button>

              <img
                src={logoImage}
                alt="SmartGN Logo"
                className="w-[120px] h-auto object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
