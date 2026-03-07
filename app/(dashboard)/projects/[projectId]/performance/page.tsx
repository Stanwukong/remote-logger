"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useLogHiveStore } from "@/store/loghive-store";
import {
  usePerformanceTimeline,
  usePagePerformance,
  usePerformanceScore,
  useSlowestEndpoints,
  useResourcePerformance,
} from "@/hooks/analytics.hook";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { TabLayout } from "@/components/shared/TabLayout";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { ObservatoryBarChart } from "@/components/shared/ObservatoryBarChart";
import { SkeletonDashboard } from "@/components/shared/SkeletonDashboard";
import {
  formatDuration,
  formatPercent as sharedFormatPercent,
  truncateUrl as sharedTruncateUrl,
  formatBytes,
  computeChange,
  resolveTimeRangeParams,
} from "@/lib/format-utils";
import { useAnomalies } from "@/hooks/anomaly.hook";
import {
  Clock,
  Gauge,
  TrendingUp,
  AlertTriangle,
  Timer,
  FileText,
  Server,
  Package,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Formatting helpers (thin wrappers preserving "--" for missing values)
// ---------------------------------------------------------------------------

function formatMs(ms: number | undefined | null): string {
  if (ms == null || isNaN(ms)) return "--";
  return formatDuration(ms);
}

function formatPercent(val: number | undefined | null): string {
  if (val == null || isNaN(val)) return "--";
  return sharedFormatPercent(val);
}

function truncateUrl(url: string, maxLen = 60): string {
  if (!url) return "--";
  return sharedTruncateUrl(url, maxLen) || "--";
}

// ---------------------------------------------------------------------------
// Score variant helper
// ---------------------------------------------------------------------------

function scoreVariant(score: number): "success" | "warning" | "danger" {
  if (score >= 90) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

// ---------------------------------------------------------------------------
// Trend helper (wraps shared computeChange)
// ---------------------------------------------------------------------------

function computeTrend(
  current: number | undefined | null,
  previous: number | undefined | null
): { direction: "up" | "down" | "neutral"; value: string } | undefined {
  if (current == null || previous == null || previous === 0) return undefined;
  const info = computeChange(current, previous);
  if (Math.abs(info.value) < 0.5) return { direction: "neutral", value: "0%" };
  return {
    direction: info.direction,
    value: `${Math.abs(info.value).toFixed(1)}%`,
  };
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS = [
  { id: "timeline", label: "Timeline", icon: <Timer className="w-4 h-4" /> },
  { id: "pages", label: "Pages", icon: <FileText className="w-4 h-4" /> },
  { id: "endpoints", label: "Endpoints", icon: <Server className="w-4 h-4" /> },
  { id: "resources", label: "Resources", icon: <Package className="w-4 h-4" /> },
];

// ---------------------------------------------------------------------------
// Sub-components: Tables
// ---------------------------------------------------------------------------

interface PagePerfEntry {
  url?: string;
  page?: string;
  avgLoadTime?: number;
  avgResponseTime?: number;
  views?: number;
  pageViews?: number;
  bounceRate?: number;
}

function PagesTable({ data }: { data: PagePerfEntry[] }) {
  if (!data || data.length === 0) {
    return <EmptyTab message="No page performance data available." />;
  }

  const sorted = [...data].sort(
    (a, b) => (b.avgLoadTime ?? b.avgResponseTime ?? 0) - (a.avgLoadTime ?? a.avgResponseTime ?? 0)
  );

  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-surface">
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Page URL
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Avg Load Time
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Views
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Bounce Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, i) => (
            <tr
              key={i}
              className="border-t border-border-subtle even:bg-bg-elevated/30 hover:bg-bg-elevated/50 transition-colors"
            >
              <td className="px-4 py-3 text-text-primary font-mono text-xs max-w-[300px] truncate" title={entry.url ?? entry.page ?? ""}>
                {truncateUrl(entry.url ?? entry.page ?? "--")}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {formatMs(entry.avgLoadTime ?? entry.avgResponseTime)}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {(entry.views ?? entry.pageViews ?? 0).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {entry.bounceRate != null ? formatPercent(entry.bounceRate) : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface EndpointEntry {
  endpoint?: string;
  name?: string;
  method?: string;
  avgTime?: number;
  avgResponseTime?: number;
  p95?: number;
  p95ResponseTime?: number;
  calls?: number;
  count?: number;
}

function EndpointsTable({ data }: { data: EndpointEntry[] }) {
  if (!data || data.length === 0) {
    return <EmptyTab message="No endpoint data available." />;
  }

  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-surface">
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Endpoint
            </th>
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Method
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Avg Time
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              p95
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Calls
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr
              key={i}
              className="border-t border-border-subtle even:bg-bg-elevated/30 hover:bg-bg-elevated/50 transition-colors"
            >
              <td className="px-4 py-3 text-text-primary font-mono text-xs max-w-[280px] truncate" title={entry.endpoint ?? entry.name ?? ""}>
                {truncateUrl(entry.endpoint ?? entry.name ?? "--")}
              </td>
              <td className="px-4 py-3 text-text-secondary text-xs">
                <span className="inline-block px-2 py-0.5 rounded bg-bg-elevated text-text-primary font-mono text-xs font-medium">
                  {entry.method ?? "GET"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {formatMs(entry.avgTime ?? entry.avgResponseTime)}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {formatMs(entry.p95 ?? entry.p95ResponseTime)}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {(entry.calls ?? entry.count ?? 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ResourceEntry {
  url?: string;
  resource?: string;
  type?: string;
  resourceType?: string;
  avgDuration?: number;
  avgResponseTime?: number;
  size?: number;
  transferSize?: number;
  initiator?: string;
  initiatorType?: string;
}

function ResourcesTable({ data }: { data: ResourceEntry[] }) {
  if (!data || data.length === 0) {
    return <EmptyTab message="No resource performance data available." />;
  }

  return (
    <div className="rounded-lg border border-border-subtle overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-surface">
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Resource URL
            </th>
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Type
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Avg Duration
            </th>
            <th className="text-right text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Size
            </th>
            <th className="text-left text-text-muted text-xs uppercase tracking-wider font-medium px-4 py-3">
              Initiator
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr
              key={i}
              className="border-t border-border-subtle even:bg-bg-elevated/30 hover:bg-bg-elevated/50 transition-colors"
            >
              <td className="px-4 py-3 text-text-primary font-mono text-xs max-w-[280px] truncate" title={entry.url ?? entry.resource ?? ""}>
                {truncateUrl(entry.url ?? entry.resource ?? "--")}
              </td>
              <td className="px-4 py-3 text-text-secondary text-xs">
                <span className="inline-block px-2 py-0.5 rounded bg-bg-elevated text-text-primary font-mono text-xs">
                  {entry.type ?? entry.resourceType ?? "--"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {formatMs(entry.avgDuration ?? entry.avgResponseTime)}
              </td>
              <td className="px-4 py-3 text-right text-text-primary font-mono text-xs">
                {formatSize(entry.size ?? entry.transferSize)}
              </td>
              <td className="px-4 py-3 text-text-muted font-mono text-xs">
                {entry.initiator ?? entry.initiatorType ?? "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatSize(bytes: number | undefined | null): string {
  if (bytes == null || isNaN(bytes)) return "--";
  return formatBytes(bytes);
}

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
      <Clock className="w-10 h-10 text-text-muted mx-auto mb-3" />
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function PerformanceAnalyticsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "";

  const selectedTimeRange = useLogHiveStore((s) => s.selectedTimeRange);
  const customTimeRange = useLogHiveStore((s) => s.customTimeRange);
  const timeParams = useMemo(
    () => resolveTimeRangeParams(selectedTimeRange, customTimeRange),
    [selectedTimeRange, customTimeRange]
  );

  // Data hooks
  const {
    data: timelineData,
    isLoading: timelineLoading,
  } = usePerformanceTimeline(projectId, timeParams);

  const {
    data: pagesData,
    isLoading: pagesLoading,
  } = usePagePerformance(projectId, timeParams);

  const {
    data: scoreData,
    isLoading: scoreLoading,
  } = usePerformanceScore(projectId, timeParams);

  const {
    data: endpointsData,
    isLoading: endpointsLoading,
  } = useSlowestEndpoints(projectId, { ...timeParams, limit: 15 });

  const {
    data: resourcesData,
    isLoading: resourcesLoading,
  } = useResourcePerformance(projectId, timeParams);

  // Anomaly data for chart overlays
  const { data: anomalyData } = useAnomalies(projectId, {
    type: "response_time_degradation",
    resolved: false,
    limit: 20,
  });

  const anomalyMarkers = useMemo(() => {
    const anomalies = Array.isArray(anomalyData) ? anomalyData : (anomalyData as any)?.data ?? [];
    return anomalies.map((a: any) => ({
      timestamp: a.detectedAt,
      severity: a.severity as "critical" | "warning" | "info",
      label: "!",
    }));
  }, [anomalyData]);

  // Derive metrics from score data
  const score = scoreData?.score ?? scoreData?.performanceScore ?? null;
  const avgResponseTime = scoreData?.avgResponseTime ?? scoreData?.avg ?? null;
  const p95ResponseTime = scoreData?.p95ResponseTime ?? scoreData?.p95 ?? null;
  const errorRate = scoreData?.errorRate ?? null;

  // Previous period values for trends (if the API provides them)
  const prevAvgResponseTime = scoreData?.previousAvgResponseTime ?? scoreData?.prevAvg ?? null;
  const prevP95ResponseTime = scoreData?.previousP95ResponseTime ?? scoreData?.prevP95 ?? null;
  const prevErrorRate = scoreData?.previousErrorRate ?? scoreData?.prevErrorRate ?? null;

  const isLoading = scoreLoading && timelineLoading;

  // Check if we have any meaningful data
  const hasData =
    score != null ||
    avgResponseTime != null ||
    (timelineData && (Array.isArray(timelineData) ? timelineData.length > 0 : true));

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader
          title="Performance Analytics"
          description="Response times and throughput"
        />
        <SkeletonDashboard />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (!hasData) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader
          title="Performance Analytics"
          description="Response times and throughput"
        />
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
          <Gauge className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            No performance data recorded yet
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            Performance metrics will appear here once your application starts
            reporting response times. Configure the SDK with auto-capture enabled
            for performance events to begin collecting data.
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Prepare chart data
  // ---------------------------------------------------------------------------

  const timelineSeries = Array.isArray(timelineData) ? timelineData : [];

  const endpointsList: EndpointEntry[] = Array.isArray(endpointsData) ? endpointsData : [];

  // Bar chart data for slowest endpoints
  const barChartData = endpointsList.slice(0, 10).map((ep) => ({
    name: truncateUrl(ep.endpoint ?? ep.name ?? "--", 40),
    avg: ep.avgTime ?? ep.avgResponseTime ?? 0,
  }));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6 space-y-6 bg-bg-base min-h-screen">
      <PageHeader
        title="Performance Analytics"
        description="Response times and throughput"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Performance Score"
          value={score != null ? Math.round(score) : "--"}
          icon={<Gauge className="w-4 h-4" />}
          variant={score != null ? scoreVariant(score) : "default"}
          subtitle={
            score != null
              ? score >= 90
                ? "Good"
                : score >= 50
                ? "Needs improvement"
                : "Poor"
              : undefined
          }
        />
        <MetricCard
          label="Avg Response Time"
          value={formatMs(avgResponseTime)}
          icon={<Clock className="w-4 h-4" />}
          trend={computeTrend(avgResponseTime, prevAvgResponseTime)}
        />
        <MetricCard
          label="p95 Response Time"
          value={formatMs(p95ResponseTime)}
          icon={<TrendingUp className="w-4 h-4" />}
          trend={computeTrend(p95ResponseTime, prevP95ResponseTime)}
        />
        <MetricCard
          label="Error Rate"
          value={formatPercent(errorRate)}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant={
            errorRate != null
              ? errorRate > 5
                ? "danger"
                : errorRate > 1
                ? "warning"
                : "success"
              : "default"
          }
          trend={computeTrend(errorRate, prevErrorRate)}
        />
      </div>

      {/* Tabbed Content */}
      <TabLayout tabs={TABS} defaultTab="timeline">
        {(activeTab) => {
          // --- Timeline tab ---
          if (activeTab === "timeline") {
            if (timelineLoading) {
              return (
                <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-40 bg-bg-elevated rounded" />
                    <div className="h-[300px] w-full bg-bg-elevated rounded" />
                  </div>
                </div>
              );
            }

            if (!timelineSeries.length) {
              return <EmptyTab message="No timeline data available for this period." />;
            }

            return (
              <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                <h3 className="text-sm font-display font-semibold text-text-primary mb-4">
                  Response Time Over Time
                </h3>
                <TimeSeriesChart
                  data={timelineSeries}
                  series={[
                    {
                      key: "avg",
                      label: "Avg Response Time",
                      color: "var(--chart-1)",
                      type: "area",
                    },
                    {
                      key: "p95",
                      label: "p95 Response Time",
                      color: "var(--chart-4)",
                      type: "line",
                      strokeDasharray: "5 3",
                    },
                  ]}
                  height={340}
                  showLegend
                  showBrush={timelineSeries.length > 30}
                  formatYAxis={(val: number) => formatMs(val)}
                  formatTooltip={(val: number) => formatMs(val)}
                  anomalies={anomalyMarkers}
                />
              </div>
            );
          }

          // --- Pages tab ---
          if (activeTab === "pages") {
            if (pagesLoading) {
              return (
                <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 bg-bg-elevated rounded" />
                    ))}
                  </div>
                </div>
              );
            }

            const pagesList: PagePerfEntry[] = Array.isArray(pagesData) ? pagesData : [];
            return (
              <div className="space-y-4">
                <h3 className="text-sm font-display font-semibold text-text-primary">
                  Page Performance
                </h3>
                <PagesTable data={pagesList} />
              </div>
            );
          }

          // --- Endpoints tab ---
          if (activeTab === "endpoints") {
            if (endpointsLoading) {
              return (
                <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 bg-bg-elevated rounded" />
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {barChartData.length > 0 && (
                  <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                    <h3 className="text-sm font-display font-semibold text-text-primary mb-4">
                      Slowest Endpoints
                    </h3>
                    <ObservatoryBarChart
                      data={barChartData}
                      series={[
                        {
                          key: "avg",
                          label: "Avg Response Time",
                          color: "var(--chart-4)",
                        },
                      ]}
                      layout="horizontal"
                      height={Math.max(250, barChartData.length * 36)}
                      showLegend={false}
                      formatValue={(val: number) => formatMs(val)}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    Endpoint Details
                  </h3>
                  <EndpointsTable data={endpointsList} />
                </div>
              </div>
            );
          }

          // --- Resources tab ---
          if (activeTab === "resources") {
            if (resourcesLoading) {
              return (
                <div className="rounded-lg border border-border-subtle bg-bg-surface p-6">
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 bg-bg-elevated rounded" />
                    ))}
                  </div>
                </div>
              );
            }

            const resourcesList: ResourceEntry[] = Array.isArray(resourcesData) ? resourcesData : [];
            return (
              <div className="space-y-4">
                <h3 className="text-sm font-display font-semibold text-text-primary">
                  Resource Performance
                </h3>
                <ResourcesTable data={resourcesList} />
              </div>
            );
          }

          return null;
        }}
      </TabLayout>
    </div>
  );
}
