import React from "react";
import certificateIcon from "../../assets/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import arrowIcon from "../../assets/arrow_forward_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/translate";

function QuickActions() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const ActionTranslations = {
    EN: {
      Card1Title: "Total Pending requests",
      Card2Title: "Total Approved requests",
      Card3Title: "Upcoming appointments",
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
  const cards = [
    {
      id: 1,
      title: "Request Certificates",
      icon: certificateIcon,
      alt: "certificate icon",
      route: "/ResidentDashboard/certificates",
    },
    {
      id: 2,
      title: "Book Appointments",
      icon: certificateIcon,
      alt: "appointment icon",
      route: "/ResidentDashboard/RAppointment/BookingForm",
    },
    {
      id: 3,
      title: "Apply for Allowances",
      icon: certificateIcon,
      alt: "allowance icon",
      route: "/ResidentDashboard/allowances",
    },
    {
      id: 4,
      title: "Disaster Relief",
      icon: certificateIcon,
      alt: "disaster icon",
      route: "/dashboard/resident/allowances",
    },
  ];
  const t = ActionTranslations[lang] || ActionTranslations.EN;

  return (
    <div className="flex flex-col gap-[20px] items-center justify-center">
      <span className="text-[#1B365D] text-[20px] font-medium">
        Quick Actions
      </span>
      <div className="grid grid-cols-2 gap-[20px]">
        {cards.map((card) => (
          <button
            key={card.id}
            className="bg-[#FFFFFF] flex items-center justify-center p-[15px] rounded-[15px] shadow-[0px_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_2px_15px_rgba(0,0,0,0.2)] hover:scale-102 transition-all duration-100 cursor-pointer"
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
