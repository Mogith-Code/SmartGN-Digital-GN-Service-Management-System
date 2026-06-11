import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage.jsx'
import RAppointment from './Pages/RAppointment.jsx';
import Login from './Pages/Login.jsx';
import RHousehold from './Pages/RHousehold.jsx';
import Register from './Pages/Registration.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/RHousehold" element={<RHousehold />} />
      </Routes>
    </Router>
  );
}

export default App;
