import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AfterlogNavbar from "../Components/Common/AfterlogNavbar";
import RSidebar from "../Components/Common/RSidebar";
import Footer from "../Components/Common/Footer";
import { useLanguage } from "../utils/translate";

const certificateSuccessTranslations = {
  EN: {
    title: "Certificate Request Confirmed!",
    subtitle: "Your certificate application has been successfully validated and submitted to your Grama Niladhari officer.",
    badgeStatus: "Under Officer Verification",
    refNo: "Reference Number",
    certType: "Certificate Type",
    applicant: "Applicant Name",
    divisionLabel: "GN Division",
    submittedOn: "Submitted Date",
    purposeLabel: "Purpose",
    timelineTitle: "Application Validation Tracker",
    step1Title: "Application Submitted & Validated",
    step1Desc: "Your request parameters and details have been recorded in the portal.",
    step2Title: "Grama Niladhari Field Verification",
    step2Desc: "Your GN officer will inspect your details and attached documentation.",
    step3Title: "Approval & Digital Certificate Issuance",
    step3Desc: "Once approved, your certificate will be generated for download or collection.",
    viewPendingBtn: "View Pending Applications",
    dashboardBtn: "Back to Resident Dashboard",
    defaultCertType: "Grama Niladhari Certificate",
    defaultUser: "Resident Applicant",
    },
  SI: {
    title: "සහතික පත්‍ර ඉල්ලීම තහවුරු විය!",
    subtitle: "ඔබගේ සහතික පත්‍ර ඉල්ලුම්පත්‍රය සාර්ථකව පරීක්ෂා කර ඔබගේ ග්‍රාම නිලධාරී වෙත යොමු කර ඇත.",
    badgeStatus: "නිලධාරී පරික්ෂාව යටතේ",
    refNo: "යොමු අංකය",
    certType: "සහතික වර්ගය",
    applicant: "අයදුම්කරුගේ නම",
    divisionLabel: "ග්‍රාම නිලධාරී වසම",
    submittedOn: "ඉදිරිපත් කළ දිනය",
    purposeLabel: "අරමුණ",
    timelineTitle: "අයදුම්පතෙහි ප්‍රගතිය",
    step1Title: "අයදුම්පත ලැබුණු බව තහවුරු විය",
    step1Desc: "ඔබගේ ඉල්ලීම පද්ධතියට සාර්ථකව ඇතුළත් කර ඇත.",
    step2Title: "ග්‍රාම නිලධාරී පරීක්ෂාව",
    step2Desc: "ඔබගේ ග්‍රාම නිලධාරිවරයා තොරතුරු පරීක්ෂා කරනු ඇත.",
    step3Title: "අනුමැතිය සහ සහතික නිකුතුව",
    step3Desc: "අනුමැතියෙන් පසු සහතිකය බාගත කිරීමට හැකියාව ලැබෙනු ඇත.",
    viewPendingBtn: "බලපොරොත්තු වන ඉල්ලීම් බලන්න",
    dashboardBtn: "නේවාසික පුවරුවට",
    defaultCertType: "ග්‍රාම නිලධාරී සහතිකය",
    defaultUser: "අයදුම්කරු",
    },
  TA: {
    title: "சான்றிதழ் கோரிக்கை உறுதி செய்யப்பட்டது!",
    subtitle: "உங்கள் சான்றிதழ் விண்ணப்பம் சரிபார்க்கப்பட்டு உங்கள் கிராம நிலதாரி அதிகாரிக்கு அனுப்பப்பட்டுள்ளது.",
    badgeStatus: "அதிகாரியின் சரிபார்ப்பில்",
    refNo: "குறிப்பு எண்",
    certType: "சான்றிதழ் வகை",
    applicant: "விண்ணப்பதாரர் பெயர்",
    divisionLabel: "கிராம நிலதாரி பிரிவு",
    submittedOn: "சமர்ப்பிக்கப்பட்ட தேதி",
    purposeLabel: "நோக்கம்",
    timelineTitle: "விண்ணப்ப கண்காணிப்பு",
    step1Title: "விண்ணப்பம் சமர்ப்பிக்கப்பட்டு சரிபார்க்கப்பட்டது",
    step1Desc: "உங்கள் விவரங்கள் போர்ட்டலில் பதிவு செய்யப்பட்டுள்ளன.",
    step2Title: "கிராம நிலதாரி களச் சரிபார்ப்பு",
    step2Desc: "உங்கள் அதிகாரி விவரங்களைச் சரிபார்ப்பார்.",
    step3Title: "ஒப்புதல் மற்றும் டிஜிட்டல் சான்றிதழ் வழக்கம்",
    step3Desc: "ஒப்புதலுக்குப் பின் சான்றிதழைப் பதிவிறக்கலாம்.",
    viewPendingBtn: "நிலுவையில் உள்ள கோரிக்கைகளைக் காண்க",
    dashboardBtn: "குடியுரிமை டாஷ்போர்டுக்கு",
    defaultCertType: "கிராம நிலதாரி சான்றிதழ்",
    defaultUser: "விண்ணப்பதாரர்",
  },
};

