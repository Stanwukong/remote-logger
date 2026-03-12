"use client";

import { cn } from "@/lib/utils";
import { SignalDot } from "@/components/shared/SignalDot";

interface HealthRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { px: 48, r: 18, stroke: 3, fontSize: "text-sm" },
  md: { px: 64, r: 24, stroke: 4, fontSize: "text-lg" },
  lg: { px: 96, r: 38, stroke: 5, fontSize: "text-2xl" },
};

function getHealthStatus(score: number) {
  if (score >= 80) return { label: "Excellent", status: "ok" as const, color: "var(--status-ok)" };
  if (score >= 60) return { label: "Good", status: "warn" as const, color: "var(--status-warn)" };
  return { label: "Poor", status: "danger" as const, color: "var(--status-danger)" };
}

export function HealthRing({
  score,
  size = "md",
  showLabel = true,
  className,
}: HealthRingProps) {
  const cfg = sizeConfig[size];
  const circumference = 2 * Math.PI * cfg.r;
  const offset = circumference * (1 - Math.min(score, 100) / 100);
  const health = getHealthStatus(score);
  const center = cfg.px / 2;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative" style={{ width: cfg.px, height: cfg.px }}>
        <svg
          width={cfg.px}
          height={cfg.px}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={cfg.r}
            stroke="var(--border-faint)"
            strokeWidth={cfg.stroke}
            fill="none"
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={cfg.r}
            stroke={health.color}
            strokeWidth={cfg.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-display font-bold text-text-primary", cfg.fontSize)}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">Health Score</p>
          <div className="flex items-center gap-1.5">
            <SignalDot status={health.status} size="sm" />
            <span className="text-xs text-text-secondary capitalize">
              {health.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
