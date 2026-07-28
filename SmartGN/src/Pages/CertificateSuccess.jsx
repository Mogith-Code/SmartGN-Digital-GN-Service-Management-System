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