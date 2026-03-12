"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  timestamp: number;
  category: string;
  message: string;
  data?: Record<string, unknown>;
  level?: string;
}

interface BreadcrumbTrailProps {
  breadcrumbs?: Breadcrumb[];
}

const CATEGORY_STYLES: Record<string, string> = {
  ui: "bg-data-purple/15 text-data-purple",
  navigation: "bg-data-info/15 text-data-info",
  network: "bg-signal/15 text-signal",
  console: "bg-bg-elevated text-text-muted",
  error: "bg-status-danger/15 text-status-danger",
};

const LEVEL_BORDER_COLORS: Record<string, string> = {
  debug: "border-l-text-muted",
  info: "border-l-data-info",
  warning: "border-l-status-warn",
  warn: "border-l-status-warn",
  error: "border-l-status-danger",
};

function formatRelativeTime(timestampMs: number, referenceMs: number): string {
  const diff = referenceMs - timestampMs;
  if (diff < 0) return "+0ms";
  if (diff < 1000) return `-${Math.round(diff)}ms`;
  if (diff < 60000) return `-${(diff / 1000).toFixed(1)}s`;
  return `-${(diff / 60000).toFixed(1)}m`;
}

export function BreadcrumbTrail({ breadcrumbs }: BreadcrumbTrailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Sort by timestamp descending (most recent first)
  const sortedBreadcrumbs = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return [];
    return [...breadcrumbs].sort((a, b) => b.timestamp - a.timestamp);
  }, [breadcrumbs]);

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  const referenceTimestamp = sortedBreadcrumbs[0].timestamp;

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors w-full text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span>Breadcrumbs ({breadcrumbs.length} events before error)</span>
      </button>

      {/* Timeline */}
      {isOpen && (
        <div className="relative ml-2 pl-4 border-l border-border-subtle space-y-0">
          {sortedBreadcrumbs.map((crumb, index) => {
            const levelBorderClass =
              LEVEL_BORDER_COLORS[crumb.level || ""] || "border-l-border-subtle";
            const categoryStyle =
              CATEGORY_STYLES[crumb.category] || "bg-bg-elevated text-text-muted";
            const hasData = crumb.data && Object.keys(crumb.data).length > 0;
            const isItemExpanded = expandedItems.has(index);

            return (
              <div
                key={index}
                className={cn(
                  "relative py-2 pl-4 border-l-2",
                  levelBorderClass
                )}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-border-subtle" />

                <div className="space-y-1">
                  {/* Top row: timestamp + category */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-muted">
                      {formatRelativeTime(crumb.timestamp, referenceTimestamp)}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded font-medium",
                        categoryStyle
                      )}
                    >
                      {crumb.category}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-text-primary">{crumb.message}</p>

                  {/* Expandable data */}
                  {hasData && (
                    <button
                      onClick={() => toggleItem(index)}
                      className="text-xs text-text-muted hover:text-signal transition-colors flex items-center gap-1"
                    >
                      {isItemExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                      data
                    </button>
                  )}
                  {hasData && isItemExpanded && (
                    <pre className="font-mono text-xs bg-bg-elevated p-2 rounded border border-border-faint overflow-x-auto">
                      {JSON.stringify(crumb.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
