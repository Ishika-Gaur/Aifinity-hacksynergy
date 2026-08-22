import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [exportedMessage, setExportedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReports();
      setReports(data);
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExport = (report) => {
    try {
      const exportPayload = {
        reportTitle: report.title,
        category: report.category,
        range: dateRange,
        generatedAt: new Date().toISOString(),
        stats: report.stats || {},
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.id}_${dateRange.replace(/\s+/g, "_")}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setExportedMessage(`Exported "${report.title}" for period: ${dateRange}`);
      setTimeout(() => setExportedMessage(null), 4000);
    } catch {
      setExportedMessage(`Export prepared for: ${report.title}`);
      setTimeout(() => setExportedMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System & Analytics Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Export structured telemetry, user growth matrices, and bottleneck breakdown reports.
          </p>
        </div>

        {/* Date Range Picker */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs outline-none"
        >
          <option value="Today">Range: Today</option>
          <option value="Last 7 days">Range: Last 7 Days</option>
          <option value="Last 30 days">Range: Last 30 Days</option>
          <option value="Quarter to Date">Range: Q1 2026</option>
        </select>
      </div>

      {exportedMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-xs">
          ✅ {exportedMessage}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 shadow-xs">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            Generating dynamic analytics reports from database…
          </div>
        </div>
      ) : (
        /* Reports Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                    {rep.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">{rep.size}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{rep.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Generated: {rep.generatedAt}</p>
              </div>

              <button
                onClick={() => handleExport(rep)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600 shadow-xs active:scale-95"
              >
                Export Report (JSON / Metrics)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
