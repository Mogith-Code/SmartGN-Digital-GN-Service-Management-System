import React from "react";
import certificateIcon from "../../assets/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import arrowIcon from "../../assets/arrow_forward_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import allowancesIcon from "../../assets/edit_document_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIcon from "../../assets/calendar_today_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";

function QuickActions() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const ActionTranslations = {
    EN: {
      title: "Quick Actions",
      card1Title: "Request Certificates",
      Card2Title: "Book Appointments",
      Card3Title: "Apply for Allowances",
      Card4Title: "Disaster Relief",
    },
    SI: {
      title: "ඉක්මන් ක්‍රියාමාර්ග",
      card1Title: "සහතික පත්‍ර ඉල්ලීම්",
      Card2Title: "හමුවීම් වෙන්කරන්න",
      Card3Title: "සහන සඳහා අයදුම් කරන්න",
      Card4Title: "අනතුරු සහන",
    },
    TA: {
      title: "விருந்து செயல்கள்",
      card1Title: "சான்றிதழ்களை கோருங்கள்",
      Card2Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      Card3Title: "சந்திப்பை பதிவு செய்யவும்",
      Card4Title: "விபத்து நிவாரணம்",
    },
  };

  const t = ActionTranslations[lang] || ActionTranslations.EN;

  const cards = [
    {
      id: 1,
      title: t.card1Title,
      icon: certificateIcon,
      alt: "certificate icon",
      route: "/ResidentDashboard/certificates",
    },
    {
      id: 2,
      title: t.Card2Title,
      icon: appointmentIcon,
      alt: "appointment icon",
      route: "/ResidentDashboard/Bookingform",
    },
    {
      id: 3,
      title: t.Card3Title,
      icon: allowancesIcon,
      alt: "allowance icon",
      route: "/ResidentDashboard/allowances",
    },
    {
      id: 4,
      title: t.Card4Title,
      icon: disasterIcon,
      alt: "disaster icon",
      route: "/ResidentDashboard/disaster-relief",
    },
  ];

  return (
    <div className="flex flex-col gap-[20px] items-center justify-center">
      <span className="text-[#1B365D] text-[20px] font-medium">{t.title}</span>
      <div className="grid grid-cols-2 gap-[20px]">
        {cards.map((card) => (
          <button
            key={card.id}
            className="bg-[#FFFFFF] flex items-center justify-center p-[15px] rounded-[15px] shadow-[0px_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0px_5px_15px_rgba(0,0,0,0.15)] hover:scale-102 transition-all duration-100 cursor-pointer"
            onClick={() => {
              navigate(card.route);
            }}
          >
            <div className="flex items-center justify-between  w-full">
              <div className="flex gap-[10px] items-center">
                <img src={card.icon} alt={card.alt} className="h-[20px]" />
                <span className="text-[16px] text-[#2D3748]">{card.title}</span>
              </div>

              <img
                src={arrowIcon}
                alt="arrowIcon"
                className="ml-[10px] h-[16px] w-[20px] opacity-[50%]"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
