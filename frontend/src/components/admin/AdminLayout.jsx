import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggingOut, logoutError, setLogoutError } = useAdminAuth();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Logout Error Toast Notification */}
      {logoutError && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-semibold text-rose-800 shadow-xl animate-fade-in">
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold">Sign Out Failed</span>
            <span className="text-rose-600">{logoutError}</span>
          </div>
          <button
            onClick={() => setLogoutError(null)}
            className="ml-3 rounded-lg p-1 text-rose-500 hover:bg-rose-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Admin UI Container with smooth exit transition */}
      <div
        className={`flex h-full w-full overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          isLoggingOut
            ? "opacity-20 scale-[0.995] pointer-events-none filter blur-[1px]"
            : "opacity-100 scale-100"
        }`}
      >
        {/* Admin Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Administrative Viewport */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Admin Header */}
          <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

          {/* Dynamic Admin Page Workspace */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
