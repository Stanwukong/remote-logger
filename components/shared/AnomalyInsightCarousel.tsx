"use client";

import { Anomaly, AnomalySeverity, AnomalyType } from "@/types/anomaly.types";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map anomaly type to icon
const typeIcons: Record<AnomalyType, React.ReactNode> = {
  log_volume_spike: <TrendingUp className="w-4 h-4" />,
  error_rate_increase: <AlertTriangle className="w-4 h-4" />,
  response_time_degradation: <Activity className="w-4 h-4" />,
  error_spike: <Zap className="w-4 h-4" />,
};

// Friendly labels for anomaly types
const typeLabels: Record<AnomalyType, string> = {
  log_volume_spike: "Volume Spike",
  error_rate_increase: "Error Rate",
  response_time_degradation: "Slow Response",
  error_spike: "Error Spike",
};

// Severity → badge variant map
const severityVariant: Record<AnomalySeverity, "status-danger" | "status-warn" | "level-info"> = {
  critical: "status-danger",
  warning: "status-warn",
  info: "level-info",
};

// Severity → left border color
const severityBorder: Record<AnomalySeverity, string> = {
  critical: "border-l-status-danger",
  warning: "border-l-status-warn",
  info: "border-l-level-info",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface AnomalyInsightCarouselProps {
  anomalies: Anomaly[];
  className?: string;
}

export function AnomalyInsightCarousel({
  anomalies,
  className,
}: AnomalyInsightCarouselProps) {
  if (!anomalies || anomalies.length === 0) return null;

  // Priority sort: critical first, then by recency
  const sorted = [...anomalies].sort((a, b) => {
    const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
    const sDiff = (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3);
    if (sDiff !== 0) return sDiff;
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });

  return (
    <div className={cn("relative", className)}>
      {/* Gradient fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-r from-bg-base to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-l from-bg-base to-transparent" />

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-1">
        {sorted.slice(0, 5).map((anomaly) => (
          <div
            key={anomaly._id}
            className={cn(
              "flex-shrink-0 w-[280px] bg-bg-surface border border-border-faint rounded-xl p-4 border-l-[3px] transition-all hover:border-border-subtle hover:-translate-y-px",
              severityBorder[anomaly.severity]
            )}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-text-muted",
                  anomaly.severity === "critical" && "text-status-danger",
                  anomaly.severity === "warning" && "text-status-warn"
                )}>
                  {typeIcons[anomaly.type]}
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {typeLabels[anomaly.type]}
                </span>
              </div>
              <Badge variant={severityVariant[anomaly.severity]} className="text-[10px] px-1.5 py-0">
                {anomaly.severity}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">
              {anomaly.description}
            </p>

            {/* Footer: deviation + timestamp */}
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span className="font-mono">
                {anomaly.deviation > 0 ? "+" : ""}
                {anomaly.deviation}σ
                {anomaly.percentChange !== 0 && (
                  <span className="ml-1">
                    ({anomaly.percentChange > 0 ? "+" : ""}
                    {Math.round(anomaly.percentChange)}%)
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(anomaly.detectedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
