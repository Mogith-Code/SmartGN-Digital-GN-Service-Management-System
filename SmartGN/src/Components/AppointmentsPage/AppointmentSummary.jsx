// src/components/AppointmentSummary.jsx
import React from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import appointmentIcon from "../../assets/calendar_today_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

function AppointmentSummary({ day, month, year }) {
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  // Contains all text content in three languages: English (EN),
  // Sinhala (SI), and Tamil (TA)
  const SummaryLayoutTranslations = {
    EN: {
      January: "January",
      February: "February",
      March: "March",
      April: "April",
      May: "May",
      June: "June",
      July: "July",
      August: "August",
      September: "September",
      October: "October",
      November: "November",
      December: "December",

      NoAppointmentsscheduledfor: "No Appointments scheduled for",
      clickonBookanappointmenttoscheduleameeting:
        "Click on 'Book an appointment' to schedule a meeting.",
    },

    SI: {
      January: "ජනවාරි",
      February: "පෙබරවාරි",
      March: "මාර්තු",
      April: "අප්‍රේල්",
      May: "මැයි",
      June: "ජූනි",
      July: "ජූලි",
      August: "අගෝස්තු",
      September: "සැප්තැම්බර්",
      October: "ඔක්තෝබර්",
      November: "නවම්බර්",
      December: "දෙසැම්බර්",

      NoAppointmentsscheduledfor: "හමුවීම් කිසිවක් කාලසටහන්ගත කර නොමැත",
      clickonBookanappointmenttoscheduleameeting:
        "හමුවීමක් සකස් කිරීමට 'හමුවක් වෙන්කරන්න' මත ක්ලික් කරන්න.",
    },

    TA: {
      January: "ஜனவரி",
      February: "பிப்ரவரி",
      March: "மார்ச்",
      April: "ஏப்ரல்",
      May: "மே",
      June: "ஜூன்",
      July: "ஜூலை",
      August: "ஆகஸ்ட்",
      September: "செப்டம்பர்",
      October: "அக்டோபர்",
      November: "நவம்பர்",
      December: "டிசம்பர்",

      NoAppointmentsscheduledfor: "நேரம் கொடுக்கப்பட்டது",
      clickonBookanappointmenttoscheduleameeting:
        "ஹமுவிமக் சகசு கிரீம் 'ஹமுவிமக் வென்கரன்' மத க்லிக் கரன்.",
    },
  };

  // Select the appropriate translation based on current language
  const t = SummaryLayoutTranslations[lang] || SummaryLayoutTranslations.EN;

  // Get month name
  const getMonthName = (monthIndex) => {
    const months = [
      t.January,
      t.February,
      t.March,
      t.April,
      t.May,
      t.June,
      t.July,
      t.August,
      t.September,
      t.October,
      t.November,
      t.December,
    ];
    return months[monthIndex];
  };

  // Format the date
  const formattedDate = `${getMonthName(month)} ${day}, ${year}`;

  return (
    <div className="flex w-full flex-col items-center justify-center p-12 px-6 text-center text-[#2D37488D] border-[1.5px] border-dashed border-[#2D37488D] rounded-xl bg-[#E2E8F0]">
      <img
        className="mb-3 w-[50px]"
        src={appointmentIcon}
        alt="Appointment Icon"
      />
      <p className="font-medium text-[16px]">
        {t.NoAppointmentsscheduledfor} {formattedDate}.
      </p>
      <p className="text-[14px] text-[#2D37488D]">
        {t.clickonBookanappointmenttoscheduleameeting}
      </p>
    </div>
  );
}

export default AppointmentSummary;
