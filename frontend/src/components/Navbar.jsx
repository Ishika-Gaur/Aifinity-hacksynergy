import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.svg";

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
      {/* Logo Image */}
      <div className="relative flex h-15 w-25 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <img
          src={logo}
          alt="Aifinity Logo"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:rotate-6"
        />
      </div>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-[#2E4F42]/12 bg-[#FBF8F0]/90 backdrop-blur-md transition-all shadow-[var(--shadow-card)]">
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
                  className={`rounded-md px-3.5 py-2 text-xs font-sans font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#1B332C] text-[#E8C547] font-bold shadow-xs border border-[#C4952A]/30"
                      : "text-[#24413A] hover:bg-[#EDE6D3]/60 hover:text-[#1B332C]"
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
            className="px-3 py-1.5 text-xs font-sans font-semibold text-[#1B332C] hover:text-[#C4952A] transition-colors"
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
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#2E4F42]/20 bg-[#F1EDE1] text-[#1B332C] transition-all hover:bg-[#EDE6D3] active:scale-95 lg:hidden cursor-pointer"
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
        <div className="border-t border-[#2E4F42]/15 bg-[#FBF8F0] px-4 py-5 backdrop-blur-lg lg:hidden transition-all">
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                currentPath === link.href ||
                (link.href !== "/" && currentPath.startsWith(link.href));

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block rounded-md px-4 py-2.5 text-sm font-sans font-semibold transition-all ${
                      isActive
                        ? "bg-[#EDE6D3] text-[#1B332C] font-bold border-l-4 border-[#D9A62B]"
                        : "text-[#24413A] hover:bg-[#EDE6D3]/50 hover:text-[#1B332C]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-3 border-t border-[#2E4F42]/10 flex flex-col gap-2">
              <a
                href="/login"
                className="w-full text-center py-2 text-sm font-sans font-semibold text-[#1B332C] hover:text-[#C4952A]"
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