// src/Pages/OfficerApprovedAppointment.jsx
import React, { useState, useEffect } from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import OSidebar from "../Common/OSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import Footer from "../Common/Footer";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { encryptId } from "../../utils/encryption";

function OfficerApprovedAppointment() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const OfficerApprovedTranslations = {
    EN: {
      back: "Back",
      Title: "Approved Appointment Requests",
      loading: "Loading approved appointments...",
      noApproved: "No approved appointments available.",
      noApprovedSub:
        "Please check Pending requests to view and approve requests.",
      viewProfile: "View Profile",
      purpose: "Purpose :",
      appointmentDate: "Appointment Date :",
      time: "Time :",
      contact: "Contact :",
      appointmentNumber: "Appointment #",
      approvedOn: "Approved On",
      error: "Error loading appointments. Please try again.",
      retry: "Retry",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්",
      loading: "අනුමත හමුවීම් පූරණය වෙමින්...",
      noApproved: "අනුමත හමුවීම් නොමැත.",
      noApprovedSub:
        "කරුණාකර අනුමැතිය ලැබීමට නියමිත ඉල්ලීම් පරීක්ෂා කර අනුමත කරන්න.",
      viewProfile: "පැතිකඩ බලන්න",
      purpose: "අරමුණ :",
      appointmentDate: "හමුවීම් දිනය :",
      time: "වේලාව :",
      contact: "සම්බන්ධ කරගත හැකි අංකය :",
      appointmentNumber: "හමුවීම් අංකය #",
      approvedOn: "අනුමත කළ දිනය",
      error: "හමුවීම් පූරණය කිරීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      retry: "නැවත උත්සාහ කරන්න",
    },
    TA: {
      back: "பின்னால்",
      Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      loading: "அங்கீகாரம் பெற்ற சந்திப்புகள் ஏற்றப்படுகின்றன...",
      noApproved: "அங்கீகாரம் பெற்ற சந்திப்புகள் இல்லை.",
      noApprovedSub:
        "தயவுசெய்து நிலுவையிலான கோரிக்கைகளைப் பார்த்து அனுமதிக்கவும்.",
      viewProfile: "சுயவிவரத்தைப் பார்க்கவும்",
      purpose: "நோக்கம் :",
      appointmentDate: "சந்திப்பு தேதி :",
      time: "நேரம் :",
      contact: "தொடர்பு எண் :",
      appointmentNumber: "சந்திப்பு எண் #",
      approvedOn: "அனுமதிக்கப்பட்ட தேதி",
      error: "சந்திப்புகளை ஏற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
      retry: "மீண்டும் முயற்சிக்கவும்",
    },
  };

  const t = OfficerApprovedTranslations[lang] || OfficerApprovedTranslations.EN;

  // State for approved appointments
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");
  const gnId = localStorage.getItem("smartgn_user_id");

  // ============================================================
  // FETCH APPROVED APPOINTMENTS
  // ============================================================
  const fetchApprovedAppointments = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/appointments/officerappointments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      if (data.success) {
        // Filter only approved appointments
        const approved = data.appointments.filter(
          (app) => app.status === "Approved",
        );
        setApprovedAppointments(approved);
        console.log("Approved appointments:", approved);
      } else {
        throw new Error(data.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching approved appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedAppointments();
  }, [token, gnId]);

  // ============================================================
  // FORMAT TIME (12-hour with AM/PM)
  // ============================================================
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }
      const [hours, minutes] = timeString.split(":");
      const h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // ============================================================
  // FORMAT DATE (DD/MM/YYYY)
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // FORMAT DATE AND TIME
  // ============================================================
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const h12 = hours % 12 || 12;
      return `${day}/${month}/${year} at ${h12}:${minutes} ${ampm}`;
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex gap-[20px] flex-1">
          <div className="flex bg-[#FFFFFF]">
            <OSidebar />
          </div>
          <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
              <p className="mt-4 text-[#1B365D]">{t.loading}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex gap-[20px] flex-1">
          <div className="flex bg-[#FFFFFF]">
            <OSidebar />
          </div>
          <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="text-red-600 font-semibold mb-2">{t.error}</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={fetchApprovedAppointments}
                  className="mt-4 px-6 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
                >
                  {t.retry}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          <OSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/OfficerDashboard/OfficerAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px] mt-[30px] mx-[30px]">
            {t.Title}
          </div>

          {/* Approved Appointments List */}
          {approvedAppointments.length > 0 ? (
            <>
              {approvedAppointments.map((appointment) => {
                // Get NIC for encryption
                const residentNic =
                  appointment.resident?.nic ||
                  appointment.resident_nic ||
                  "N/A";
                const encryptedNic = encryptId(residentNic);

                // Debug log to check values
                console.log("🔍 Resident NIC:", residentNic);
                console.log("🔍 Encrypted NIC:", encryptedNic);
                console.log(
                  "🔍 Navigation path:",
                  `/OfficerDashboard/ResidentsDetails/profile/${encryptedNic}`,
                );

                return (
                  <div
                    key={appointment.appointment_id}
                    className="mx-[50px] my-[30px] flex flex-col border border-[#2D37484D] rounded-[15px] p-[20px] hover:bg-[#FDF5E6]"
                  >
                    <div className="flex justify-between mb-[10px]">
                      <div className="flex w-[40%] items-center">
                        <img
                          src={profileIcon}
                          alt="Resident Photo"
                          className="w-[100px] h-[100px] rounded-full"
                        />

                        <div className="flex flex-col ml-[10px]">
                          <span className="text-sm sm:text-base md:text-lg lg:text-[16px] text-[#1B365D] font-medium">
                            {appointment.resident?.fullName ||
                              `${appointment.resident?.firstName || ""} ${appointment.resident?.lastName || ""}` ||
                              "Resident"}
                          </span>
                          <span className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#2D3748] font-light">
                            NIC: {residentNic}
                          </span>
                          <span
                            className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#D69E2E] font-medium mt-[10px] hover:cursor-pointer hover:underline"
                            onClick={() => {
                              // ✅ Navigate with encrypted NIC
                              const path = `/OfficerDashboard/OfficerAppointment/OfficerApprovedAppointment/profile/${encryptedNic}`;
                              console.log("🔄 Navigating to:", path);
                              navigate(path);
                            }}
                          >
                            {t.viewProfile}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-light text-green-600 flex items-center gap-1">
                          <img
                            src={approvedIcon}
                            alt="approved"
                            className="h-4 w-4"
                          />
                          Approved
                        </span>
                        <span className="font-light text-xs text-[#2D37488D]">
                          {appointment.approved_at
                            ? formatDateTime(appointment.approved_at)
                            : ""}
                        </span>
                      </div>
                    </div>

                    <hr className="border border-[#2D37482D]" />

                    <div className="flex flex-col text-[16px] text-[#2D3748] my-[10px]">
                      <div className="flex gap-[5px]">
                        <span className="font-medium">{t.purpose} </span>
                        <span>{appointment.purpose || "N/A"}</span>
                      </div>

                      <div className="flex gap-[5px]">
                        <span className="font-medium">{t.appointmentDate}</span>
                        <span>{formatDate(appointment.date)}</span>
                      </div>

                      <div className="flex gap-[5px]">
                        <span className="font-medium">{t.time}</span>
                        <span>{formatTime(appointment.time)}</span>
                      </div>

                      <div className="flex gap-[5px]">
                        <span className="font-medium">{t.contact}</span>
                        <span>{appointment.contact_number || "N/A"}</span>
                      </div>

                      {appointment.appointment_number && (
                        <div className="flex gap-[5px]">
                          <span className="font-medium">
                            {t.appointmentNumber}
                          </span>
                          <span>{appointment.appointment_number}</span>
                        </div>
                      )}
                    </div>

                    <hr className="border border-[#2D37482D]" />
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <img
                src={approvedIcon}
                alt="approvedIcon"
                className="w-[80px] opacity-50"
              />
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
                {t.noApproved}
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-[14px] text-[#2D3748D] mt-1 sm:mt-2">
                {t.noApprovedSub}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OfficerApprovedAppointment;
