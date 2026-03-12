"use client";

import { cn } from "@/lib/utils";

type Rating = "good" | "needs-improvement" | "poor";

interface VitalCardProps {
  name: string;
  p50: number;
  p75: number;
  p95: number;
  count: number;
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
}

// Google Core Web Vitals thresholds
const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, p75: number): Rating {
  const threshold = THRESHOLDS[name];
  if (!threshold) return "needs-improvement";
  if (p75 < threshold.good) return "good";
  if (p75 < threshold.poor) return "needs-improvement";
  return "poor";
}

function formatValue(name: string, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)}`;
}

function getUnit(name: string): string {
  if (name === "CLS") return "";
  return "ms";
}

function getFullName(name: string): string {
  switch (name) {
    case "LCP":
      return "Largest Contentful Paint";
    case "CLS":
      return "Cumulative Layout Shift";
    case "INP":
      return "Interaction to Next Paint";
    default:
      return name;
  }
}

const ratingStyles: Record<Rating, { badge: string; border: string }> = {
  good: {
    badge: "bg-signal/15 text-signal",
    border: "border-l-signal",
  },
  "needs-improvement": {
    badge: "bg-status-warn/15 text-status-warn",
    border: "border-l-status-warn",
  },
  poor: {
    badge: "bg-status-danger/15 text-status-danger",
    border: "border-l-status-danger",
  },
};

const ratingLabels: Record<Rating, string> = {
  good: "Good",
  "needs-improvement": "Needs Improvement",
  poor: "Poor",
};

export function VitalCard({
  name,
  p50,
  p75,
  p95,
  count,
  goodCount,
  needsImprovementCount,
  poorCount,
}: VitalCardProps) {
  const rating = getRating(name, p75);
  const styles = ratingStyles[rating];
  const unit = getUnit(name);

  return (
    <div
      className={cn(
        "bg-bg-surface border border-border-subtle rounded-lg p-5 transition-all duration-200 border-l-4",
        styles.border
      )}
    >
      {/* Header: Name + Rating badge */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">{name}</p>
          <p className="text-xs text-text-muted">{getFullName(name)}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            styles.badge
          )}
        >
          {ratingLabels[rating]}
        </span>
      </div>

      {/* Primary metric: p75 */}
      <div className="mb-3">
        <span className="font-mono text-2xl text-text-primary font-bold">
          {formatValue(name, p75)}
        </span>
        {unit && (
          <span className="text-sm text-text-muted ml-1">{unit}</span>
        )}
        <span className="text-xs text-text-muted ml-2">p75</span>
      </div>

      {/* Secondary row: p50 and p95 */}
      <p className="text-text-muted text-xs font-mono mb-2">
        p50: {formatValue(name, p50)}
        {unit} | p95: {formatValue(name, p95)}
        {unit}
      </p>

      {/* Rating distribution bar */}
      <div className="mb-2">
        <div className="flex h-1.5 rounded-full overflow-hidden bg-bg-elevated">
          {count > 0 && (
            <>
              <div
                className="bg-signal transition-all"
                style={{ width: `${(goodCount / count) * 100}%` }}
              />
              <div
                className="bg-status-warn transition-all"
                style={{
                  width: `${(needsImprovementCount / count) * 100}%`,
                }}
              />
              <div
                className="bg-status-danger transition-all"
                style={{ width: `${(poorCount / count) * 100}%` }}
              />
            </>
          )}
        </div>
      </div>

      {/* Sample count */}
      <p className="text-text-muted text-xs">
        {count.toLocaleString()} samples
      </p>
    </div>
  );
}
