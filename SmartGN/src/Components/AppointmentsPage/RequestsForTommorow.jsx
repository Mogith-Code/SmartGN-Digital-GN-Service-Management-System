// src/Pages/RequestsForTomorrow.jsx
import React, { useState, useEffect } from "react";
import OfficerNavbar from "../Common/OfficerNavbar";
import OSidebar from "../Common/OSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import profileIcon from "../../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import confirmIcon from "../../assets/check_circle_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import cancelIcon from "../../assets/cancel_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_22C55E_FILL0_wght400_GRAD0_opsz24.svg";
import pendingIcon from "../../assets/schedule_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../Common/Footer";

function RequestsForTomorrow() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const RFTTranslations = {
    EN: {
      back: "Back",
      Title: "Tomorrow's Appointments",
      reject: "Reject Request",
      approve: "Approve Request",
      viewProfile: "View Profile",
      purpose: "Purpose :",
      appointmentDate: "Appointment Date :",
      time: "Time : ",
      contact: "Contact Number :",
      loading: "Loading tomorrow's appointments...",
      noAppointments: "No appointments scheduled for tomorrow.",
      approveSuccess: "Appointment approved successfully!",
      rejectSuccess: "Appointment rejected successfully!",
      error: "Error processing request. Please try again.",
      rejectReason: "Please enter reason for rejection:",
      approveConfirm: "Are you sure you want to approve this appointment?",
      rejectConfirm: "Are you sure you want to reject this appointment?",
      retry: "Retry",
      status: "Status:",
      appointmentNumber: "Appointment #",
    },
    SI: {
      back: "ආපසු",
      Title: "හෙට ඇති හමුවීම්",
      reject: "අවලංගු කරන්න",
      approve: "අනුමත කරන්න",
      viewProfile: "පැතිකඩ බලන්න",
      purpose: "අරමුණ :",
      appointmentDate: "හමුවීම් දිනය :",
      time: "වේලාව : ",
      contact: "දුරකථන අංකය :",
      loading: "හෙට දින හමුවීම් පූරණය වෙමින්...",
      noAppointments: "හෙට දින හමුවීම් නොමැත.",
      approveSuccess: "හමුව සාර්ථකව අනුමත කරන ලදී!",
      rejectSuccess: "හමුව සාර්ථකව ප්‍රතික්ෂේප කරන ලදී!",
      error: "ඉල්ලීම සැකසීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
      rejectReason: "ප්‍රතික්ෂේප කිරීමට හේතුව ඇතුළත් කරන්න:",
      approveConfirm: "ඔබට මෙම හමුව අනුමත කිරීමට අවශ්‍ය බව විශ්වාසද?",
      rejectConfirm: "ඔබට මෙම හමුව ප්‍රතික්ෂේප කිරීමට අවශ්‍ය බව විශ්වාසද?",
      retry: "නැවත උත්සාහ කරන්න",
      status: "තත්වය:",
      appointmentNumber: "හමුවීම් අංකය #",
    },
    TA: {
      back: "பின்னால்",
      Title: "நாளைய சந்திப்புகள்",
      reject: "ரத்து செய்",
      approve: "அனுமதி செய்",
      viewProfile: "சுயவிவரத்தைப் பார்க்கவும்",
      purpose: "நோக்கம் :",
      appointmentDate: "சந்திப்பு தேதி :",
      time: "நேரம் : ",
      contact: "தொடர்பு எண் :",
      loading: "நாளைய சந்திப்புகள் ஏற்றப்படுகின்றன...",
      noAppointments: "நாளைக்கு சந்திப்புகள் எதுவும் இல்லை.",
      approveSuccess: "சந்திப்பு வெற்றிகரமாக அனுமதிக்கப்பட்டது!",
      rejectSuccess: "சந்திப்பு வெற்றிகரமாக நிராகரிக்கப்பட்டது!",
      error: "கோரிக்கையை செயல்படுத்துவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
      rejectReason: "நிராகரிப்பதற்கான காரணத்தை உள்ளிடவும்:",
      approveConfirm: "இந்த சந்திப்பை அனுமதிக்க விரும்புகிறீர்களா?",
      rejectConfirm: "இந்த சந்திப்பை நிராகரிக்க விரும்புகிறீர்களா?",
      retry: "மீண்டும் முயற்சிக்கவும்",
      status: "நிலை:",
      appointmentNumber: "சந்திப்பு எண் #",
    },
  };

  const t = RFTTranslations[lang] || RFTTranslations.EN;

  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("smartgn_token");

  // ============================================================
  // GET TOMORROW'S DATE STRING (YYYY-MM-DD)
  // ============================================================
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ============================================================
  // FETCH TOMORROW'S APPOINTMENTS (BOTH PENDING AND APPROVED)
  // ============================================================
  const fetchTomorrowAppointments = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tomorrowStr = getTomorrowDateString();
      console.log(`🔍 Looking for appointments on: ${tomorrowStr}`);

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
        console.log(
          "📋 All appointments received:",
          data.appointments?.length || 0,
        );

        // ✅ Filter appointments for tomorrow using simple string comparison
        const tomorrowApps = data.appointments.filter((app) => {
          // The date comes as 'YYYY-MM-DD' from the backend
          const isTomorrow = app.date === tomorrowStr;
          if (isTomorrow) {
            console.log(
              `✅ Found: ${app.purpose} on ${app.date} (${app.status})`,
            );
          }
          return isTomorrow;
        });

        // Sort by time
        tomorrowApps.sort((a, b) => a.time.localeCompare(b.time));

        setTomorrowAppointments(tomorrowApps);
        console.log(
          `✅ Found ${tomorrowApps.length} appointments for tomorrow`,
        );
      } else {
        throw new Error(data.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Error fetching tomorrow's appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTomorrowAppointments();
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
        fetchTomorrowAppointments();
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

    const rejectionReason = prompt(t.rejectReason);
    if (rejectionReason === null) {
      return;
    }

    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setProcessingId(appointmentId);

      const response = await fetch(
        `/api/appointments/${appointmentId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject appointment");
      }

      const data = await response.json();

      if (data.success) {
        alert(t.rejectSuccess);
        fetchTomorrowAppointments();
      } else {
        throw new Error(data.error || "Failed to reject appointment");
      }
    } catch (err) {
      alert(t.error);
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

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
          <div className="flex flex-1 w-full">
            <OSidebar />
          </div>
          <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <p className="text-red-600 font-semibold mb-2">{t.error}</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={fetchTomorrowAppointments}
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
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
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

          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px] mt-[30px] mx-[30px]">
            {t.Title}
          </div>

          {/* Display count of appointments */}
          <div className="mx-[50px] mt-[10px] text-sm text-[#2D37488D]">
            {tomorrowAppointments.length} appointment(s) scheduled for tomorrow
            ({getTomorrowDateString()})
          </div>

          {tomorrowAppointments.length > 0 ? (
            <>
              {tomorrowAppointments.map((appointment) => (
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
                          NIC:{" "}
                          {appointment.resident?.nic ||
                            appointment.resident_nic ||
                            "N/A"}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg lg:text-[12px] text-[#D69E2E] font-medium mt-[10px] hover:cursor-pointer hover:underline">
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

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col w-[50%] text-[16px] text-[#2D3748] my-[10px]">
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

                    {/* Status Badge - Shows both Pending and Approved */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-[#2D37488D]">
                        {t.status}
                      </span>
                      {appointment.status === "Approved" ? (
                        <div className="flex border gap-[10px] border-[#22C55E] rounded-[50px] py-[10px] px-[20px] text-[16px] text-[#22C55E] items-center bg-[#22C55E10]">
                          <img
                            src={approvedIcon}
                            alt="Approved"
                            className="w-[20px] h-[20px]"
                          />
                          <span>Approved</span>
                        </div>
                      ) : (
                        <div className="flex border gap-[10px] border-[#D69E2E] rounded-[50px] py-[10px] px-[20px] text-[16px] text-[#D69E2E] items-center bg-[#D69E2E10]">
                          <img
                            src={pendingIcon}
                            alt="Pending"
                            className="w-[20px] h-[20px]"
                          />
                          <span>Pending</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="border border-[#2D37482D]" />

                  {/* Action Buttons - Only for Pending appointments */}
                  {appointment.status === "Pending" && (
                    <div className="flex justify-end gap-[10px] mt-[10px]">
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
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="flex mx-[50px] my-[30px] flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
              <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[16px] text-[#2D37488D]">
                {t.noAppointments}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RequestsForTomorrow;
