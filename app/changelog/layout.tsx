"use client";

import Link from "next/link";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

function ApperioLogo() {
  return (
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
        apperio
      </span>
    </Link>
  );
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-bg-base">
        <header className="border-b border-border-subtle">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <ApperioLogo />
            <nav className="flex items-center gap-4 text-sm text-text-muted">
              <Link
                href="/status"
                className="hover:text-text-primary transition-colors"
              >
                Status
              </Link>
              <Link
                href="/"
                className="hover:text-text-primary transition-colors"
              >
                Home
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-border-subtle">
          <div className="max-w-3xl mx-auto px-6 py-6 text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Apperio. All rights reserved.
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
