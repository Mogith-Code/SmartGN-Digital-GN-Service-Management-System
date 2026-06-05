import React from 'react'
function About() {
  return (
     <section 
      id="about" 
      className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:px-[60px] max-md:p-[20px]"
    >
      {/* Two-column layout: about-container (left) and objectives-container (right) */}
      <div className="flex items-start justify-center gap-5 max-md:flex-col">
        
        
        {/* LEFT COLUMN: ABOUT CONTAINER */}
        <div className="w-[580px] max-lg:w-full flex flex-col gap-5 items-center">
          
          {/* TEXT CONTAINER - White background as shown in image */}
          <div className="w-full py-[30px] px-20 bg-[#E2E8F0] border border-[#2D37484D] rounded-[25px] max-md:p-[20px]">
            <h2 className="text-[20px] max-md:text-[16px] text-center font-medium text-[#1B365D] mb-2.5">
              About SmartGN
            </h2>
            <p className="text-[16px] max-md:text-[12px] font-normal text-[#2D3748] text-justify leading-relaxed">
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
              className="w-[285px] max-md:w-[100px] opacity-[50%] h-auto object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="w-[580px] py-[30px] px-20 bg-[#E2E8F0] border border-[#2D37484D] rounded-[25px] max-md:w-full max-md:p-[20px]">
          
          <h2 className="text-[20px] max-md:text-[16px] text-center font-medium text-[#1B365D] mb-2.5">
            Our Objectives
          </h2>

            <ul className="list-disc list-inside text-[16px] font-normal text-[#2D3748] max-md:text-[12px] leading-relaxed">
            <li className="mb-2">
              <strong>Digital Transformation:</strong> Moving manual paperwork and physical registers into a secure, cloud-based management system.</li>
            <li className="mb-2">
              <strong>Service Accessibility:</strong> Ensuring that residents in even the most remote villages can request official documents and aid with a smartphone.</li>
            <li className="mb-2">
              <strong>Enhanced Transparency:</strong> Providing real-time tracking for applications so citizens know exactly when their requests are processed.</li>
            <li className="mb-2">
              <strong>Disaster Readiness:</strong> Establishing a direct digital link for emergency alerts and rapid distribution of relief allowances.</li>
            <li className="mb-2">
              <strong>Inclusivity:</strong> Offering a multilingual interface in Sinhala, Tamil, and English to serve every citizen in Sri Lanka equally.</li>
            </ul>
        </div>
      </div>
    </section>
  )
}

export default About