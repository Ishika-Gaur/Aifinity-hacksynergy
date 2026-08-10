import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Concept Root", href: "/concept-root" },
  { label: "Mistake Map", href: "/mistake-map" },
  { label: "Skill Gap", href: "/skill-gap" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contact", href: "/contact" },
];

function BrandLogo() {
  return (
    <a
      href="/"
      className="group flex items-center gap-3 transition-all duration-300 hover:opacity-95 active:scale-98"
    >
      {/* Premium Logo Icon Emblem */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 p-0.5 shadow-md shadow-indigo-900/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25 group-hover:scale-105">
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <svg className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              className="stroke-indigo-400"
            />
            <circle cx="12" cy="12" r="2" className="fill-cyan-400 stroke-none animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
          AFINITY<span className="ml-1 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
          Learning Intelligence
        </span>
      </div>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <BrandLogo />

        {/* Desktop Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== "/" && currentPath.startsWith(link.href));

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs ring-1 ring-indigo-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            Log In
          </a>
          <Button
            as="a"
            href="/signup"
            size="sm"
            className="shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:bg-slate-50 active:scale-95 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-5 backdrop-blur-lg lg:hidden transition-all">
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                currentPath === link.href ||
                (link.href !== "/" && currentPath.startsWith(link.href));

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="/login"
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
              >
                Log In
              </a>
              <Button as="a" href="/signup" size="md" className="w-full">
                Get Started
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}