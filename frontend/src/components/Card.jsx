import React from "react";

export default function Card({
  eyebrow,
  icon,
  title,
  children,
  footer,
  className = "",
  hoverable = true,
}) {
  return (
    <div
      className={[
        "group relative flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8",
        hoverable
          ? "transition-all duration-200 hover:border-[var(--color-primary-300)] hover:shadow-[var(--shadow-card-hover)]"
          : "shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      {(icon || eyebrow) && (
        <div className="flex items-center justify-between">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
              {icon}
            </div>
          )}
          {eyebrow && (
            <span className="text-sm font-semibold tracking-wide text-[var(--color-primary-600)]">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {title && (
        <h3 className="text-xl font-semibold text-[var(--color-text-h)]">
          {title}
        </h3>
      )}

      {children && (
        <div className="text-base leading-relaxed text-[var(--color-text-muted)]">
          {children}
        </div>
      )}

      {footer && (
        <div className="mt-2 border-t border-[var(--color-border)] pt-5">
          {footer}
        </div>
      )}

      {/* subtle accent line on hover */}
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-b-2xl bg-[var(--color-primary-600)] transition-transform duration-200 group-hover:scale-x-100" />
    </div>
  );
}