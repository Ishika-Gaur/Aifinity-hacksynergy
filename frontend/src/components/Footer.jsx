import Container from "../components/Container";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Concept Root", href: "/concept-root" },
      { label: "Mistake Map", href: "/mistake-map" },
      { label: "Skill Gap", href: "/skill-gap" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Assessment", href: "/assessment" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

function GithubIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] text-slate-300">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="flex flex-col gap-4 sm:col-span-2">
            <a href="/" className="group flex items-center gap-3 w-fit">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 p-0.5 shadow-md shadow-indigo-950 transition-all duration-300 group-hover:border-cyan-400 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900 text-white">
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

              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-none group-hover:text-cyan-400 transition-colors">
                  AFINITY<span className="ml-1 text-xs font-bold uppercase tracking-widest text-cyan-400">AI</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 leading-tight">
                  Learning Intelligence
                </span>
              </div>
            </a>

            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Building clear, intelligent, and guided learning paths from where you are to where you want to be.
            </p>

            <div className="flex gap-3 mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-all duration-200 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-all duration-200 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-all duration-200 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs font-medium text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Afinity AI. All rights reserved. Developed by Faiz, Isika, and Aman Negi.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="/privacy" className="transition-colors hover:text-cyan-400">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-cyan-400">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}