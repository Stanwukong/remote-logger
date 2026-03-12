"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";
import {
  Activity,
  Bell,
  Brain,
  Shield,
  Users,
} from "lucide-react";

/* ============================================================================
   BENTO CARD COMPONENT
   ============================================================================ */

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}

function BentoCard({ children, className = "", featured }: BentoCardProps) {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:bg-bg-elevated hover:border-border-accent hover:-translate-y-0.5 shadow-[inset_0_1px_0_#ffffff10] ${
        featured
          ? "border-t-2 border-t-signal shadow-[var(--shadow-card),var(--glow-signal)]"
          : ""
      } ${className}`}
      data-stagger
    >
      {children}
    </div>
  );
}

/* ============================================================================
   WAVEFORM DECORATION
   ============================================================================ */

function Waveform() {
  return (
    <div className="flex items-end gap-1 h-8 mt-4">
      {[12, 20, 8, 28, 16, 24, 10].map((h, i) => (
        <div
          key={i}
          className="w-1.5 bg-signal/60 rounded-full"
          style={{
            height: `${h}px`,
            animation: `waveform 1.2s ease-in-out ${i * 0.15}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   HEALTH SCORE RING
   ============================================================================ */

function HealthRing() {
  const score = 94;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--border-faint)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display font-extrabold text-2xl"
          fill="var(--text-primary)"
        >
          {score}
        </text>
      </svg>
    </div>
  );
}

/* ============================================================================
   MAIN FEATURES / BENTO GRID
   ============================================================================ */

const sdkCode = `import { Apperio } from 'apperio';

const logger = new Apperio({
  apiKey: 'mnt_••••••••••••',
  projectId: 'proj_••••••••',
});

logger.init(); // That's it.`;

export function Features() {
  const containerRef = useStaggerReveal({ stagger: 0.1 });

  return (
    <section id="features" className="py-24" ref={containerRef}>
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="BUILT FOR DEVELOPERS"
          headline="Everything you need to"
          headlineAccent="see clearly."
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-16">
          {/* Row 1: 3 | 6 | 3 */}
          <BentoCard className="md:col-span-3">
            <Activity className="w-6 h-6 text-signal mb-3" />
            <h3 className="font-display font-bold text-base text-text-primary mb-2">
              Live. Always.
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Logs appear in your dashboard within milliseconds of firing.
            </p>
            <Waveform />
          </BentoCard>

          <BentoCard className="md:col-span-6 min-h-[280px]" featured>
            <h3 className="font-display font-bold text-lg text-text-primary mb-2">
              Log Explorer
            </h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Instant full-text search across every event. Filter by level,
              service, environment, time. Click any log for the full context.
            </p>
            {/* Mini log explorer */}
            <div className="rounded-lg border border-border-faint bg-bg-void/80 p-3 space-y-1.5">
              {[
                { level: "ERR", msg: "Payment timeout: stripe_pi_3Mx...", color: "text-level-error bg-level-error/10" },
                { level: "WRN", msg: "Rate limit approaching (87/100)", color: "text-level-warn bg-level-warn/10" },
                { level: "INF", msg: "User session created: usr_8k2...", color: "text-level-info bg-level-info/10" },
                { level: "ERR", msg: "Auth token expired: tkn_j4m...", color: "text-level-error bg-level-error/10" },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.color}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-text-primary font-code truncate">
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-3">
            <Bell className="w-6 h-6 text-signal mb-3" />
            <h3 className="font-display font-bold text-base text-text-primary mb-2">
              Signal, not noise
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Alert rules that know when to wake you up — and when not to.
            </p>
            {/* Mini notification */}
            <div className="mt-4 p-2.5 rounded-lg border border-status-danger/20 bg-status-danger/5 text-xs">
              <span className="font-semibold text-status-danger">
                2 critical alerts
              </span>
              <span className="text-text-muted ml-1">• api-service</span>
            </div>
          </BentoCard>

          {/* Row 2: 7 | 5 */}
          <BentoCard className="md:col-span-7 min-h-[260px]">
            <div className="grid md:grid-cols-2 gap-6 h-full">
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                  Five minutes to full observability
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Drop two lines of code and get automatic error capture,
                  performance tracking, network monitoring, and real-time
                  dashboards. No YAML. No agents. No ceremony.
                </p>
              </div>
              <TerminalBlock
                code={sdkCode}
                filename="app.ts"
                language="typescript"
                className="h-full"
              />
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-5 min-h-[260px]">
            <Shield className="w-6 h-6 text-signal mb-3" />
            <h3 className="font-display font-bold text-base text-text-primary mb-2">
              Privacy by default
            </h3>
            <div className="space-y-3 mt-4">
              <div className="p-2.5 rounded border border-status-danger/20 bg-status-danger/5 text-xs font-code">
                <span className="text-text-muted">Before:</span>{" "}
                <span className="text-text-primary">
                  User login: john.doe@company.com — SSN: 123-45-6789
                </span>
              </div>
              <div className="text-center text-text-muted text-xs">
                ↓ auto-sanitized
              </div>
              <div className="p-2.5 rounded border border-signal/20 bg-signal-muted text-xs font-code">
                <span className="text-text-muted">After:</span>{" "}
                <span className="text-text-primary">
                  User login:{" "}
                  <span className="text-signal">[EMAIL_REDACTED]</span> — SSN:{" "}
                  <span className="text-signal">[SSN_REDACTED]</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              10 built-in PII patterns. Sanitized before leaving your app.
              GDPR-ready.
            </p>
          </BentoCard>

          {/* Row 3: 4 | 4 | 4 */}
          <BentoCard className="md:col-span-4">
            <Brain className="w-6 h-6 text-data mb-3" />
            <h3 className="font-display font-bold text-base text-text-primary mb-2">
              AI-powered insights
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Apperio surfaces root causes, not just symptoms.
            </p>
            <div className="p-3 rounded-lg border border-data/20 bg-data-muted text-xs text-text-primary leading-relaxed">
              <span className="text-data font-semibold">↗</span> Error rate
              increased 340% in the last hour. Root cause: auth-service timeout
              cascade.
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-4">
            <HealthRing />
            <h3 className="font-display font-bold text-base text-text-primary mt-3 mb-2 text-center">
              Project Health Score
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed text-center">
              Real-time scoring for each project. Know which services need
              attention before users do.
            </p>
          </BentoCard>

          <BentoCard className="md:col-span-4">
            <Users className="w-6 h-6 text-signal mb-3" />
            <h3 className="font-display font-bold text-base text-text-primary mb-2">
              Built for teams
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Share dashboards, set role-based access, and investigate incidents
              together.
            </p>
            {/* Avatar stack */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["J", "A", "S"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-bg-elevated border-2 border-bg-surface flex items-center justify-center text-[10px] font-semibold text-text-secondary"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-xs text-text-muted">Shared workspace</span>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
