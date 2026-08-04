import React from "react";

function ChatbotIcon({
  size = 24,
  strokeColor = "currentColor",
  strokeWidth = 2.5,
  className = "",
  responsive = true,
}) {
  // Responsive size mapping
  const getResponsiveSize = () => {
    if (!responsive) return size;

    // If size is passed as a number, use it as base and scale responsively
    const baseSize = size;
    return {
      mobile: Math.max(baseSize * 0.7, 16), // 70% of base, minimum 16px
      tablet: baseSize * 0.85, // 85% of base
      desktop: baseSize, // 100% of base
    };
  };

  const sizes = getResponsiveSize();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`
        ${className}
        ${responsive ? "w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px]" : ""}
        transition-all duration-200
        flex-shrink-0
      `}
    >
      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
      <circle cx="12" cy="5" r="2"></circle>
      <path d="M12 7v4"></path>
      <line x1="8" y1="16" x2="8" y2="16"></line>
      <line x1="16" y1="16" x2="16" y2="16"></line>
    </svg>
  );
}

export default ChatbotIcon;
