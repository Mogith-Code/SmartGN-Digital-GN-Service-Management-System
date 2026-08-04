import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/translate";
import LanguageSelector from "../Components/Common/LanguageSelector";
import logoImage from "../assets/logo.png";
import { getApiUrl } from "../utils/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [step, setStep] = useState(1); // 1: Request Code, 2: OTP & New Password, 3: Success
  const [identifier, setIdentifier] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const translations = {
    EN: {
      title: "Reset Password",
      step1Subtitle:
        "Enter your registered Username, NIC, or Email address to receive a verification code.",
      identifierLabel: "Username / NIC / Email",
      identifierPlaceholder: "e.g., 199912345678, email, or username",
      sendCodeBtn: "Send Verification Code",
      sendingCodeBtn: "Sending Code...",
      step2Subtitle: "A 6-digit verification code has been sent to",
      otpLabel: "Verification Code",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPasswordLabel: "Confirm New Password",
      confirmPasswordPlaceholder: "Re-enter your new password",
      resetBtn: "Reset Password",
      resettingBtn: "Resetting Password...",
      passMismatch: "Passwords do not match.",
      passRules:
        "Password must be at least 8 characters long and contain uppercase, lowercase, a number, and a special character.",
      resendCode: "Resend Code",
      resending: "Resending...",
      backToLogin: "Back to Login",
      successTitle: "Password Reset Successful!",
      successSubtitle:
        "Your password has been updated successfully. You can now log in with your new password.",
      loginNowBtn: "Go to Login",
      otpConsoleMessage:
        "📧 OTP has been sent to console. Check your terminal!",
    },
    SI: {
      title: "මුරපදය නැවත සකසන්න",
      step1Subtitle:
        "තහවුරු කිරීමේ කේතයක් ලබා ගැනීමට ඔබගේ ලියාපදිංචි පරිශීලක නාමය, ජා.හැ.අංකය හෝ විද්‍යුත් තැපෑල ඇතුළත් කරන්න.",
      identifierLabel: "පරිශීලක නාමය / ජා.හැ.අංකය / විද්‍යුත් තැපෑල",
      identifierPlaceholder: "උදා: 199912345678, විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය",
      sendCodeBtn: "තහවුරු කිරීමේ කේතය යවන්න",
      sendingCodeBtn: "කේතය යවමින්...",
      step2Subtitle: "අපි ඉලක්කම් 6ක තහවුරු කිරීමේ කේතයක් මෙහි යවා ඇත:",
      otpLabel: "තහවුරු කිරීමේ කේතය",
      newPasswordLabel: "නව මුරපදය",
      newPasswordPlaceholder: "ඔබගේ නව මුරපදය ඇතුළත් කරන්න",
      confirmPasswordLabel: "නව මුරපදය තහවුරු කරන්න",
      confirmPasswordPlaceholder: "ඔබගේ නව මුරපදය නැවත ඇතුළත් කරන්න",
      resetBtn: "මුරපදය නැවත සකසන්න",
      resettingBtn: "මුරපදය සකසමින්...",
      passMismatch: "මුරපද දෙක ගැලපෙන්නේ නැත.",
      passRules:
        "මුරපදය අවම වශයෙන් අක්ෂර 8ක් දිග විය යුතු අතර ලොකු අකුරු, කුඩා අකුරු, අංකයක් සහ විශේෂ සංකේතයක් තිබිය යුතුය.",
      resendCode: "කේතය නැවත එවන්න",
      resending: "නැවත යවමින්...",
      backToLogin: "ඇතුල්වීමට ආපසු යන්න",
      successTitle: "මුරපදය සාර්ථකව නැවත සකසන ලදී!",
      successSubtitle:
        "ඔබගේ මුරපදය සාර්ථකව යාවත්කාලීන කර ඇත. ඔබට දැන් ඔබගේ නව මුරපදයෙන් ඇතුළු විය හැක.",
      loginNowBtn: "ඇතුල්වීමේ පිටුවට යන්න",
      otpConsoleMessage:
        "📧 OTP කේතය console එකට යවා ඇත. ඔබගේ ටර්මිනලය පරීක්ෂා කරන්න!",
    },
    TA: {
      title: "கடவுச்சொல்லை மீட்டமைக்கவும்",
      step1Subtitle:
        "சரிபார்ப்புக் குறியீட்டைப் பெற உங்கள் பதிவுசெய்த பயனர் பெயர், NIC அல்லது மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
      identifierLabel: "பயனர் பெயர் / NIC / மின்னஞ்சல்",
      identifierPlaceholder: "உதா: 199912345678, மின்னஞ்சல் அல்லது பயனர் பெயர்",
      sendCodeBtn: "சரிபார்ப்புக் குறியீட்டை அனுப்பு",
      sendingCodeBtn: "குறியீடு அனுப்பப்படுகிறது...",
      step2Subtitle: "நாங்கள் 6 இலக்க சரிபார்ப்புக் குறியீட்டை அனுப்பியுள்ளோம்:",
      otpLabel: "சரிபார்ப்புக் குறியீடு",
      newPasswordLabel: "புதிய கடவுச்சொல்",
      newPasswordPlaceholder: "உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்",
      confirmPasswordLabel: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      confirmPasswordPlaceholder: "உங்கள் புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
      resetBtn: "கடவுச்சொல்லை மீட்டமைக்கவும்",
      resettingBtn: "கடவுச்சொல் மீட்டமைக்கப்படுகிறது...",
      passMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
      passRules:
        "கடவுச்சொல் குறைந்தபட்சம் 8 எழுத்துக்கள் கொண்டதாகவும், பெரிய எழுத்துக்கள், சிறிய எழுத்துக்கள், எண் மற்றும் சிறப்பு எழுத்துக்களைக் கொண்டதாகவும் இருக்க வேண்டும்.",
      resendCode: "குறியீட்டை மீண்டும் அனுப்பவும்",
      resending: "மீண்டும் அனுப்புகிறது...",
      backToLogin: "உள்நுழைவுக்குத் திரும்புக",
      successTitle: "கடவுச்சொல் மீட்டமைப்பு வெற்றி!",
      successSubtitle:
        "உங்கள் கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது. இப்போது உங்கள் புதிய கடவுச்சொல்லுடன் உள்நுழையலாம்.",
      loginNowBtn: "உள்நுழைவுக்குச் செல்லவும்",
      otpConsoleMessage:
        "📧 OTP குறியீடு console-க்கு அனுப்பப்பட்டது. உங்கள் டெர்மினலைச் சரிபார்க்கவும்!",
    },
  };

  const t = translations[lang] || translations.EN;

  // Countdown timer hook
  useEffect(() => {
    let interval;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerCount]);

  // Auto focus first OTP input on step 2
  useEffect(() => {
    if (step === 2 && inputRefs[0].current) {
      setTimeout(() => inputRefs[0].current.focus(), 100);
    }
  }, [step]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage(
        lang === "EN"
          ? "Please enter your username, NIC, or email."
          : lang === "SI"
            ? "කරුණාකර ඔබගේ පරිශීලක නාමය, ජා.හැ.අංකය හෝ විද්‍යුත් තැපෑල ඇතුළත් කරන්න."
            : "தயவுசெய்து உங்கள் பயனர் பெயர், NIC அல்லது மின்னஞ்சலை உள்ளிடவும்.",
      );
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const lowerId = identifier.trim().toLowerCase();

    // Dev/Mock bypass
    if (lowerId === "officer" || lowerId.includes("officer")) {
      setTargetEmail("officer.email@example.com");
      setStep(2);
      setTimerCount(60);
      setIsSubmitting(false);
      return;
    }

    if (lowerId === "resident" || lowerId.includes("resident")) {
      setTargetEmail("resident.email@example.com");
      setStep(2);
      setTimerCount(60);
      setIsSubmitting(false);
      return;
    }

    if (lowerId === "admin" || lowerId.includes("admin")) {
      setTargetEmail("admin@example.com");
      setStep(2);
      setTimerCount(60);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to find account.");
        return;
      }

      setTargetEmail(data.email);
      setStep(2);
      setTimerCount(60);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage("Network error. Please make sure the backend server is running.");
    }
  };

  const handleOtpDigitChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

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

  const handleResendOtp = async () => {
    if (timerCount > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(getApiUrl("/api/auth/resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, purpose: "FORGOT_PASSWORD" }),
      });

      const data = await response.json();
      setIsResending(false);

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to resend verification code.");
        return;
      }

      setSuccessMessage("Verification code resent successfully!");
      setTimerCount(60);
      setOtpDigits(["", "", "", "", "", ""]);
      if (inputRefs[0].current) inputRefs[0].current.focus();
    } catch (err) {
      setIsResending(false);
      setErrorMessage("Failed to resend code.");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otpDigits.join("");

    if (otpValue.length !== 6) {
      setErrorMessage(
        lang === "EN"
          ? "Please enter a valid 6-digit verification code."
          : "කරුණාකර වලංගු ඉලක්කම් 6ක තහවුරු කිරීමේ කේතයක් ඇතුළත් කරන්න.",
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t.passMismatch);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(t.passRules);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Dev/Mock bypass
    if (
      targetEmail === "officer.email@example.com" ||
      targetEmail === "resident.email@example.com" ||
      targetEmail === "admin@example.com" ||
      otpValue === "123456"
    ) {
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
      }, 500);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          otp: otpValue,
          newPassword,
        }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        setErrorMessage(data.error || "Password reset failed.");
        return;
      }

      setStep(3);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 relative bg-[#F7FAFC]">
      <div className="absolute top-6 right-8">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-[540px] bg-white rounded-[32px] border border-[#2D37482D] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col transition-all duration-300">
        {step === 1 && (
          <>
            <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-3 tracking-tight">
              {t.title}
            </h2>
            <p className="text-[14px] text-gray-500 text-center mb-8">
              {t.step1Subtitle}
            </p>

            <form onSubmit={handleRequestCode} className="flex flex-col gap-6">
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

              {errorMessage && (
                <p className="text-[#ef4444] text-[13px] text-left mt-1">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.sendingCodeBtn : t.sendCodeBtn}
              </button>
            </form>

            <div className="flex justify-between items-center mt-12 border-t border-[#2D37481F] pt-6">
              <button
                className="flex items-center gap-1.5 text-gray-500 hover:text-[#2D3748] text-[14px] font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <span className="text-[18px]">←</span> {t.backToLogin}
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

        {step === 2 && (
          <>
            <h2 className="text-[22px] font-semibold text-[#1B365D] text-center mb-3 tracking-tight">
              {t.title}
            </h2>
            <p className="text-[14px] text-gray-500 text-center mb-6">
              {t.step2Subtitle}{" "}
              <strong className="text-[#1B365D]">{targetEmail}</strong>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-center">
              <span className="text-sm text-blue-800 font-medium">
                {t.otpConsoleMessage}
              </span>
            </div>

            <form
              onSubmit={handleResetPasswordSubmit}
              className="flex flex-col gap-5"
            >
              {/* OTP Digits */}
              <div className="flex flex-col gap-2 items-center">
                <label className="text-[14px] font-medium text-[#2D3748] self-start">
                  {t.otpLabel}
                </label>
                <div
                  className="flex gap-2 md:gap-3 justify-center w-full"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      maxLength="1"
                      className="w-11 h-13 text-center text-[20px] font-bold bg-[#EBF1F6] border border-[#2D37482D] rounded-[10px] focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200 text-[#1B365D]"
                      value={digit}
                      onChange={(e) =>
                        handleOtpDigitChange(e.target.value, idx)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="newPassword"
                  className="text-[14px] font-medium text-[#2D3748] text-left"
                >
                  {t.newPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    className="w-full pl-4 pr-12 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
                    placeholder={t.newPasswordPlaceholder}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#1B365D] cursor-pointer bg-transparent border-none outline-none"
                  >
                    {showNewPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#1B365D] cursor-pointer bg-transparent border-none outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-[#ef4444] text-[13px] text-left mt-1">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="text-[#10b981] text-[13.5px] text-center mt-1 font-medium">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer mt-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.resettingBtn : t.resetBtn}
              </button>
            </form>

            <div className="flex flex-col items-center gap-3 mt-6 border-t border-[#2D37481F] pt-5 w-full">
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
                  ? t.resending
                  : timerCount > 0
                    ? `${t.resendCode} (${timerCount}s)`
                    : t.resendCode}
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="text-[13.5px] text-gray-500 hover:text-[#1B365D] font-medium transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                ← {t.backToLogin}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-[22px] font-semibold text-[#1B365D] mb-3 tracking-tight">
              {t.successTitle}
            </h2>
            <p className="text-[14.5px] text-gray-600 mb-8 max-w-sm">
              {t.successSubtitle}
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[16px] rounded-full shadow-[0_4px_12px_rgba(27,54,93,0.3)] hover:shadow-[0_6px_20px_rgba(27,54,93,0.4)] transition-all duration-300 cursor-pointer"
            >
              {t.loginNowBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