function CertificateSuccess({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = certificateSuccessTranslations[lang] || certificateSuccessTranslations.EN;

  // Retrieve details passed from application form
  const stateData = location.state || {};
  const requestNumber = stateData.requestNumber || `CERT-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  const certificateType = stateData.certificateType || t.defaultCertType;
  const applicantName = stateData.applicantName || localStorage.getItem("smartgn_user_name") || t.defaultUser;
  const division = stateData.division || localStorage.getItem("smartgn_user_division") || "Grama Niladhari Division";
  const purpose = stateData.purpose || "Official Certificate Request";
  const submittedDate = stateData.submittedDate || new Date().toLocaleDateString();

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      {/* Top Navbar */}
      <AfterlogNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        {/* Sidebar */}
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 bg-[#F7FAFC] flex flex-col items-center justify-center">
          <div className="w-full max-w-[700px] bg-white rounded-[24px] border border-[#2D37482D] shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-10 flex flex-col items-center text-center my-6">
            
            {/* Animated Validation Badge */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 shadow-[0_8px_24px_rgba(16,185,129,0.18)]">
                <svg
                  className="w-10 h-10 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-ping"></div>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] mb-2 tracking-tight">
              {t.title}
            </h2>
            <p className="text-[15px] text-[#475569] max-w-[540px] leading-relaxed mb-6">
              {t.subtitle}
            </p>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] rounded-full text-[13px] font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
              {t.badgeStatus}
            </div>

            {/* Summary Box */}
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 mb-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.refNo}
                  </span>
                  <span className="font-mono font-bold text-[#1B365D] text-[15px]">
                    {requestNumber}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.certType}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {certificateType}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.applicant}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {applicantName}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.divisionLabel}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {division}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.submittedOn}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {submittedDate}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                    {t.purposeLabel}
                  </span>
                  <span className="font-semibold text-[#1e293b] truncate block">
                    {purpose}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="w-full text-left mb-8">
              <h4 className="text-[15px] font-bold text-[#1B365D] mb-4">
                {t.timelineTitle}
              </h4>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-[14px] font-semibold text-[#1e293b]">
                      {t.step1Title}
                    </h5>
                    <p className="text-xs text-[#64748B]">
                      {t.step1Desc}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 animate-pulse">
                    2
                  </div>
                  <div>
                    <h5 className="text-[14px] font-semibold text-[#1e293b]">
                      {t.step2Title}
                    </h5>
                    <p className="text-xs text-[#64748B]">
                      {t.step2Desc}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-[14px] font-semibold text-slate-500">
                      {t.step3Title}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {t.step3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/ResidentDashboard/certificates/pending")}
                className="flex-1 py-3 px-5 bg-[#1B365D] hover:bg-[#005BBD] text-white font-medium text-[15px] rounded-xl transition-all duration-200 shadow-md cursor-pointer"
              >
                {t.viewPendingBtn}
              </button>
              <button
                onClick={() => navigate("/ResidentDashboard")}
                className="flex-1 py-3 px-5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#1E293B] font-medium text-[15px] rounded-xl transition-all duration-200 cursor-pointer"
              >
                {t.dashboardBtn}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CertificateSuccess;
        

        

