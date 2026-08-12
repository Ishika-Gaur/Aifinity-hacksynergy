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
  "card-classroom group relative flex flex-col gap-5 rounded-[6px] p-8",
  hoverable ? "card-classroom--hoverable" : "",
  className,
].join(" ")}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

        .card-classroom {
  background: #FBF8F0;
  background-image: repeating-linear-gradient(...);
  border: 1px solid rgba(27, 51, 44, 0.10);
  box-shadow: 0 5px 0 rgba(27, 51, 44, 0.08), 0 10px 18px rgba(27, 51, 44, 0.14);
  transform: rotate(var(--card-tilt, -1deg));
  margin-top: 8px;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.45s ease;
}
        .card-classroom:nth-of-type(3n+1) { --card-tilt: -1.1deg; }
        .card-classroom:nth-of-type(3n+2) { --card-tilt: 0.8deg; }
        .card-classroom:nth-of-type(3n)   { --card-tilt: -0.4deg; }

        .card-classroom::before {
          /* push-pin */
          content: "";
          position: absolute;
          top: -7px;
          left: 28px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: radial-gradient(circle at 35% 30%, #E2685D 0%, #C1443C 60%, #9B372F 100%);
          box-shadow: 0 2px 3px rgba(0,0,0,0.35);
          z-index: 2;
        }

        .card-classroom--hoverable:hover {
          transform: rotate(0deg) translateY(-6px);
          box-shadow: 0 10px 0 rgba(27, 51, 44, 0.08), 0 22px 34px rgba(27, 51, 44, 0.20);
        }

        .card-classroom .cc-icon-badge {
          border: 1.5px dashed rgba(27, 51, 44, 0.35);
          background: rgba(46, 79, 66, 0.05);
          color: #2E4F42;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-classroom--hoverable:hover .cc-icon-badge {
          transform: rotate(-6deg) scale(1.06);
          background: rgba(232, 197, 71, 0.18);
          border-color: rgba(184, 134, 15, 0.5);
        }

        .card-classroom .cc-eyebrow {
          transform: rotate(-2deg);
          background: #2E4F42;
          color: #F7F4EA;
          font-family: "Space Mono", monospace;
          box-shadow: 0 2px 0 rgba(0,0,0,0.15);
        }

        .card-classroom .cc-title {
          font-family: "Kalam", cursive;
          color: #1B332C;
        }

        .card-classroom .cc-footer {
          border-top: 1.5px dashed rgba(27, 51, 44, 0.28);
        }

        .card-classroom .cc-underline {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          height: 4px;
          transform: scaleX(0);
          transform-origin: left;
          background: #E8C547;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-classroom--hoverable:hover .cc-underline {
          transform: scaleX(1);
        }
      `}</style>

      {(icon || eyebrow) && (
        <div className="relative flex items-center justify-between pt-1">
          {icon && (
            <div
              className="cc-icon-badge relative flex h-14 w-14 items-center justify-center rounded-full"
            >
              {icon}
            </div>
          )}
          {eyebrow && (
            <span className="cc-eyebrow relative rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {title && (
        <h3 className="cc-title relative text-2xl font-bold leading-snug">
          {title}
        </h3>
      )}

      {children && (
        <div className="relative text-base leading-relaxed text-[#5B6B5F]">
          {children}
        </div>
      )}

      {footer && (
        <div className="cc-footer relative mt-2 pt-5">
          {footer}
        </div>
      )}

      <span className="cc-underline" aria-hidden="true" />
    </div>
  );
}