import React from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-primary-600)] text-white border border-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] hover:border-[var(--color-primary-700)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
  outline:
    "bg-[var(--color-surface)] text-[var(--color-primary-600)] border border-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)]",
  ghost:
    "bg-transparent text-[var(--color-primary-600)] border border-transparent hover:bg-[var(--color-primary-50)]",
  subtle:
    "bg-[var(--color-primary-50)] text-[var(--color-primary-600)] border border-[var(--color-primary-100)] hover:bg-[var(--color-primary-100)]",
  accent:
    "bg-[var(--color-accent)] text-white border border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
};

const SIZE_CLASSES = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  className = "",
  icon = null,
  iconPosition = "right",
  ...props
}) {
  const Tag = as;

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-md font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    className,
  ].join(" ");

  return (
    <Tag className={classes} {...props}>
      {icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </Tag>
  );
}