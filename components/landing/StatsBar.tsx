"use client";

import { useCountUp, useScrollReveal } from "@/hooks/useGsapAnimations";

interface StatItemProps {
  target: string;
  suffix: string;
  label: string;
}

function StatItem({ target, suffix, label }: StatItemProps) {
  const ref = useCountUp({ duration: 1.2 });

  return (
    <div className="text-center px-4">
      <div className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-signal tracking-tight">
        <span ref={ref} data-target={target}>
          0
        </span>
        <span>{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </div>
  );
}

const stats = [
  { target: "5", suffix: " min", label: "Setup time" },
  { target: "10", suffix: "K", label: "Free logs/mo" },
  { target: "99.9", suffix: "%", label: "Uptime SLA" },
  { target: "133", suffix: "+", label: "Live features" },
];

export function StatsBar() {
  const containerRef = useScrollReveal({ y: 16 });

  return (
    <section className="py-20 bg-bg-void" ref={containerRef}>
      <div
        className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-border-faint"
        data-reveal
      >
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
