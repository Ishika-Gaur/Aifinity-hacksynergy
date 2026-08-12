import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

export default function AiAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(adminService.getAnalytics());
  }, []);

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Model Telemetry & Request Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on AI invocation volume, token throughput, response latencies, and feature popularity.
        </p>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Requests (30d)
          </span>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {analytics.totalRequests.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">
            {analytics.successRate} Success Rate
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Token Throughput
          </span>
          <p className="mt-2 text-3xl font-extrabold text-indigo-600">
            {analytics.tokenConsumption.promptTokens}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Completion: {analytics.tokenConsumption.completionTokens}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Latency
          </span>
          <p className="mt-2 text-3xl font-extrabold text-cyan-600">
            {analytics.averageLatencyMs} ms
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Estimated Cost: {analytics.tokenConsumption.estimatedCost}
          </span>
        </div>
      </div>

      {/* Feature Breakdown & Daily Trend */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Daily Request Volume (SVG Column Chart) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Daily Volume Distribution</h3>
          <div className="flex h-56 items-end justify-between gap-3 pt-6">
            {analytics.dailyUsageTrend.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">{d.requests}</span>
                <div className="w-full rounded-t-xl bg-indigo-500/20 overflow-hidden h-40 flex items-end">
                  <div
                    className="w-full rounded-t-xl bg-indigo-600 transition-all duration-500"
                    style={{ height: `${(d.requests / 2200) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features Share */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Module Popularity</h3>
          <div className="space-y-4">
            {analytics.usageByFeature.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{item.name}</span>
                  <span className="text-slate-500">{item.requests} calls ({item.percentage}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
