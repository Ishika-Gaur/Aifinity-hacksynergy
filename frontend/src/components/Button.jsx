import React from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-blue-700 text-white border border-blue-700 hover:bg-blue-800 hover:border-blue-800 shadow-sm hover:shadow-md",
  outline:
    "bg-white text-blue-700 border border-blue-700 hover:bg-blue-50",
  ghost:
    "bg-transparent text-blue-700 border border-transparent hover:bg-blue-50",
  subtle:
    "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100",
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
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
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