import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import Footer from "../Common/Footer";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";
import { authenticatedFetch } from "../../utils/api";

function DetailItem({ label, value, isEmail }) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-[15px] font-medium text-gray-800 ${isEmail ? "text-blue-600 hover:underline cursor-pointer" : ""}`}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}

function ProfileDetails({ onOpenHelp }) {
  const navigate = useNavigate();
  const { nic } = useParams();
  const { lang } = useLanguage();

  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ProfileTranslations = {
    EN: {
      back: "Back",
      Title: "Resident Profile Details",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      householdInfo: "Household & Location Information",
      fullName: "Full Name",
      nic: "NIC Number",
      dob: "Date of Birth",
      gender: "Gender",
      occupation: "Occupation",
      email: "Email Address",
      mobile: "Mobile Number",
      householdNo: "Household Number",
      address: "Address",
      division: "GN Division",
      status: "Account Status",
      loading: "Loading profile details...",
      error: "Error loading profile details.",
    },
    SI: {
      back: "ආපසු",
      Title: "පදිංචිකරුවාගේ ප්‍රොෆයිල් විස්තර",
      personalInfo: "පුද්ගලික තොරතුරු",
      contactInfo: "සම්බන්ධතා තොරතුරු",
      householdInfo: "ගෘහස්ථ සහ ප්‍රදේශ තොරතුරු",
      fullName: "සම්පූර්ණ නම",
      nic: "ජාතික හැඳුනුම්පත් අංකය",
      dob: "උපන් දිනය",
      gender: "ස්ත්‍රී/පුරුෂ භාවය",
      occupation: "රැකියාව",
      email: "විද්‍යුත් තැපෑල",
      mobile: "දුරකථන අංකය",
      householdNo: "ගෘහ අංකය",
      address: "ලිපිනය",
      division: "වසම",
      status: "ගිණුමේ තත්ත්වය",
      loading: "ප්‍රොෆයිල් විස්තර පූරණය වෙමින්...",
      error: "විස්තර පූරණය කිරීමේ දෝෂයකි.",
    },
    TA: {
      back: "பின்னால்",
      Title: "குடியிருப்பாளர் சுயவிவர விவரங்கள்",
      personalInfo: "தனிப்பட்ட தகவல்",
      contactInfo: "தொடர்பு தகவல்",
      householdInfo: "வீடு & இருப்பிடத் தகவல்கள்",
      fullName: "முழு பெயர்",
      nic: "தேசிய அடையாள அட்டை எண்",
      dob: "பிறந்த தேதி",
      gender: "பாலினம்",
      occupation: "தொழில்",
      email: "மின்னஞ்சல் முகவரி",
      mobile: "கைபேசி எண்",
      householdNo: "வீட்டு எண்",
      address: "முகவரி",
      division: "பிரிவு",
      status: "கணக்கு நிலை",
      loading: "சுயவிவர விவரங்கள் ஏற்றப்படுகின்றன...",
      error: "சுயவிவர விவரங்களை ஏற்றுவதில் பிழை.",
    },
  };

  const t = ProfileTranslations[lang] || ProfileTranslations.EN;

  useEffect(() => {
    const fetchResidentDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await authenticatedFetch(
          `/api/auth/admin/residents/${nic}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch resident details");
        }
        const data = await response.json();
        setResident(data);
      } catch (err) {
        console.error("Error fetching resident profile:", err);
        setError("Could not load resident details. Using fallback data.");
        // Fallback to static mock data if api fails
        setResident({
          name: "Dissanayake Mudiyanselage Nimal Perera",
          nic: nic || "2005686114655",
          dob: "1995-05-12",
          gender: "Male",
          address: "123 Galle Road, Colombo 03, Sri Lanka",
          mobile_no: "0771234567",
          email: "nimal.perera@example.com",
          household_number: "12345",
          division_name: "Colombo Fort",
          occupation: "Software Engineer",
          status: "Active",
          created_at: "2026-01-10T12:00:00.000Z",
        });
      } finally {
        setLoading(false);
      }
    };

    if (nic) {
      fetchResidentDetails();
    }
  }, [nic]);

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-6 sm:p-8 md:p-10 flex flex-col text-left">
          {/* Back Button */}
          <button
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[20px] cursor-pointer border-0 bg-transparent"
            onClick={() => navigate("/OfficerDashboard/ResidentsDetails")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </button>

          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px] mt-[30px] mb-8">
            {t.Title}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 font-medium">{t.loading}</span>
            </div>
          ) : error && !resident ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
              {t.error}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Header Profile Card */}
              <div className="bg-gradient-to-r from-[#1B365D] to-[#2B548A] rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                {/* Decorative Shapes */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                <div className="absolute right-10 -top-10 w-24 h-24 bg-white opacity-5 rounded-full"></div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
                  {resident.name ? resident.name.charAt(0) : "R"}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                    {resident.name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2">
                    <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      NIC: {resident.nic}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        resident.status === "Active"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {resident.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 1: Personal Details */}
                <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-[17px] font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#D69E2E] rounded-full inline-block"></span>
                    {t.personalInfo}
                  </h4>
                  <div className="flex flex-col gap-4">
                    <DetailItem label={t.fullName} value={resident.name} />
                    <DetailItem label={t.nic} value={resident.nic} />
                    <DetailItem
                      label={t.dob}
                      value={
                        resident.dob
                          ? new Date(resident.dob).toLocaleDateString()
                          : "N/A"
                      }
                    />
                    <DetailItem label={t.gender} value={resident.gender} />
                    <DetailItem
                      label={t.occupation}
                      value={resident.occupation || "N/A"}
                    />
                  </div>
                </div>

                {/* Section 2: Contact Details */}
                <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-[17px] font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#D69E2E] rounded-full inline-block"></span>
                    {t.contactInfo}
                  </h4>
                  <div className="flex flex-col gap-4">
                    <DetailItem
                      label={t.email}
                      value={resident.email}
                      isEmail
                    />
                    <DetailItem
                      label={t.mobile}
                      value={resident.mobile_no || "N/A"}
                    />
                  </div>
                </div>

                {/* Section 3: Household & Location Details */}
                <div className="bg-white border border-[#2D37481F] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
                  <h4 className="text-[17px] font-bold text-[#1B365D] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#D69E2E] rounded-full inline-block"></span>
                    {t.householdInfo}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label={t.householdNo}
                      value={resident.household_number || "N/A"}
                    />
                    <DetailItem
                      label={t.division}
                      value={resident.division_name || "N/A"}
                    />
                    <div className="md:col-span-2">
                      <DetailItem
                        label={t.address}
                        value={resident.address || "N/A"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D69E2E] text-white border-0 text-base sm:text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00] z-50"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default ProfileDetails;
