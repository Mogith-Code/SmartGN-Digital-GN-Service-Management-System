import React from "react";
import { useState } from "react";
import { useLanguage } from "../../utils/translate"; // Custom hook for multilingual support
import pendingIcon from "../../assets/schedule_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import approvedIcon from "../../assets/verified_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "../../assets/add_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";

function CardLayout({ pendingCount, approvedCount }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
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

  // Navigation Handlers
  const handleCard1Click = () => {
    navigate("/ResidentDashboard/RAppointment/PendingAppointmentRequests");
  };

  const handleCard2Click = () => {
    navigate("/RAppointment/ApprovedAppointmentRequests");
  };

  const handleCard3Click = () => {
    navigate("/RAppointment/BookingForm");
  };

  // Select the appropriate translation based on current language
  const t = CardLayoutTranslations[lang] || CardLayoutTranslations.EN;

  // ============================================================================
  // CARD ARRAY - Pass function references (NOT function calls!)
  // ============================================================================
  const cards = [
    {
      id: 1,
      icon: pendingIcon,
      title: t.Card1Title,
      count: pendingCount,
      onClick: handleCard1Click,
    },
    {
      id: 2,
      icon: approvedIcon,
      title: t.Card2Title,
      count: approvedCount,
      onClick: handleCard2Click,
    },
    {
      id: 3,
      icon: addIcon,
      title: t.Card3Title,
      count: null,
      onClick: handleCard3Click,
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#E2E8F0] gap-[15px] rounded-2xl p-[15px] flex flex-col items-center shadow-[0px_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
          onClick={card.onClick}
        >
          <img src={card.icon} alt="card icon" className="w-[50px]" />

          <div className="flex flex-col gap-[10px] items-center">
            <span className="text-[16px] font-regular text-[#2D3748] text-center">
              {card.title}
            </span>
            {card.count !== null && (
              <span className="text-[20px] font-medium text-[#2D3748]">
                {card.count}
              </span>
            )}
            {card.id === 3 && (
              <span className="text-[12px] font-light text-[#2D3748] text-center">
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
