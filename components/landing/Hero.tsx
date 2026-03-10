"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { DashboardPreview } from "./DashboardPreview";
import { useHeroSequence } from "@/hooks/useGsapAnimations";

export function Hero() {
  const containerRef = useHeroSequence();

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-16"
    >
      {/* Hero content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-24 pb-16 md:pt-32">
        {/* Badge pill */}
        <div className="flex justify-center mb-8" data-hero-badge>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-signal bg-signal-muted">
            <SignalDot status="ok" size="sm" />
            <span className="text-xs font-display font-semibold uppercase tracking-[0.08em] text-signal">
              Real-time observability for JS apps
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-6">
          <h1
            className="font-display font-extrabold tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: "clamp(52px, 8vw, 96px)" }}
          >
            <span data-hero-headline>Stop guessing what&apos;s</span>

            <br />
            <span data-hero-headline>
              <span
                className="text-status-danger animate-text-glitch"
                data-hero-glitch
                style={{ animationDelay: "2s" }}
              >
                breaking
              </span>{" "}
              in{" "}
              <span data-hero-headline className="text-signal">
                production.
              </span>
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p
          className="text-center text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          data-hero-sub
        >
          One npm install. One line of code. Instant dashboards, real-time
          alerts, and AI-powered insights — without the enterprise complexity.
        </p>

        {/* CTA row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          data-hero-ctas
        >
          <Button
            variant="signal"
            size="lg"
            className="font-display font-bold text-base px-8 py-6"
            asChild
          >
            <Link href="/signup">
              Start monitoring free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <TerminalBlock
            code="npm install apperio"
            className="w-full sm:w-auto min-w-[280px]"
            showCopy
          />
        </div>

        {/* Trust bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-text-muted mb-16"
          data-hero-trust
        >
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            10,000 logs free/mo
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            No credit card
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted" />5 min setup
          </span>
        </div>

        {/* Dashboard preview */}
        <div
          className="relative max-w-[1000px] mx-auto"
          data-hero-preview
          style={{
            perspective: "2000px",
          }}
        >
          <div
            className="relative rounded-2xl border border-border-subtle overflow-hidden"
            style={{
              transform: "rotateX(8deg)",
              boxShadow:
                "0 0 0 1px var(--border-faint), 0 60px 120px rgba(0,0,0,0.8), 0 0 60px #00d97e10",
            }}
          >
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
