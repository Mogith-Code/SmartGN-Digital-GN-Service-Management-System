// src/pages/PendingAppointmentRequests.jsx
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../utils/translate";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import editIcon from "../../assets/edit_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import pendingIcon from "../../assets/schedule_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import pendingIcon2 from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Common/Footer";

function PendingAppointmentRequests({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const token = localStorage.getItem("smartgn_token");

  // State for pending appointments
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const PendingAppointmentTranslations = {
    EN: {
      back: "Back",
      Title: "Pending Appointment Requests",
      cancel: "Cancel Request",
      edit: "Edit Request",
      appointmentDate: "Appointment Date : ",
      time: "Time : ",
      noPendingAppointments: "No pending appointments available.",
      loading: "Loading pending appointments...",
      error: "Error loading appointments",
      retry: "Retry",
      cancelling: "Cancelling...",
      cancelConfirm: "Are you sure you want to cancel this appointment?",
      cancelSuccess: "Appointment cancelled successfully!",
      cancelError: "Failed to cancel appointment. Please try again.",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      cancel: "අවලංගු කරන්න",
      edit: "සංස්කරණය කරන්න",
      appointmentDate: "හමුවීම් දිනය : ",
      time: "වේලාව : ",
      noPendingAppointments: "හමුවීම් නොමැත.",
      loading: "හමුවීම් පූරණය වෙමින්...",
      error: "හමුවීම් පූරණය කිරීමේ දෝෂයකි",
      retry: "නැවත උත්සාහ කරන්න",
      cancelling: "අවලංගු කරමින්...",
      cancelConfirm: "ඔබට මෙම හමුව අවලංගු කිරීමට අවශ්ය බව විශ්වාසද?",
      cancelSuccess: "හමුව සාර්ථකව අවලංගු කරන ලදී!",
      cancelError: "හමුව අවලංගු කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    },
    TA: {
      back: "பின்னால்",
      Title: "நிலுவையிலான முக்கிய சந்திப்புகள்",
      cancel: "ரத்து செய்",
      edit: "திருத்து",
      appointmentDate: "முகாமை தேதி : ",
      time: "நேரம் : ",
      noPendingAppointments: "நிலுவையிலான சந்திப்புகள் இல்லை.",
      loading: "சந்திப்புகள் ஏற்றப்படுகின்றன...",
      error: "சந்திப்புகளை ஏற்றுவதில் பிழை",
      retry: "மீண்டும் முயற்சிக்கவும்",
      cancelling: "ரத்து செய்கிறது...",
      cancelConfirm: "இந்த சந்திப்பை ரத்து செய்ய விரும்புகிறீர்களா?",
      cancelSuccess: "சந்திப்பு வெற்றிகரமாக ரத்து செய்யப்பட்டது!",
      cancelError:
        "சந்திப்பை ரத்து செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    },
  };

  const t =
    PendingAppointmentTranslations[lang] || PendingAppointmentTranslations.EN;

  // ============================================================
  // FETCH PENDING APPOINTMENTS
  // ============================================================
  const fetchPendingAppointments = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
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
        const pending = data.appointments.filter(
          (app) => app.status === "Pending",
        );
        setPendingAppointments(pending);
      } else {
        throw new Error(data.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pending appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, [token]);

  // ============================================================
  // CANCEL APPOINTMENT
  // ============================================================
  const handleCancel = async (appointmentId) => {
    if (!window.confirm(t.cancelConfirm)) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      const response = await fetch(
        `/api/appointments/${appointmentId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      const data = await response.json();

      if (data.success) {
        alert(t.cancelSuccess);
        fetchPendingAppointments();
      } else {
        throw new Error(data.error || "Failed to cancel appointment");
      }
    } catch (err) {
      alert(t.cancelError);
      console.error("Error cancelling appointment:", err);
    } finally {
      setCancellingId(null);
    }
  };

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
  // FORMAT REQUESTED DATE
  // ============================================================
  const formatRequestedDateOnly = (dateString) => {
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

  // FORMAT REQUESTED TIME (Only Time)
  // ============================================================
  const formatRequestedTimeOnly = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const h12 = hours % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // FORMAT APPOINTMENT DATE
  // ============================================================
  const formatAppointmentDate = (dateString) => {
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
                  onClick={fetchPendingAppointments}
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

          {/* Pending Appointments List */}
          {pendingAppointments.length > 0 ? (
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-4 sm:my-5 md:my-[30px] flex flex-col gap-4 sm:gap-5">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="flex flex-col gap-[5px] border border-[#2D37484D] rounded-[12px] sm:rounded-[15px] p-3.5 sm:p-4 md:p-[20px] bg-white hover:bg-[#FDF5E6] shadow-[0px_2px_5px_rgba(0,0,0,0.06)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.12)] transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-[20px] items-start sm:items-center">
                    <img
                      src={pendingIcon2}
                      alt="pendingIcon"
                      className="h-[40px] sm:h-[50px] md:h-[60px] w-[40px] sm:w-[50px] md:w-[60px] bg-[#E2E8F0] p-2 sm:p-2.5 md:p-[10px] rounded-[10px] sm:rounded-[15px] flex-shrink-0 object-contain"
                    />
                    <div className="flex w-full flex-col gap-1.5 sm:gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[14px] sm:text-[15px] md:text-[16px] text-[#2D3748] gap-1 sm:gap-2">
                        <span className="font-semibold text-[#1B365D] break-words">
                          {appointment.purpose || "N/A"}
                        </span>
                        <span className="font-light text-[12px] sm:text-sm text-[#4A5568] whitespace-nowrap">
                          {formatRequestedDateOnly(appointment.requested_at)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[14px] md:text-[15px] text-[#2D3748] gap-1 sm:gap-2 border-t border-gray-100 pt-2">
                        <span className="font-regular break-words">
                          {t.appointmentDate}{" "}
                          <span className="font-medium">{formatAppointmentDate(appointment.date)}</span>
                        </span>
                        <span className="font-light text-[12px] sm:text-xs text-[#718096] whitespace-nowrap">
                          {formatRequestedTimeOnly(appointment.requested_at)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] sm:text-[14px] md:text-[15px] text-[#2D3748] gap-1 sm:gap-2">
                        <span className="font-regular">
                          {t.time} <span className="font-medium">{formatTime(appointment.time)}</span>
                        </span>
                        <span className="font-medium text-[#1B365D] break-words">
                          Appointment No:{" "}
                          {appointment.appointment_number || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-[10px] mt-3 sm:mt-[10px] border-t border-gray-100 pt-3">
                    <button
                      className="flex px-4 sm:px-[20px] py-1.5 sm:py-[10px] bg-[#1B365D] rounded-[10px] sm:rounded-[15px] hover:bg-[#005BBD] transition-colors shadow-[0px_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.3)] hover:scale-101 group cursor-pointer w-full sm:w-auto justify-center"
                      onClick={() =>
                        navigate(
                          `/ResidentDashboard/RAppointment/PendingAppointmentRequests/EditAppointment/${appointment.appointment_id}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-1.5 sm:gap-[10px] text-[#F7FAFC] text-[12px] sm:text-[13px] md:text-[14px] font-medium">
                        <img
                          src={editIcon}
                          alt="editIcon"
                          className="h-[12px] sm:h-[14px] md:h-[15px]"
                        />
                        <span>{t.edit}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleCancel(appointment.appointment_id)}
                      disabled={cancellingId === appointment.appointment_id}
                      className={`flex px-4 sm:px-[20px] py-1.5 sm:py-[10px] bg-[#E7000B] rounded-[10px] sm:rounded-[15px] hover:bg-[#FF000C] transition-colors cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.3)] hover:scale-101 group w-full sm:w-auto justify-center ${
                        cancellingId === appointment.appointment_id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-[10px] text-[#F7FAFC] text-[12px] sm:text-[13px] md:text-[14px] font-medium">
                        {cancellingId === appointment.appointment_id ? (
                          <>
                            <div className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>{t.cancelling}</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={cancelIcon}
                              alt="cancelIcon"
                              className="h-[13px] sm:h-[14px] md:h-[16px]"
                            />
                            <span>{t.cancel}</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex mx-3 sm:mx-4 md:mx-5 lg:mx-[30px] my-6 sm:my-8 flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center text-[#718096] border border-dashed border-[#CBD5E0] rounded-[15px] bg-[#F7FAFC]">
              <img
                src={pendingIcon}
                alt="pendingIcon"
                className="w-[50px] sm:w-[65px] md:w-[75px] opacity-40 mb-3"
              />
              <p className="font-medium text-sm sm:text-base md:text-lg text-[#4A5568]">
                {t.noPendingAppointments}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PendingAppointmentRequests;
