import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage.jsx'
import RAppointment from './Pages/RAppointment.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/RAppointment" element={<RAppointment />} />
       </Routes>
    </Router>
    
      
  )
}

export default App

