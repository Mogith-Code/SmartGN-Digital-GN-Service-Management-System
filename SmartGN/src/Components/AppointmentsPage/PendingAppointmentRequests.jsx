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

function PendingAppointmentRequests() {
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
      cancelConfirm: "ඔබට මෙම හමුව අවලංගු කිරීමට අවශ්‍ය බව විශ්වාසද?",
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
        // Filter only pending appointments
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
        // Refresh the list
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
  // FORMAT DATE
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  // ============================================================
  // FORMAT TIME (12-hour with AM/PM)
  // ============================================================
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      // If time is already in 12-hour format
      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }
      // Convert from 24-hour format (HH:MM:SS)
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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <AfterlogNavbar />
        <div className="flex gap-[20px] flex-1">
          <div className="flex bg-[#FFFFFF]">
            <RSidebar />
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
            <RSidebar />
          </div>
          <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="text-red-600 font-semibold mb-2">{t.error}</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={fetchPendingAppointments}
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
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/ResidentDashboard/RAppointment")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          {/* Page Title */}
          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px] mt-[30px] mx-[30px]">
            {t.Title}
          </div>

          {/* Pending Appointments List */}
          {pendingAppointments.length > 0 ? (
            <>
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="mx-[50px] my-[30px] flex flex-col gap-[5px] border border-[#2D37484D] rounded-[15px] p-[20px] hover:bg-[#FDF5E6]"
                >
                  <div className="flex gap-[20px] items-center">
                    <img
                      src={pendingIcon2}
                      alt="pendingIcon"
                      className="h-[60px] bg-[#E2E8F0] p-[10px] rounded-[15px]"
                    />
                    <div className="flex w-full flex-col">
                      <div className="flex justify-between text-[16px] text-[#2D3748]">
                        <span className="font-medium">
                          {appointment.purpose || "N/A"}
                        </span>
                        <span className="font-light">
                          {formatRequestedDateOnly(appointment.requested_at)}
                        </span>
                      </div>

                      <div className="flex justify-between text-[16px] text-[#2D3748]">
                        <span className="font-regular">
                          {t.appointmentDate}{" "}
                          {formatAppointmentDate(appointment.date)}
                        </span>
                        <span className="font-light">
                          {formatRequestedTimeOnly(appointment.requested_at)}
                        </span>
                      </div>

                      <div className="flex justify-between text-[16px] text-[#2D3748]">
                        <span className="font-regular">
                          {t.time} {formatTime(appointment.time)}
                        </span>
                        <span className="font-light">
                          Appointment No:{" "}
                          {appointment.appointment_number || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-[10px] mt-[10px]">
                    {/* Edit Button - Disabled for now */}
                    <button
                      className="flex px-[20px] py-[10px] bg-[#1B365D] rounded-[15px] hover:bg-[#005BBD] transition-colors shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/ResidentDashboard/RAppointment/PendingAppointmentRequests/EditAppointment/${appointment.appointment_id}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-[10px] text-[#F7FAFC] text-[14px] font-regular">
                        <img
                          src={editIcon}
                          alt="editIcon"
                          className="h-[15px]"
                        />
                        <span>{t.edit}</span>
                      </div>
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => handleCancel(appointment.appointment_id)}
                      disabled={cancellingId === appointment.appointment_id}
                      className={`flex px-[20px] py-[10px] bg-[#E7000B] rounded-[15px] hover:bg-[#FF000C] transition-colors cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group ${
                        cancellingId === appointment.appointment_id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-[10px] text-[#F7FAFC] text-[14px] font-regular">
                        {cancellingId === appointment.appointment_id ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>{t.cancelling}</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={cancelIcon}
                              alt="cancelIcon"
                              className="h-[16px]"
                            />
                            <span>{t.cancel}</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <img
                src={pendingIcon}
                alt="pendingIcon"
                className="w-[80px] opacity-50"
              />
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
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
