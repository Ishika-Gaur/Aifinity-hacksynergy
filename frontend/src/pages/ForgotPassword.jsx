import React, { useState } from "react";
import Button from "../components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [locked, setLocked] = useState(true); // readOnly trick against autofill
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-sm">
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary-600)] text-sm font-bold text-white">
            L
          </span>
          <span className="text-lg font-semibold text-[var(--color-text-h)]">
            Logo<span className="text-[var(--color-primary-600)]">.</span>
          </span>
        </a>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-h)]">
              Reset your password
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Enter the email on your account and we'll send you a link to
              reset it.
            </p>

            <form
              className="mt-6 flex flex-col gap-4"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-text-h)]"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  name="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setLocked(false)}
                  readOnly={locked}
                  placeholder="you@example.com"
                  autoComplete="off"
                  className="w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-base text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                />
              </div>

              <Button type="submit" size="lg" className="mt-1 w-full">
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-2xl">
              ✓
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--color-text-h)]">
              Check your email
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              If an account exists for{" "}
              <span className="font-medium text-[var(--color-text-h)]">
                {email}
              </span>
              , a reset link is on its way.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          Remembered it?{" "}
          <a
            href="/login"
            className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}