import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import LanguageSelector from "../Components/Common/LanguageSelector";

function ResidentDashboard({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Retrieve username and division from navigation state if available (defaults to Nimal Perera)
  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Nimal Perera";

  // Extract first name for the personal greeting
  const firstName = successUser.split(" ")[0];
  const userDivision =
    location.state?.division ||
    localStorage.getItem("smartgn_user_division") ||
    "Colombo";

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true);

  // States for dynamic database counts
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [approvedRequestsCount, setApprovedRequestsCount] = useState(0);
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = getAuthHeaders();

        // 1. Fetch certificates
        const certRes = await fetch("/api/certificates/resident", { headers });
        const certs = certRes.ok ? await certRes.json() : [];

        // 2. Fetch allowances
        const allowRes = await fetch("/api/allowances/resident", { headers });
        const allowances = allowRes.ok ? await allowRes.json() : [];

        // 3. Fetch appointments
        const apptRes = await fetch("/api/appointments/resident", { headers });
        const appts = apptRes.ok ? await apptRes.json() : [];

        // Calculate pending and approved counts
        const pendingCerts = certs.filter((c) => c.status === "PENDING").length;
        const pendingAllows = allowances.filter(
          (a) => a.status === "PENDING",
        ).length;
        const pendingAppts = appts.filter((a) => a.status === "PENDING").length;
        setPendingRequestsCount(pendingCerts + pendingAllows + pendingAppts);

        const approvedCerts = certs.filter(
          (c) => c.status === "APPROVED",
        ).length;
        const approvedAllows = allowances.filter(
          (a) => a.status === "APPROVED",
        ).length;
        setApprovedRequestsCount(approvedCerts + approvedAllows);

        const confirmedAppts = appts.filter(
          (a) => a.status === "CONFIRMED",
        ).length;
        setUpcomingAppointmentsCount(confirmedAppts);
      } catch (err) {
        console.error("Error loading resident dashboard stats:", err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements/feed");
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching announcements feed:", err);
      }
    };

    fetchDashboardData();
    fetchAnnouncements();
  }, []);

  const localDict = {
    EN: {
      alertNic:
        "Please upload a high-quality image of your National Identity Card",
      greeting: `Have a Nice Day ${firstName}!`,
      pendingReq: "Pending requests",
      approvedReq: "Approved requests",
      upcomingApp: "Upcoming Appointments",
      quickActions: "Quick Actions",
      requestCert: "Request Certificates",
      bookApp: "Book Appointments",
      applyAllow: "Apply for Allowances",
      disasterRelief: "Disaster Relief",
      announcements: "Announcements",
      viewAll: "View All",
      camp: "Community Health Camp",
      campTag: "Health",
    },
    SI: {
      alertNic: "කරුණාකර ඔබගේ ජාතික හැඳුනුම්පතේ පැහැදිලි ඡායාරූපයක් එක් කරන්න",
      greeting: `සුභ දවසක් ${firstName}!`,
      pendingReq: "පූරණය වෙමින් පවතින ඉල්ලීම්",
      approvedReq: "අනුමත ඉල්ලීම්",
      upcomingApp: "ඉදිරි හමුවීම්",
      quickActions: "ඉක්මන් ක්‍රියාමාර්ග",
      requestCert: "සහතික ඉල්ලීම්",
      bookApp: "හමුවීම් වෙන්කරවා ගැනීම",
      applyAllow: "දීමනා සඳහා ඉල්ලුම් කිරීම",
      disasterRelief: "ආපදා සහන",
      announcements: "නිවේදන",
      viewAll: "සියල්ල බලන්න",
      camp: "ප්‍රජා සෞඛ්‍ය කඳවුර",
      campTag: "සෞඛ්‍ය",
    },
    TA: {
      alertNic:
        "தயவுசெய்து உங்கள் தேசிய அடையாள அட்டையின் தெளிவான படத்தை பதிவேற்றவும்",
      greeting: `இனிய நாள் ${firstName}!`,
      pendingReq: "நிலுவையிலுள்ள கோரிக்கைகள்",
      approvedReq: "அங்கீகரிக்கப்பட்ட கோரிக்கைகள்",
      upcomingApp: "வரவிருக்கும் சந்திப்புகள்",
      quickActions: "விரைவான நடவடிக்கைகள்",
      requestCert: "சான்றிதழ்களைக் கோருங்கள்",
      bookApp: "சந்திப்புகளை முன்பதிவு செய்க",
      applyAllow: "கொடுப்பனவுகளுக்கு விண்ணப்பிக்கவும்",
      disasterRelief: "பேரழிவு நிவாரணம்",
      announcements: "அறிவிப்புகள்",
      viewAll: "அனைத்தையும் காட்டு",
      camp: "சமூக சுகாதார முகாம்",
      campTag: "சுகாதாரம்",
    },
  };

  const d = localDict[lang] || localDict.EN;

  return (
    <div className="dashboard-container">
      {/* 1. Header */}
      <header className="dashboard-header">
        <div
          className="landing-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-smart">Smart</span>
          <span className="logo-gn">GN</span>
          <p className="logo-subtext">{t.tagline}</p>
        </div>

        <div className="header-right">
          <LanguageSelector />

          {/* Notifications */}
          <div className="notification-bell">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="bell-badge">2</span>
          </div>

          {/* User Profile Info */}
          <div className="user-profile-info">
            <div className="user-text-details">
              <span className="user-division">{userDivision}</span>
              <span className="user-name">{successUser}</span>
            </div>
            <div className="user-avatar-circle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="avatar-svg"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Layout */}
      <div className="dashboard-main-layout">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <button className="menu-btn" onClick={() => navigate("/")}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.home}</span>
            </button>

            <button className="menu-btn active">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
              <span>{t.dashboard}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/profile", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{t.profile}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/household", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <circle cx="9" cy="14" r="2"></circle>
                <circle cx="15" cy="14" r="2"></circle>
              </svg>
              <span>{t.family}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/certificates", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <circle cx="12" cy="11" r="3"></circle>
              </svg>
              <span>{t.certificates}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/appointments", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{t.appointments}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/allowances", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              <span>{t.allowances}</span>
            </button>

            <button
              className="menu-btn"
              onClick={() =>
                navigate("/dashboard/resident/disaster", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{t.disaster}</span>
            </button>

            <button className="menu-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="menu-icon"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{t.announcements}</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="dashboard-content">
          {/* Top warning Alert */}
          {showAlert && (
            <div className="dashboard-alert-banner">
              <div className="alert-text-wrapper">
                <span>{d.alertNic}</span>
              </div>
              <button
                className="alert-close-btn"
                onClick={() => setShowAlert(false)}
                aria-label="Close Warning"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Heading Greeting */}
          <h2 className="content-greeting">{d.greeting}</h2>

          {/* Stats Widgets */}
          <div className="stats-row-grid">
            {/* Card 1: Pending Requests */}
            <div className="stat-card">
              <div className="stat-icon-circle">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <circle cx="12" cy="14" r="3"></circle>
                  <polyline points="12 12 12 14 14 14"></polyline>
                </svg>
              </div>
              <span className="stat-label">{d.pendingReq}</span>
              <span className="stat-value">{pendingRequestsCount}</span>
            </div>

            {/* Card 2: Approved Requests */}
            <div className="stat-card">
              <div className="stat-icon-circle">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="stat-label">{d.approvedReq}</span>
              <span className="stat-value">{approvedRequestsCount}</span>
            </div>

            {/* Card 3: Upcoming Appointments */}
            <div
              className="stat-card"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/dashboard/resident/appointments", {
                  state: { successUser, division: userDivision },
                })
              }
            >
              <div className="stat-icon-circle">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <polyline points="12 12 16 14 12 16"></polyline>
                </svg>
              </div>
              <span className="stat-label">{d.upcomingApp}</span>
              <span className="stat-value">{upcomingAppointmentsCount}</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="quick-actions-card">
            <h3 className="card-inner-title">{d.quickActions}</h3>

            <div className="quick-actions-button-grid">
              <button
                className="action-button-item"
                onClick={() =>
                  navigate("/dashboard/resident/certificates", {
                    state: { successUser, division: userDivision },
                  })
                }
              >
                <div className="action-left-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <circle cx="12" cy="11" r="3"></circle>
                  </svg>
                </div>
                <span>{d.requestCert}</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button
                className="action-button-item"
                onClick={() =>
                  navigate("/dashboard/resident/appointments", {
                    state: { successUser, division: userDivision },
                  })
                }
              >
                <div className="action-left-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <span>{d.bookApp}</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button
                className="action-button-item"
                onClick={() =>
                  navigate("/dashboard/resident/allowances", {
                    state: { successUser, division: userDivision },
                  })
                }
              >
                <div className="action-left-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                  >
                    <rect
                      x="2"
                      y="4"
                      width="20"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                </div>
                <span>{d.applyAllow}</span>
                <span className="action-right-arrow">➔</span>
              </button>

              <button
                className="action-button-item"
                onClick={() =>
                  navigate("/dashboard/resident/disaster", {
                    state: { successUser, division: userDivision },
                  })
                }
              >
                <div className="action-left-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 22h20L12 2z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                  </svg>
                </div>
                <span>{d.disasterRelief}</span>
                <span className="action-right-arrow">➔</span>
              </button>
            </div>
          </div>

          {/* Announcements Card */}
          <div className="dashboard-announcements-card">
            <div className="announcements-card-header">
              <h3 className="card-inner-title" style={{ margin: 0 }}>
                {d.announcements}
              </h3>
              <span
                className="view-all-link"
                style={{ cursor: "pointer" }}
                onClick={() => alert("Announcements feed is displayed below.")}
              >
                {d.viewAll}
              </span>
            </div>

            <div className="announcements-rows-list">
              {announcements.length > 0 ? (
                announcements.map((item, idx) => (
                  <div
                    key={item.announcement_id || idx}
                    className="announcement-row-item"
                    style={{
                      height: "auto",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="announcement-left-group"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        className="announcement-icon-bullet"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        </svg>
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <span
                          className="announcement-title-txt"
                          style={{
                            display: "block",
                            fontWeight: "800",
                            color: "#1e293b",
                          }}
                        >
                          {item.title}
                        </span>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <div
                      className="announcement-right-group"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "4px",
                      }}
                    >
                      <span
                        className="announcement-date"
                        style={{ fontSize: "11.5px", color: "#64748b" }}
                      >
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "2026-05-15"}
                      </span>
                      <span
                        className="announcement-tag"
                        style={{
                          fontSize: "10px",
                          background: "#fef3c7",
                          color: "#d97706",
                          padding: "2px 8px",
                          borderRadius: "50px",
                          fontWeight: "750",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="announcement-row-item">
                    <div className="announcement-left-group">
                      <span className="announcement-icon-bullet">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        </svg>
                      </span>
                      <span className="announcement-title-txt">{d.camp}</span>
                    </div>
                    <div className="announcement-right-group">
                      <span className="announcement-date">April 10, 2026</span>
                      <span className="announcement-tag">{d.campTag}</span>
                    </div>
                  </div>
                  <div className="announcement-row-placeholder"></div>
                  <div className="announcement-row-placeholder"></div>
                  <div className="announcement-row-placeholder"></div>
                </>
              )}
            </div>
          </div>

          {/* Floating Help Trigger */}
          <button
            className="floating-dashboard-help"
            aria-label="Help Trigger"
            onClick={onOpenHelp}
          >
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <footer
        className="landing-footer"
        style={{ padding: "16px 64px", borderTop: "none" }}
      >
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ResidentDashboard;
