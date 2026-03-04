"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, getLevelColor, getLevelIcon } from "@/lib/utils";
import { LogEntry } from "@/types/analytics";
import { format } from "date-fns";

interface TraceTimelineProps {
  logs: LogEntry[];
}

interface GroupedLogs {
  spanId: string;
  logs: LogEntry[];
}

export function TraceTimeline({ logs }: TraceTimelineProps) {
  const grouped = useMemo(() => {
    const sortedLogs = [...logs].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const groups: GroupedLogs[] = [];
    const spanMap = new Map<string, LogEntry[]>();

    for (const log of sortedLogs) {
      const spanKey =
        (log.context as Record<string, string> | undefined)?.spanId ||
        (log.metadata as Record<string, string> | undefined)?.spanId ||
        "no-span";
      if (!spanMap.has(spanKey)) {
        spanMap.set(spanKey, []);
      }
      spanMap.get(spanKey)!.push(log);
    }

    for (const [spanId, spanLogs] of spanMap) {
      groups.push({ spanId, logs: spanLogs });
    }

    // Sort groups by earliest log timestamp
    groups.sort(
      (a, b) =>
        new Date(a.logs[0].timestamp).getTime() -
        new Date(b.logs[0].timestamp).getTime()
    );

    return groups;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
        <p className="text-text-muted text-sm">No log entries for this trace.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden">
      {grouped.map((group, groupIndex) => (
        <div key={group.spanId}>
          {/* Span separator */}
          {groupIndex > 0 && (
            <div className="border-t border-border-subtle" />
          )}

          {/* Span header */}
          <div className="px-4 py-2 bg-bg-elevated/30 flex items-center gap-2">
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
              Span
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {group.spanId === "no-span"
                ? "Unassigned"
                : group.spanId.slice(0, 12)}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] text-text-muted ml-auto"
            >
              {group.logs.length} log{group.logs.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Log entries */}
          {group.logs.map((log) => (
            <div
              key={log._id}
              className={cn(
                "flex items-start gap-3 px-4 py-2 border-l-2",
                getLevelColor(log.level)
              )}
            >
              {/* Timestamp */}
              <span className="font-mono text-xs text-text-muted shrink-0 w-24 pt-0.5">
                {format(new Date(log.timestamp), "HH:mm:ss.SSS")}
              </span>

              {/* Level badge */}
              <div className="shrink-0 pt-0.5">
                {getLevelIcon(log.level)}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary break-words">
                  {log.message}
                </p>
                {log.error && (
                  <p className="text-xs text-status-danger mt-0.5 font-mono truncate">
                    {log.error.name}: {log.error.message}
                  </p>
                )}
              </div>

              {/* Service tag */}
              {log.service && (
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] text-text-muted"
                >
                  {log.service}
                </Badge>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
