import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setSettings(adminService.getSettings());
  }, []);

  if (!settings) return null;

  const handleSave = (e) => {
    e.preventDefault();
    adminService.updateSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Platform Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure platform defaults, rate limits, AI model hyperparameters, and security policies.
        </p>
      </div>

      {savedMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-xs">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        {["general", "ai", "security"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "ai" ? "AI Model Configuration" : `${tab} Settings`}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 max-w-2xl">
        {activeTab === "general" && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Application Name</label>
              <input
                type="text"
                value={settings.general.appName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, appName: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, supportEmail: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="maint"
                checked={settings.general.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="maint" className="font-bold text-slate-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary AI Model</label>
              <select
                value={settings.ai.primaryModel}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ai: { ...settings.ai, primaryModel: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none font-semibold text-slate-800"
              >
                <option value="gemini-3.5-flash-latest">Gemini 3.5 Flash (Fast & Responsive)</option>
                <option value="gemini-3.5-pro-latest">Gemini 3.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Daily Requests Limit per User
              </label>
              <input
                type="number"
                value={settings.ai.dailyLimitPerUser}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ai: { ...settings.ai, dailyLimitPerUser: parseInt(e.target.value) },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none font-semibold text-slate-800"
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mfa"
                checked={settings.security.enforceMfa}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, enforceMfa: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="mfa" className="font-bold text-slate-700">
                Enforce Multi-Factor Authentication (MFA) for Admins
              </label>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500 hover:scale-105 active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
