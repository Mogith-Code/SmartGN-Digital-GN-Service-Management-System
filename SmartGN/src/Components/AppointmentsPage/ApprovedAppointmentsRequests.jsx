// src/pages/ApprovedAppointmentsRequests.jsx
import React, { useState, useEffect } from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import { useLanguage } from "../../utils/translate";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon2 from "../../assets/verified_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Common/Footer";

function ApprovedAppointmentsRequests({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const ApprovedAppointmentTranslations = {
    EN: {
      back: "Back",
      Title: "Approved Appointment Requests",
      loading: "Loading approved appointments...",
      noApproved: "No approved appointments available.",
      requestedDate: "Requested Date:",
      appointmentDate: "Appointment Date:",
      time: "Time:",
      appointmentNumber: "Appointment #",
      contact: "Contact:",
      status: "Status:",
      approvedOn: "Approved On:",
      error: "Error loading appointments. Please try again.",
      retry: "Retry",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්",
      loading: "අනුමත හමුවීම් පූරණය වෙමින්...",
      noApproved: "අනුමත හමුවීම් නොමැත.",
      requestedDate: "ඉල්ලූ දිනය:",
      appointmentDate: "හමුවීම් දිනය:",
      time: "වේලාව:",
      appointmentNumber: "හමුවීම් අංකය #",
      contact: "සම්බන්ධ කරගත හැකි අංකය:",
      status: "තත්වය:",
      approvedOn: "අනුමත කළ දිනය:",
      error: "හමුවීම් පූරණය කිරීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      retry: "නැවත උත්සාහ කරන්න",
    },
    TA: {
      back: "பின்னால்",
      Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      loading: "அங்கீகாரம் பெற்ற சந்திப்புகள் ஏற்றப்படுகின்றன...",
      noApproved: "அங்கீகாரம் பெற்ற சந்திப்புகள் இல்லை.",
      requestedDate: "கோரப்பட்ட தேதி:",
      appointmentDate: "சந்திப்பு தேதி:",
      time: "நேரம்:",
      appointmentNumber: "சந்திப்பு எண் #",
      contact: "தொடர்பு எண்:",
      status: "நிலை:",
      approvedOn: "அனுமதிக்கப்பட்ட தேதி:",
      error: "சந்திப்புகளை ஏற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
      retry: "மீண்டும் முயற்சிக்கவும்",
    },
  };

  const t =
    ApprovedAppointmentTranslations[lang] || ApprovedAppointmentTranslations.EN;

  // State for approved appointments
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");
  const residentNic = localStorage.getItem("smartgn_user_id");

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

      const response = await fetch("/api/appointments/rappointments", {
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
        const approved = data.appointments.filter(
          (app) => app.status === "Approved",
        );
        setApprovedAppointments(approved);
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
  }, [token, residentNic]);

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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar onOpenHelp={onOpenHelp} />
        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          <div className="hidden md:block bg-white">
            <RSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center p-6 min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
              <p className="mt-4 text-[#1B365D] text-sm sm:text-base font-medium">
                {t.loading}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar onOpenHelp={onOpenHelp} />
        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          <div className="hidden md:block bg-white">
            <RSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center p-4 sm:p-6 min-h-[400px]">
            <div className="text-center w-full max-w-md">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <p className="text-red-600 font-semibold mb-2 text-sm sm:text-base">
                  {t.error}
                </p>
                <p className="text-red-500 text-xs sm:text-sm mb-4">{error}</p>
                <button
                  onClick={fetchApprovedAppointments}
                  className="px-4 sm:px-6 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors text-sm sm:text-base font-medium shadow-sm"
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
      <AfterlogNavbar onOpenHelp={onOpenHelp} />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <RSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] pb-8">
          {/* Back Button */}
          <div
            className="inline-flex p-[5px] text-[13px] sm:text-[14px] md:text-[15px] items-center gap-[8px] sm:gap-[10px] font-medium text-[#1B365D] mt-4 sm:mt-6 md:mt-8 lg:mt-[30px] mx-4 sm:mx-5 md:mx-6 lg:mx-[30px] cursor-pointer hover:underline"
            onClick={() => navigate("/ResidentDashboard/RAppointment")}
          >
            <img
              src={backIcon}
              alt="backIcon"
              className="w-[14px] sm:w-[16px]"
            />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-semibold text-[#1B365D] border-b border-[#2D37482D] pb-2.5 sm:pb-3 mt-2 sm:mt-3 mx-4 sm:mx-5 md:mx-6 lg:mx-[30px]">
            {t.Title}
          </div>

          {/* Approved Appointments List */}
          {approvedAppointments.length > 0 ? (
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] flex flex-col gap-4 sm:gap-5">
              {approvedAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id || appointment.id}
                  className="flex flex-col gap-[5px] border border-[#2D37484D] rounded-[12px] sm:rounded-[15px] p-3.5 sm:p-4 md:p-[20px] bg-white hover:bg-[#FDF5E6] shadow-[0px_2px_5px_rgba(0,0,0,0.06)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.12)] transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-[20px] items-start sm:items-center">
                    <img
                      src={approvedIcon}
                      alt="approvedIcon"
                      className="h-[40px] sm:h-[50px] md:h-[60px] w-[40px] sm:w-[50px] md:w-[60px] bg-[#E2E8F0] p-2 sm:p-2.5 md:p-[10px] rounded-[10px] sm:rounded-[15px] flex-shrink-0 object-contain"
                    />
                    <div className="flex w-full flex-col gap-1.5 sm:gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[14px] sm:text-[15px] md:text-[16px] text-[#2D3748] gap-1 sm:gap-2">
                        <span className="font-semibold text-[#1B365D] break-words">
                          {appointment.purpose || "N/A"}
                        </span>
                        <div className="flex flex-col items-start sm:items-end">
                          <span className="font-light text-[12px] sm:text-sm text-[#4A5568]">
                            {formatDate(
                              appointment.approved_at ||
                                appointment.requested_at,
                            )}
                          </span>
                          <span className="font-medium text-[10px] sm:text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            {appointment.approved_at ? "Approved" : "Requested"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[14px] md:text-[15px] text-[#2D3748] gap-1 sm:gap-2 border-t border-gray-100 pt-2">
                        <span className="font-regular break-words">
                          {t.requestedDate}{" "}
                          <span className="font-medium">{formatDateTime(appointment.requested_at)}</span>
                        </span>
                        <span className="font-medium text-[#1B365D] whitespace-nowrap">
                          {t.appointmentNumber}{" "}
                          {appointment.appointment_number || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[14px] md:text-[15px] text-[#2D3748] gap-1 sm:gap-2">
                        <span className="font-regular break-words">
                          {t.appointmentDate} <span className="font-medium">{formatDate(appointment.date)}</span>
                        </span>
                        <span className="font-medium text-green-600 whitespace-nowrap">
                          {t.status} {appointment.status}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[14px] md:text-[15px] text-[#2D3748] gap-1 sm:gap-2">
                        <span className="font-regular">
                          {t.time} <span className="font-medium">{formatTime(appointment.time)}</span>
                        </span>
                        <span className="font-regular break-words">
                          {t.contact} <span className="font-medium">{appointment.contact_number || "N/A"}</span>
                        </span>
                      </div>

                      {appointment.approved_at && (
                        <div className="flex flex-col sm:flex-row justify-between text-[12px] sm:text-[13px] text-[#718096] mt-1 border-t border-[#2D37481A] pt-2 gap-1 sm:gap-2">
                          <span className="font-regular">
                            {t.approvedOn}
                          </span>
                          <span className="font-medium text-[#4A5568] break-words">
                            {formatDateTime(appointment.approved_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-6 sm:my-8 flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center text-[#718096] border border-dashed border-[#CBD5E0] rounded-[15px] bg-[#F7FAFC]">
              <img
                src={approvedIcon2}
                alt="approvedIcon 2"
                className="w-[50px] sm:w-[65px] md:w-[75px] opacity-40 mb-3"
              />
              <p className="font-medium text-sm sm:text-base md:text-lg text-[#4A5568]">
                {t.noApproved}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ApprovedAppointmentsRequests;
