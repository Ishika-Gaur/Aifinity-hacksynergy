import React from "react";
import { Link } from "react-router-dom";

export default function RoadmapSection({ roadmap }) {
  const items = roadmap?.items || [
    { id: "1", title: "Python", status: "completed" },
    { id: "2", title: "Machine Learning", status: "completed" },
    { id: "3", title: "Deep Learning", status: "in_progress" },
    { id: "4", title: "NLP", status: "upcoming" },
    { id: "5", title: "Generative AI", status: "upcoming" },
  ];

  const getStatusMeta = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: "✓",
          label: "Completed",
          circleBg: "bg-[#2E4F42] text-[#FBF8F0] border-[#2E4F42]",
          cardBg: "bg-[#FBF8F0] border-[#2E4F42]/15 text-[#1B332C] hover:border-[#2E4F42] hover:bg-[#2E4F42]/05",
          textColor: "text-[#2E4F42]",
        };
      case "in_progress":
        return {
          icon: "●",
          label: "In Progress",
          circleBg: "bg-[#D9A62B] text-[#1B332C] border-[#B9860F] ring-4 ring-[#E8C547]/30",
          cardBg: "bg-[#1B332C] text-[#FBF8F0] border-[#C4952A] shadow-md hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]",
          textColor: "text-[#E8C547]",
        };
      case "upcoming":
      default:
        return {
          icon: "○",
          label: "Upcoming",
          circleBg: "bg-[#EDE6D3] text-[#5B6B5F] border-[#2E4F42]/20",
          cardBg: "bg-[#FBF8F0]/60 border-[#2E4F42]/10 text-[#8B9690] hover:border-[#2E4F42]/30 hover:bg-[#EDE6D3]/70 hover:text-[#1B332C]",
          textColor: "text-[#8B9690]",
        };
    }
  };

  return (
    <div className="rounded-md bg-[#FBF8F0] p-6 sm:p-8 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1B332C]">
            {roadmap?.title || "YOUR LEARNING ROADMAP"}
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6B5F] font-normal mt-0.5">
            Structured milestone pathway generated for your target career
          </p>
        </div>

        <Link
          to={roadmap?.href || "/roadmap"}
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none bg-[var(--color-primary-600)] text-white border border-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] hover:border-[var(--color-primary-700)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] px-3.5 py-1.5 text-sm hover:scale-105 transition-transform shrink-0"
        >
          {roadmap?.cta || "Continue Roadmap"} →
        </Link>
      </div>

      {/* Stepper Timeline with Node Hover Feedback */}
      <div className="relative mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {items.map((item, idx) => {
            const meta = getStatusMeta(item.status);
            const isLast = idx === items.length - 1;

            return (
              <div key={item.id} className="relative flex flex-col gap-3 group cursor-pointer">
                {/* Connecting Line between steps */}
                {!isLast && (
                  <div className="hidden sm:block absolute top-4 left-1/2 w-full h-0.5 bg-[#2E4F42]/20 -z-0">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === "completed" ? "bg-[#2E4F42]" : "bg-transparent"
                      }`}
                    />
                  </div>
                )}

                {/* Status Dot / Emblem */}
                <div className="relative z-10 flex items-center justify-start sm:justify-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-['Space_Mono'] font-bold text-sm border transition-transform duration-200 group-hover:scale-110 ${meta.circleBg}`}
                  >
                    {meta.icon}
                  </div>
                </div>

                {/* Step Information Card with Hover Feedback */}
                <div
                  className={`rounded p-4 border transition-all duration-200 ${meta.cardBg}`}
                >
                  <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Step 0{idx + 1}
                  </span>
                  <h4 className="font-sans text-base font-bold leading-tight">
                    {item.title}
                  </h4>
                  <span
                    className={`inline-block font-['Space_Mono'] text-xs font-semibold mt-2 ${meta.textColor}`}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
