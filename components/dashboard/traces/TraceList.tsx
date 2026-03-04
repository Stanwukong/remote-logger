"use client";

import { useRouter } from "next/navigation";
import { SignalDot } from "@/components/shared/SignalDot";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TraceSummary } from "@/services/trace.service";
import { format } from "date-fns";

interface TraceListProps {
  traces: TraceSummary[];
  projectId: string;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function TraceList({ traces, projectId }: TraceListProps) {
  const router = useRouter();

  if (traces.length === 0) {
    return (
      <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
        <h3 className="text-lg font-display font-semibold text-text-primary">
          No traces found
        </h3>
        <p className="text-text-secondary mt-2 max-w-md mx-auto">
          No traces found. Enable distributed tracing in your SDK configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1.5fr_100px_80px_80px_1fr_140px] gap-4 px-4 py-3 border-b border-border-subtle bg-bg-elevated/30 text-xs font-medium text-text-muted uppercase tracking-wider">
        <span>Trace ID</span>
        <span>Root Span</span>
        <span>Duration</span>
        <span>Spans</span>
        <span>Status</span>
        <span>Services</span>
        <span>Start Time</span>
      </div>

      {/* Table rows */}
      {traces.map((trace) => {
        const hasError = trace.hasErrors > 0;
        return (
          <div
            key={trace._id}
            onClick={() =>
              router.push(`/projects/${projectId}/traces/${trace._id}`)
            }
            className={cn(
              "grid grid-cols-[1fr_1.5fr_100px_80px_80px_1fr_140px] gap-4 px-4 py-3 border-b border-border-subtle cursor-pointer transition-colors hover:bg-bg-elevated/50",
              hasError && "border-l-2 border-l-status-danger"
            )}
          >
            {/* Trace ID */}
            <span className="font-mono text-sm text-text-primary truncate">
              {trace._id.slice(0, 8)}
            </span>

            {/* Root Span */}
            <span className="text-sm text-text-secondary truncate">
              {trace.rootSpanName || "Unknown"}
            </span>

            {/* Duration */}
            <span className="font-mono text-sm text-text-primary">
              {formatDuration(trace.duration)}
            </span>

            {/* Span Count */}
            <span className="text-sm text-text-secondary">
              {trace.spanCount}
            </span>

            {/* Status */}
            <span className="flex items-center gap-1.5">
              <SignalDot
                status={hasError ? "danger" : "ok"}
                size="sm"
                pulse={false}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  hasError ? "text-status-danger" : "text-status-ok"
                )}
              >
                {hasError ? "Error" : "OK"}
              </span>
            </span>

            {/* Services */}
            <div className="flex items-center gap-1 overflow-hidden">
              {trace.services.slice(0, 3).map((svc) => (
                <Badge
                  key={svc}
                  variant="outline"
                  className="text-[10px] text-text-muted shrink-0"
                >
                  {svc}
                </Badge>
              ))}
              {trace.services.length > 3 && (
                <span className="text-[10px] text-text-muted">
                  +{trace.services.length - 3}
                </span>
              )}
            </div>

            {/* Start Time */}
            <span className="font-mono text-xs text-text-muted">
              {format(new Date(trace.startTime), "MMM dd HH:mm:ss")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
