import React from 'react'
// Import icons
import requestIcon from '../assets/images/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import appointmentIcon from '../assets/images/calendar_today_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import trackIcon from '../assets/images/list_alt_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import allowanceIcon from '../assets/images/edit_document_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';

function Services() {
  // Navigation handler functions
  const handleRequestCertificates = () => {
    console.log('Navigating to Request Certificates page');
  };

  const handleBookAppointments = () => {
    console.log('Navigating to Book Appointments page');
  };

  const handleTrackRequests = () => {
    console.log('Navigating to Track Requests page');
  };

  return (
    <section 
      id="services" 
      className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:px-8 max-md:px-4"
    >
      <div className="w-full flex flex-col items-center gap-5">
        
        {/* TEXT CONTAINER - Title Section */}
        <div className="w-full text-center">
          <h2 className="text-[40px] font-medium text-[#1a3a5c] max-lg:text-[32px] max-md:text-[28px] max-sm:text-[24px]">
            Services You Can Get
          </h2>
        </div>

        {/* CARD CONTAINER - Grid Layout with Clickable Cards */}
        <div className="w-full grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          
          {/* CARD 1: Request Certificates - Entire Card Clickable */}
          <div 
            onClick={handleRequestCertificates}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRequestCertificates();
              }
            }}
            className="flex flex-col p-[30px] rounded-[25px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] justify-center hover:shadow-[0_20px_35px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
          >
            {/* Title Container */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={requestIcon}
                  alt="Request Certificates icon"
                  className="w-auto h-5 object-contain"
                />
                <h3 className="text-[16px] font-reglar text-[#2D3748] max-sm:text-[14px] group-hover:text-[#2c5f8a]">
                  Request Certificates
                </h3>
              </div>
              <img 
                src={arrowIcon}
                alt="Arrow icon"
                className="w-auto h-[15px] object-contain opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
            {/* Content Container */}
            <div className="mt-[5px] ml-[30px]">
              <p className="text-[14px] font-light text-[#2D3748] leading-relaxed text-justify max-sm:text-[14px]">
                Apply for character certificates, income certificates, permit requests and more with digital verification.
              </p>
            </div>
          </div>

          {/* CARD 2: Book Appointments - Entire Card Clickable */}
          <div 
            onClick={handleBookAppointments}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBookAppointments();
              }
            }}
            className="flex flex-col p-[30px] rounded-[25px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] justify-center hover:shadow-[0_20px_35px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={appointmentIcon}
                  alt="Book Appointments icon"
                  className="w-auto h-5 object-contain"
                />
                <h3 className="text-[16px] font-regular text-[#2D3748] max-sm:text-[14px] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Book Appointments
                </h3>
              </div>
              <img 
                src={arrowIcon}
                alt="Arrow icon"
                className="w-auto h-[15px] object-contain opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
            <div className="mt-[5px] ml-[30px]">
              <p className="text-[14px] font-light text-[#2D3748] leading-relaxed text-justify max-sm:text-[14px]">
                Schedule meetings with your Grama Niladhari officer at convenient times.
              </p>
            </div>
          </div>

          {/* CARD 3: Track Requests - Entire Card Clickable */}
          <div 
            onClick={handleTrackRequests}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTrackRequests();
              }
            }}
            className="flex flex-col p-[30px] rounded-[25px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] justify-center hover:shadow-[0_20px_35px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={trackIcon}
                  alt="Track Requests icon"
                  className="w-auto h-5 object-contain"
                />
                <h3 className="text-[16px] font-regular text-[#2D3748] max-sm:text-[14px] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Track Requests
                </h3>
              </div>
              <img 
                src={arrowIcon}
                alt="Arrow icon"
                className="w-auto h-[15px] object-contain opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
            <div className="mt-[5px] ml-[30px]">
              <p className="text-[14px] font-light text-[#2D3748] leading-relaxed text-justify max-sm:text-[14px]">
                Check the status of your applications (pending, approved, or require further information).
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Services