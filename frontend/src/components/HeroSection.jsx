import Button from "./Button";

/**
 * Classroom-vibe HeroSection.
 * Same props/interface as the original — drop-in replacement.
 *
 * Design notes:
 * - Deep chalkboard-green backdrop with a faint chalk grid + a soft
 *   "erased" smudge behind the headline.
 * - Eyebrow reads like a hall-pass ticket taped to the board.
 * - Title set in a real chalk-handwriting face; the highlight word
 *   gets a hand-drawn underline, like a teacher circling the answer.
 * - Stats render as pinned index cards along a chalk tray at the
 *   bottom, each pushpinned and slightly askew.
 * - Button colors are pushed through the shared CSS custom
 *   properties, so <Button /> re-themes itself with no edits.
 */
export default function HeroSection({
  eyebrow,
  title,
  highlightWord,
  description,
  primaryCta,
  secondaryCta,
  stats = [],
}) {
  return (
    <section
      className="hs-classroom relative overflow-hidden py-20 sm:py-24 lg:py-28"
      style={{
        // Re-theme the shared design tokens for this section (and for
        // <Button />, which reads the same vars) without touching
        // Button.jsx.
        "--color-primary-50": "rgba(232, 197, 71, 0.14)",
        "--color-primary-600": "#D9A62B",
        "--color-primary-700": "#B9860F",
        "--color-border": "rgba(247, 244, 234, 0.16)",
        "--color-border-strong": "rgba(247, 244, 234, 0.34)",
        "--color-text-h": "#F7F4EA",
        "--color-text-muted": "rgba(247, 244, 234, 0.78)",
        "--color-text-light": "rgba(247, 244, 234, 0.58)",
        "--font-display": "'Kalam', cursive",
        "--font-mono": "'Space Mono', monospace",
        background:
          "radial-gradient(ellipse 70% 55% at 50% 38%, #2E4F42 0%, #24413A 55%, #1B332C 100%)",
        borderBottom: "1px solid rgba(247, 244, 234, 0.12)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

        .hs-classroom {
          --dust: rgba(247, 244, 234, 0.5);
        }

        /* faint chalk grid, like the board was never fully erased */
        .hs-classroom .hs-grid {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(247,244,234,0.05) 0px, rgba(247,244,234,0.05) 1px, transparent 1px, transparent 48px),
            repeating-linear-gradient(90deg, rgba(247,244,234,0.05) 0px, rgba(247,244,234,0.05) 1px, transparent 1px, transparent 48px);
          mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 90%);
          pointer-events: none;
        }

        .hs-classroom .hs-eyebrow {
          transform: rotate(-2deg);
          box-shadow: 0 3px 0 rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.25);
        }
        .hs-classroom .hs-eyebrow::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 50%;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(247,244,234,0.5);
          transform: translateY(-50%);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
        }

        .hs-classroom .hs-underline {
          position: absolute;
          left: -2%;
          right: -2%;
          bottom: -0.1em;
          height: 0.5em;
          width: 104%;
        }

        .hs-classroom .hs-card {
          background: #FBF8F0;
          background-image: repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent 21px,
            rgba(122, 156, 198, 0.25) 22px
          );
          box-shadow: 0 6px 0 rgba(0,0,0,0.12), 0 10px 16px rgba(0,0,0,0.28);
        }
        .hs-classroom .hs-card::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 50%;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #C1443C;
          box-shadow: 0 1px 2px rgba(0,0,0,0.4);
          transform: translateX(-50%);
        }
        .hs-classroom .hs-card:nth-child(odd) { transform: rotate(-2.5deg); }
        .hs-classroom .hs-card:nth-child(even) { transform: rotate(2deg); }
        .hs-classroom .hs-card:hover { transform: rotate(0deg) translateY(-2px); }
        .hs-classroom .hs-card { transition: transform 0.2s ease; }

        .hs-classroom .hs-tray {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 14px;
          background: linear-gradient(180deg, #B98A5E 0%, #8B5A3C 100%);
          box-shadow: 0 -2px 8px rgba(0,0,0,0.25) inset;
        }
        .hs-classroom .hs-dust {
          position: absolute;
          bottom: 12px;
          border-radius: 999px;
          background: var(--dust);
          opacity: 0;
          animation: hs-fall 5s ease-in infinite;
        }
        @keyframes hs-fall {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 0.6; }
          90% { opacity: 0.15; }
          100% { opacity: 0; transform: translateY(-26px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-classroom .hs-dust { animation: none; opacity: 0.2; }
        }
      `}</style>

      <div className="hs-grid" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {eyebrow && (
            <div
              className="hs-eyebrow relative inline-flex items-center gap-2 rounded-sm border border-dashed px-5 py-1.5 pl-7 text-xs font-bold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-mono)",
                borderColor: "var(--color-border-strong)",
                background: "#FBF8F0",
                color: "#3D2E1F",
              }}
            >
              {eyebrow}
            </div>
          )}

          <h1
            className="max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl lg:leading-[1.15]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-h)" }}
          >
            {title}{" "}
            {highlightWord && (
              <span className="relative inline-block" style={{ color: "#E8C547" }}>
                {highlightWord}
                <svg
                  className="hs-underline"
                  viewBox="0 0 200 16"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C 40 14, 80 2, 120 8 S 180 13, 198 6"
                    fill="none"
                    stroke="#E8C547"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </span>
            )}
          </h1>

          {description && (
            <p
              className="max-w-2xl text-base leading-7 sm:text-lg"
              style={{ color: "var(--color-text-muted)" }}
            >
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap justify-center gap-3.5 pt-2">
              {primaryCta && (
                <Button as="a" href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button as="a" href={secondaryCta.href} variant="outline" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div
              className="mt-10 grid w-full max-w-xl gap-6 pt-4"
              style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="hs-card relative flex flex-col items-center gap-0.5 rounded-sm px-3 py-4"
                >
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#2E4F42" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-mono)", color: "#6B6152" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* chalk tray + drifting dust — the signature classroom touch */}
      <div className="hs-tray" aria-hidden="true" />
      <span className="hs-dust" style={{ left: "18%", width: 3, height: 3, animationDelay: "0s" }} aria-hidden="true" />
      <span className="hs-dust" style={{ left: "34%", width: 2, height: 2, animationDelay: "1.4s" }} aria-hidden="true" />
      <span className="hs-dust" style={{ left: "58%", width: 3, height: 3, animationDelay: "2.6s" }} aria-hidden="true" />
      <span className="hs-dust" style={{ left: "76%", width: 2, height: 2, animationDelay: "0.8s" }} aria-hidden="true" />
    </section>
  );
}