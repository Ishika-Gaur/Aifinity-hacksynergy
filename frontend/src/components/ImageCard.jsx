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
        "group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white",
        "transition-all duration-200 hover:border-blue-300 hover:shadow-[0_4px_20px_-4px_rgba(30,64,175,0.15)]",
        className,
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-blue-50">
        {image ? (
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-blue-300 text-sm">
            No image
          </div>
        )}
        {tag && (
          <span className="absolute left-3 top-3 rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 text-xs font-medium text-blue-700 backdrop-blur">
            {tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {title && (
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        )}
        {footer && <div className="mt-2 pt-2">{footer}</div>}
      </div>
    </Wrapper>
  );
}