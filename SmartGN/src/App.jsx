import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/Common/ProtectedRoute";
import Unauthorized from "./Pages/Unauthorized";

// Page Imports
import LandingPage from "./Pages/LandingPage.jsx";
import RAppointment from "./Pages/RAppointment.jsx";
import BookingForm from "./Components/AppointmentsPage/BookingForm.jsx";
import Login from "./Pages/Login.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
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
import RejectedCertificates from "./Pages/RejectedCertificates.jsx";
import PendingCertificates from "./Pages/PendingCertificates.jsx";
import ApprovedCertificates from "./Pages/ApprovedCertificates.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import Chatbot from "./Components/Chatbox.jsx";
import EditFamilyDetails from "./Components/Family&HouseholdPage/EditFamilyDetails.jsx";
import EditHouseholdDetails from "./Components/Family&HouseholdPage/EditHouseholdDetails.jsx";
import ResidentsDetails from "./Pages/ResidentsDetails.jsx";
import OfficerPendingAppointment from "./Components/AppointmentsPage/OfficerPendingAppointment.jsx";
import OfficerApprovedAppointment from "./Components/AppointmentsPage/OfficerApprovedAppointment.jsx";
import RequestsForTommorow from "./Components/AppointmentsPage/RequestsForTommorow.jsx";
import ResidentDashboard from "./Pages/ResidentDashboard.jsx";
import OfficerDashboard from "./Pages/OfficerDashboard.jsx";
import ResidentAllowances from "./Pages/ResidentAllowances.jsx";
import OfficerAllowances from "./Pages/OfficerAllowances.jsx";
import ResidentDisasterReport from "./Pages/ResidentDisasterReport.jsx";
import OfficerDisasterReports from "./Pages/OfficerDisasterReport.jsx";
import OfficerAnnouncements from "./Pages/OfficerAnnouncements.jsx";
import Success from "./Pages/Success.jsx";
import CertificateSuccess from "./Pages/CertificateSuccess.jsx";
import ProfileDetails from "./Components/ResidentsDetails/ProfileDetails.jsx";
import EditAppoinment from "./Components/AppointmentsPage/EditAppoinment.jsx";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const openChatbot = () => setIsChatbotOpen(true);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<LandingPage onOpenHelp={openChatbot} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ============================================
              RESIDENT ONLY ROUTES
              ============================================ */}

          {/* Resident Dashboard */}
          <Route
            path="/ResidentDashboard"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentDashboard onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Profile */}
          <Route
            path="/ResidentDashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentProfile onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/resident/profile"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentProfile onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/profile"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentProfile onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Appointments */}
          <Route
            path="/ResidentDashboard/RAppointment"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <RAppointment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/Bookingform"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <BookingForm onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/BookingForm"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <BookingForm onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RAppointment/BookingForm"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <BookingForm onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RAppointment/PendingAppointmentRequests"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <PendingAppointmentRequests onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RAppointment/PendingAppointmentRequests/EditAppointment/:id"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <EditAppoinment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RAppointment/ApprovedAppointmentRequests"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ApprovedAppointmentsRequests onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Household */}
          <Route
            path="/ResidentDashboard/RHousehold"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <RHousehold onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RHousehold/EditFamilyDetails"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <EditFamilyDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/RHousehold/EditHouseholdDetails"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <EditHouseholdDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Certificates */}
          <Route
            path="/ResidentDashboard/certificates"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RCertificates"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/apply-character"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ApplyCharacterCertificate onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/apply-income"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ApplyIncomeCertificate onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/rejected"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <RejectedCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/pending"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <PendingCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/approved"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ApprovedCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentDashboard/certificates/success"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <CertificateSuccess onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Allowances */}
          <Route
            path="/ResidentDashboard/allowances"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentAllowances onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/resident/allowances"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentAllowances onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Resident Disaster Relief */}
          <Route
            path="/ResidentDashboard/disaster-relief"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentDisasterReport onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disaster-relief"
            element={
              <ProtectedRoute allowedRoles={["RESIDENT"]}>
                <ResidentDisasterReport onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              OFFICER ONLY ROUTES
              ============================================ */}

          {/* Officer Dashboard */}
          <Route
            path="/OfficerDashboard"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerDashboard onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/officer"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerDashboard onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Profile */}
          <Route
            path="/OfficerDashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerProfile onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/officer/profile"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerProfile onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Appointments */}
          <Route
            path="/OfficerDashboard/OfficerAppointment"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerAppointment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerAppointment"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerAppointment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/OfficerPendingAppointment"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerPendingAppointment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/OfficerApprovedAppointment"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerApprovedAppointment onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/RequestsForTomorrow"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <RequestsForTommorow onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/OfficerApprovedAppointment/profile/:nic"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ProfileDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/OfficerPendingAppointment/profile/:nic"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ProfileDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/RequestsForTomorrow/profile/:nic"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ProfileDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/OfficerAppointment/profile/:nic"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ProfileDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Residents */}
          <Route
            path="/OfficerDashboard/ResidentsDetails"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ResidentsDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ResidentsDetails"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ResidentsDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/officer/residents"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ResidentsDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/ResidentsDetails/profile/:nic"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <ProfileDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Certificates */}
          <Route
            path="/OfficerDashboard/Certificates"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerCertificates onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OfficerDashboard/certificates/:id"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerCertificateDetails onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Allowances */}
          <Route
            path="/OfficerDashboard/allowances"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerAllowances onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Disasters */}
          <Route
            path="/OfficerDashboard/disasters"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerDisasterReports onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* Officer Announcements */}
          <Route
            path="/OfficerDashboard/announcements"
            element={
              <ProtectedRoute allowedRoles={["OFFICER"]}>
                <OfficerAnnouncements onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              ADMIN ONLY ROUTES
              ============================================ */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard onOpenHelp={openChatbot} />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              Catch-all route for 404
              ============================================ */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <a
                    href="/"
                    className="mt-6 inline-block text-[#1B365D] hover:underline"
                  >
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
