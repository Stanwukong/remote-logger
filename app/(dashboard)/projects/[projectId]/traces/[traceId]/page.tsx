"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, GitBranch, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTraceDetail, useTraceSpans } from "@/hooks/trace.hook";
import { TraceWaterfall } from "@/components/dashboard/traces/TraceWaterfall";
import { TraceTimeline } from "@/components/dashboard/traces/TraceTimeline";
import { SpanDetail } from "@/components/dashboard/traces/SpanDetail";
import { SpanData } from "@/services/trace.service";
import { LogEntry } from "@/types/analytics";
import { format } from "date-fns";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function TraceDetailPage() {
  const params = useParams<{ projectId: string; traceId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const traceId =
    typeof params?.traceId === "string" ? params.traceId : "";

  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: detailResponse, isLoading: detailLoading, error: detailError } =
    useTraceDetail(projectId, traceId);
  const { data: spansResponse, isLoading: spansLoading } =
    useTraceSpans(projectId, traceId);

  const logs: LogEntry[] = useMemo(
    () => detailResponse?.data || [],
    [detailResponse?.data]
  );
  const spans: SpanData[] = useMemo(
    () => spansResponse?.data || [],
    [spansResponse?.data]
  );

  // Compute trace-level summary from logs/spans
  const traceSummary = useMemo(() => {
    if (logs.length === 0 && spans.length === 0) return null;

    const timestamps = logs.map((l) => new Date(l.timestamp).getTime());
    const spanStarts = spans.map((s) => new Date(s.startTime).getTime());
    const spanEnds = spans.map((s) => new Date(s.endTime).getTime());
    const allStarts = [...timestamps, ...spanStarts];
    const allEnds = [...timestamps, ...spanEnds];

    const startTime = Math.min(...allStarts);
    const endTime = Math.max(...allEnds);
    const duration = endTime - startTime;

    return {
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration,
      spanCount: spans.length,
      logCount: logs.length,
    };
  }, [logs, spans]);

  // Find selected span and its logs
  const selectedSpan = useMemo(
    () => spans.find((s) => s.spanId === selectedSpanId) || null,
    [spans, selectedSpanId]
  );

  const selectedSpanLogs = useMemo(() => {
    if (!selectedSpanId) return [];
    return logs.filter(
      (log) =>
        (log.context as Record<string, string> | undefined)?.spanId === selectedSpanId ||
        (log.metadata as Record<string, string> | undefined)?.spanId === selectedSpanId
    );
  }, [logs, selectedSpanId]);

  const handleCopyTraceId = () => {
    navigator.clipboard.writeText(traceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = detailLoading || spansLoading;

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
          <h2 className="text-2xl font-display font-bold text-status-danger">
            Failed to load trace
          </h2>
          <p className="text-text-secondary mt-2">
            Could not fetch trace details. The trace may not exist or an error occurred.
          </p>
          <div className="mt-4">
            <Button variant="signal" asChild>
              <Link href={`/projects/${projectId}/traces`}>Back to Traces</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}/traces`}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <GitBranch className="w-5 h-5 text-signal" />
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Trace Detail
          </h1>
        </div>

        {/* Trace metadata bar */}
        <div className="flex flex-wrap items-center gap-4 bg-bg-surface border border-border-subtle rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Trace ID</span>
            <span className="font-mono text-sm text-text-primary">
              {traceId.slice(0, 16)}
            </span>
            <button
              onClick={handleCopyTraceId}
              className="p-0.5 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
              aria-label="Copy trace ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-status-ok" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {traceSummary && (
            <>
              <div className="h-4 w-px bg-border-subtle" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span className="font-mono text-sm text-text-primary">
                  {formatDuration(traceSummary.duration)}
                </span>
              </div>

              <div className="h-4 w-px bg-border-subtle" />
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-sm text-text-secondary">
                  {traceSummary.spanCount} spans
                </span>
              </div>

              <div className="h-4 w-px bg-border-subtle" />
              <span className="text-sm text-text-muted">
                {format(new Date(traceSummary.startTime), "MMM dd, yyyy HH:mm:ss")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="waterfall">
        <TabsList className="bg-bg-elevated border border-border-subtle">
          <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="waterfall" className="mt-4">
          {spans.length > 0 && traceSummary ? (
            <div className="flex gap-4">
              {/* Waterfall - expands when no span selected */}
              <div className={selectedSpan ? "w-[70%]" : "w-full"}>
                <TraceWaterfall
                  spans={spans}
                  traceStartTime={traceSummary.startTime}
                  traceDuration={traceSummary.duration}
                  onSpanClick={(id) =>
                    setSelectedSpanId((prev) => (prev === id ? null : id))
                  }
                  selectedSpanId={selectedSpanId || undefined}
                />
              </div>

              {/* Span detail panel */}
              {selectedSpan && (
                <div className="w-[30%]">
                  <SpanDetail
                    span={selectedSpan}
                    logs={selectedSpanLogs}
                    onClose={() => setSelectedSpanId(null)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
              <p className="text-text-muted">
                No span data available for this trace.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <TraceTimeline logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
