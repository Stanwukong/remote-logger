"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LiveLogStream } from "./LiveLogStream";
import { FeatureCard } from "./FeatureCard";
import { useHeroSequence, useScrollReveal, useStaggerReveal } from "@/hooks/useGsapAnimations";
import {
  ArrowRight,
  Sparkles,
  Github,
  Activity,
  Zap,
  Shield,
  Bell,
  CheckCircle2,
} from "lucide-react";

// ─── Email Form (shared between hero + closing CTA) ─────────────────────────

function WaitlistForm({
  submitted,
  position,
  loading,
  onSubmit,
}: {
  submitted: boolean;
  position: number | null;
  loading: boolean;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) onSubmit(email.trim());
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 animate-fade-in">
        <CheckCircle2 className="w-5 h-5 text-signal animate-signal-pulse" />
        <p className="text-text-primary font-display font-semibold">
          You&apos;re #{position} on the list.{" "}
          <span className="text-text-secondary font-body font-normal">
            We&apos;ll be in touch.
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-11 bg-bg-void/80 border-border-subtle text-text-primary placeholder:text-text-muted"
      />
      <Button
        type="submit"
        variant="signal"
        size="lg"
        disabled={loading}
        className="font-display font-bold text-sm px-6 h-11 shrink-0"
      >
        {loading ? "Joining..." : "Request Early Access"}
        {!loading && <ArrowRight className="ml-1 w-4 h-4" />}
      </Button>
    </form>
  );
}

// ─── AI Insight typing animation ─────────────────────────────────────────────

function AIInsightTyping() {
  const [text, setText] = useState("");
  const fullText =
    "TypeError spike detected in /checkout. 12x increase in last 15min. Root cause: null response from payment API after deploy v2.4.1. Suggested fix: add null check at checkout.ts:142.";
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setText(fullText.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        // Reset after pause
        setTimeout(() => {
          indexRef.current = 0;
          setText("");
        }, 2000);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-signal/20 bg-signal/5 p-3 text-[12px] font-mono text-text-secondary leading-relaxed h-[100px] sm:h-[88px] overflow-hidden">
      <span className="text-signal font-semibold">AI Insight: </span>
      {text}
      <span className="inline-block w-[2px] h-3 bg-signal ml-0.5 animate-pulse" />
    </div>
  );
}

// ─── Mini Sparkline ──────────────────────────────────────────────────────────

function MiniSparkline() {
  const bars = [35, 45, 30, 60, 80, 55, 70, 90, 65, 40, 75, 85];
  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[6px] rounded-sm bg-signal/60 transition-all duration-500"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Redacted PII demo ──────────────────────────────────────────────────────

function RedactedText() {
  return (
    <div className="text-[12px] font-mono space-y-1">
      <div>
        <span className="text-text-muted">email: </span>
        <span className="bg-status-danger/20 text-status-danger px-1 rounded line-through">
          john@example.com
        </span>
        <span className="text-signal ml-1">&rarr; [EMAIL_REDACTED]</span>
      </div>
      <div>
        <span className="text-text-muted">card: </span>
        <span className="bg-status-danger/20 text-status-danger px-1 rounded line-through">
          4242-4242-4242-4242
        </span>
        <span className="text-signal ml-1">&rarr; [CC_REDACTED]</span>
      </div>
    </div>
  );
}

// ─── Mock GitHub Issue ───────────────────────────────────────────────────────

function MockGithubIssue() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-void/80 p-3 text-[12px]">
      <div className="flex items-center gap-2 mb-2">
        <Github className="w-3.5 h-3.5 text-text-muted" />
        <span className="font-mono text-text-secondary">
          #142 <span className="text-status-danger">bug</span>
        </span>
      </div>
      <p className="font-semibold text-text-primary text-[11px]">
        TypeError in checkout flow
      </p>
      <p className="text-text-muted text-[10px] mt-1">
        Auto-generated with stack trace, user context, and environment details
      </p>
    </div>
  );
}

// ─── Main Waitlist Page ──────────────────────────────────────────────────────

