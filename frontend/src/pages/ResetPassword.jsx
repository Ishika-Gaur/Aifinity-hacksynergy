import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { authApi } from "../services/api";
import logoImg from "../assets/logo.svg";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await authApi.resetPassword(token, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Unable to reset the password.");
      return;
    }
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex">
          <img src={logoImg} alt="AIFinity" className="h-12 w-28 object-contain object-left" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-h)]">Set a new password</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Choose a new password for your account.</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">{error}</div>}
          {[{ id: "new-password", label: "New password", value: password, setValue: setPassword }, { id: "confirm-password", label: "Confirm password", value: confirmPassword, setValue: setConfirmPassword }].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-[var(--color-text-h)]">{field.label}</label>
              <div className="relative">
                <input id={field.id} type={showPassword ? "text" : "password"} value={field.value} onChange={(event) => field.setValue(event.target.value)} className="w-full rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 pr-14 text-base text-[var(--color-text-h)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]" required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-700)]" aria-label={showPassword ? "Hide passwords" : "Show passwords"}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>
          ))}
          <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
        </form>
      </div>
    </div>
  );
}
