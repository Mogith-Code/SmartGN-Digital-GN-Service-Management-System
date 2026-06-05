import React from 'react'
import Navbar from '../Components/LandingPage/Navbar';
import Services from '../Components/LandingPage/Services';
import About from './About';


// LANDING PAGE COMPONENT
// Main landing page that includes navbar, hero section, about, services and footer
function LandingPage() {
   
  // COMPONENT RENDER
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <Navbar />
        <About />
        <Services />
        
        

        {/* MAIN CONTENT SECTION - Home, About, Services will be added here    */}
        {/* TODO: Add Home, About, Services components here */}
    </div>
  )
}

export default LandingPage