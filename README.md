# SmartGN - Digital Grama Niladhari Service Management System

SmartGN is an online platform designed to modernize village administration using digital solutions.
It enables Grama Niladhari officers and community members to access and manage services efficiently through a user-friendly and well-organized system.

---

## Project Overview

SmartGN provides a centralized platform where residents and Grama Niladhari officers can interact digitally.

The system allows:

* Resident registration and profile management
* Grama Niladhari account access
* Certificate request management
* Appointment booking
* Government allowance applications
* Disaster support requests
* Village announcements
* AI chatbot guidance
* Multi-language support

---

## Main Features

### Resident Features

* Register using NIC details
* Login securely
* Manage household information
* Add family member details
* Request certificates
* Book appointments with Grama Niladhari
* Apply for government allowances
* Submit disaster assistance requests
* Receive announcements

### Grama Niladhari Features

* Login using provided credentials
* Verify resident registrations
* Approve or reject certificate requests
* Manage appointments
* Publish village announcements
* Review allowance eligibility
* Handle disaster support requests
* Monitor village information

### Admin Features

* Manage Grama Niladhari accounts
* Add or remove users
* Maintain system operations
* Resolve platform issues

---

## AI Chatbot Integration

The system includes one AI chatbot that supports:

* Sinhala language
* Tamil language
* English language

The chatbot provides:

* Registration guidance
* System usage instructions
* Service explanations
* Resident assistance
* Grama Niladhari assistance

---

## Technologies Used

* HTML
* CSS
* JavaScript
* GitHub
* Figma
* Database Management System

---

## System Modules

1. User Registration Module
2. Authentication Module
3. Resident Management Module
4. Certificate Request Module
5. Appointment Management Module
6. Announcement Module
7. Allowance Management Module
8. Disaster Support Module
9. AI Chatbot Module
10. Admin Management Module

---

## Project Goal

The goal of SmartGN is to digitize Grama Niladhari services and improve communication between residents and village officers.

This platform reduces paperwork and improves accessibility for village-level administration.

---

## 📁 Project Structure

```text
smartgn/
├── client/                    # React Frontend
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/                # Images, icons, fonts
│   ├── components/            # Reusable UI Components
│   │   ├── common/
│   │   ├── layout/
│   │   └── chatbot/
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── LangContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   ├── i18n/
│   │   ├── en.json
│   │   ├── si.json
│   │   └── ta.json
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── resident/
│   │   ├── gn/
│   │   └── admin/
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── certificateService.js
│   │   ├── appointmentService.js
│   │   ├── allowanceService.js
│   │   └── disasterService.js
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── validators.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/                    # Node.js + Express Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docs/                      # Project Documentation
├── README.md
├── .gitignore
└── package.json
```

## 👥 Team Collaboration

This project is developed collaboratively using GitHub.

### Workflow

```text
main
│
└── develop
     │
     ├── feature/authentication
     ├── feature/dashboard
     ├── feature/appointments
     ├── feature/certificates
     ├── feature/chatbot
     └── feature/admin-panel
```

- All team members work on separate feature branches.
- Changes are submitted through Pull Requests.
- Code is reviewed before merging into the `develop` branch.
- Only tested and stable code is merged into the `main` branch.
---

## [Click here to see our Figma Design](https://www.figma.com/design/0DP18Q3Lb3On3EAlbc4lFL/SmartGN?node-id=0-1&t=IHolQj4QQj0MT4Kj-1)

---

## 👥 Module Assignment & Component Responsibilities

To ensure clear development ownership, the frontend pages, components, and backend route handlers are mapped below to the respective team members, aligning with the core modules from the project proposal. (This is the random future plan to create the pages it might be changed) 

### 📋 Overall Assignment Table

