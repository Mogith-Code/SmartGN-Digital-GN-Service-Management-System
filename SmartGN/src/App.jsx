import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import RAppointment from "./Pages/RAppointment.jsx";
import Login from "./Pages/Login.jsx";
import RHousehold from "./Pages/RHousehold.jsx";
import Register from "./Pages/Registration.jsx";
import ResidentProfile from "./Pages/ResidentProfile.jsx";
import OfficerProfile from "./Pages/OfficerProfile.jsx";
import ResidentCertificates from "./Pages/RCertificates.jsx";
import BookingForm from "./Components/AppointmentsPage/BookingForm.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
        <Route path="/RAppointment/BookingForm" element={<BookingForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/RHousehold" element={<RHousehold />} />
        <Route path="/dashboard/resident" element={<ResidentProfile />} />
        <Route path="/dashboard/officer" element={<OfficerProfile />} />
        <Route path="/profile" element={<ResidentProfile />} />
        <Route path="/certificates" element={<ResidentCertificates />} />
        <Route
          path="/dashboard/resident/certificates"
          element={<ResidentCertificates />}
        />
      </Routes>
    </Router>
  );
}

export default App;
