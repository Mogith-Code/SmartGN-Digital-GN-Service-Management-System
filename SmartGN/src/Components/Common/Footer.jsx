// src/components/Footer.jsx
import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1B365D] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5">
      <div className="w-full flex items-center justify-between gap-4 sm:gap-6 md:gap-8 max-md:flex-col max-md:text-center">
        {/* ==================================================================== */}
        {/* RIGHTS CONTAINER - Copyright Text */}
        {/* ==================================================================== */}
        <div className="flex-shrink-0">
          <p className="text-xs sm:text-sm md:text-base lg:text-[16px] font-regular text-[#F7FAFC8D]">
            © {currentYear} SmartGN. All rights reserved.
          </p>
        </div>

        {/* ==================================================================== */}
        {/* CONTACT CONTAINER - Admin Support Information */}
        {/* ==================================================================== */}
        <div className="flex flex-col items-start gap-1 max-md:items-center">
          {/* Admin Support Title */}
          <p className="text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-[#F7FAFC]">
            Admin Support:
          </p>

          {/* Mobile Number */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm md:text-[14px] font-regular text-[#F7FAFC]">
              Mobile:
            </span>
            <a
              href="tel:+94255731913"
              className="text-xs sm:text-sm md:text-[14px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
            >
              0255731913
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm md:text-[14px] font-regular text-[#F7FAFC]">
              Email:
            </span>
            <a
              href="mailto:warapitiyalakshan@gmail.com"
              className="text-xs sm:text-sm md:text-[14px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300 break-all sm:break-normal"
            >
              warapitiyalakshan@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
