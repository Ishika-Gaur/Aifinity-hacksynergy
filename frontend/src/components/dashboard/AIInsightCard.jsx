import React from "react";
import { Link } from "react-router-dom";

export default function AIInsightCard({ aiInsight }) {
  const {
    title = "✦ AI LEARNING INSIGHT",
    observation = "You're improving in Binary Search, but your accuracy drops when questions require edge-case handling.",
    recommendationTitle = "RECOMMENDED NEXT STEP",
    recommendation = "Practice 5 edge-case problems before moving to the next topic.",
    cta = "View Insight",
    href = "/concept-root",
  } = aiInsight || {};

  return (
    <div className="relative overflow-hidden rounded-md bg-[#1B332C] p-6 sm:p-8 text-[#FBF8F0] shadow-[var(--shadow-card-hover)] border border-[#C4952A]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 group">
      {/* Background Chalk Dust Glow Accent */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#E8C547]/10 blur-2xl pointer-events-none group-hover:bg-[#E8C547]/20 transition-all duration-500" />

      {/* Card Header & Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded bg-[#C4952A]/20 px-3 py-1 text-xs font-['Space_Mono'] font-bold uppercase tracking-wider text-[#E8C547] border border-[#E8C547]/30">
          <span>{title}</span>
        </div>
        <span className="font-['Space_Mono'] text-[11px] text-[#8B9690]">
          Personalized
        </span>
      </div>

      {/* Core AI Observation */}
      <div className="flex flex-col gap-2">
        <p className="font-['Kalam'] text-xl sm:text-2xl text-[#E8C547] leading-relaxed group-hover:text-[#FBF8F0] transition-colors duration-200">
          "{observation}"
        </p>
      </div>

      {/* Recommended Action Box */}
      <div className="rounded bg-[#2E4F42]/60 p-4 border border-[#E8C547]/20 flex flex-col gap-1 group-hover:border-[#E8C547]/40 transition-colors duration-200">
        <span className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-widest text-[#E8C547]">
          {recommendationTitle}
        </span>
        <p className="text-sm text-[#FBF8F0]/90 font-normal leading-relaxed">
          {recommendation}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2E4F42]/50">
        <span className="text-xs text-[#8B9690] font-['Space_Mono']">
          Confidence: 94%
        </span>
        <Link to={href} className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none bg-[var(--color-accent)] text-white border border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] px-3.5 py-1.5 text-sm group-hover:scale-105 transition-transform">
          {cta} →
        </Link>
      </div>
    </div>
  );
}
