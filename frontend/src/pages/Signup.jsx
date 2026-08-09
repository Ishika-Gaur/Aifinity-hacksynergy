import React, { useState } from "react";
import Button from "../components/Button";

const BENEFITS = [
  "Takes under 10 minutes to see your first result",
  "No credit card needed to get started",
  "Works across coding, aptitude, GK, and verbal",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locked, setLocked] = useState(true); // readOnly trick against autofill

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left — informative panel, not just empty color */}
      <div className="hidden flex-col justify-center bg-[var(--color-primary-50)] px-12 py-16 lg:flex xl:px-20">
        <div className="mx-auto max-w-sm">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary-600)]">
            Why sign up
          </span>
          <h2 className="mt-3 text-2xl font-bold leading-snug text-[var(--color-text-h)]">
            Find your gaps before the interview does.
          </h2>

          <ul className="mt-8 flex flex-col gap-5">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-xs font-bold text-white">
                  ✓
                </span>
                <span className="text-base leading-relaxed text-[var(--color-text-body)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-[var(--color-primary-100)] bg-white p-5">
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              "Instead of redoing entire mock tests, I just work through
              the top 3 flagged concepts each week."
            </p>
            <p className="mt-3 text-sm font-semibold text-[var(--color-text-h)]">
              — a student who stuck with it
            </p>
          </div>
        </div>
      </div>

      {/* Right — form, sticky so it stays in view */}
      <div className="flex items-start justify-center px-6 py-16 sm:px-12 lg:px-16">
        <div className="sticky top-16 w-full max-w-sm">
          <a href="/" className="mb-8 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary-600)] text-sm font-bold text-white">
              L
            </span>
            <span className="text-lg font-semibold text-[var(--color-text-h)]">
              Logo<span className="text-[var(--color-primary-600)]">.</span>
            </span>
          </a>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-h)]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Free to start — no card required.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="signup-name"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-h)]"
              >
                Full name
              </label>
              <input
                id="signup-name"
                name="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setLocked(false)}
                readOnly={locked}
                placeholder="Your name"
                autoComplete="off"
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-base text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-h)]"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="signup-email"
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

            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-h)]"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setLocked(false)}
                readOnly={locked}
                placeholder="At least 8 characters"
                autoComplete="off"
                className="w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-base text-[var(--color-text-h)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
              />
            </div>

            <Button type="submit" size="lg" className="mt-1 w-full">
              Create Account
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs font-medium uppercase text-[var(--color-text-light)]">
              or
            </span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <Button
            as="a"
            href="/auth/google"
            variant="outline"
            size="md"
            className="w-full"
          >
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}