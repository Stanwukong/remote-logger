"use client";

import { Button } from "@/components/ui/button";
import { SignalDot } from "@/components/shared/SignalDot";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export function EarlyAccessGate() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, var(--signal-glow) 0%, transparent 60%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border-subtle bg-bg-surface/80 backdrop-blur-xl p-8 sm:p-10 text-center animate-fade-in shadow-2xl">
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-signal/10 border border-signal/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-signal" />
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <SignalDot status="warn" size="sm" />
          <span className="text-[11px] font-display font-semibold uppercase tracking-[0.12em] text-status-warn">
            Private Beta
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight mb-4">
          Apperio is in early access.
        </h1>

        {/* Body */}
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8 max-w-sm mx-auto">
          We&apos;re onboarding select teams to ensure a great experience. Join
          the waitlist to get notified when your spot opens up.
        </p>

        {/* CTA */}
        <Button
          variant="signal"
          size="lg"
          className="font-display font-bold px-8"
          asChild
        >
          <Link href="/">
            Join the Waitlist
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>

        {/* Fine print */}
        <p className="text-xs text-text-muted mt-6">
          Already on the list? We&apos;ll email you when it&apos;s your turn.
        </p>
      </div>
    </div>
  );
}
