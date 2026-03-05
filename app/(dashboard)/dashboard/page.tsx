"use client";

import { useDashboardData } from "@/hooks/dashboard.hook";
import { useProjects } from "@/hooks/project.hooks";
import { useUserAlertStats, useUserAlerts } from "@/hooks/alerts.hook";
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
  Activity,
  AlertTriangle,
  Bug,
  FolderOpen,
  Plus,
  ScrollText,
  ArrowRight,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number | undefined | null): string {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function deriveProjectHealth(
  project: any
): "ok" | "warn" | "danger" {
  const errorRate = project?.metrics?.recentActivity?.errorsLast24h ?? 0;
  const healthScore = project?.metrics?.healthScore ?? 100;
  if (healthScore < 50 || errorRate > 50) return "danger";
  if (healthScore < 75 || errorRate > 10) return "warn";
  return "ok";
}

const severityBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  critical: "destructive",
  warning: "secondary",
  info: "outline",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const {
    overview,
    isLoading: dashboardLoading,
    hasData: dashboardHasData,
  } = useDashboardData();

  const { data: projectsResponse, isLoading: projectsLoading } = useProjects();
  const { data: alertStatsResponse, isLoading: alertStatsLoading } = useUserAlertStats();
  const { data: alertsResponse } = useUserAlerts({ limit: 5 } as any);

  const isLoading = dashboardLoading || projectsLoading || alertStatsLoading;

  if (isLoading) {
    return (
      <div className="p-6 md:px-8 lg:p-10">
        <SkeletonDashboard />
      </div>
    );
  }

  const projects: any[] = projectsResponse?.data ?? [];
  const overviewData = overview?.data ?? null;
  const alertStats = alertStatsResponse?.data ?? null;
  const recentAlerts: any[] = alertsResponse?.data ?? [];

  const totalLogs = overviewData?.summary?.totalLogs ?? 0;
  const totalErrors = overviewData?.summary?.totalErrors ?? 0;
  const activeAlerts = alertStats?.active ?? 0;
  const activeProjectCount = projects.filter((p: any) => p.isActive !== false).length;

  // Build time-series data from overview trends if available
  const timeSeriesData: any[] = [];
  const timeSeriesSeries = [
    { key: "logs", label: "Log Volume", color: "var(--signal)", type: "area" as const },
  ];

  // Empty state: no projects at all
  if (projects.length === 0 && !dashboardHasData) {
    return (
      <div className="p-6 md:px-8 lg:p-10">
        <PageHeader title="Dashboard" description="Cross-project overview" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-signal/10 flex items-center justify-center mb-6">
            <FolderOpen className="w-8 h-8 text-signal" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
            Welcome to Monita
          </h2>
          <p className="text-text-secondary max-w-md mb-6">
            Create your first project to start monitoring your applications in real-time.
          </p>
          <Button variant="signal" asChild>
            <Link href="/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:px-8 lg:p-10 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Cross-project overview"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Logs"
          value={formatNumber(totalLogs)}
          icon={<ScrollText className="h-4 w-4" />}
          trend={
            overviewData?.trends?.logVolumeChange
              ? {
                  direction: overviewData.trends.logVolumeChange > 0 ? "up" : overviewData.trends.logVolumeChange < 0 ? "down" : "neutral",
                  value: `${Math.abs(overviewData.trends.logVolumeChange).toFixed(1)}%`,
                }
              : undefined
          }
        />
        <MetricCard
          label="Active Alerts"
          value={formatNumber(activeAlerts)}
          icon={<AlertTriangle className="h-4 w-4" />}
          variant={activeAlerts > 0 ? "danger" : "default"}
        />
        <MetricCard
          label="Total Errors"
          value={formatNumber(totalErrors)}
          icon={<Bug className="h-4 w-4" />}
          variant={totalErrors > 0 ? "warning" : "default"}
          trend={
            overviewData?.trends?.errorRateChange
              ? {
                  direction: overviewData.trends.errorRateChange > 0 ? "up" : overviewData.trends.errorRateChange < 0 ? "down" : "neutral",
                  value: `${Math.abs(overviewData.trends.errorRateChange).toFixed(1)}%`,
                }
              : undefined
          }
        />
        <MetricCard
          label="Active Projects"
          value={activeProjectCount}
          icon={<Activity className="h-4 w-4" />}
          variant="success"
        />
      </div>

      {/* Log Volume Chart */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
            Log Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeSeriesData.length > 0 ? (
            <TimeSeriesChart
              data={timeSeriesData}
              series={timeSeriesSeries}
              height={280}
              showLegend={false}
            />
          ) : (
            <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">
              Log volume data will appear here once logs are ingested.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Column: Project Health + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Health Grid */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
              Project Health
            </CardTitle>
            <Link
              href="/projects"
              className="text-xs text-signal hover:text-signal-bright transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.slice(0, 6).map((project: any) => {
                  const health = deriveProjectHealth(project);
                  return (
                    <Link
                      key={project._id}
                      href={`/projects/${project._id}`}
                      className="group flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-bg-base hover:bg-bg-elevated hover:border-border-accent transition-all duration-200"
                    >
                      <SignalDot status={health} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-display font-semibold text-text-primary truncate group-hover:text-signal transition-colors">
                          {project.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatNumber(project.logCount ?? project.metrics?.recentActivity?.logsLast24h ?? 0)} logs
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                No projects found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-body text-text-secondary uppercase tracking-wider">
              Recent Alerts
            </CardTitle>
            <Link
              href="/alerts"
              className="text-xs text-signal hover:text-signal-bright transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.slice(0, 5).map((alert: any) => (
                  <div
                    key={alert._id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border-subtle bg-bg-base"
                  >
                    <SignalDot
                      status={
                        alert.severity === "critical"
                          ? "danger"
                          : alert.severity === "warning"
                          ? "warn"
                          : "info"
                      }
                      size="sm"
                      pulse={alert.status === "active"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {alert.title || alert.message || "Untitled alert"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={severityBadgeVariant[alert.severity] ?? "outline"}
                          className="text-[10px]"
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                No recent alerts. All systems operational.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status Bar */}
      <div className="flex items-center gap-2 p-3 rounded-lg border border-border-subtle bg-bg-surface">
        <SignalDot
          status={
            overviewData?.health?.criticalProjects > 0
              ? "danger"
              : overviewData?.health?.warningProjects > 0
              ? "warn"
              : "ok"
          }
          size="md"
        />
        <span className="text-sm text-text-secondary">
          {overviewData?.health?.criticalProjects > 0
            ? `${overviewData.health.criticalProjects} critical project${overviewData.health.criticalProjects > 1 ? "s" : ""} require attention`
            : overviewData?.health?.warningProjects > 0
            ? `${overviewData.health.warningProjects} project${overviewData.health.warningProjects > 1 ? "s" : ""} with warnings`
            : "All systems operational"}
        </span>
      </div>
    </div>
  );
}
