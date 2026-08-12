import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logoImg from "../../assets/logo.svg";

export default function AdminSignup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, adminExists } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (adminExists) {
      setError("Admin setup has already been completed. Creating additional admin accounts is permanently locked.");
      return;
    }

    if (!email || !password || !displayName) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup(email, password, displayName);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0F172A] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 p-2 shadow-lg ring-1 ring-slate-700 hover:scale-105 transition-transform">
            <img src={logoImg} alt="AIFinity Logo" className="h-full w-full object-contain" />
          </Link>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
            {adminExists ? "Admin Registration Locked" : "Bootstrap Initial Admin"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {adminExists
              ? "The administrator identity for this platform is already established."
              : "Create the primary administrator credentials for the AIFinity console."}
          </p>
        </div>

        {/* Permanently Locked View if Admin exists */}
        {adminExists ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white">Bootstrap Creation Disabled</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An administrator account has already been registered in the database. Public registration is locked to prevent unauthorized access.
            </p>
            <Link
              to="/admin/login"
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              Sign In to Admin Console →
            </Link>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Full Name / Role Title
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="System Administrator"
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aifinity.ai"
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/30 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Creating Admin Account...
                  </span>
                ) : (
                  "Create Admin Account"
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer Link */}
        <div className="border-t border-slate-800 pt-4 text-center flex items-center justify-between text-xs text-slate-400">
          <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">
            Already have an admin account? Sign In
          </Link>
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}
