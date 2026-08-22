import React from "react";
import { Link } from "react-router-dom";

export default function RecentAssessmentsTable({ assessments }) {
  const items = assessments || [
    {
      id: "a1",
      name: "Binary Search",
      score: "82%",
      date: "Aug 12",
      status: "Completed",
      type: "success",
    },
    {
      id: "a2",
      name: "Arrays",
      score: "91%",
      date: "Aug 11",
      status: "Completed",
      type: "success",
    },
    {
      id: "a3",
      name: "Recursion",
      score: "68%",
      date: "Aug 10",
      status: "Needs Review",
      type: "warning",
    },
    {
      id: "a4",
      name: "Sorting",
      score: "87%",
      date: "Aug 08",
      status: "Completed",
      type: "success",
    },
  ];

  return (
    <div className="rounded-md bg-[#FBF8F0] p-6 sm:p-8 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1B332C]">
          RECENT ASSESSMENTS
        </h2>
        <span className="font-['Space_Mono'] text-xs text-[#5B6B5F]">
          Last 4 evaluated sessions
        </span>
      </div>

      {/* Table Container with Responsive Horizontal Scroll */}
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
                  onClick={() => window.location.href = `/assessment`}
                  className="hover:bg-[#EDE6D3]/60 transition-colors duration-200 group cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#1B332C] group-hover:text-[#C4952A] transition-colors">
                    <Link to="/assessment" className="hover:underline">
                      {row.name}
                    </Link>
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

      <div className="pt-2 text-right">
        <Link
          to="/assessment"
          className="inline-flex items-center gap-1 font-['Space_Mono'] text-xs font-bold text-[#1B332C] hover:text-[#C4952A] hover:translate-x-1 transition-all duration-200"
        >
          <span>View All Assessments</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
