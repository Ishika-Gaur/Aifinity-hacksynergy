import React from "react";
import Container from "../components/Container";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Concept Root", href: "/concept-root" },
      { label: "Mistake Map", href: "/mistake-map" },
      { label: "Skill Gap", href: "/skill-gap" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container>
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                L
              </span>
              <span className="text-lg font-semibold text-white">
                Logo<span className="text-blue-400">.</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed text-slate-400">
              Building clear, guided paths from where you are to where you
              want to be.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-white">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Logo. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-400">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}