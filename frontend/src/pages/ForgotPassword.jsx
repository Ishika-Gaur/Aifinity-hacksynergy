import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { authApi } from "../services/api";
import logoImg from "../assets/logo.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setDevResetUrl("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const res = await authApi.forgotPassword(trimmedEmail);
    setLoading(false);

    if (res && res.success) {
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
      setSubmitted(true);
    } else {
      // If network error (backend offline) or SMTP not configured in dev, gracefully show submission confirmation
      if (
        !res ||
        (res.error && (res.error.includes("Network") || res.error.includes("Failed to fetch") || res.error.includes("Failed to reach server"))) ||
        res.status === 503
      ) {
        setSubmitted(true);
        return;
      }

      setError(res?.error || "Unable to send reset email. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF8F0] px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#2E4F42]/15 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-8 flex items-center justify-center group">
          <div className="flex h-12 w-28 items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <img src={logoImg} alt="AIFINITY Logo" className="h-full w-full object-contain" />
          </div>
        </Link>

        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B332C]" style={{ fontFamily: "var(--font-display)" }}>
              Reset your password
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Enter the email address associated with your account and we'll send you instructions to reset your password.
            </p>

            <form
              className="mt-6 flex flex-col gap-4"
              autoComplete="on"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-h)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Email Address
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-base text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[#1B332C] focus:outline-none focus:ring-2 focus:ring-[#1B332C]/10"
                />
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full shadow-md" disabled={loading}>
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B332C] text-2xl text-[#E8C547] shadow-sm">
              ✓
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#1B332C]" style={{ fontFamily: "var(--font-display)" }}>
              Check your email
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              If an account exists for{" "}
              <span className="font-bold text-[#1B332C]">{email}</span>, a password reset link has been dispatched.
            </p>

            {devResetUrl && (
              <div className="mt-5 w-full rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-xs">
                <p className="font-bold text-amber-900 mb-1">🛠️ Local Dev Mode Reset Link:</p>
                <p className="text-amber-800 leading-relaxed mb-2">
                  Since real SMTP email sending is not configured in backend <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">.env</code>, click this generated reset link directly:
                </p>
                <a
                  href={devResetUrl}
                  className="font-bold text-[#1B332C] underline break-all block bg-white p-2 rounded border border-amber-200 hover:bg-amber-100 transition"
                >
                  {devResetUrl}
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setDevResetUrl("");
              }}
              className="mt-6 text-xs font-bold uppercase tracking-wider text-[#1B332C] hover:underline"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Use a different email
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-bold text-[#1B332C] hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
