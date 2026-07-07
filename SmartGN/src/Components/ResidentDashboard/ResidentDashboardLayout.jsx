import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";
import ResidentCardLayout from "./ResidentCardLayout";
import QuickActions from "./QuickActions";

function ResidentDashboardLayout() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const AppointmentLayoutTranslations = {
    EN: { Title: "Have a Nice Day Nimal!" },
    SI: { Title: "හමුවවීම්" },
    TA: { Title: "சந்திப்புகள்" },
  };

  const t =
    AppointmentLayoutTranslations[lang] || AppointmentLayoutTranslations.EN;

  // BOOKING STATES - CORRECTLY CREATING DATES
  // ============================================================================
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Approved",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      purpose: "Document Submission",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },

    {
      id: 4,
      purpose: "Meeting with Officer B",
      date: new Date(2026, 5, 23), // June 23, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
    },
  ]);

  const [allowances, setAllowances] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Approved",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      purpose: "Document Submission",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },

    {
      id: 4,
      purpose: "Meeting with Officer B",
      date: new Date(2026, 5, 23), // June 23, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
    },
  ]);

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Approved",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      purpose: "Document Submission",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },

    {
      id: 4,
      purpose: "Meeting with Officer B",
      date: new Date(2026, 5, 23), // June 23, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
    },
  ]);

  const [disasters, setDisasters] = useState([
    {
      id: 1,
      purpose: "Meeting with Officer A",
      date: new Date(2026, 5, 30), // June 30, 2026 (Month: 5 = June)
      time: "10:00 AM",
      contact: "0703891153",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 13, 17), // June 15, 2026 at 9:00 AM
    },
    {
      id: 2,
      purpose: "Certificate Collection",
      date: new Date(2026, 5, 25), // June 25, 2026
      time: "2:30 PM",
      contact: "0771234567",
      status: "Approved",
      requestedDate: new Date(2026, 5, 10, 14, 30), // June 10, 2026 at 2:30 PM
      createdAt: new Date(2026, 5, 15, 14, 30), // June 10, 2026 at 2:30 PM
    },
    {
      id: 3,
      purpose: "Document Submission",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 22, 9, 0), // June 15, 2026 at 9:00 AM
    },

    {
      id: 4,
      purpose: "Meeting with Officer B",
      date: new Date(2026, 5, 23), // June 23, 2026
      time: "1:00 PM",
      contact: "0771234567",
      status: "Pending",
      requestedDate: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
      createdAt: new Date(2026, 5, 21, 9, 0), // June 15, 2026 at 9:00 AM
    },
  ]);

  // Combine all requests into one array
  const totalActivities = [
    ...appointments,
    ...allowances,
    ...certificates,
    ...disasters,
  ];

  const upcomingAppointmentsCount = appointments.filter(
    (item) => item.status === "Approved",
  ).length;
  // Calculate dynamic stats
  const totalPendingCount = totalActivities.filter(
    (item) => item.status === "Pending",
  ).length;
  const totalApprovedCount = totalActivities.filter(
    (item) => item.status === "Approved",
  ).length;

  return (
    <>
      <div className="flex text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-2 sm:pb-2.5 md:pb-3 lg:pb-[10px] mt-12 sm:mt-14 md:mt-16 lg:mt-[60px] mx-4 sm:mx-6 md:mx-8 lg:mx-[30px]">
        {t.Title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-[75px] mt-4 sm:mt-5 md:mt-6 lg:mt-[30px]">
        <ResidentCardLayout
          totalPendingCount={totalPendingCount}
          totalApprovedCount={totalApprovedCount}
          upcomingAppointmentsCount={upcomingAppointmentsCount}
        />
      </div>

      <div className="flex mx-[100px] justify-center border border-[#2D37482D] rounded-[15px] bg-[#FDF5E6] mt-[30px] p-[20px]">
        <QuickActions />
      </div>

      <div className="flex mx-[200px] justify-center border border-[#2D37482D] rounded-[15px] mt-[30px] p-[30px]"></div>
    </>
  );
}

export default ResidentDashboardLayout;