| Module ID | Module Name | Responsible Member | Student Index | Frontend Pages & Components | Backend Route Files |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **User Authentication & Identity** | Mogith | - [RoleSelection.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/RoleSelection.jsx)<br>- [ResidentLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentLogin.jsx)<br>- [OfficerLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerLogin.jsx)<br>- [AdminLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminLogin.jsx)<br>- [Register.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Register.jsx)<br>- [Success.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Success.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Auth/Registration)* |
| **2** | **Resident & Family Management** | Achini | - [ResidentProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentProfile.jsx)<br>- [OfficerProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerProfile.jsx)<br>- [ResidentDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDashboard.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Profile APIs)* |
| **3** | **Divisional & Household Management** | Janith | - [ResidentHousehold.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentHousehold.jsx)<br>- [OfficerHouseholdDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerHouseholdDetails.jsx) | - [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) *(Household endpoints)* |
| **4** | **Digital Certificate Service** | Mogith | - [ApplyCharacterCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyCharacterCertificate.jsx)<br>- [ApplyIncomeCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyIncomeCertificate.jsx)<br>- [ResidentCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentCertificates.jsx)<br>- [OfficerCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificates.jsx)<br>- [OfficerCertificateDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificateDetails.jsx) | - [certificates.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/certificates.js) |
| **5** | **Government Allowance & Welfare** | Achini | - [ResidentAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAllowances.jsx)<br>- [OfficerAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAllowances.jsx) | - [allowances.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/allowances.js) |
| **6** | **Appointment & Meeting Scheduler** | Janith | - [ResidentAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAppointments.jsx)<br>- [OfficerAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAppointments.jsx) | - [appointments.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/appointments.js) |
| **7** | **Disaster & Emergency Relief** | Achini | - [ResidentDisasterReport.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDisasterReport.jsx)<br>- [OfficerDisasterReports.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDisasterReports.jsx) | - [disasters.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/disasters.js) |
| **8** | **AI Chatbot & Information** | Mogith | - [LandingPage.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/LandingPage.jsx)<br>- [Chatbot.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/Chatbot.jsx)<br>- [LanguageSelector.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/LanguageSelector.jsx) | - *Integrations across routes* |
| **9** | **Village Asset & Admin** | Janith | - [AdminDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminDashboard.jsx)<br>- [OfficerDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDashboard.jsx) | - [announcements.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/announcements.js) |

### 🛠️ Detailed Component & Route Tasks Breakdowns

#### 1. User Authentication and Identity (Mogith)
* **Frontend Components:**
  * [RoleSelection.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/RoleSelection.jsx): Select user role entry-point before redirecting to individual log-in screens.
  * [ResidentLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentLogin.jsx) / [OfficerLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerLogin.jsx) / [AdminLogin.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminLogin.jsx): Input fields, authentication requests handling, error messages, storage of JWT session tokens in localStorage.
  * [Register.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Register.jsx): Multi-step form for user creation including NIC front/back file attachment logic.
  * [Success.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/Success.jsx): Dynamic completion feedback state indicator.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js): Login validation handlers, database queries, password hashing (`bcrypt`), JWT creation, OTP mailer integration helper.

