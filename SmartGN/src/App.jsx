import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage.jsx'
import RAppointment from './Pages/RAppointment.jsx';
import Login from './Pages/Login.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
        <Route path="/login" element={<Login />} />
       </Routes>
    </Router>
    
      
  )
}

export default App

