import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logoImg from "../../assets/logo.png";

export default function ProtectedRoute() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 p-2 shadow-2xl ring-1 ring-cyan-500/30">
            <img src={logoImg} alt="AIFinity Logo" className="h-full w-full object-contain animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Verifying Admin Authorization...
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
