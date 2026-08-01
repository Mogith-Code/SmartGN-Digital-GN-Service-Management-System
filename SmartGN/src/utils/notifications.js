// src/utils/notifications.js

const RESIDENT_NOTIF_KEY = "smartgn_notifications_resident";
const OFFICER_NOTIF_KEY = "smartgn_notifications_officer";
const ADMIN_NOTIF_KEY = "smartgn_notifications_admin";

// Default initial notifications for demonstration and usability
const DEFAULT_RESIDENT_NOTIFS = [
  {
    id: "notif-res-1",
    type: "certificate",
    title: "Certificate Approved",
    message: "Your Character Certificate request (#CERT-102) has been approved by Grama Niladhari.",
    date: "10 mins ago",
    read: false,
    link: "/ResidentDashboard/certificates/approved",
  },
  {
    id: "notif-res-2",
    type: "announcement",
    title: "New Announcement",
    message: "Community Health Program notice published by Grama Niladhari Office.",
    date: "2 hours ago",
    read: false,
    link: "/ResidentDashboard",
  },
  {
    id: "notif-res-3",
    type: "appointment",
    title: "Appointment Confirmed",
    message: "Your appointment request for identity verification has been confirmed for tomorrow at 10:00 AM.",
    date: "Yesterday",
    read: true,
    link: "/ResidentDashboard/RAppointment/ApprovedAppointmentRequests",
  },
];

const DEFAULT_OFFICER_NOTIFS = [
  {
    id: "notif-off-1",
    type: "certificate",
    title: "New Certificate Application",
    message: "Nimal Perera submitted a new Income Certificate application.",
    date: "15 mins ago",
    read: false,
    link: "/dashboard/officer/certificates",
  },
  {
    id: "notif-off-2",
    type: "appointment",
    title: "Appointment Request",
    message: "Resident Sunethra Silva requested an appointment for tomorrow at 10:30 AM.",
    date: "1 hour ago",
    read: false,
    link: "/OfficerDashboard/OfficerAppointment/OfficerPendingAppointment",
  },
  {
    id: "notif-off-3",
    type: "disaster",
    title: "Disaster Relief Incident Report",
    message: "Flood damage report submitted in Ward 4 by resident Kamal Jayasinghe.",
    date: "3 hours ago",
    read: true,
    link: "/dashboard/officer/disasters",
  },
];

const DEFAULT_ADMIN_NOTIFS = [
  {
    id: "notif-admin-1",
    type: "user",
    title: "New Resident Registered",
    message: "Resident Nimal Perera (NIC: 200324511540) registered under Colombo Borella Division.",
    date: "10 mins ago",
    read: false,
    link: "/dashboard/admin",
  },
  {
    id: "notif-admin-2",
    type: "security",
    title: "Password Reset Request",
    message: "Resident requested password reset for account Nimal.Perera@example.com.",
    date: "1 hour ago",
    read: false,
    link: "/dashboard/admin",
  },
];

/**
 * Get storage key based on user role ('resident' | 'officer' | 'admin')
 */
const getKey = (role) => {
  if (role === "admin") return ADMIN_NOTIF_KEY;
  if (role === "officer") return OFFICER_NOTIF_KEY;
  return RESIDENT_NOTIF_KEY;
};

/**
 * Get all notifications for a role
 */
export const getNotifications = (role = "resident") => {
  try {
    const key = getKey(role);
    const stored = localStorage.getItem(key);
    if (!stored) {
      const initial =
        role === "admin"
          ? DEFAULT_ADMIN_NOTIFS
          : role === "officer"
          ? DEFAULT_OFFICER_NOTIFS
          : DEFAULT_RESIDENT_NOTIFS;
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading notifications from localStorage:", error);
    if (role === "admin") return DEFAULT_ADMIN_NOTIFS;
    return role === "officer" ? DEFAULT_OFFICER_NOTIFS : DEFAULT_RESIDENT_NOTIFS;
  }
};

/**
 * Dispatch DOM event to notify active navbar components
 */
const notifyChange = () => {
  window.dispatchEvent(new Event("notificationsUpdated"));
};

/**
 * Format notification timestamp into relative time flow string
 */
export const formatNotificationTime = (item) => {
  if (!item) return "";
  let timestamp = item.timestamp;
  if (!timestamp && item.id && item.id.startsWith("notif-")) {
    const parts = item.id.split("-");
    if (parts[1] && !isNaN(parseInt(parts[1], 10))) {
      timestamp = parseInt(parts[1], 10);
    }
  }
  if (!timestamp || isNaN(timestamp)) {
    return item.date || "Just now";
  }

  const now = Date.now();
  const elapsedMs = Math.max(0, now - timestamp);
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const elapsedMin = Math.floor(elapsedSec / 60);
  const elapsedHour = Math.floor(elapsedMin / 60);
  const elapsedDay = Math.floor(elapsedHour / 24);

  if (elapsedSec < 30) return "Just now";
  if (elapsedMin < 60) return `${elapsedMin} ${elapsedMin === 1 ? "min" : "mins"} ago`;
  if (elapsedHour < 24) return `${elapsedHour} ${elapsedHour === 1 ? "hour" : "hours"} ago`;
  if (elapsedDay === 1) return "Yesterday";
  if (elapsedDay < 7) return `${elapsedDay} days ago`;

  const dateObj = new Date(timestamp);
  return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Add a new notification
 */
export const addNotification = (role = "resident", notification) => {
  try {
    const notifications = getNotifications(role);
    const nowTs = Date.now();
    const newNotif = {
      id: `notif-${nowTs}-${Math.floor(Math.random() * 1000)}`,
      type: notification.type || "info",
      title: notification.title || "Notification",
      message: notification.message || "",
      timestamp: nowTs,
      date: "Just now",
      read: false,
      link: notification.link || (role === "officer" ? "/dashboard/officer" : "/ResidentDashboard"),
    };

    const updated = [newNotif, ...notifications];
    localStorage.setItem(getKey(role), JSON.stringify(updated));
    notifyChange();
    return newNotif;
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = (role = "resident", notificationId) => {
  try {
    const notifications = getNotifications(role);
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(getKey(role), JSON.stringify(updated));
    notifyChange();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

/**
 * Mark all notifications as read for a role
 */
export const markAllAsRead = (role = "resident") => {
  try {
    const notifications = getNotifications(role);
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem(getKey(role), JSON.stringify(updated));
    notifyChange();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

/**
 * Clear all notifications for a role
 */
export const clearNotifications = (role = "resident") => {
  try {
    localStorage.setItem(getKey(role), JSON.stringify([]));
    notifyChange();
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
};
