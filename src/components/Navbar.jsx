import React, { useState } from "react";
import Button from "../components/Button";


const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Concept Root", href: "/concept-root" },
  { label: "Mistake Map", href: "/mistake-map" },
  { label: "Skill Gap", href: "/skill-gap" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ activePath = "/" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-700 text-sm font-bold text-white">
            L
          </span>
          <span className="text-lg font-semibold text-slate-900">
            Logo<span className="text-blue-700">.</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activePath === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue-700"
                      : "text-slate-600 hover:text-blue-700",
                  ].join(" ")}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Button as="a" href="/signup" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-sm font-medium text-slate-700 hover:text-blue-700"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button as="a" href="/signup" size="sm" className="w-full">
                Get Started
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}