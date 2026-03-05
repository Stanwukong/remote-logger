"use client";

import { useParams } from "next/navigation";
import { useProject } from "@/hooks/project.hooks";
import { useLogSummary } from "@/hooks/log.hooks";
import { useAlertStats } from "@/hooks/alerts.hook";
import { useLogHiveStore } from "@/store/loghive-store";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { SkeletonDashboard } from "@/components/shared/SkeletonDashboard";
import { SignalDot } from "@/components/shared/SignalDot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const selectedTimeRange = useLogHiveStore((s) => s.selectedTimeRange);

  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  // Log summary available for future use
  useLogSummary(projectId, selectedTimeRange);
  const { data: alertStatsResponse } = useAlertStats(projectId);

  if (projectLoading) {
    return (
      <div className="p-6 md:px-8 lg:p-10">
        <SkeletonDashboard />
      </div>
    );
  }

  if (!projectData || !projectData.project) {
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

  const { project, analytics, recommendations } = projectData as Project;
  const healthStatus = deriveHealthStatus(analytics);
  const alertStats = alertStatsResponse?.data ?? null;

  // Metric values
  const logsToday = analytics?.overview?.recentLogs ?? 0;
  const errorsToday = analytics?.overview?.errorLogs ?? 0;
  const avgResponseTime = analytics?.responseTime?.current?.avgResponseTime ?? 0;
  const perfHealth = analytics?.performance?.health ?? "unknown";
  const healthScore = recommendations?.healthScore ?? 0;

  // Build time-series from response time history
  const timeSeriesData = (analytics?.responseTime?.history ?? []).map((point: any) => ({
    timestamp: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: point.avgResponseTime ?? 0,
  }));

  const timeSeriesSeries = [
    {
      key: "responseTime",
      label: "Avg Response Time (ms)",
      color: "var(--signal)",
      type: "area" as const,
    },
  ];

  // Recent alerts for this project
  const activeAlertCount = alertStats?.active ?? 0;

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
              : "success"
          }
          subtitle={`Health: ${perfHealth}`}
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

      {/* Response Time Chart */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
            Response Time (Last 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeSeriesData.length > 0 ? (
            <TimeSeriesChart
              data={timeSeriesData}
              series={timeSeriesSeries}
              height={280}
              showLegend={false}
              formatYAxis={(v: number) => `${v}ms`}
            />
          ) : (
            <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">
              Response time data will appear here once traffic is detected.
            </div>
          )}
        </CardContent>
      </Card>

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
                      <div className={`w-10 h-10 rounded-lg ${link.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${link.color}`} />
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
