// src/components/AppointmentsPage/CardLayout.jsx
import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate";
import pendingIcon from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function CardLayout({ pendingCount, approvedCount }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const CardLayoutTranslations = {
    EN: {
      Card1Title: "Pending appointment requests",
      Card2Title: "Approved appointment requests",
      Card3Title: "Book an appointment",
    },
    SI: {
      Card1Title: "අනුමැතිය ලැබීමට නියමිත හමුවීම් සඳහා ඉල්ලීම්",
      Card2Title: "අනුමත හමුවීම් සඳහා ඉල්ලීම්",
      Card3Title: "හමුවක් වෙන්කරන්න",
    },
    TA: {
      Card1Title: "நிலுவையில் உள்ள சந்திப்பு கோரிக்கைகள்",
      Card2Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      Card3Title: "சந்திப்பை பதிவு செய்யவும்",
    },
  };

  const t = CardLayoutTranslations[lang] || CardLayoutTranslations.EN;

  const cards = [
    {
      id: 1,
      icon: pendingIcon,
      title: t.Card1Title,
      count: pendingCount,
      path: "/ResidentDashboard/RAppointment/PendingAppointmentRequests",
    },
    {
      id: 2,
      icon: approvedIcon,
      title: t.Card2Title,
      count: approvedCount,
      path: "/ResidentDashboard/RAppointment/ApprovedAppointmentRequests",
    },
    {
      id: 3,
      icon: addIcon,
      title: t.Card3Title,
      count: null,
      path: "/ResidentDashboard/RAppointment/BookingForm",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => navigate(card.path)}
          className="bg-[#E2E8F0] gap-[5px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_2px_5px_rgba(0,0,0,0.1)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-102 transition-all duration-100 cursor-pointer w-full"
        >
          <img
            src={card.icon}
            alt="card icon"
            className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] object-contain"
          />

          <div className="flex flex-col items-center w-full">
            <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-regular text-[#2D3748] text-center leading-tight break-words max-w-full px-0.5">
              {card.title}
            </span>
            {card.count !== null && (
              <span className="text-[18px] sm:text-[20px] font-medium text-[#2D3748]">
                {card.count}
              </span>
            )}
            {card.id === 3 && (
              <span className="text-[10px] sm:text-[11px] md:text-[12px] font-light text-[#2D3748] text-center">
                Only 1 appointment can be booked for a day
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default CardLayout;
