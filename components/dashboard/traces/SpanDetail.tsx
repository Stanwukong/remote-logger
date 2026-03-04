"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import { cn, getLevelColor, getLevelIcon } from "@/lib/utils";
import { SpanData } from "@/services/trace.service";
import { LogEntry } from "@/types/analytics";
import { format } from "date-fns";
import { Clock, Layers, Link2, X } from "lucide-react";

interface SpanDetailProps {
  span: SpanData;
  logs: LogEntry[];
  onClose?: () => void;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function SpanDetail({ span, logs, onClose }: SpanDetailProps) {
  const hasError = span.hasErrors > 0;

  return (
    <Card className="bg-bg-surface border-border-subtle h-full overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base font-display truncate">
              {span.name}
            </CardTitle>
            <div className="flex items-center gap-2">
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
              {span.service && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-text-muted"
                >
                  {span.service}
                </Badge>
              )}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-elevated rounded transition-colors text-text-muted hover:text-text-primary"
              aria-label="Close detail panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timing info */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Timing
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-text-muted text-xs">Start</span>
              <p className="font-mono text-xs text-text-primary">
                {format(new Date(span.startTime), "HH:mm:ss.SSS")}
              </p>
            </div>
            <div>
              <span className="text-text-muted text-xs">End</span>
              <p className="font-mono text-xs text-text-primary">
                {format(new Date(span.endTime), "HH:mm:ss.SSS")}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-text-muted text-xs">Duration</span>
              <p className="font-mono text-sm text-text-primary font-medium">
                {formatDuration(span.duration)}
              </p>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Attributes
          </h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Span ID</span>
              <span className="font-mono text-text-secondary">
                {span.spanId.slice(0, 12)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Trace ID</span>
              <span className="font-mono text-text-secondary">
                {span.traceId.slice(0, 12)}
              </span>
            </div>
            {span.parentSpanId && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Parent Span
                </span>
                <span className="font-mono text-text-secondary">
                  {span.parentSpanId.slice(0, 12)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Level</span>
              <span className="text-text-secondary">{span.level}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Log Count</span>
              <span className="text-text-secondary">{span.logCount}</span>
            </div>
          </div>
        </div>

        {/* Related Logs */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Related Logs ({logs.length})
            </h4>
            <div className="space-y-1 max-h-64 overflow-auto">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className={cn(
                    "p-2 rounded border-l-2 text-xs",
                    getLevelColor(log.level)
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {getLevelIcon(log.level)}
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0"
                    >
                      {log.level}
                    </Badge>
                    <span className="font-mono text-text-muted text-[10px]">
                      {format(new Date(log.timestamp), "HH:mm:ss.SSS")}
                    </span>
                  </div>
                  <p className="text-text-secondary truncate">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {logs.length === 0 && (
          <div className="text-center py-4 text-xs text-text-muted">
            No logs associated with this span.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
