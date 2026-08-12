import React from "react";

export default function StatCard({ label, value, unit = "", change, icon }) {
  return (
    <div className="relative flex flex-col justify-between rounded-md bg-[#FBF8F0] p-6 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[#C4952A]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[#D9A62B]/30 group-hover:bg-[#D9A62B] transition-colors rounded-t-md" />

      <div className="flex items-center justify-between">
        <span className="font-['Space_Mono'] text-xs font-bold uppercase tracking-wider text-[#5B6B5F] group-hover:text-[#1B332C] transition-colors">
          {label}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EDE6D3]/60 text-[#1B332C] border border-[#2E4F42]/10 group-hover:bg-[#1B332C] group-hover:text-[#E8C547] group-hover:rotate-6 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-['Kalam'] text-4xl sm:text-5xl font-bold text-[#1B332C] leading-none group-hover:text-[#C4952A] transition-colors duration-200">
          {value}
        </span>
        {unit && (
          <span className="font-['Kalam'] text-2xl font-bold text-[#C4952A]">
            {unit}
          </span>
        )}
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#5B6B5F]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2E4F42] group-hover:scale-125 transition-transform" />
          <span className="font-sans text-xs font-normal text-[#5B6B5F]">{change}</span>
        </div>
      )}
    </div>
  );
}
