import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1B365D] px-[100px] py-5 max-lg:px-8 max-md:px-4 z-1000">
      <div className="w-full flex items-center justify-between gap-8 max-md:flex-col max-md:text-center">
        {/* RIGHTS CONTAINER - Copyright Text */}
        <div className="flex-shrink-0">
          <p className="text-[16px] font-regular text-[#F7FAFC8D]">
            © {currentYear} SmartGN. All rights reserved.
          </p>
        </div>

        {/* CONTACT CONTAINER - Admin Support Information */}
        <div className="flex flex-col items-start gap-1 max-md:items-center">
          {/* Admin Support Title */}
          <p className="text-[16px] font-medium text-[#F7FAFC]">
            Admin Support:
          </p>

          {/* Mobile Number */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-regular text-[#F7FAFC]">
              Mobile:
            </span>
            <a
              href="tel:+94255731913"
              className="text-[14px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
            >
              0255731913
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-regular text-[#F7FAFC]">
              Email:
            </span>
            <a
              href="mailto:Admin@gmail.com"
              className="text-[14px] font-normal text-[#F7FAFC] hover:text-white hover:underline transition-all duration-300"
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
