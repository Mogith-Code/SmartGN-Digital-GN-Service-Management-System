import React from 'react'
// Import icons
import requestIcon from '../../assets/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import appointmentIcon from '../../assets/calendar_today_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import trackIcon from '../../assets/list_alt_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg';
import arrowIcon from '../../assets/arrow_forward_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg';

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
      className="w-full bg-[#F7FAFC] px-[100px] py-[60px] max-lg:px-8 max-md:px-4 flex justify-center items-center"
    >
      <div className="w-full max-w-7xl flex flex-col items-center gap-10">
        
        {/* TEXT CONTAINER - Title Section */}
        <div className="w-full text-center">
          <h2 className="text-[32px] font-semibold text-[#1a3a5c] tracking-tight max-md:text-[28px] max-sm:text-[24px]">
            Services You Can Get
          </h2>
        </div>

        {/* CARD CONTAINER - Grid Layout with 3 Clickable Cards */}
        <div className="w-full grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          
          {/* CARD 1: Request Certificates */}
          <div 
            onClick={handleRequestCertificates}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRequestCertificates();
              }
            }}
            className="flex items-start gap-4 p-8 rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out group cursor-pointer"
          >
            {/* Left Column: Icon */}
            <img 
              src={requestIcon}
              alt="Request Certificates icon"
              className="w-[20px] h-[20px] min-w-[20px] object-contain mt-1"
            />
            
            {/* Right Column: Title + Description */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-2">
                <h3 className="text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Request Certificates
                </h3>
                <img 
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3.5 h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                />
              </div>
              <p className="text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Apply for character certificates, income certificates, permit requests and more with digital verification.
              </p>
            </div>
          </div>

          {/* CARD 2: Book Appointments */}
          <div 
            onClick={handleBookAppointments}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBookAppointments();
              }
            }}
            className="flex items-start gap-4 p-8 rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out group cursor-pointer"
          >
            {/* Left Column: Icon */}
            <img 
              src={appointmentIcon}
              alt="Book Appointments icon"
              className="w-[20px] h-[20px] min-w-[20px] object-contain mt-1"
            />
            
            {/* Right Column: Title + Description */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-2">
                <h3 className="text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Book Appointments
                </h3>
                <img 
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3.5 h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                />
              </div>
              <p className="text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Schedule meetings with your Grama Niladhari officer at convenient times.
              </p>
            </div>
          </div>

          {/* CARD 3: Track Requests */}
          <div 
            onClick={handleTrackRequests}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTrackRequests();
              }
            }}
            className="flex items-start gap-4 p-8 rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out group cursor-pointer"
          >
            {/* Left Column: Icon */}
            <img 
              src={trackIcon}
              alt="Track Requests icon"
              className="w-[20px] h-[20px] min-w-[20px] object-contain mt-1"
            />
            
            {/* Right Column: Title + Description */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-2">
                <h3 className="text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Track Requests
                </h3>
                <img 
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3.5 h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                />
              </div>
              <p className="text-[14px] text-gray-500 font-normal leading-relaxed text-left">
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