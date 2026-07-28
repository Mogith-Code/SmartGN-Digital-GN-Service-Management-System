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