import React from "react";
import { Link } from "react-router-dom";

export default function NextStepsCard({ recommendations }) {
  const items = recommendations || [
    { id: "r1", num: "01", text: "Review recursion fundamentals", href: "/concept-root" },
    { id: "r2", num: "02", text: "Complete 5 recursion problems", href: "/assessment" },
    { id: "r3", num: "03", text: "Analyze your repeated mistakes", href: "/mistake-map" },
    { id: "r4", num: "04", text: "Continue the Deep Learning roadmap", href: "/roadmap" },
  ];

  return (
    <div className="rounded-md bg-[#FBF8F0] p-6 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#2E4F42]/10 pb-3">
        <h3 className="font-sans text-xl font-bold text-[#1B332C]">
          WHAT TO DO NEXT
        </h3>
        <span className="font-['Space_Mono'] text-xs font-bold text-[#C4952A] bg-[#EDE6D3] px-2 py-0.5 rounded">
          ACTION ITEMS
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.href || "/dashboard"}
            className="flex items-center gap-3.5 rounded bg-[#F1EDE1]/60 p-3.5 border border-[#2E4F42]/08 hover:bg-[#EDE6D3] hover:border-[#C4952A]/40 hover:translate-x-1 transition-all duration-200 group cursor-pointer"
          >
            <span className="font-['Space_Mono'] text-sm font-bold text-[#C4952A] group-hover:text-[#1B332C] transition-colors">
              {item.num}
            </span>
            <span className="text-sm text-[#24413A] font-normal leading-snug group-hover:font-medium transition-all">
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
