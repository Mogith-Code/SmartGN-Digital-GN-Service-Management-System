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