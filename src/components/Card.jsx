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
        "group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6",
        hoverable
          ? "transition-all duration-200 hover:border-blue-300 hover:shadow-[0_4px_20px_-4px_rgba(30,64,175,0.15)]"
          : "",
        className,
      ].join(" ")}
    >
      {(icon || eyebrow) && (
        <div className="flex items-center justify-between">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
              {icon}
            </div>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold tracking-wide text-blue-600">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {title && (
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      )}

      {children && (
        <div className="text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      )}

      {footer && (
        <div className="mt-2 border-t border-slate-100 pt-4">{footer}</div>
      )}

      {/* subtle accent line on hover */}
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-b-xl bg-blue-600 transition-transform duration-200 group-hover:scale-x-100" />
    </div>
  );
}