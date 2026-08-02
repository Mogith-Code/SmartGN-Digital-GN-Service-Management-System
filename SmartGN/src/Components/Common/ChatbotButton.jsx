import React, { useState, useEffect, useRef } from "react";
import ChatbotIcon from "./ChatbotIcon";

function ChatbotButton({ onOpenHelp }) {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem("smartgn_bot_btn_pos");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: null, y: null };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialLeft: 0, initialTop: 0, moved: false });
  const buttonRef = useRef(null);

  const startDrag = (clientX, clientY) => {
    const rect = buttonRef.current
      ? buttonRef.current.getBoundingClientRect()
      : { left: window.innerWidth - 200, top: window.innerHeight - 80 };

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const updateDrag = (clientX, clientY) => {
      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        dragStartRef.current.moved = true;
      }

      const buttonWidth = buttonRef.current ? buttonRef.current.offsetWidth : 180;
      const buttonHeight = buttonRef.current ? buttonRef.current.offsetHeight : 60;

      let newX = dragStartRef.current.initialLeft + deltaX;
      let newY = dragStartRef.current.initialTop + deltaY;

      // Bound position cleanly inside viewport
      newX = Math.max(10, Math.min(window.innerWidth - buttonWidth - 10, newX));
      newY = Math.max(10, Math.min(window.innerHeight - buttonHeight - 10, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      updateDrag(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        updateDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleDragEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);

      if (dragStartRef.current.moved) {
        try {
          setPosition((latestPos) => {
            if (latestPos.x !== null) {
              localStorage.setItem("smartgn_bot_btn_pos", JSON.stringify(latestPos));
            }
            return latestPos;
          });
        } catch (e) {}
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  const handleClick = (e) => {
    if (dragStartRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onOpenHelp) onOpenHelp();
  };

  const style =
    position.x !== null && position.y !== null
      ? { left: `${position.x}px`, top: `${position.y}px`, bottom: "auto", right: "auto" }
      : {};

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      style={style}
      className={`fixed z-[100] flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-[#1B365D] via-[#2B548A] to-[#005BBD] text-white rounded-full shadow-[0_10px_25px_rgba(27,54,93,0.4)] hover:shadow-[0_12px_35px_rgba(0,91,189,0.6)] transition-shadow duration-200 border-2 border-[#D69E2E] cursor-grab active:cursor-grabbing group select-none ${
        position.x === null ? "bottom-6 right-6" : ""
      }`}
      aria-label="Ask SmartGN Assistant"
      title="Click to ask SmartGN Digital Assistant • Drag anywhere on page"
    >
      <span className="text-[#FFAA00] opacity-70 group-hover:opacity-100 text-xs font-bold transition-opacity">
        ⠿
      </span>

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
        <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FFAA00] tracking-wide uppercase leading-tight">
          Hi! Need Help?
        </span>
        <span className="text-[12px] sm:text-[13px] font-bold text-white leading-tight">
          Ask SmartGN ➔
        </span>
      </div>
    </button>
  );
}

export default ChatbotButton;
