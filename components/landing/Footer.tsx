import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/logs", label: "Log Explorer" },
      { href: "/alerts", label: "Alerts" },
      { href: "/sdk", label: "SDK" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/sdk", label: "SDK Reference" },
      { href: "/docs", label: "Changelog" },
      { href: "/docs", label: "Status Page" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/docs", label: "About" },
      { href: "/docs", label: "Privacy" },
      { href: "/docs", label: "Terms" },
      { href: "/docs", label: "Security" },
      { href: "/docs", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-void border-t border-border-faint">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                className="text-signal"
              >
                <path
                  d="M4 20L4 16L8 12L12 18L18 8L22 14L24 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="4" cy="20" r="2" fill="currentColor" />
                <circle cx="24" cy="10" r="2" fill="currentColor" />
              </svg>
              <span className="font-display font-semibold text-lg text-text-primary tracking-[-0.02em]">
                monita
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              The Developer&apos;s Logging Companion
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                className="text-text-muted hover:text-text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-text-muted hover:text-text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-sm text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-faint pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>&copy; 2025 Monita. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>GDPR Ready</span>
            <span>&bull;</span>
            <span>SOC 2</span>
            <span>&bull;</span>
            <span>99.9% SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