export function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const heroRef = useHeroSequence();
  const featuresRef = useStaggerReveal({ stagger: 0.1 });
  const stepsRef = useScrollReveal();
  const closingRef = useScrollReveal();

  const handleSubmit = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosition(data.position);
        setSubmitted(true);
      }
    } catch {
      // Fail silently — form stays visible for retry
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section id="waitlist" ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column — text */}
            <div className='w-full'>
              {/* Badge pill */}
              <div className="mb-8" data-hero-badge>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-signal bg-signal-muted">
                  <SignalDot status="ok" size="sm" />
                  <span className="text-xs font-display font-semibold uppercase tracking-[0.08em] text-signal">
                    Private Beta &mdash; Limited Early Access
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1
                className="font-display font-extrabold tracking-[-0.03em] leading-[1.08] mb-6"
                style={{ fontSize: "clamp(28px, 5.5vw, 72px)" }}
              >
                <span data-hero-headline>Your production app is</span>
                <br />
                <span data-hero-headline>
                  <span className="text-status-danger animate-text-glitch" style={{ animationDelay: "1s" }}>
                    screaming
                  </span>{" "}
                  into the{" "}
                  <span className="text-signal">void.</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed" data-hero-sub>
                Apperio catches every error, measures every interaction, and turns
                chaos into clarity before your users file a ticket.
              </p>

              {/* Email form */}
              <div data-hero-ctas className="mb-4">
                <WaitlistForm
                  submitted={submitted}
                  position={position}
                  loading={loading}
                  onSubmit={handleSubmit}
                />
              </div>

              {/* Trust line */}
              <p className="text-xs text-text-muted" data-hero-trust>
                No spam. Charter members get locked pricing + roadmap input.
              </p>
            </div>

            {/* Right column — LiveLogStream */}
            <div data-hero-preview className="lg:mt-0 mt-4">
              <LiveLogStream />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: SIGNAL BAR ═══ */}
      <section className="relative py-6 border-y border-border-faint backdrop-blur-md bg-bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <span className="flex items-center gap-3">
              <span className="font-mono font-bold text-signal text-lg">1</span>
              <span className="text-text-muted">npm install</span>
            </span>
            <span className="w-px h-4 bg-border-subtle hidden sm:block" />
            <span className="flex items-center gap-3">
              <span className="font-mono font-bold text-signal text-lg">&lt;5</span>
              <span className="text-text-muted">min setup</span>
            </span>
            <span className="w-px h-4 bg-border-subtle hidden sm:block" />
            <span className="flex items-center gap-3">
              <span className="font-mono font-bold text-signal text-lg">0</span>
              <span className="text-text-muted">config auto-capture</span>
            </span>
            <span className="w-px h-4 bg-border-subtle hidden sm:block" />
            <span className="flex items-center gap-3">
              <span className="font-mono font-bold text-signal text-lg">10K</span>
              <span className="text-text-muted">logs free/mo</span>
            </span>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: FEATURE BENTO GRID ═══ */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionHeading
            eyebrow="Why Apperio"
            headline="Every signal your app sends,"
            headlineAccent="captured and understood."
            sub="Stop stitching together five different tools. One SDK, one dashboard, one source of truth."
          />

          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16"
          >
            <FeatureCard
              pain="Logs are noise without context"
              title="AI-Powered Insights"
              description="Pattern detection, anomaly surfacing, and actionable fix suggestions, powered by AI that understands your codebase."
              icon={<Sparkles className="w-4 h-4" />}
              visual={<AIInsightTyping />}
              span={2}
            />

            <FeatureCard
              pain="Copy-pasting stack traces into issues"
              title="GitHub Issue Generation"
              description="One click: error becomes a GitHub Issue with full stack trace, user context, and environment details."
              icon={<Github className="w-4 h-4" />}
              visual={<MockGithubIssue />}
            />

            <FeatureCard
              pain="Users complain before you notice"
              title="Performance Monitoring"
              description="Web Vitals, network timing, interaction latency. Tracked automatically across every session."
              icon={<Activity className="w-4 h-4" />}
              visual={
                <div className="flex items-center gap-4">
                  <MiniSparkline />
                  <div className="text-[11px] font-mono">
                    <div className="text-signal">LCP 1.2s</div>
                    <div className="text-status-warn">FID 120ms</div>
                    <div className="text-text-muted">CLS 0.03</div>
                  </div>
                </div>
              }
              span={2}
            />

            <FeatureCard
              pain="Manual logging is incomplete"
              title="Auto-Instrumentation"
              description="Errors, network requests, clicks, page views, console logs. All captured with zero configuration."
              icon={<Zap className="w-4 h-4" />}
              visual={
                <div className="rounded-lg bg-bg-void/80 p-3 font-mono text-[12px] text-text-secondary">
                  <span className="text-signal">const</span> apperio ={" "}
                  <span className="text-signal">new</span>{" "}
                  <span className="text-data">Apperio</span>
                  {"({\n  "}
                  <span className="text-text-muted">apiKey</span>:{" "}
                  <span className="text-status-warn">&apos;your-key&apos;</span>
                  {"\n})"}
                </div>
              }
            />

            <FeatureCard
              pain="Accidentally logging user data"
              title="PII Protection"
              description="10+ built-in detection patterns for emails, credit cards, SSNs, API keys. GDPR-ready sanitization with audit trail."
              icon={<Shield className="w-4 h-4" />}
              visual={<RedactedText />}
            />

            <FeatureCard
              pain="Finding out from Twitter"
              title="Real-Time Alerts"
              description="Slack, email, or webhook notifications triggered by thresholds, anomalies, or error spikes before users notice."
              icon={<Bell className="w-4 h-4" />}
              visual={
                <div className="rounded-lg border border-border-subtle bg-bg-void/80 p-3 text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#4A154B] flex items-center justify-center text-[8px] text-white font-bold">
                      S
                    </div>
                    <span className="text-text-muted font-mono">#eng-alerts</span>
                  </div>
                  <p className="mt-2 text-text-secondary text-[11px]">
                    <span className="text-status-danger font-semibold">Error spike</span>{" "}
                    in /api/checkout &mdash; 23 errors in 5min (baseline: 2)
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 sm:py-32 border-t border-border-faint" ref={stepsRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <SectionHeading
            eyebrow="Get Started"
            headline="Three steps to"
            headlineAccent="complete observability."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1 */}
            <div className="text-center" data-reveal>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-signal text-bg-void font-display font-bold text-sm mb-5">
                1
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Install</h3>
              <TerminalBlock code="npm install apperio" showCopy className="text-left" />
            </div>

            {/* Step 2 */}
            <div className="text-center" data-reveal>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-signal text-bg-void font-display font-bold text-sm mb-5">
                2
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Initialize</h3>
              <div className="rounded-lg border border-border-subtle bg-bg-void p-4 text-left">
                <pre className="text-[12px] font-mono text-text-secondary leading-relaxed">
                  <code>
                    <span className="text-signal">import</span> {"{ Apperio }"}{" "}
                    <span className="text-signal">from</span>{" "}
                    <span className="text-status-warn">&apos;apperio&apos;</span>
                    {"\n\n"}
                    <span className="text-signal">const</span> apperio ={" "}
                    <span className="text-signal">new</span>{" "}
                    <span className="text-data">Apperio</span>
                    {"({\n  "}
                    apiKey: <span className="text-status-warn">&apos;your-key&apos;</span>
                    {"\n})"}
                  </code>
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center" data-reveal>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-signal text-bg-void font-display font-bold text-sm mb-5">
                3
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Observe</h3>
              <div className="rounded-lg border border-border-subtle bg-bg-void p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-text-muted">Error Rate</span>
                  <span className="text-[11px] font-mono text-status-danger">-47%</span>
                </div>
                <MiniSparkline />
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono">
                  <span className="text-text-muted">24h trend</span>
                  <span className="text-signal flex items-center gap-1">
                    <SignalDot status="ok" size="sm" pulse={false} />
                    Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CLOSING CTA ═══ */}
      <section className="py-32 relative overflow-hidden" ref={closingRef}>
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          {/* Pre-headline */}
          <div className="flex items-center justify-center gap-2 mb-6" data-reveal>
            <SignalDot status="ok" size="sm" />
            <span className="text-sm text-text-muted">Production-ready in 5 minutes</span>
          </div>

          {/* Headline */}
          <h2
            className="font-display font-extrabold tracking-tight leading-[1.1] text-text-primary mb-6"
            style={{ fontSize: "clamp(24px, 4.5vw, 56px)" }}
            data-reveal
          >
            Be the first to know when
            <br />
            your app breaks &mdash; <span className="text-signal">not the last.</span>
          </h2>

          {/* Form */}
          <div className="flex justify-center mb-8" data-reveal>
            <WaitlistForm
              submitted={submitted}
              position={position}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Terminal */}
          <div className="max-w-[480px] mx-auto mb-8" data-reveal>
            <TerminalBlock code="npm install apperio" showCopy />
          </div>

          {/* Fine print */}
          <p className="text-xs text-text-muted" data-reveal>
            Free tier forever &bull; No credit card &bull; Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
