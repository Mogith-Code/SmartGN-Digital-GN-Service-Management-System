// src/components/Services.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Import icons
import requestIcon from "../../assets/license_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import appointmentIcon from "../../assets/calendar_today_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import trackIcon from "../../assets/list_alt_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import arrowIcon from "../../assets/arrow_forward_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import allowanceIcon from "../../assets/edit_document_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import disasterIcon from "../../assets/flood_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import announcementIcon from "../../assets/brand_awareness_24dp_D69E2E_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";

function Services() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // TRANSLATION OBJECTS
  const servicesTranslations = {
    EN: { Title: "Appointments" },
    SI: { Title: "හමුවවීම්" },
    TA: { Title: "சந்திப்புகள்" },
  };

  const t = servicesTranslations[lang] || servicesTranslations.EN;

  // Navigation handler functions
  const handleRequestCertificates = () => {
    console.log("Navigating to Request Certificates page");
    // navigate("/services/request-certificates");
  };

  const handleBookAppointments = () => {
    console.log("Navigating to Book Appointments page");
    // navigate("/services/book-appointments");
  };

  const handleTrackRequests = () => {
    console.log("Navigating to Track Requests page");
    // navigate("/services/track-requests");
  };

  const handleApplyAllowances = () => {
    console.log("Navigating to Apply for Allowances page");
    // navigate("/services/apply-for-allowances");
  };

  const handleDisasterRelief = () => {
    console.log("Navigating to Disaster Relief page");
    // navigate("/services/disaster-relief");
  };

  const handleAnnouncements = () => {
    console.log("Navigating to Announcements page");
    // navigate("/services/announcements");
  };

  return (
    <section
      id="services"
      className="w-full bg-[#F7FAFC] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-[60px] flex justify-center items-center"
    >
      <div className="w-full max-w-7xl flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
        {/* ==================================================================== */}
        {/* TEXT CONTAINER - Title Section */}
        {/* ==================================================================== */}
        <div className="w-full text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[32px] font-semibold text-[#1B365D] tracking-tight">
            Services You Can Get
          </h2>
        </div>

        {/* ==================================================================== */}
        {/* CARD CONTAINER - Grid Layout with Clickable Cards */}
        {/* ==================================================================== */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* ================================================================ */}
          {/* CARD 1: Request Certificates */}
          {/* ================================================================ */}
          <div
            onClick={handleRequestCertificates}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleRequestCertificates();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            {/* Left Column: Icon */}
            <img
              src={requestIcon}
              alt="Request Certificates icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />

            {/* Right Column: Title + Description */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Request Certificates
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Apply for character certificates, income certificates and more
                with digital verification.
              </p>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 2: Book Appointments */}
          {/* ================================================================ */}
          <div
            onClick={handleBookAppointments}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleBookAppointments();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            <img
              src={appointmentIcon}
              alt="Book Appointments icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Book Appointments
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Schedule meetings with your Grama Niladhari officer at
                convenient times.
              </p>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 3: Track Requests */}
          {/* ================================================================ */}
          <div
            onClick={handleTrackRequests}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTrackRequests();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            <img
              src={trackIcon}
              alt="Track Requests icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Track Requests
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Check the status of your applications (pending, approved, or
                require further information).
              </p>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 4: Apply for Allowances */}
          {/* ================================================================ */}
          <div
            onClick={handleApplyAllowances}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleApplyAllowances();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            <img
              src={allowanceIcon}
              alt="Apply for Allowances icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Apply for Allowances
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Register for Aswesuma, Samurdhi and other government allowance
                programs.
              </p>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 5: Disaster Relief */}
          {/* ================================================================ */}
          <div
            onClick={handleDisasterRelief}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDisasterRelief();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            <img
              src={disasterIcon}
              alt="Disaster Relief icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Disaster Relief
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Report disaster damage and apply for government relief
                assistance.
              </p>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 6: Announcements */}
          {/* ================================================================ */}
          <div
            onClick={handleAnnouncements}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAnnouncements();
              }
            }}
            className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer"
          >
            <img
              src={announcementIcon}
              alt="Announcements icon"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-[20px] md:h-[20px] min-w-[16px] sm:min-w-[20px] object-contain mt-0.5 sm:mt-1"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-[#2D3748] group-hover:text-[#2c5f8a] transition-colors duration-300">
                  Announcements
                </h3>
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 font-normal leading-relaxed text-left">
                Stay informed with official notices and community announcements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