#### 2. Resident and Family Management (Achini)
* **Frontend Components:**
  * [ResidentProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentProfile.jsx): Allows residents to configure their credentials, upload avatar, review registered properties, and declare family member records.
  * [OfficerProfile.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerProfile.jsx): Grama Niladhari profile page with contact detail management tools.
  * [ResidentDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDashboard.jsx): Displays summaries of requests, appointments, alerts, and navigation links.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) / [server.js](file:///d:/SmartGn-Anti/SmartGN/backend/server.js): API endpoints for updating profile, appending/deleting family members under matching parent NIC.

#### 3. Divisional and Household Management (Janith)
* **Frontend Components:**
  * [ResidentHousehold.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentHousehold.jsx): Section for household metadata registration, residential proof list, and head of household matching details.
  * [OfficerHouseholdDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerHouseholdDetails.jsx): Administrative division filters allowing matching GNs to see all registered households, verify residents list under divisions, search by Household No.
* **Backend Routers:**
  * [auth.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/auth.js) (Shared): Database integration queries for listing/updating household and divisional relationships.

#### 4. Digital Certificate Service (Mogith)
* **Frontend Components:**
  * [ApplyCharacterCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyCharacterCertificate.jsx) / [ApplyIncomeCertificate.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ApplyIncomeCertificate.jsx): Interactive online submission forms with conditional file attachments (employment/revenue proof, character declarations).
  * [ResidentCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentCertificates.jsx): Tabbed lists tracking status of submissions: *Pending*, *Approved*, and *Rejected*. Includes download action links.
  * [OfficerCertificates.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificates.jsx): Division list of incoming applications sorted chronologically.
  * [OfficerCertificateDetails.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerCertificateDetails.jsx): Officer panel enabling PDF preview of credentials, approval toggle, reject comments panel, and automated digital certificate generation.
* **Backend Routers:**
  * [certificates.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/certificates.js): Route handlers to process new submissions, retrieve requests filterable by status/officer division, update review records, upload documents, and generate certificate documents.

#### 5. Government Allowance and Welfare (Achini)
* **Frontend Components:**
  * [ResidentAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAllowances.jsx): Form to apply for Aswesuma/Samurdhi, file/income detail declarations, status history tracking list.
  * [OfficerAllowances.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAllowances.jsx): Dashboard for managing welfare benefits. Allows GNs to check application details, verify income status, search applicants, toggle approval, and configure custom allowance programs.
* **Backend Routers:**
  * [allowances.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/allowances.js): CRUD API endpoints for managing allowance applications, registering new welfare program categories, querying beneficiary data.

#### 6. Appointment and Meeting Scheduler (Janith)
* **Frontend Components:**
  * [ResidentAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentAppointments.jsx): Request appointment form (select date, time slot, write details) with active scheduler calendar displaying slots availability.
  * [OfficerAppointments.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerAppointments.jsx): Management calendar showing upcoming bookings, action buttons to confirm/cancel/reschedule with feedback dialog.
* **Backend Routers:**
  * [appointments.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/appointments.js): Calendar-check query helper endpoints, appointment requests validation routes, notification alerts trigger hook.

#### 7. Disaster and Emergency Relief (Achini)
* **Frontend Components:**
  * [ResidentDisasterReport.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/ResidentDisasterReport.jsx): Submit disaster alerts, specify affected resources (damage description, severity level), track aid request statuses.
  * [OfficerDisasterReports.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDisasterReports.jsx): Relief dashboard listing incidents by category/location, update logistics and financial relief allocations.
* **Backend Routers:**
  * [disasters.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/disasters.js): Incident reporting logic, coordinates/relatives associations, relief distributions tracking APIs.

#### 8. AI Chatbot and Information (Mogith)
* **Frontend Components:**
  * [LandingPage.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/LandingPage.jsx): Entry dashboard featuring welcome headers, site overview sliders, quick navigation links.
  * [Chatbot.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/Chatbot.jsx): Floatable overlay chat widget allowing interactive text input, fetching responses from automated knowledge base APIs.
  * [LanguageSelector.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/components/LanguageSelector.jsx): Dropdown widget storing selected translation locale state (en/si/ta) dynamically mapping visual components string keys.
* **Backend Routers:**
  * Chatbot response query processors, session tracking endpoints, Knowledge base retrieval system.

#### 9. Village Asset and Admin (Janith)
* **Frontend Components:**
  * [AdminDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/AdminDashboard.jsx): Statistics counters (active registrations, approved certificates), audit history table, officer profiles management dashboard.
  * [OfficerDashboard.jsx](file:///d:/SmartGn-Anti/SmartGN/GN/src/pages/OfficerDashboard.jsx): GN management workspace with divisional resources status charts, activity logs, summary stats.
* **Backend Routers:**
  * [announcements.js](file:///d:/SmartGn-Anti/SmartGN/backend/routes/announcements.js): Route handlers to fetch regional announcements, publish new entries with severity rating, modify/retire outdated notices.

---

## Contributors

* Janith [GitHub](https://github.com/janith230528)
* Mogith [GitHub](https://github.com/Mogith-Code)
* Achini [GitHub](https://github.com/Achini-Mekala)

---

## License

This project is developed for educational purposes.
