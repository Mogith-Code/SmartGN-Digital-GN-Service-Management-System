import React from 'react'
function About() {
  return (
     <section 
      id="about" 
      className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:px-8 max-md:px-4"
    >
      /* Two-column layout: about-container (left) and objectives-container (right) */
      <div className="flex items-start justify-center gap-5 max-lg:flex-col max-lg:gap-8">
        
        
        /* LEFT COLUMN: ABOUT CONTAINER */
        <div className="w-[580px] max-lg:w-full flex flex-col gap-5 items-center">
          
          /* TEXT CONTAINER - White background as shown in image */
          <div className="w-full py-[30px] px-20 bg-[#E2E8F0] border border-[#2D37484D] rounded-[25px] max-md:px-6 max-md:py-5">
            <h2 className="text-[20px] text-center font-medium text-[#1B365D] mb-2.5">
              About SmartGN
            </h2>
            <p className="text-[16px] font-normal text-[#2D3748] text-justify leading-relaxed">
              SmartGN is a modern digital initiative designed to transform the traditional 
              Grama Niladhari service into a high-speed, transparent, and user-friendly 
              experience. We aim to bridge the gap between village-level administration 
              and citizens by leveraging the latest technology to ensure every resident 
              can access essential services from the comfort of their home.
            </p>
          </div>
          
          <div className="w-full flex justify-center">
            <img 
              src="/favicon.png"
              alt="SmartGN - Digital Grama Niladhari Service Management System"
              className="w-[285px] opacity-[50%] h-auto object-cover rounded-lg"
            />
          </div>
        </div>