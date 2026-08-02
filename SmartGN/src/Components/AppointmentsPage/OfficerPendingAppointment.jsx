// src/Pages/OfficerPendingAppointment.jsx
import React, { useState, useEffect } from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import Footer from "../Common/Footer";
import ChatbotButton from "../Common/ChatbotButton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import confirmIcon from "../../assets/check_circle_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { encryptId } from "../../utils/encryption";

function OfficerPendingAppointment({ onOpenHelp }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const OfficerPendingTranslations = {
    EN: {
      back: "Back",
      Title: "Pending Appointment Requests",
      reject: "Reject Request",
      approve: "Approve Request",
      viewProfile: "View Profile",
      purpose: "Purpose :",
      appointmentDate: "Appointment Date :",
      time: "Time : ",
      contact: "Contact Number :",
      loading: "Loading pending appointments...",
      noPending: "No pending appointments available.",
      approveSuccess: "Appointment approved successfully!",
      rejectSuccess: "Appointment rejected successfully!",
      error: "Error processing request. Please try again.",
      rejectReason: "Please enter reason for rejection:",
      approveConfirm: "Are you sure you want to approve this appointment?",
      rejectConfirm: "Are you sure you want to reject this appointment?",
    },
    SI: {
      back: "ආපසු",
      Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      reject: "අවලංගු කරන්න",
      approve: "අනුමත කරන්න",
      viewProfile: "පැතිකඩ බලන්න",
      purpose: "අරමුණ :",
      appointmentDate: "හමුවීම් දිනය :",
      time: "වේලාව : ",
      contact: "දුරකථන අංකය :",
      loading: "හමුවීම් පූරණය වෙමින්...",
      noPending: "හමුවීම් නොමැත.",
      approveSuccess: "හමුව සාර්ථකව අනුමත කරන ලදී!",
      rejectSuccess: "හමුව සාර්ථකව ප්‍රතික්ෂේප කරන ලදී!",
      error: "ඉල්ලීම සැකසීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      rejectReason: "ප්‍රතික්ෂේප කිරීමට හේතුව ඇතුළත් කරන්න:",
      approveConfirm: "ඔබට මෙම හමුව අනුමත කිරීමට අවශ්‍ය බව විශ්වාසද?",
      rejectConfirm: "ඔබට මෙම හමුව ප්‍රතික්ෂේප කිරීමට අවශ්‍ය බව විශ්වාසද?",
    },
    TA: {
      back: "பின்னால்",
      Title: "நிலுவையிலான முக்கிய சந்திப்புகள்",
      reject: "ரத்து செய்",
      approve: "அனுமதி செய்",
      viewProfile: "சுயவிவரத்தைப் பார்க்கவும்",
      purpose: "நோக்கம் :",
      appointmentDate: "ஹமுவிம் தேதி :",
      time: "நேரம் : ",
      contact: "தொடர்பு எண் :",
      loading: "சந்திப்புகள் ஏற்றப்படுகின்றன...",
      noPending: "நிலுவையிலான சந்திப்புகள் இல்லை.",
      approveSuccess: "சந்திப்பு வெற்றிகரமாக அனுமதிக்கப்பட்டது!",
      rejectSuccess: "சந்திப்பு வெற்றிகரமாக நிராகரிக்கப்பட்டது!",
      error: "கோரிக்கையை செயல்படுத்துவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
      rejectReason: "நிராகரிப்பதற்கான காரணத்தை உள்ளிடவும்:",
      approveConfirm: "இந்த சந்திப்பை அனுமதிக்க விரும்புகிறீர்களா?",
      rejectConfirm: "இந்த சந்திப்பை நிராகரிக்க விரும்புகிறீர்களா?",
    },
  };

  const t = OfficerPendingTranslations[lang] || OfficerPendingTranslations.EN;

  // State for pending appointments
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");

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
        // Filter only pending appointments
        const pending = data.appointments.filter(
          (app) => app.status === "Pending",
        );
        setPendingAppointments(pending);
        console.log("Pending appointments:", pending);
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
  // APPROVE APPOINTMENT
  // ============================================================
  const handleApprove = async (appointmentId) => {
    if (!window.confirm(t.approveConfirm)) {
      return;
    }

    try {
      setProcessingId(appointmentId);

      const response = await fetch(
        `/api/appointments/${appointmentId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve appointment");
      }

      const data = await response.json();

      if (data.success) {
        alert(t.approveSuccess);
        // Refresh the list
        fetchPendingAppointments();
      } else {
        throw new Error(data.error || "Failed to approve appointment");
      }
    } catch (err) {
      alert(t.error);
      console.error("Error approving appointment:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // REJECT APPOINTMENT
  // ============================================================
  const handleReject = async (appointmentId) => {
    if (!window.confirm(t.rejectConfirm)) {
      return;
    }

    // Get rejection reason
    const rejectionReason = prompt(t.rejectReason);
    if (rejectionReason === null) {
      return; // User cancelled
    }

    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setProcessingId(appointmentId);

      console.log("Rejecting appointment:", appointmentId);
      console.log("Rejection reason:", rejectionReason);

      const response = await fetch(
        `/api/appointments/${appointmentId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: rejectionReason.trim(),
          }),
        },
      );

      // Log response status for debugging
      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to reject appointment";
        try {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON
          const text = await response.text();
          console.log("Error response text:", text);
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Reject response:", data);

      if (data.success) {
        alert(t.rejectSuccess);
        // Refresh the list
        fetchPendingAppointments();
      } else {
        throw new Error(data.error || "Failed to reject appointment");
      }
    } catch (err) {
      alert(t.error + "\n" + err.message);
      console.error("Error rejecting appointment:", err);
    } finally {
      setProcessingId(null);
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
  // FORMAT DATE
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
  // FORMAT REQUESTED DATE
  // ============================================================
  const formatRequestedDate = (dateString) => {
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
      return `${day}/${month}/${year} ${h12}:${minutes} ${ampm}`;
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
        <OfficerNavbar />
        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          <div className="flex flex-1 w-full">
            <OSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center">
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

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
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

          {/* Error Message */}
          {error && (
            <div className="mx-[50px] mt-[20px] p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Pending Appointments List */}
          {pendingAppointments.length > 0 ? (
            <>
              {pendingAppointments.map((appointment) => {
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
                      <div className="flex w-[30%] items-center">
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
                            {residentNic}
                          </span>
                          <span
                            className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#D69E2E] font-medium mt-[10px] hover:cursor-pointer hover:underline"
                            onClick={() => {
                              // ✅ Navigate with encrypted NIC
                              const path = `/OfficerDashboard/ResidentsDetails/profile/${encryptedNic}`;
                              console.log("🔄 Navigating to:", path);
                              navigate(path);
                            }}
                          >
                            {t.viewProfile}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-light">
                          {formatRequestedDate(
                            appointment.requested_at || appointment.created_at,
                          )}
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
                          <span className="font-medium">Appointment #</span>
                          <span>{appointment.appointment_number}</span>
                        </div>
                      )}
                    </div>

                    <hr className="border border-[#2D37482D]" />
                    <div className="flex justify-end gap-[10px] mt-[10px]">
                      {/* Approve Button */}
                      <button
                        onClick={() =>
                          handleApprove(appointment.appointment_id)
                        }
                        disabled={processingId === appointment.appointment_id}
                        className={`flex gap-[10px] items-center px-[20px] py-[10px] bg-[#1B365D] text-[#F7FAFC] rounded-[15px] hover:bg-[#005BBD] transition-colors text-[14px] font-regular cursor-pointer shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] hover:scale-101 group ${
                          processingId === appointment.appointment_id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {processingId === appointment.appointment_id ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={confirmIcon}
                              alt="confirmIcon"
                              className="h-[15px]"
                            />
                            <span>{t.approve}</span>
                          </>
                        )}
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(appointment.appointment_id)}
                        disabled={processingId === appointment.appointment_id}
                        className={`flex gap-[10px] items-center px-[20px] py-[10px] bg-[#E7000B] text-[#F7FAFC] rounded-[15px] hover:bg-[#FF000C] shadow-[0px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[0px_2px_10px_rgba(0,0,0,0.4)] text-[14px] font-regular cursor-pointer hover:scale-101 group ${
                          processingId === appointment.appointment_id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {processingId === appointment.appointment_id ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={cancelIcon}
                              alt="cancelIcon"
                              className="h-[16px]"
                            />
                            <span>{t.reject}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
                {t.noPending}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Help Trigger */}
      <ChatbotButton onOpenHelp={onOpenHelp} />

      <Footer />
    </div>
  );
}

export default OfficerPendingAppointment;
