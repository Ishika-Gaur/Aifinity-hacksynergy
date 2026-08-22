import React from "react";
import { Link } from "react-router-dom";

export default function RecentAssessmentsTable({ assessments }) {
  const items = Array.isArray(assessments) ? assessments : [];

  return (
    <div className="rounded-md bg-[#FBF8F0] p-6 sm:p-8 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1B332C]">
          RECENT ASSESSMENTS
        </h2>
        <span className="font-['Space_Mono'] text-xs text-[#5B6B5F]">
          {items.length > 0 ? `Last ${items.length} evaluated session${items.length !== 1 ? "s" : ""}` : "No sessions yet"}
        </span>
      </div>

      {items.length === 0 ? (
        /* ── Empty state */
        <div className="flex flex-col items-center justify-center rounded border border-[#2E4F42]/10 bg-[#F1EDE1]/40 p-10 gap-3 text-center">
          <span className="text-3xl">📝</span>
          <p className="font-['Kalam'] text-lg text-[#1B332C]">No assessments completed yet.</p>
          <p className="text-sm text-[#5B6B5F] max-w-xs">
            Take your first assessment to start building your learning profile.
          </p>
          <a
            href="/assessment"
            className="mt-2 inline-flex items-center gap-2 font-['Space_Mono'] text-xs font-bold text-[#1B332C] hover:text-[#C4952A] transition-colors"
          >
            Browse Assessments →
          </a>
        </div>
      ) : (
        /* ── Table Container with Responsive Horizontal Scroll */
        <div className="w-full overflow-x-auto rounded border border-[#2E4F42]/10 bg-[#F1EDE1]/40">
          <table className="w-full text-left border-collapse text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-[#2E4F42]/15 bg-[#EDE6D3] font-['Space_Mono'] text-xs font-bold text-[#1B332C]">
                <th className="py-3 px-4 uppercase tracking-wider">ASSESSMENT</th>
                <th className="py-3 px-4 uppercase tracking-wider text-center">SCORE</th>
                <th className="py-3 px-4 uppercase tracking-wider text-center">DATE</th>
                <th className="py-3 px-4 uppercase tracking-wider text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E4F42]/10 font-sans">
              {items.map((row) => {
                const isCompleted = row.status === "Completed";
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#EDE6D3]/60 transition-colors duration-200 group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#1B332C] group-hover:text-[#C4952A] transition-colors">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-['Kalam'] font-bold text-lg text-[#1B332C]">
                      {row.score}
                    </td>
                    <td className="py-3.5 px-4 text-center font-['Space_Mono'] text-xs text-[#5B6B5F]">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-['Space_Mono'] font-bold border transition-transform duration-200 group-hover:scale-105 ${
                          isCompleted
                            ? "bg-[#2E4F42]/10 text-[#2E4F42] border-[#2E4F42]/30"
                            : "bg-[#C1443C]/10 text-[#C1443C] border-[#C1443C]/30"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isCompleted ? "bg-[#2E4F42]" : "bg-[#C1443C]"
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-2 text-right">
        <a
          href="/assessment"
          className="inline-flex items-center gap-1 font-['Space_Mono'] text-xs font-bold text-[#1B332C] hover:text-[#C4952A] hover:translate-x-1 transition-all duration-200"
        >
          <span>View All Assessments</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}

