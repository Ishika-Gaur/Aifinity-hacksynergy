import React from "react";

export default function ImageCard({
  image,
  alt = "",
  tag,
  title,
  description,
  href,
  footer,
  className = "",
}) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        "group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
        "transition-all duration-200 hover:border-[var(--color-primary-300)] hover:shadow-[var(--shadow-card-hover)]",
        className,
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-primary-50)]">
        {image ? (
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-primary-300)] text-sm">
            No image
          </div>
        )}
        {tag && (
          <span className="absolute left-3 top-3 rounded-full border border-[var(--color-primary-100)] bg-white/95 px-2.5 py-1 text-xs font-medium text-[var(--color-primary-600)] backdrop-blur">
            {tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {title && (
          <h3 className="text-base font-semibold text-[var(--color-text-h)] group-hover:text-[var(--color-primary-600)] transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
        {footer && <div className="mt-2 pt-2">{footer}</div>}
      </div>
    </Wrapper>
  );
}