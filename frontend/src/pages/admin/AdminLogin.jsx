import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logoImg from "../../assets/logo.svg";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, adminExists } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
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
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl animate-fade-in transition-all duration-300 motion-reduce:transition-none">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 p-2 shadow-lg ring-1 ring-slate-700 hover:scale-105 transition-transform">
            <img src={logoImg} alt="AIFinity Logo" className="h-full w-full object-contain" />
          </Link>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Admin Authentication
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in with your Firebase admin credentials to access the console.
          </p>
        </div>

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

        {/* Setup Notice if no admin account bootstrapped yet */}
        {!adminExists && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-300">
            <p className="font-bold">Initial Setup Required</p>
            <p className="mt-1 text-[11px] text-cyan-200/80 leading-relaxed">
              No administrator account has been established yet. Create the initial admin account using the bootstrap setup.
            </p>
            <Link
              to="/admin/signup"
              className="mt-2.5 inline-block font-bold text-cyan-400 underline hover:text-cyan-300"
            >
              Establish Admin Account →
            </Link>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
              className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/30 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign In to Admin Console"
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="border-t border-slate-800 pt-5 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
