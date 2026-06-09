<<<<<<< HEAD
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage.jsx'
import RAppointment from './Pages/RAppointment.jsx';
import Login from './Pages/Login.jsx';


=======
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import RAppointment from "./Pages/RAppointment.jsx";
import RHousehold from "./Pages/RHousehold.jsx";
>>>>>>> a768290b4b0871ee1a7f8d7fe64352a0d05e793b

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
       </Routes>
=======
        <Route path="/RHousehold" element={<RHousehold />} />
      </Routes>
>>>>>>> a768290b4b0871ee1a7f8d7fe64352a0d05e793b
    </Router>
  );
}

export default App;
