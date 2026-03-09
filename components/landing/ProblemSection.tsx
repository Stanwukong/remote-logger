"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SignalDot } from "@/components/shared/SignalDot";
import { useScrollReveal } from "@/hooks/useGsapAnimations";

const chaosLogs = [
  'console.log("user data:", userData)',
  'console.log("HERE 2")',
  "console.log(response.data)",
  'console.log("WHY IS THIS NULL???", result)',
  'console.log("=== DEBUG START ===")',
  "console.error(err)",
  'console.log("TODO: remove this")',
  'console.log("fix later:", payload)',
];

const structuredLogs = [
  { level: "error", msg: "Payment timeout: stripe_pi_3Mx...", time: "12:04:32" },
  { level: "warn", msg: "Rate limit approaching (87/100)", time: "12:04:28" },
  { level: "info", msg: "User session created: usr_8k2...", time: "12:04:25" },
  { level: "error", msg: "DB connection pool exhausted", time: "12:04:22" },
  { level: "info", msg: "Deployment v2.4.1 rolled out", time: "12:04:18" },
];

const levelColors: Record<string, string> = {
  error: "text-level-error bg-level-error/10 border-level-error/20",
  warn: "text-level-warn bg-level-warn/10 border-level-warn/20",
  info: "text-level-info bg-level-info/10 border-level-info/20",
};

export function ProblemSection() {
  const containerRef = useScrollReveal();

  return (
    <section className="py-24 bg-bg-base" ref={containerRef}>
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="THE PROBLEM"
          headline="You're flying blind in production"
          sub='Every developer has shipped console.log to production and hoped for the best.'
        />

        <div className="grid md:grid-cols-2 gap-6 mt-16 relative" data-reveal>
          {/* Left: Without Monita */}
          <div className="rounded-xl border border-status-danger/20 bg-bg-surface overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-status-danger/20 bg-status-danger/5">
              <SignalDot status="danger" size="sm" />
              <span className="text-xs font-display font-semibold text-status-danger uppercase tracking-wider">
                Without Apperio
              </span>
            </div>
            <div className="p-4 font-code text-xs leading-relaxed text-text-muted space-y-1 h-[240px] overflow-hidden">
              {chaosLogs.map((log, i) => (
                <div key={i} className="opacity-70">
                  <span className="text-syntax-comment">{">"}</span>{" "}
                  <span className="text-syntax-string">{log}</span>
                </div>
              ))}
              <div className="text-status-danger/60 mt-2">
                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                {"// 47 more console.logs in this file..."}
              </div>
            </div>
          </div>

          {/* Center VS divider — desktop only */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-10 h-10 rounded-full border border-border-accent bg-bg-elevated flex items-center justify-center text-xs font-display font-bold text-text-secondary">
              VS
            </div>
          </div>

          {/* Right: With Monita */}
          <div className="rounded-xl border border-signal/20 bg-bg-surface overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-signal/20 bg-signal-muted">
              <SignalDot status="ok" size="sm" />
              <span className="text-xs font-display font-semibold text-signal uppercase tracking-wider">
                With Apperio
              </span>
            </div>
            <div className="p-4 space-y-2 h-[240px] overflow-hidden">
              {structuredLogs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-md border border-border-faint bg-bg-void/50 text-xs"
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${levelColors[log.level]}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-text-primary flex-1 truncate font-code">
                    {log.msg}
                  </span>
                  <span className="text-text-muted font-code shrink-0">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
