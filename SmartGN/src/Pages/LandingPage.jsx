import React from 'react'
import Navbar from '../Components/LandingPage/Navbar';
import Services from '../Components/LandingPage/Services';
import Footer from '../Components/Common/Footer';
import About from '../Components/LandingPage/About';
import Home from '../Components/LandingPage/Home';

// LANDING PAGE COMPONENT
// Main landing page that includes navbar, hero section, about, services and footer
function LandingPage() {
   
  // COMPONENT RENDER
  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <Navbar />
        <Home />
        <hr className="border border-[#2D37482D]" />
        <About />
        <hr className="border border-[#2D37482D]" />
        <Services />
        <hr className="border border-[#2D37482D]" />
        <Footer />
        
        

        {/* MAIN CONTENT SECTION - Home, About, Services will be added here    */}
        {/* TODO: Add Home, About, Services components here */}
    </div>
  )
}

export default LandingPage