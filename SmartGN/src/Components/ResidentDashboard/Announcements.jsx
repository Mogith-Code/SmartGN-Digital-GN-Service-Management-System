import React, { useState } from "react";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";

function Announcements({ announcements = [] }) {
  const { lang } = useLanguage();

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const AnnTranslations = {
    EN: { title: "Announcements", view: "View all", readMore: "Click to read description" },
    SI: { title: "ඇනවුන්ස්මන්ට්", view: "සියල්ල දැක්වීම", readMore: "විස්තරය කියවීමට ක්ලික් කරන්න" },
    TA: { title: "அறிவிப்புகள்", view: "அனைத்தையும் பார்வையிடு", readMore: "விவரங்களைப் படிக்க கிளிக் செய்க" },
  };
  const t = AnnTranslations[lang] || AnnTranslations.EN;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleCardClick = (announcement, e) => {
    e.stopPropagation();
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full gap-[20px]">
      <div className="flex w-full justify-center items-center">
        <div className="flex text-[#1B365D] font-medium text-[20px]">
          {t.title}
        </div>
      </div>

      <div className="flex flex-col gap-[12px] w-full justify-between items-center">
        {announcements.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-[30px] px-4 sm:px-6 md:px-8 text-center text-[#2D37488D] border border-dashed border-[#2D37484D] rounded-xl bg-[#E2E8F0]">
            No announcements from your GN division yet.
          </div>
        ) : (
          announcements.map((announcement) => {
            const annId = announcement.announcement_id || announcement.id;
            const isExpanded = expandedId === annId;

            return (
              <div
                key={annId}
                className="flex flex-col w-full border border-[#2D37484D] hover:border-[#005BBD] rounded-[15px] p-[16px] sm:p-[20px] bg-white hover:bg-[#F8FAFC] transition-all duration-200 shadow-xs cursor-pointer group"
                onClick={(e) => handleCardClick(announcement, e)}
                title="Click to view full announcement details"
              >
                <div className="flex flex-col sm:flex-row justify-between w-full gap-3 sm:items-center">
                  <div className="flex gap-[12px] items-start sm:items-center">
                    <img
                      src={announcementIcon}
                      alt="announcement icon"
                      className="h-[22px] w-[22px] flex-shrink-0 mt-0.5 sm:mt-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-[#2D3748] text-[15px] sm:text-[16px] font-semibold group-hover:text-[#005BBD] transition-colors">
                        {announcement.title}
                      </span>
                      {announcement.division_name && (
                        <div className="text-xs text-[#2D374880] mt-0.5">
                          📍 {announcement.division_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 items-center justify-between sm:justify-end">
                    <span className="text-[#2D3748] text-[13px] sm:text-[14px]">
                      {formatDate(announcement.date)}
                    </span>
                    <span
                      className={`text-[11px] sm:text-[12px] px-2.5 py-0.5 rounded-full font-semibold ${
                        announcement.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : announcement.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {announcement.type || "General"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(annId, e)}
                      className="text-xs text-[#005BBD] hover:underline font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border-0 cursor-pointer ml-1"
                    >
                      {isExpanded ? "Hide" : "Details"}
                    </button>
                  </div>
                </div>

                {/* Inline Description Preview */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-left text-xs sm:text-sm text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-xl">
                    <p className="m-0 font-normal whitespace-pre-line">
                      {announcement.description || announcement.content || "No detailed description provided."}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Announcement Details Modal */}
      {showModal && selectedAnnouncement && (
        <div className="fixed inset-x-0 bottom-0 top-[70px] sm:top-[85px] bg-[#0f172a]/65 backdrop-blur-xs z-[95] flex justify-center items-start p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#2D37482D] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl flex flex-col relative z-[96] my-4 max-h-[calc(100vh-120px)] overflow-y-auto text-left animate-zoom-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF8FF] flex items-center justify-center flex-shrink-0 border border-[#005BBD]/20">
                  <img src={announcementIcon} alt="Icon" className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      selectedAnnouncement.priority === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : selectedAnnouncement.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {selectedAnnouncement.type || "General"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(selectedAnnouncement.date || selectedAnnouncement.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center border-0 cursor-pointer text-lg transition-colors flex-shrink-0"
                aria-label="Close announcement details"
              >
                &times;
              </button>
            </div>

            {/* Announcement Title & Meta */}
            <div className="mt-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#1B365D] m-0 leading-snug">
                {selectedAnnouncement.title}
              </h2>

              {selectedAnnouncement.division_name && (
                <div className="text-xs text-[#005BBD] font-semibold bg-[#EBF8FF] px-3 py-1 rounded-lg w-fit mt-1">
                  📍 GN Division: {selectedAnnouncement.division_name}
                </div>
              )}
            </div>

            {/* Full Announcement Description */}
            <div className="mt-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Notice Description & Details
              </label>
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 text-sm text-[#2D3748] leading-relaxed whitespace-pre-line font-normal">
                {selectedAnnouncement.description || selectedAnnouncement.content || selectedAnnouncement.details || "No additional details available for this announcement."}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-[#1B365D] hover:bg-[#005BBD] text-white font-bold px-6 py-2 rounded-xl border-0 cursor-pointer text-sm transition-all shadow-md"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
