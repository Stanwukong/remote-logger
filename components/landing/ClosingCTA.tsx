"use client";

import { Button } from "@/components/ui/button";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { useScrollReveal } from "@/hooks/useGsapAnimations";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ClosingCTA() {
  const containerRef = useScrollReveal();

  return (
    <section
      className="py-32 relative overflow-hidden"
      ref={containerRef}
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, #00d97e08 0%, transparent 70%), var(--bg-void)`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        {/* Pre-headline */}
        <div className="flex items-center justify-center gap-2 mb-6" data-reveal>
          <SignalDot status="ok" size="sm" />
          <span className="text-sm text-text-muted">
            Production ready in 5 minutes
          </span>
        </div>

        {/* Headline */}
        <h2
          className="font-display font-extrabold tracking-tight leading-[1.1] text-text-primary mb-6"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          data-reveal
        >
          Your app is trying
          <br />
          to tell you something.
        </h2>

        <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed" data-reveal>
          Most bugs are announced before users notice them. Monita listens.
        </p>

        {/* Terminal */}
        <div className="max-w-[480px] mx-auto mb-8" data-reveal>
          <TerminalBlock code="npm install monita" showCopy />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-reveal>
          <Button
            variant="signal"
            size="lg"
            className="font-display font-bold px-8"
            asChild
          >
            <Link href="/signup">
              Start for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>

        {/* Fine print */}
        <p className="text-xs text-text-muted" data-reveal>
          No credit card required &bull; 10,000 logs free forever &bull; Cancel
          anytime
        </p>
      </div>
    </section>
  );
}
