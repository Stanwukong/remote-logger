"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SpanData } from "@/services/trace.service";

interface TraceWaterfallProps {
  spans: SpanData[];
  traceStartTime: string;
  traceDuration: number;
  onSpanClick: (spanId: string) => void;
  selectedSpanId?: string;
}

interface SpanTreeNode extends SpanData {
  children: SpanTreeNode[];
  depth: number;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function buildTree(spans: SpanData[]): SpanTreeNode[] {
  const map = new Map<string, SpanTreeNode>();
  const roots: SpanTreeNode[] = [];

  // Initialize all nodes
  for (const span of spans) {
    map.set(span.spanId, { ...span, children: [], depth: 0 });
  }

  // Build parent-child relationships
  for (const span of spans) {
    const node = map.get(span.spanId)!;
    if (span.parentSpanId && map.has(span.parentSpanId)) {
      const parent = map.get(span.parentSpanId)!;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Assign depths
  function setDepth(nodes: SpanTreeNode[], depth: number) {
    for (const node of nodes) {
      node.depth = depth;
      setDepth(node.children, depth + 1);
    }
  }
  setDepth(roots, 0);

  return roots;
}

function flattenTree(nodes: SpanTreeNode[]): SpanTreeNode[] {
  const result: SpanTreeNode[] = [];
  function walk(list: SpanTreeNode[]) {
    for (const node of list) {
      result.push(node);
      walk(node.children);
    }
  }
  walk(nodes);
  return result;
}

function ScaleBar({ traceDuration }: { traceDuration: number }) {
  const divisions = 5;
  const marks = Array.from({ length: divisions + 1 }, (_, i) => {
    const pct = (i / divisions) * 100;
    const time = (traceDuration / divisions) * i;
    return { pct, label: formatDuration(time) };
  });

  return (
    <div className="relative h-6 border-b border-border-subtle mb-2">
      {marks.map((mark) => (
        <div
          key={mark.pct}
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${mark.pct}%` }}
        >
          <div className="h-3 w-px bg-border-subtle" />
          <span className="text-[10px] font-mono text-text-muted whitespace-nowrap -translate-x-1/2">
            {mark.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TraceWaterfall({
  spans,
  traceStartTime,
  traceDuration,
  onSpanClick,
  selectedSpanId,
}: TraceWaterfallProps) {
  const flatSpans = useMemo(() => {
    const tree = buildTree(spans);
    return flattenTree(tree);
  }, [spans]);

  const traceStart = new Date(traceStartTime).getTime();
  const safeDuration = traceDuration > 0 ? traceDuration : 1;

  if (spans.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">
        No spans found for this trace.
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden">
      <div className="px-4 pt-3">
        <ScaleBar traceDuration={safeDuration} />
      </div>

      <div className="divide-y divide-border-subtle">
        {flatSpans.map((span) => {
          const spanStart = new Date(span.startTime).getTime();
          const offsetPct =
            ((spanStart - traceStart) / safeDuration) * 100;
          const widthPct = Math.max(
            (span.duration / safeDuration) * 100,
            2
          );
          const isSelected = selectedSpanId === span.spanId;
          const hasError = span.hasErrors > 0;

          return (
            <div
              key={span.spanId}
              onClick={() => onSpanClick(span.spanId)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors hover:bg-bg-elevated/50",
                isSelected && "ring-2 ring-signal ring-inset bg-signal/5"
              )}
            >
              {/* Span name with indentation */}
              <div
                className="shrink-0 w-48 truncate text-sm text-text-secondary"
                style={{ paddingLeft: `${span.depth * 24}px` }}
              >
                <span className="truncate">{span.name}</span>
              </div>

              {/* Waterfall bar */}
              <div className="flex-1 relative h-6">
                <div
                  className={cn(
                    "absolute top-0.5 h-5 rounded-sm flex items-center px-1.5 min-w-[24px]",
                    hasError ? "bg-status-danger" : "bg-signal"
                  )}
                  style={{
                    left: `${Math.min(offsetPct, 98)}%`,
                    width: `${Math.min(widthPct, 100 - Math.min(offsetPct, 98))}%`,
                  }}
                >
                  <span className="font-mono text-[10px] text-bg-void whitespace-nowrap">
                    {formatDuration(span.duration)}
                  </span>
                </div>
              </div>

              {/* Service badge */}
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] text-text-muted"
              >
                {span.service || "unknown"}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
