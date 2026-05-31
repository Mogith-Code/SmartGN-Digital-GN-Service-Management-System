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

## Contributors

* Janith [GitHub](https://github.com/janith230528)
* Mogith [GitHub](https://github.com/Mogith-Code)
* Achini [GitHub](https://github.com/Achini-Mekala)

---

## License

This project is developed for educational purposes.
