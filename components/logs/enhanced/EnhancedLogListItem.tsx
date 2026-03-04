"use client";

import { LogEntry } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { SignalDot } from "@/components/shared/SignalDot";
import { Badge } from "@/components/ui/badge";

interface EnhancedLogListItemProps {
  log: LogEntry;
  isSelected: boolean;
  onSelect: (log: LogEntry) => void;
}

const LEVEL_COLORS = {
  trace: "text-[var(--level-trace)] bg-[var(--level-trace)]/10 border-[var(--level-trace)]/30",
  debug: "text-[var(--level-debug)] bg-[var(--level-debug)]/10 border-[var(--level-debug)]/30",
  info: "text-[var(--level-info)] bg-[var(--level-info)]/10 border-[var(--level-info)]/30",
  warn: "text-[var(--level-warn)] bg-[var(--level-warn)]/10 border-[var(--level-warn)]/30",
  error: "text-[var(--level-error)] bg-[var(--level-error)]/10 border-[var(--level-error)]/30",
  fatal: "text-[var(--level-fatal)] bg-[var(--level-fatal)]/10 border-[var(--level-fatal)]/30",
};

const LEVEL_DOT_STATUS: Record<string, "ok" | "warn" | "danger" | "fatal" | "info"> = {
  trace: "info",
  debug: "info",
  info: "ok",
  warn: "warn",
  error: "danger",
  fatal: "fatal",
};

export function EnhancedLogListItem({
  log,
  isSelected,
  onSelect,
}: EnhancedLogListItemProps) {
  const levelColor = LEVEL_COLORS[log.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.info;
  const dotStatus = LEVEL_DOT_STATUS[log.level] || LEVEL_DOT_STATUS.info;

  const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });

  return (
    <div
      className={cn(
        "group relative px-4 py-3 cursor-pointer transition-all duration-200",
        "border-b border-border-faint hover:border-signal/20",
        "hover:bg-bg-elevated/50",
        isSelected && [
          "bg-signal-muted border-l-2 border-l-signal",
          "shadow-[inset_2px_0_0_var(--signal)]"
        ]
      )}
      onClick={() => onSelect(log)}
    >
      {/* Selection indicator glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-signal/5 to-transparent pointer-events-none" />
      )}

      <div className="relative space-y-2">
        {/* Header row */}
        <div className="flex items-center gap-3">
          {/* Level badge with dot */}
          <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-medium font-mono uppercase tracking-wide", levelColor)}>
            <SignalDot status={dotStatus} size="sm" pulse={log.level === "error" || log.level === "fatal"} />
            {log.level}
          </div>

          {/* Timestamp */}
          <span className="text-xs text-text-muted font-mono">
            {timeAgo}
          </span>

          {/* Service tag */}
          {log.service && (
            <span className="text-xs px-2 py-0.5 rounded bg-data-muted text-data border border-data/20">
              {log.service}
            </span>
          )}

          {/* Environment tag */}
          {log.environment && (
            <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border-subtle">
              {log.environment}
            </span>
          )}

          {/* Release tag */}
          {log.release && (
            <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border-subtle font-mono">
              v{log.release}
            </span>
          )}

          {/* Offline queue badge */}
          {(log.data?.offlineQueued || log.metadata?.offlineQueued) && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-status-warn/10 text-status-warn border-status-warn/30">
              Offline
            </Badge>
          )}
        </div>

        {/* Message */}
        <div className="text-sm text-text-primary font-body leading-relaxed line-clamp-2">
          {log.message}
        </div>

        {/* Error preview */}
        {log.error?.message && (
          <div className="text-xs text-status-danger/80 font-mono bg-status-danger/5 px-2 py-1 rounded border border-status-danger/20 line-clamp-1">
            {log.error.name}: {log.error.message}
          </div>
        )}

        {/* Metadata footer */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {log.eventType && (
            <span className="flex items-center gap-1">
              <span className="text-text-muted/60">type:</span>
              <span className="text-text-secondary">{log.eventType}</span>
            </span>
          )}
          {log.correlationId && (
            <span className="flex items-center gap-1">
              <span className="text-text-muted/60">correlation:</span>
              <span className="text-text-secondary font-mono truncate max-w-[120px]">{log.correlationId}</span>
            </span>
          )}
          {log.sessionId && (
            <span className="flex items-center gap-1">
              <span className="text-text-muted/60">session:</span>
              <span className="text-text-secondary font-mono truncate max-w-[120px]">{log.sessionId}</span>
            </span>
          )}
        </div>
      </div>

      {/* Keyboard navigation indicator */}
      {isSelected && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-signal/60 font-mono">
          ⏎
        </div>
      )}
    </div>
  );
}
