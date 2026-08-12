import React from "react";

export default function DashboardLogo({ size = "md", className = "" }) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Visual Emblem Badge: Graduation Cap + Neural Brain AI Sparkles */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-[#1B332C] p-2 text-[#E8C547] shadow-[0_4px_12px_rgba(27,51,44,0.25)] border border-[#C4952A]/40 transition-transform duration-300 hover:scale-105 ${iconSizes[size] || iconSizes.md}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full"
        >
          {/* Graduation Cap Base & Top */}
          <path
            d="M12 3L2 8L12 13L22 8L12 3Z"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-[#E8C547]"
          />
          <path
            d="M5 9.5V15.5C5 15.5 8.5 18 12 18C15.5 18 19 15.5 19 15.5V9.5"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-[#D9A62B]"
          />
          {/* Cap Tassel */}
          <path
            d="M20 9V14"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="stroke-[#E8C547]"
          />
          <circle cx="20" cy="14.5" r="1" fill="#E8C547" />

          {/* AI Neural Circuit Nodes inside Cap */}
          <circle cx="12" cy="8" r="1.5" fill="#E8C547" />
          <line x1="12" y1="8" x2="8" y2="6" stroke="#E8C547" strokeWidth="1" />
          <line x1="12" y1="8" x2="16" y2="6" stroke="#E8C547" strokeWidth="1" />
          <line x1="12" y1="8" x2="12" y2="13" stroke="#E8C547" strokeWidth="1" />
        </svg>

        {/* Floating AI Sparkle Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C547] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9A62B]"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-['Kalam'] text-xl font-bold tracking-tight text-[#1B332C] leading-none">
            AIFinity
          </span>
          <span className="rounded px-1.5 py-0.5 text-[10px] font-['Space_Mono'] font-bold uppercase tracking-wider bg-[#1B332C] text-[#E8C547]">
            AI Studio
          </span>
        </div>
        <span className="text-[10px] font-['Space_Mono'] uppercase tracking-widest text-[#5B6B5F] mt-0.5">
          Smart Learning Dashboard
        </span>
      </div>
    </div>
  );
}
