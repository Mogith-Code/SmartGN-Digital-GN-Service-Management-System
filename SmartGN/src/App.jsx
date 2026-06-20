import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import RAppointment from "./Pages/RAppointment.jsx";
import BookingForm from "./Components/AppointmentsPage/BookingForm.jsx";
import Login from "./Pages/Login.jsx";
import RHousehold from "./Pages/RHousehold.jsx";
import Register from "./Pages/Registration.jsx";
import ResidentProfile from "./Pages/ResidentProfile.jsx";
import OfficerProfile from "./Pages/OfficerProfile.jsx";
import OfficerCertificates from "./Pages/OfficerCertificates.jsx";
import OfficerCertificateDetails from "./Pages/OfficerCertificateDetails.jsx";
import ResidentCertificates from "./Pages/RCertificates.jsx";
import ApplyCharacterCertificate from "./Pages/ApplyCharacterCertificate.jsx";
import ApplyIncomeCertificate from "./Pages/ApplyIncomeCertificate.jsx";
import PendingAppointmentRequests from "./Components/AppointmentsPage/PendingAppointmentRequests.jsx";
import ApprovedAppointmentsRequests from "./Components/AppointmentsPage/ApprovedAppointmentsRequests.jsx";
import OfficerAppointment from "./Pages/OfficerAppointment.jsx";
import OfficerHousehold from "./Pages/OfficerHousehold.jsx";
import RejectedCertificates from "./Pages/RejectedCertificates.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
        <Route path="/OfficerAppointment" element={<OfficerAppointment />} />
        <Route path="/OfficerHousehold" element={<OfficerHousehold />} />
        <Route path="/RAppointment/BookingForm" element={<BookingForm />} />
        <Route
          path="/RAppointment/PendingAppointmentRequests"
          element={<PendingAppointmentRequests />}
        />
        <Route
          path="/RAppointment/ApprovedAppointmentRequests"
          element={<ApprovedAppointmentsRequests />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/RHousehold" element={<RHousehold />} />
        <Route path="/dashboard/resident" element={<ResidentProfile />} />
        <Route path="/dashboard/officer" element={<OfficerProfile />} />
        <Route
          path="/dashboard/officer/certificates"
          element={<OfficerCertificates />}
        />
        <Route
          path="/dashboard/officer/certificates/:id"
          element={<OfficerCertificateDetails />}
        />

        <Route path="/profile" element={<ResidentProfile />} />
        <Route path="/certificates" element={<ResidentCertificates />} />
        <Route
          path="/dashboard/resident/certificates"
          element={<ResidentCertificates />}
        />
        <Route
          path="/dashboard/resident/certificates/apply-character"
          element={<ApplyCharacterCertificate />}
        />
        <Route
          path="/dashboard/resident/certificates/apply-income"
          element={<ApplyIncomeCertificate />}
        />
        <Route
          path="/dashboard/resident/certificates/rejected"
          element={<RejectedCertificates />}
        />
      </Routes>
    </Router>
  );
}

export default App;
