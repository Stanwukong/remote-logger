"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/project.hooks";
import { useLogSummary } from "@/hooks/log.hooks";
import { useAlertStats } from "@/hooks/alerts.hook";
import { useApperioStore } from "@/store/apperio-store";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { SkeletonDashboard } from "@/components/shared/SkeletonDashboard";
import { SignalDot } from "@/components/shared/SignalDot";
import { GettingStartedWizard } from "@/components/shared/GettingStartedWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ScrollText,
  Bug,
  Gauge,
  Activity,
  GitBranch,
  AlertTriangle,
  Globe,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/types/project.types";
import { resolveTimeRangeParams } from "@/lib/format-utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number | undefined | null): string {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function deriveHealthStatus(
  analytics: Project["analytics"] | undefined
): "ok" | "warn" | "danger" {
  if (!analytics) return "ok";
  const errorRate = analytics.overview?.errorRate ?? 0;
  const perfHealth = analytics.performance?.health;
  if (errorRate > 10 || perfHealth === "critical") return "danger";
  if (errorRate > 5 || perfHealth === "warning" || perfHealth === "degraded") return "warn";
  return "ok";
}

function formatHour(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Chart configs
// ---------------------------------------------------------------------------

const responseTimeChartConfig = {
  avgResponseTime: {
    label: "Avg Response Time",
    color: "var(--signal)",
  },
} satisfies ChartConfig;

const logVolumeChartConfig = {
  totalLogs: {
    label: "Total Logs",
    color: "var(--data)",
  },
  errorLogs: {
    label: "Errors",
    color: "var(--status-danger)",
  },
} satisfies ChartConfig;

// ---------------------------------------------------------------------------
// Quick link definitions
// ---------------------------------------------------------------------------

const quickLinks = [
  {
    href: "logs",
    icon: ScrollText,
    label: "Logs",
    description: "View and search log entries",
    color: "text-signal",
    bgColor: "bg-signal/10",
  },
  {
    href: "errors",
    icon: Bug,
    label: "Errors",
    description: "Track and debug errors",
    color: "text-status-danger",
    bgColor: "bg-status-danger/10",
  },
  {
    href: "performance",
    icon: Gauge,
    label: "Performance",
    description: "Response times and throughput",
    color: "text-data-info",
    bgColor: "bg-data-info/10",
  },
  {
    href: "web-vitals",
    icon: Globe,
    label: "Web Vitals",
    description: "Core web vitals metrics",
    color: "text-data-purple",
    bgColor: "bg-data-purple/10",
  },
  {
    href: "traces",
    icon: GitBranch,
    label: "Traces",
    description: "Distributed tracing",
    color: "text-status-warn",
    bgColor: "bg-status-warn/10",
  },
  {
    href: "insights",
    icon: Activity,
    label: "Insights",
    description: "AI-powered analysis",
    color: "text-signal",
    bgColor: "bg-signal/10",
  },
  {
    href: "/alerts",
    icon: AlertTriangle,
    label: "Alerts",
    description: "Alert rules and events",
    color: "text-status-danger",
    bgColor: "bg-status-danger/10",
    absolute: true,
  },
  {
    href: "settings",
    icon: Settings,
    label: "Settings",
    description: "Project configuration",
    color: "text-text-secondary",
    bgColor: "bg-bg-elevated",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectDashboard() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "";
  const selectedTimeRange = useApperioStore((s) => s.selectedTimeRange);
  const customTimeRange = useApperioStore((s) => s.customTimeRange);
  const timeRangeParams = useMemo(
    () => resolveTimeRangeParams(selectedTimeRange, customTimeRange),
    [selectedTimeRange, customTimeRange]
  );

  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  useLogSummary(projectId, timeRangeParams.timeRange);
  const { data: alertStatsResponse } = useAlertStats(projectId);

  // Getting-started wizard visibility
  const [wizardDismissed, setWizardDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`wizard-dismissed-${projectId}`) === "true";
  });

  const handleDismissWizard = useCallback(() => {
    localStorage.setItem(`wizard-dismissed-${projectId}`, "true");
    setWizardDismissed(true);
  }, [projectId]);

  // Derived data (must be above early returns to satisfy rules-of-hooks)
  const pData = projectData as Project | undefined;
  const analytics = pData?.analytics;
  const recommendations = pData?.recommendations;
  const project = pData?.project;
  const alertStats = alertStatsResponse?.data ?? null;

  const healthStatus = deriveHealthStatus(analytics);
  const logsToday = analytics?.overview?.recentLogs ?? 0;
  const errorsToday = analytics?.overview?.errorLogs ?? 0;
  const avgResponseTime = analytics?.responseTime?.current?.avgResponseTime ?? 0;
  const perfHealth = analytics?.performance?.health ?? "unknown";
  const healthScore = recommendations?.healthScore ?? 0;
  const activeAlertCount = alertStats?.active ?? 0;

  // Build response time chart data from responseTime.trends (hourly buckets)
  const responseTimeData = useMemo(() => {
    const trends = analytics?.responseTime?.trends ?? [];
    return trends.map((point: any) => ({
      hour: formatHour(point._id?.hour ?? point.timestamp ?? ""),
      avgResponseTime: Math.round((point.avgResponseTime ?? 0) * 100) / 100,
    }));
  }, [analytics?.responseTime?.trends]);

  // Build log volume chart data from trends.logs (daily buckets)
  const logVolumeData = useMemo(() => {
    const trends = analytics?.trends?.logs ?? [];
    return trends.map((point: any) => ({
      date: formatDate(point._id?.date ?? point.date ?? ""),
      totalLogs: point.totalLogs ?? 0,
      errorLogs: point.errorLogs ?? 0,
    }));
  }, [analytics?.trends?.logs]);

  if (projectLoading) {
    return (
      <div className="p-6 md:px-8 lg:p-10">
        <SkeletonDashboard />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:px-8 lg:p-10">
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Project not found
          </h2>
          <p className="text-text-secondary mt-2">
            The project you are looking for does not exist or you do not have access.
          </p>
          <div className="mt-6">
            <Button variant="signal" asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:px-8 lg:p-10 space-y-6">
      {/* Page Header */}
      <PageHeader
        title={project.name}
        description={project.description || "Project overview"}
        badge={
          <div className="flex items-center gap-2">
            <SignalDot status={healthStatus} size="md" />
            <Badge
              variant={project.isActive ? "outline" : "secondary"}
              className="text-xs"
            >
              {project.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        }
        actions={
          <Button variant="outline" size="sm" asChild className="border-border-subtle">
            <Link href={`/projects/${projectId}/settings`}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        }
      />

      {/* Getting Started Wizard — shown when project has no logs */}
      {!wizardDismissed || project.logCount === 0 && (
        <GettingStartedWizard
          projectId={projectId}
          apiKey={project.apiKey}
          onDismiss={handleDismissWizard}
        />
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Logs Today"
          value={formatNumber(logsToday)}
          icon={<ScrollText className="h-4 w-4" />}
          subtitle={`${formatNumber(analytics?.overview?.totalLogs ?? 0)} total`}
        />
        <MetricCard
          label="Errors Today"
          value={formatNumber(errorsToday)}
          icon={<Bug className="h-4 w-4" />}
          variant={errorsToday > 0 ? "danger" : "default"}
          subtitle={`${(analytics?.overview?.errorRate ?? 0).toFixed(1)}% error rate`}
        />
        <MetricCard
          label="Performance"
          value={avgResponseTime > 0 ? `${Math.round(avgResponseTime)}ms` : "N/A"}
          icon={<Gauge className="h-4 w-4" />}
          variant={
            perfHealth === "critical" || perfHealth === "poor"
              ? "danger"
              : perfHealth === "warning" || perfHealth === "degraded"
              ? "warning"
              : "default"
          }
          subtitle={
            avgResponseTime > 0
              ? `Health: ${perfHealth}`
              : `${formatNumber(analytics?.performance?.metrics?.totalRequests ?? 0)} requests tracked`
          }
        />
        <MetricCard
          label="Health Score"
          value={`${healthScore}%`}
          icon={<Activity className="h-4 w-4" />}
          variant={
            healthScore >= 80
              ? "success"
              : healthScore >= 50
              ? "warning"
              : "danger"
          }
          subtitle={
            activeAlertCount > 0
              ? `${activeAlertCount} active alert${activeAlertCount > 1 ? "s" : ""}`
              : "No active alerts"
          }
        />
      </div>

      {/* Charts: Response Time + Log Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Response Time Chart */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
              Response Time (Hourly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responseTimeData.length > 0 ? (
              <ChartContainer config={responseTimeChartConfig} className="min-h-[220px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={responseTimeData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="responseTimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-avgResponseTime)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-avgResponseTime)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeOpacity={0.06} />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickFormatter={(v) => `${v}ms`}
                    width={52}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${Number(value).toFixed(1)}ms`]}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="avgResponseTime"
                    stroke="var(--color-avgResponseTime)"
                    strokeWidth={2}
                    fill="url(#responseTimeGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "var(--color-avgResponseTime)",
                      fill: "var(--bg-surface)",
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center min-h-[220px] text-text-muted text-sm">
                Response time data will appear once network requests with latency are captured.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Volume Chart */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
              Log Volume (Daily)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logVolumeData.length > 0 ? (
              <ChartContainer config={logVolumeChartConfig} className="min-h-[220px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={logVolumeData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="totalLogsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-totalLogs)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-totalLogs)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="errorLogsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-errorLogs)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-errorLogs)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeOpacity={0.06} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    width={40}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalLogs"
                    stroke="var(--color-totalLogs)"
                    strokeWidth={2}
                    fill="url(#totalLogsGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "var(--color-totalLogs)",
                      fill: "var(--bg-surface)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="errorLogs"
                    stroke="var(--color-errorLogs)"
                    strokeWidth={2}
                    fill="url(#errorLogsGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "var(--color-errorLogs)",
                      fill: "var(--bg-surface)",
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center min-h-[220px] text-text-muted text-sm">
                Log volume data will appear once logs are ingested.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Links Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-bg-surface border-border-subtle">
            <CardHeader>
              <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  const href = link.absolute
                    ? link.href
                    : `/projects/${projectId}/${link.href}`;

                  return (
                    <Link
                      key={link.label}
                      href={href}
                      className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-border-subtle bg-bg-base hover:bg-bg-elevated hover:border-border-accent transition-all duration-200 text-center"
                    >
                      <div className={`size-10 rounded-lg ${link.bgColor} flex items-center justify-center`}>
                        <Icon className={`size-5 ${link.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-display font-semibold text-text-primary group-hover:text-signal transition-colors">
                          {link.label}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
              Alerts
            </CardTitle>
            <Link
              href="/alerts"
              className="text-xs text-signal hover:text-signal-bright transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {activeAlertCount > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-bg-base">
                  <SignalDot
                    status={activeAlertCount > 5 ? "danger" : "warn"}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {activeAlertCount} Active Alert{activeAlertCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {alertStats?.bySeverity?.critical
                        ? `${alertStats.bySeverity.critical} critical`
                        : "No critical alerts"}
                      {alertStats?.bySeverity?.warning
                        ? ` / ${alertStats.bySeverity.warning} warning`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded border border-border-subtle bg-bg-base text-center">
                    <p className="text-lg font-display font-bold text-text-primary">
                      {alertStats?.acknowledged ?? 0}
                    </p>
                    <p className="text-xs text-text-muted">Acknowledged</p>
                  </div>
                  <div className="p-2 rounded border border-border-subtle bg-bg-base text-center">
                    <p className="text-lg font-display font-bold text-text-primary">
                      {alertStats?.resolved ?? 0}
                    </p>
                    <p className="text-xs text-text-muted">Resolved</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <SignalDot status="ok" size="lg" className="mb-3" />
                <p className="text-sm text-text-muted">
                  No active alerts for this project.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
