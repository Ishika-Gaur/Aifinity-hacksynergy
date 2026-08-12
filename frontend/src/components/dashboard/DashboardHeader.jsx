import React, { useState, useEffect } from "react";
import DashboardLogo from "./DashboardLogo";

export default function DashboardHeader({ user, quotes = [] }) {
  const greeting = user?.greeting || "Good evening";
  const name = user?.name || "Learner";
  const subtitle = user?.subtitle || "Here's where your learning journey stands today.";
  const streak = user?.streak ?? 7;

  const defaultQuotes = [
    "Small progress is still progress.",
    "Consistency builds what motivation starts.",
    "Every mistake is a clue.",
    "Understand the why, not just the answer.",
    "Your weak areas are your next opportunities.",
    "Practice turns confusion into confidence.",
    "Keep learning. Keep questioning. Keep improving.",
    "One concept understood deeply is worth ten memorized.",
    "Your mistakes are showing you where to grow.",
    "Progress is built one problem at a time.",
  ];

  const activeQuotes = quotes.length > 0 ? quotes : defaultQuotes;
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  // Automatic quote rotation every 6 seconds with smooth fade transition
  useEffect(() => {
    if (activeQuotes.length <= 1) return;

    const intervalId = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % activeQuotes.length);
        setFadeState(true);
      }, 300); // match transition duration
    }, 6000);

    return () => clearInterval(intervalId);
  }, [activeQuotes.length]);

  return (
    <div className="relative overflow-hidden rounded-md bg-[#FBF8F0] border border-[#2E4F42]/15 p-6 sm:p-8 shadow-[var(--shadow-card)] transition-all duration-300">
      {/* Decorative top chalk gold accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D9A62B] via-[#E8C547] to-[#1B332C]" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left branding, heading & rotating quote */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <DashboardLogo />

          <div className="mt-1">
            <h1 className="font-['Kalam'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B332C] leading-tight">
              {greeting}, {name} 👋
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#24413A] font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* 13. ROTATING QUOTES WITH FADE & SPACE MONO COUNTER */}
          <div className="mt-2 flex items-center gap-3 rounded-md bg-[#EDE6D3]/60 px-4 py-2.5 border border-[#2E4F42]/12 w-fit min-h-[44px]">
            <span className="text-[#C4952A] text-sm shrink-0">✎</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-['Kalam'] text-sm sm:text-base text-[#1B332C] font-semibold transition-opacity duration-300 ${
                  fadeState ? "opacity-100" : "opacity-0"
                }`}
              >
                "{activeQuotes[currentQuoteIndex]}"
              </span>
              <span className="font-['Space_Mono'] text-[10px] font-bold text-[#5B6B5F] bg-[#FBF8F0] px-1.5 py-0.5 rounded border border-[#2E4F42]/10 shrink-0 ml-1">
                {String(currentQuoteIndex + 1).padStart(2, "0")} / {String(activeQuotes.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Streak Badge with Hover Effect */}
        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-3.5 rounded-md bg-[#1B332C] px-5 py-3.5 text-[#FBF8F0] shadow-md border border-[#C4952A]/30 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔥</span>
            <div className="flex flex-col">
              <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#E8C547] font-bold">
                {streak} DAY STREAK
              </span>
              <span className="font-['Space_Mono'] text-[11px] text-[#8B9690] mt-0.5">
                Consistency Multiplier 1.4x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
