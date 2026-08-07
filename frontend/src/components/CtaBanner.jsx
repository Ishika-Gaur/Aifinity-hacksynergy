import React from "react";
import Button from "./Button";

export default function CtaBanner({
  eyebrow = "Ready to begin?",
  title,
  buttonLabel = "Get Started",
  href = "#",
  className = "",
}) {
  return (
<div
  className={[
    "flex flex-col items-start justify-between gap-6 rounded-3xl px-8 py-10 sm:flex-row sm:items-center sm:px-12",
    "bg-[var(--color-navy)] border border-[var(--color-primary-800)]",
    className,
  ].join(" ")}
>
  <div className="flex flex-col gap-3">
    <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary-300)]">
      {eyebrow}
    </span>
    <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
      {title}
    </h2>
  </div>

  <Button as="a" href={href} size="lg" className="!rounded-full shrink-0">
    {buttonLabel}
  </Button>
</div>
  );
}