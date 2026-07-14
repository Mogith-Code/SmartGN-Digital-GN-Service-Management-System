import React from "react";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";

function Announcements() {
  const { lang } = useLanguage();

  const AnnTranslations = {
    EN: {
      title: "Announcements",
      view: "View all",
      Card2Title: "Book Appointments",
      Card3Title: "Apply for Allowances",
      Card4Title: "Disaster Relief",
    },
    SI: {
      title: "ඇනවුන්ස්මන්ට්",
      view: "සියල්ල දැක්වීම",
      Card2Title: "හමුවීම් වෙන්කරන්න",
      Card3Title: "සහන සඳහා අයදුම් කරන්න",
      Card4Title: "අනතුරු සහන",
    },
    TA: {
      title: "அறிவிப்புகள்",
      view: "அனைத்தையும் பார்வையிடு",
      Card2Title: "அங்கீகாரம் பெற்ற சந்திப்பு கோரிக்கைகள்",
      Card3Title: "சந்திப்பை பதிவு செய்யவும்",
      Card4Title: "விபத்து நிவாரணம்",
    },
  };

  const t = AnnTranslations[lang] || AnnTranslations.EN;
  const Announcements = [
    {
      id: 1,
      title: "Community Health Camp",
      date: "April 10, 2026",
      category: "Health",
    },
    {
      id: 2,
      title: "About Allowances",
      date: "April 11, 2026",
      category: "Allowances",
    },
    {
      id: 3,
      title: "About Certificates",
      date: "April 12, 2026",
      category: "Certificates",
    },
    {
      id: 4,
      title: "About Disasters",
      date: "April 13, 2026",
      category: "Disasters",
    },
  ];
  return (
    <>
      <div className="flex flex-col w-full gap-[20px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex text-[white] text-[16px]">
            <span>View all</span>
          </div>
          <div className="flex text-[#1B365D] font-medium text-[20px]">
            {t.title}
          </div>
          <div className="flex text-[#D69E2E] text-[16px] bover: cursor-pointer hover:underline hover:font-medium">
            <span>{t.view}</span>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] w-full justify-between items-center">
          {Announcements.map((announcement) => (
            <div className="flex justify-between w-full border border-[#2D37484D] rounded-[15px] p-[20px]">
              <div className="flex gap-[10px] items-center">
                <img
                  src={announcementIcon}
                  alt="announcement icon"
                  className="h-[20px]"
                />
                <span className="text-[#2D3748] text-[16px]">
                  {announcement.title}
                </span>
              </div>

              <div className="flex w-[40%] justify-between items-center">
                <span className="text-[#2D3748] text-[16px]">
                  {announcement.date}
                </span>
                <span className="text-[#2D3748] text-[16px]">
                  {announcement.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Announcements;
