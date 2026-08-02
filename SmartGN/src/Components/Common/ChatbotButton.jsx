import React from "react";
import ChatbotIcon from "./ChatbotIcon";

function ChatbotButton({ onOpenHelp }) {
  return (
    <button
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1B365D] via-[#2B548A] to-[#005BBD] text-white rounded-full shadow-[0_10px_25px_rgba(27,54,93,0.4)] hover:shadow-[0_12px_35px_rgba(0,91,189,0.6)] transition-all duration-300 hover:scale-105 border-2 border-[#D69E2E] cursor-pointer group"
      aria-label="Ask SmartGN Assistant"
      onClick={onOpenHelp}
      title="Click to ask SmartGN Digital Assistant"
    >
      <div className="relative flex items-center justify-center">
        <ChatbotIcon
          size={24}
          strokeColor="#FFAA00"
          strokeWidth={2.2}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B365D] rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B365D] rounded-full"></span>
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[11px] font-extrabold text-[#FFAA00] tracking-wide uppercase leading-tight">
          Hi! Need Help?
        </span>
        <span className="text-[13px] font-bold text-white leading-tight">
          Ask SmartGN ➔
        </span>
      </div>
    </button>
  );
}

export default ChatbotButton;
