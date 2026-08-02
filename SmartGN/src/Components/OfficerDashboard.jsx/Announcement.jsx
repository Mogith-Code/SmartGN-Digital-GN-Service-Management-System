import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { getAuthHeaders } from "../../utils/api";

function Announcement() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements/officer", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to load announcements.");

      const data = await response.json();

      // Format the announcements similar to OfficerAnnouncements
      const formatted = data.map((item) => {
        const dateObj = new Date(item.date);
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
        const formattedDate = `${months[dateObj.getMonth()] || "Jan"} ${dateObj.getDate() || 1}, ${dateObj.getFullYear() || 2026}`;

        const isUrgentType = item.type?.toLowerCase() === "urgent";
        return {
          id: item.announcement_id,
          title: item.title,
          category: isUrgentType ? "Urgent" : item.type || "General",
          date: formattedDate,
          content: item.description,
          status: isUrgentType ? "Urgent" : "Live",
        };
      });

      setAnnouncements(formatted);
      setError(null);
    } catch (err) {
      console.error("Error loading announcements:", err);

      // Fallback to localStorage if API fails
      try {
        const saved = localStorage.getItem("smartgn_announcements");
        if (saved) {
          const parsed = JSON.parse(saved);
          setAnnouncements(parsed);
        } else {
          setError("No announcements available");
        }
      } catch (localErr) {
        setError("Failed to load announcements");
      }
    } finally {
      setLoading(false);
    }
  };

  // Listen for announcement updates
  useEffect(() => {
    const handleUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener("announcementsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("announcementsUpdated", handleUpdate);
    };
  }, []);

  // Show only active announcements (not archived)
  const activeAnnouncements = announcements.filter(
    (item) => item.status !== "Archived",
  );

  // Get the 4 most recent announcements for display
  const recentAnnouncements = activeAnnouncements.slice(0, 4);

  // Handle navigation to officer announcements page
  const handleAddNewAnnouncement = () => {
    navigate("/OfficerDashboard/announcements");
  };

  // Handle "View all" click
  const handleViewAll = () => {
    navigate("/OfficerDashboard/announcements");
  };

  return (
    <>
      <div className="flex flex-col w-full gap-[20px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex text-[white] text-[16px]">
            <span>View all</span>
          </div>
          <div className="flex text-[#1B365D] font-medium text-[20px]">
            Announcements
          </div>
          <div
            className="flex text-[#D69E2E] text-[16px] hover:cursor-pointer hover:underline hover:font-medium"
            onClick={handleViewAll}
          >
            <span>View all</span>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] w-full justify-between items-center">
          {loading ? (
            <div className="flex justify-center w-full border border-[#2D37484D] rounded-[15px] p-[20px] text-[#2D3748]">
              Loading announcements...
            </div>
          ) : error ? (
            <div className="flex justify-center w-full border border-[#2D37484D] rounded-[15px] p-[20px] text-[#2D3748]">
              {error}
            </div>
          ) : recentAnnouncements.length === 0 ? (
            <div className="flex justify-center w-full border border-[#2D37484D] rounded-[15px] p-[20px] text-[#2D3748]">
              No announcements available
            </div>
          ) : (
            recentAnnouncements.map((announcement) => {
              // Determine if this is urgent
              const isUrgent =
                announcement.status === "Urgent" ||
                announcement.category?.toLowerCase() === "urgent";

              // Set border color based on urgency
              const borderColor = isUrgent
                ? "border-rose-500"
                : "border-[#2D37484D]";

              return (
                <div
                  key={announcement.id}
                  className={`flex justify-between w-full border ${borderColor} rounded-[15px] p-[20px] ${isUrgent ? "bg-rose-50" : "bg-white"}`}
                >
                  <div className="flex gap-[10px] items-center">
                    <img
                      src={announcementIcon}
                      alt="announcement icon"
                      className="h-[20px]"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-[16px] ${isUrgent ? "text-rose-700 font-semibold" : "text-[#2D3748]"}`}
                      >
                        {announcement.title}
                      </span>
                      {isUrgent && (
                        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                          ⚠️ Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex w-[40%] justify-between items-center">
                    <span className="text-[#2D3748] text-[16px]">
                      {announcement.date}
                    </span>
                    <span
                      className={`text-[16px] ${isUrgent ? "text-rose-600 font-semibold" : "text-[#2D3748]"}`}
                    >
                      {announcement.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          <div
            className="flex justify-center w-full border border-[#2D37484D] rounded-[15px] p-[20px] text-[#2D3748] hover:bg-gray-50 hover:cursor-pointer transition-colors duration-200"
            onClick={handleAddNewAnnouncement}
          >
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Announcement
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Announcement;
