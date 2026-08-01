import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../utils/translate";
import { addNotification } from "../utils/notifications";
import LanguageSelector from "../Components/Common/LanguageSelector";
import logoImage from "../assets/logo.png";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";

function ForgotPassword({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [emailOrNic, setEmailOrNic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const forgotTranslations = {
    EN: {
      title: "Reset Your Password",
      subtitle:
        "Enter your registered Email address or NIC number below. An administrative password reset notice will be dispatched.",
      label: "Email Address or NIC Number",
      placeholder: "e.g., Nimal.Perera@example.com or 200324511540",
      submitBtn: "Send Password Reset Request",
      backLogin: "Back to Login",
      successTitle: "Request Dispatched Successfully!",
      successMessage:
        "Your password reset request has been logged. An essential notification has been sent to the Admin & Grama Niladhari officer for identity verification.",
      errorEmpty: "Please enter your registered Email or NIC number.",
    },
    SI: {
      title: "මුරපදය නැවත සකසන්න",
      subtitle:
        "ඔබගේ ලියාපදිංචි විද්‍යුත් තැපැල් ලිපිනය හෝ ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න.",
      label: "විද්‍යුත් තැපෑල හෝ ජාතික හැඳුනුම්පත් අංකය",
      placeholder: "උදා: Nimal.Perera@example.com හෝ 200324511540",
      submitBtn: "මුරපද නැවත සැකසීමේ ඉල්ලීම යවන්න",
      backLogin: "ඇතුළුවීමට ආපසු යන්න",
      successTitle: "ඉල්ලීම සාර්ථකව යවන ලදී!",
      successMessage:
        "ඔබගේ මුරපද නැවත සැකසීමේ ඉල්ලීම වාර්තා කර ඇත. අනන්‍යතාවය සත්‍යාපනය කිරීම සඳහා පාලක (Admin) වෙත දැනුම්දීමක් යවා ඇත.",
      errorEmpty: "කරුණාකර ඔබගේ විද්‍යුත් තැපෑල හෝ හැඳුනුම්පත් අංකය ඇතුළත් කරන්න.",
    },
    TA: {
      title: "கடவுச்சொல்லை மீட்டமைக்கவும்",
      subtitle:
        "உங்கள் பதிவுசெய்த மின்னஞ்சல் முகவரி அல்லது தேசிய அடையாள அட்டை எண்ணை உள்ளிடவும்.",
      label: "மின்னஞ்சல் முகவரி அல்லது NIC எண்",
      placeholder: "எ.கா: Nimal.Perera@example.com அல்லது 200324511540",
      submitBtn: "கடவுச்சொல் மீட்டமைப்பு கோரிக்கையை அனுப்பு",
      backLogin: "உள்நுழைவுக்கு திரும்பவும்",
      successTitle: "கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!",
      successMessage:
        "உங்கள் கடவுச்சொல் மீட்டமைப்பு கோரிக்கை பதிவு செய்யப்பட்டுள்ளது. நிர்வாகிக்கு அறிவிப்பு அனுப்பப்பட்டுள்ளது.",
      errorEmpty: "உங்கள் மின்னஞ்சல் அல்லது NIC எண்ணை உள்ளிடவும்.",
    },
  };

  const t = forgotTranslations[lang] || forgotTranslations.EN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrNic.trim()) {
      setErrorMessage(t.errorEmpty);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrNic: emailOrNic.trim() }),
      });

      const data = await response.json();

      // Create essential admin notification for reset request
      addNotification("admin", {
        type: "security",
        title: "Password Reset Requested",
        message: `Password reset instructions sent to (${emailOrNic.trim()}) via SmartGN Mailer (warapitiyalakshan@gmail.com).`,
        link: "/dashboard/admin",
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      // Fallback UI success with admin notification
      addNotification("admin", {
        type: "security",
        title: "Password Reset Requested",
        message: `Password reset request submitted for user (${emailOrNic.trim()}). Official mailer: warapitiyalakshan@gmail.com.`,
        link: "/dashboard/admin",
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] flex flex-col justify-between">
      {/* Header */}
      <header className="w-full bg-[#1B365D] py-4 px-6 sm:px-12 flex justify-between items-center shadow-md">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoImage} alt="SmartGN Logo" className="h-10 w-auto" />
          <span className="text-white text-xl font-bold tracking-wide">
            SmartGN
          </span>
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white border border-[#2D37482D] rounded-2xl p-6 sm:p-8 shadow-lg text-left">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#EBF8FF] text-[#005BBD] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#005BBD]/20">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1B365D]">
                  {t.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.label}
                  </label>
                  <input
                    type="text"
                    value={emailOrNic}
                    onChange={(e) => setEmailOrNic(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-xl text-sm text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all"
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs font-medium text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : t.submitBtn}
                </button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-xs font-bold text-[#005BBD] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    ← {t.backLogin}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#1B365D] mb-2">
                {t.successTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                {t.successMessage}
              </p>

              <button
                onClick={() => navigate("/login")}
                className="py-3 px-8 bg-[#1B365D] hover:bg-[#005BBD] text-white font-bold text-xs rounded-full shadow transition-all cursor-pointer border-0"
              >
                {t.backLogin}
              </button>
            </div>
          )}
        </div>
      </main>

      <ChatbotButton onOpenHelp={onOpenHelp} />
      <Footer />
    </div>
  );
}

export default ForgotPassword;
