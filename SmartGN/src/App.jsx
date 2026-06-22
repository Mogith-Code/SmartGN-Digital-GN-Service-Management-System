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
import ResidentAllowances from "./Pages/RAllowances.jsx";
import OfficerAllowances from "./Pages/OfficerAllowances.jsx";
import Chatbot from "./Components/Chatbox.jsx";
import EditFamilyDetails from "./Components/Family&HouseholdPage/EditFamilyDetails.jsx";
import EditHouseholdDetails from "./Components/Family&HouseholdPage/EditHouseholdDetails.jsx";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const openChatbot = () => setIsChatbotOpen(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onOpenHelp={openChatbot} />} />
        <Route
          path="/RAppointment"
          element={<RAppointment onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/appointments"
          element={<RAppointment onOpenHelp={openChatbot} />}
        />
        <Route
          path="/OfficerAppointment"
          element={<OfficerAppointment onOpenHelp={openChatbot} />}
        />
        <Route
          path="/OfficerHousehold"
          element={<OfficerHousehold onOpenHelp={openChatbot} />}
        />
        <Route
          path="/RAppointment/BookingForm"
          element={<BookingForm onOpenHelp={openChatbot} />}
        />
        <Route
          path="/RAppointment/PendingAppointmentRequests"
          element={<PendingAppointmentRequests onOpenHelp={openChatbot} />}
        />
        <Route
          path="/RAppointment/ApprovedAppointmentRequests"
          element={<ApprovedAppointmentsRequests onOpenHelp={openChatbot} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/RHousehold"
          element={<RHousehold onOpenHelp={openChatbot} />}
        />
        <Route
          path="/RHousehold/EditFamilyDetails"
          element={<EditFamilyDetails onOpenHelp={openChatbot} />}
        />
        <Route
          path="/RHousehold/EditHouseholdDetails"
          element={<EditHouseholdDetails onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident"
          element={<ResidentProfile onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/officer"
          element={<OfficerProfile onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/officer/certificates"
          element={<OfficerCertificates onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/officer/certificates/:id"
          element={<OfficerCertificateDetails onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/officer/allowances"
          element={<OfficerAllowances onOpenHelp={openChatbot} />}
        />

        <Route
          path="/profile"
          element={<ResidentProfile onOpenHelp={openChatbot} />}
        />
        <Route
          path="/certificates"
          element={<ResidentCertificates onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/certificates"
          element={<ResidentCertificates onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/certificates/apply-character"
          element={<ApplyCharacterCertificate onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/certificates/apply-income"
          element={<ApplyIncomeCertificate onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/certificates/rejected"
          element={<RejectedCertificates onOpenHelp={openChatbot} />}
        />
        <Route
          path="/dashboard/resident/allowances"
          element={<ResidentAllowances onOpenHelp={openChatbot} />}
        />
      </Routes>
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </Router>
  );
}

export default App;
