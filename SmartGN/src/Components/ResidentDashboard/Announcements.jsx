import React from "react";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";

function Announcements({ announcements = [] }) {
  const { lang } = useLanguage();

  const AnnTranslations = {
    EN: { title: "Announcements", view: "View all" },
    SI: { title: "ඇනවුන්ස්මන්ට්", view: "සියල්ල දැක්වීම" },
    TA: { title: "அறிவிப்புகள்", view: "அனைத்தையும் பார்வையிடு" },
  };
  const t = AnnTranslations[lang] || AnnTranslations.EN;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <div className="flex flex-col w-full gap-[20px]">
      <div className="flex w-full justify-center items-center">
        <div className="flex text-[#1B365D] font-medium text-[20px]">
          {t.title}
        </div>
      </div>

      <div className="flex flex-col gap-[10px] w-full justify-between items-center">
        {announcements.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
            No announcements from your GN division yet.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.announcement_id || announcement.id}
              className="flex justify-between w-full border border-[#2D37484D] rounded-[15px] p-[20px] hover:bg-[#F7FAFC] transition-colors duration-150"
            >
              <div className="flex gap-[10px] items-center">
                <img
                  src={announcementIcon}
                  alt="announcement icon"
                  className="h-[20px]"
                />
                <div>
                  <span className="text-[#2D3748] text-[16px] font-medium">
                    {announcement.title}
                  </span>
                  {announcement.division_name && (
                    <div className="text-xs text-[#2D374880]">
                      {announcement.division_name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-[#2D3748] text-[14px]">
                  {formatDate(announcement.date)}
                </span>
                <span
                  className={`text-[12px] px-2 py-0.5 rounded-full font-medium ${
                    announcement.priority === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : announcement.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {announcement.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcements;
