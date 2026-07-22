import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/translate";
import LanguageSelector from "../Components/Common/LanguageSelector";
import logoImage from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 2FA States
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [devOtpTip, setDevOtpTip] = useState("");
  const [timerCount, setTimerCount] = useState(0);

  // Focus refs for the 6 inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Translations
  const loginTranslations = {
    EN: {
      title: "Login",
      identifierLabel: "Enter your Username",
      identifierPlaceholder: "e.g., 199912345678, email, or username",
      passwordLabel: "Enter Password",
      passwordPlaceholder: "Enter your password",
      submitButton: "Login",
      noAccount: "Don't have an account ?",
      registerLink: "Register here",
      backHome: "Back",
      forgotPassword: "Forgot Password ?",
      contactSupport: "Contact Support",
      otpTitle: "Two-Factor Verification",
      otpDescription: "A 6-digit verification code has been sent to",
      otpLabel: "Enter Verification Code",
      otpVerifyButton: "Verify & Login",
      otpResendCode: "Resend Code",
      otpResending: "Resending...",
      otpBackToLogin: "Back to Login",
      otpErrorInvalid: "Please enter a valid 6-digit code.",
      otpResendSuccess: "Verification code resent successfully!",
    },
    SI: {
      title: "ඇතුල්වීම",
      identifierLabel: "ඔබගේ පරිශීලක නාමය ඇතුළත් කරන්න",
      identifierPlaceholder:
        "උදා: 199912345678, විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය",
      passwordLabel: "මුරපදය ඇතුළත් කරන්න",
      passwordPlaceholder: "ඔබගේ මුරපදය ඇතුළත් කරන්න",
      submitButton: "ඇතුල් වන්න",
      noAccount: "ගිණුමක් නොමැතිද ?",
      registerLink: "මෙහි ලියාපදිංචි වන්න",
      backHome: "ආපසු",
      forgotPassword: "මුරපදය අමතකද ?",
      contactSupport: "සහාය අමතන්න",
      otpTitle: "ද්වි-සාධක තහවුරු කිරීම",
      otpDescription: "අපි ඉලක්කම් 6ක තහවුරු කිරීමේ කේතයක් මෙහි යවා ඇත:",
      otpLabel: "තහවුරු කිරීමේ කේතය ඇතුළත් කරන්න",
      otpVerifyButton: "තහවුරු කර ඇතුල් වන්න",
      otpResendCode: "කේතය නැවත එවන්න",
      otpResending: "නැවත යවමින්...",
      otpBackToLogin: "ඇතුල්වීමට ආපසු යන්න",
      otpErrorInvalid: "කරුණාකර වලංගු ඉලක්කම් 6ක කේතයක් ඇතුළත් කරන්න.",
      otpResendSuccess: "තහවුරු කිරීමේ කේතය සාර්ථකව නැවත එවන ලදී!",
    },
    TA: {
      title: "உள்நுழைவு",
      identifierLabel: "உங்கள் பயனர் பெயரை உள்ளிடவும்",
      identifierPlaceholder: "உதா: 199912345678, மின்னஞ்சல் அல்லது பயனர் பெயர்",
      passwordLabel: "கடவுச்சொல்லை உள்ளிடவும்",
      passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      submitButton: "உள்நுழைக",
      noAccount: "கணக்கு இல்லையா ?",
      registerLink: "இங்கே பதிவு செய்க",
      backHome: "பின்னால்",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா ?",
      contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
      otpTitle: "இரு காரணி சரிபார்ப்பு",
      otpDescription:
        "நாங்கள் 6 இலக்க சரிபார்ப்புக் குறியீட்டை அனுப்பியுள்ளோம்:",
      otpLabel: "சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
      otpVerifyButton: "சரிபார்த்து உள்நுழைக",
      otpResendCode: "குறியீட்டை மீண்டும் அனுப்பவும்",
      otpResending: "மீண்டும் அனுப்புகிறது...",
      otpBackToLogin: "உள்நுழைவுக்குத் திரும்புக",
      otpErrorInvalid: "தயவுசெய்து சரியான 6 இலக்க குறியீட்டை உள்ளிடவும்.",
      otpResendSuccess:
        "சரிபார்ப்புக் குறியீடு வெற்றிகரமாக மீண்டும் அனுப்பப்பட்டது!",
    },
  };

  const t = loginTranslations[lang] || loginTranslations.EN;

  // Resend OTP countdown hook
  useEffect(() => {
    let interval;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerCount]);

  // Focus first input on transition
  useEffect(() => {
    if (showOtpVerify && inputRefs[0].current) {
      setTimeout(() => inputRefs[0].current.focus(), 100);
    }
  }, [showOtpVerify]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage(
        lang === "EN"
          ? "Please fill in all fields."
          : lang === "SI"
            ? "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න."
            : "தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்.",
      );
      return;
    }

    setErrorMessage("");
    setResendSuccessMessage("");

    // Mock / Development bypass for easy review and offline workability
    const lowerId = identifier.trim().toLowerCase();
    if (lowerId === "admin" && password === "admin") {
      localStorage.setItem("smartgn_token", "mock_admin_token");
      localStorage.setItem("smartgn_user_role", "ADMIN");
      localStorage.setItem("smartgn_user_name", "System Admin");
      localStorage.setItem("smartgn_user_id", "ADMIN-001");
      navigate("/dashboard/admin", {
        state: { successUser: "System Admin" },
      });
      return;
    }

    // Simulate OTP flow for mock officer/resident bypass
    if (lowerId === "officer" && password === "officer") {
      setVerificationEmail("officer.email@example.com");
      setShowOtpVerify(true);
      setDevOtpTip("123456");
      setTimerCount(60);
      return;
    }

    if (lowerId === "resident" && password === "resident") {
      setVerificationEmail("resident.email@example.com");
      setShowOtpVerify(true);
      setDevOtpTip("123456");
      setTimerCount(60);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        setErrorMessage(
          data.error ||
            (lang === "EN"
              ? "Invalid credentials or suspended account."
              : lang === "SI"
                ? "වලංගු නොවන අක්තපත්‍ර හෝ අත්හිටුවන ලද ගිණුමකි."
                : "தவறான சான்றுகள் அல்லது இடைநிறுத்தப்பட்ட கணக்கு."),
        );
        return;
      }

      // Check if 2FA is required
      if (data.requires2FA) {
        setVerificationEmail(data.email);
        setShowOtpVerify(true);
        setTimerCount(60);
        if (data.otpForTesting) {
          setDevOtpTip(data.otpForTesting);
        }
      } else {
        // Direct Login (Admins or if 2FA disabled)
        processLoginSuccess(data);
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        lang === "EN"
          ? "Network connection error. Please verify the MySQL backend is active."
          : lang === "SI"
            ? "ජාල සම්බන්ධතා දෝෂයකි. MySQL පසුබිම් සේවාදායකය ක්‍රියාකාරී දැයි පරීක්ෂා කරන්න."
            : "பிணைய இணைப்பு பிழை. MySQL பின்தள சேவையகம் செயலில் உள்ளதா என சரிபார்க்கவும்.",
      );
    }
  };

  const processLoginSuccess = (data) => {
    localStorage.setItem("smartgn_token", data.token);
    localStorage.setItem("smartgn_user_role", data.role);

    if (data.role === "RESIDENT") {
      localStorage.setItem("smartgn_user_id", data.user.nic);
      localStorage.setItem("smartgn_user_division", data.user.division);
      navigate("/ResidentDashboard", {
        state: {
          successUser: data.user.name,
          division: data.user.division,
          nic: data.user.nic,
        },
      });
    } else if (data.role === "OFFICER") {
      localStorage.setItem("smartgn_user_id", data.user.id);
      localStorage.setItem("smartgn_user_division", data.user.divisionName);
      navigate("/OfficerDashboard", {
        state: {
          successUser: data.user.name,
          officerId: data.user.id,
          division: data.user.divisionName,
        },
      });
    } else if (data.role === "ADMIN") {
      localStorage.setItem("smartgn_user_id", data.user.id);
      navigate("/dashboard/admin", {
        state: { successUser: data.user.name },
      });
    }
  };

  const handleOtpDigitChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

    // Auto-focus next input
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
    if (!/^\d{6}$/.test(pasteData)) return;

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
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail, otp: otpValue }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        setErrorMessage(data.error || t.otpErrorInvalid);
        return;
      }

      setErrorMessage("");
      processLoginSuccess(data);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        lang === "EN"
          ? "Connection failed. Try again."
          : "සම්බන්ධතාවය අසාර්ථක විය. නැවත උත්සාහ කරන්න.",
      );
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
        body: JSON.stringify({ email: verificationEmail, purpose: "LOGIN" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to resend code.");
        setIsResending(false);
        return;
      }

      setResendSuccessMessage(t.otpResendSuccess);
      setTimerCount(60);
      setOtpDigits(["", "", "", "", "", ""]);
      if (data.otpForTesting) {
        setDevOtpTip(data.otpForTesting);
      }
      setIsResending(false);
      if (inputRefs[0].current) inputRefs[0].current.focus();
    } catch (err) {
      console.error("Resend error:", err);
      setErrorMessage(t.otpErrorInvalid);
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 relative">
      {/* Language Selector floating in top right */}
      <div className="absolute top-6 right-8">
        <LanguageSelector />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[540px] bg-white rounded-[32px] border border-[#2D37482D] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col transition-all duration-300">
        {/* VIEW 1: OTP VERIFICATION VIEW */}
        {showOtpVerify ? (
          <>
            {/* Card Title */}
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
              {/* Digit Inputs */}
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
                    className="w-12 h-14 text-center text-[22px] font-bold bg-[#EBF1F6] border border-[#2D37482D] rounded-[12px] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200 text-[#1B365D]"
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {/* Dev Mode Assistance */}
              {devOtpTip && (
                <div className="w-full max-w-[400px] px-4 py-2.5 bg-[#FFF9E6] border border-[#F5D17E] rounded-[8px] text-[13px] text-[#A76F00] text-center font-medium my-1 animate-pulse">
                  🔧 Development Notice: Verification code is{" "}
                  <strong>{devOtpTip}</strong>
                </div>
              )}

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

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-4 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : t.otpVerifyButton}
              </button>
            </form>

            {/* OTP Footer actions */}
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
                ← {t.otpBackToLogin}
              </button>
            </div>
          </>
        ) : (
          /* VIEW 2: NORMAL LOGIN VIEW */
          <>
            {/* Card Title */}
            <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-8 tracking-tight">
              {t.title}
            </h2>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
              {/* Identifier field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="identifier"
                  className="text-[14px] font-medium text-[#2D3748] text-left"
                >
                  {t.identifierLabel}
                </label>
                <input
                  type="text"
                  id="identifier"
                  className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                  placeholder={t.identifierPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[14px] font-medium text-[#2D3748] text-left"
                >
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Links Row */}
              <div className="flex justify-between items-center text-[13.5px] font-semibold text-[#D69E2E] px-1">
                <span
                  className="hover:text-[#FFAA00] cursor-pointer transition-colors duration-200"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  {t.forgotPassword}
                </span>
                <span
                  className="hover:text-[#FFAA00] cursor-pointer transition-colors duration-200"
                  onClick={() => console.log("Contact support clicked")}
                >
                  {t.contactSupport}
                </span>
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
                className="w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-2"
              >
                {t.submitButton}
              </button>
            </form>

            {/* Help / Register link */}
            <div className="text-[14px] text-gray-500 text-center mt-6">
              {t.noAccount}{" "}
              <span
                className="text-[#D69E2E] hover:text-[#FFAA00] font-semibold cursor-pointer ml-1 transition-colors duration-200"
                onClick={() => navigate("/register")}
              >
                {t.registerLink}
              </span>
            </div>

            {/* Bottom Row: Back & Logo */}
            <div className="flex justify-between items-center mt-12 border-t border-[#2D37481F] pt-6">
              {/* Back Button */}
              <button
                className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D3748] text-[14px] font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <span className="text-[18px]">←</span> {t.backHome}
              </button>

              {/* SmartGN Logo */}
              <div className="flex flex-col items-end">
                <img
                  src={logoImage}
                  alt="SmartGN Logo"
                  className="w-[120px] h-auto object-contain cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
