"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalDot } from "@/components/shared/SignalDot";
import { useAlertStats, useAlertAnalytics } from "@/hooks/alerts.hook";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Bell,
  TrendingUp,
  Activity,
  Volume2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertStatsCardsProps {
  projectId?: string;
  timeRange?: "1d" | "7d" | "30d";
}

export function AlertStatsCards({
  projectId,
  timeRange = "7d",
}: AlertStatsCardsProps) {
  const { data: statsData, isLoading: isStatsLoading } = useAlertStats(projectId);
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAlertAnalytics(
    projectId || "",
    timeRange
  );

  const stats = statsData?.data;
  const analytics = analyticsData?.data;

  if (isStatsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-[var(--border-subtle)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Alerts */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--signal)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Total Alerts
            </CardTitle>
            <Bell className="h-4 w-4 text-[var(--signal)] group-hover:animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats?.total.toLocaleString() || 0}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {stats?.byTimeRange.last24h || 0} in last 24h
            </p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="border-[var(--status-danger)]/30 bg-[var(--bg-surface)] hover:border-[var(--status-danger)] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Active Alerts
            </CardTitle>
            <div className="flex items-center gap-2">
              {stats && stats.active > 0 && (
                <SignalDot status="danger" pulse={stats.active > 0} />
              )}
              <AlertTriangle className="h-4 w-4 text-[var(--status-danger)]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-[var(--status-danger)]">
              {stats?.active || 0}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {stats?.bySeverity.critical || 0} critical,{" "}
              {stats?.bySeverity.warning || 0} warning
            </p>
          </CardContent>
        </Card>

        {/* Acknowledged Alerts */}
        <Card className="border-[var(--status-warn)]/30 bg-[var(--bg-surface)] hover:border-[var(--status-warn)] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Acknowledged
            </CardTitle>
            <Clock className="h-4 w-4 text-[var(--status-warn)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-[var(--status-warn)]">
              {stats?.acknowledged || 0}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Awaiting resolution
            </p>
          </CardContent>
        </Card>

        {/* Resolved Alerts */}
        <Card className="border-[var(--status-ok)]/30 bg-[var(--bg-surface)] hover:border-[var(--status-ok)] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-[var(--status-ok)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-[var(--status-ok)]">
              {stats?.resolved || 0}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {stats?.byTimeRange.last7d || 0} in last 7d
            </p>
          </CardContent>
        </Card>

        {/* MTTR */}
        {!isAnalyticsLoading && analytics?.mttr && (
          <Card className="border-[var(--data-info)]/30 bg-[var(--bg-surface)] hover:border-[var(--data-info)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                MTTR (Avg)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[var(--data-info)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-[var(--data-info)]">
                {analytics.mttr.avgMinutes}
                <span className="text-sm font-normal text-[var(--text-tertiary)] ml-1">
                  min
                </span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                {analytics.mttr.resolvedCount} resolved in {timeRange}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Alert Frequency with Sparkline */}
        {!isAnalyticsLoading && analytics?.frequencyTrends && (
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--signal)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                Alert Frequency
              </CardTitle>
              <Activity className="h-4 w-4 text-[var(--signal)]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-3xl font-bold font-display text-[var(--signal)]">
                    {analytics.frequencyTrends.reduce(
                      (sum, day) => sum + day.count,
                      0
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {analytics.frequencyTrends.length} days tracked
                  </p>
                </div>
                {/* Mini Sparkline */}
                <MiniSparkline
                  data={analytics.frequencyTrends.map((d) => d.count)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Noisiest Rules Bar */}
      {!isAnalyticsLoading &&
        analytics?.noisiestRules &&
        analytics.noisiestRules.length > 0 && (
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-[var(--status-warn)]" />
                Noisiest Rules ({timeRange})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.noisiestRules.slice(0, 5).map((rule, i) => {
                  const maxCount = analytics.noisiestRules[0]?.count || 1;
                  const percentage = Math.round((rule.count / maxCount) * 100);
                  return (
                    <div key={rule.ruleId || i} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-tertiary)] w-4 text-right font-mono">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[var(--text-primary)] truncate">
                            {rule.ruleName || "Unknown Rule"}
                          </span>
                          <span className="text-xs text-[var(--text-tertiary)] font-mono ml-2 shrink-0">
                            {rule.count}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--bg-base)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--status-warn)] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

// ============================================
// Mini Sparkline (SVG)
// ============================================

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const width = 64;
  const height = 28;
  const max = Math.max(...data, 1);
  const barWidth = Math.max(2, (width - (data.length - 1)) / data.length);
  const gap = 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      {data.map((value, i) => {
        const barHeight = Math.max(1, (value / max) * (height - 2));
        const x = i * (barWidth + gap);
        const y = height - barHeight;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={1}
            fill="var(--signal)"
            opacity={i === data.length - 1 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}
