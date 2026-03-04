"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";
import { DashboardOverview } from "@/types/dashboard";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";

interface OverviewTabContentProps {
  overviewData: DashboardOverview | null;
}

export function OverviewTabContent({ overviewData }: OverviewTabContentProps) {
  if (!overviewData) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No overview data available
      </div>
    );
  }

  const { summary, realTime, health, topIssues, trends } = overviewData;

  // Build error distribution data from critical errors if available
  const errorDistributionData = topIssues.recentCriticalErrors?.length > 0
    ? topIssues.recentCriticalErrors.slice(0, 6).map((error: { message?: string; count?: number; level?: string }, idx: number) => ({
        name: error.message
          ? error.message.length > 30
            ? error.message.substring(0, 30) + "..."
            : error.message
          : `Error ${idx + 1}`,
        count: error.count || 1,
        level: error.level || "error",
      }))
    : [
        { name: "No critical errors", count: 0, level: "info" },
      ];

  // Build health distribution for the bar chart
  const healthData = [
    { name: "Healthy", count: health.healthyProjects, fill: CHART_COLORS.ok },
    { name: "Warning", count: health.warningProjects, fill: CHART_COLORS.warn },
    { name: "Critical", count: health.criticalProjects, fill: CHART_COLORS.danger },
  ];

  // Build a simple trend visualization
  const trendData = [
    { name: "Previous", logVolume: 100, errorRate: summary.errorRate - trends.errorRateChange },
    { name: "Current", logVolume: 100 + trends.logVolumeChange, errorRate: summary.errorRate },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-signal">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Real-time RPS</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {realTime.currentRPS.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {realTime.activeUsers} active user{realTime.activeUsers !== 1 ? "s" : ""}
                </p>
              </div>
              <Activity className="h-8 w-8 text-signal/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-danger">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Error Rate</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {summary.errorRate.toFixed(2)}%
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {summary.totalErrors.toLocaleString()} total errors
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-status-danger/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-data-info">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Trend</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {trends.logVolumeChange > 0 ? "+" : ""}
                  {trends.logVolumeChange.toFixed(1)}%
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Log volume change
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-data-info/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Project Health Distribution
            </CardTitle>
            <CardDescription className="text-text-muted">
              Status of {summary.totalProjects} project{summary.totalProjects !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData} barSize={40}>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="name" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} allowDecimals={false} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLES.contentStyle}
                    labelStyle={TOOLTIP_STYLES.labelStyle}
                    itemStyle={TOOLTIP_STYLES.itemStyle}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    fill={CHART_COLORS.signal}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Period Comparison
            </CardTitle>
            <CardDescription className="text-text-muted">
              Log volume and error rate trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.signal} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.signal} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="name" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLES.contentStyle}
                    labelStyle={TOOLTIP_STYLES.labelStyle}
                    itemStyle={TOOLTIP_STYLES.itemStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="logVolume"
                    stroke={CHART_COLORS.signal}
                    fill="url(#signalGradient)"
                    strokeWidth={2}
                    name="Log Volume %"
                  />
                  <Area
                    type="monotone"
                    dataKey="errorRate"
                    stroke={CHART_COLORS.danger}
                    fill="url(#dangerGradient)"
                    strokeWidth={2}
                    name="Error Rate %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Critical Errors */}
      {topIssues.recentCriticalErrors?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Recent Critical Errors
            </CardTitle>
            <CardDescription className="text-text-muted">
              {topIssues.mostFrequentError
                ? `Most frequent: ${topIssues.mostFrequentError}`
                : "Latest critical errors across projects"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorDistributionData} layout="vertical" barSize={16}>
                  <CartesianGrid {...GRID_PROPS} horizontal={false} />
                  <XAxis type="number" {...AXIS_PROPS} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    {...AXIS_PROPS}
                    width={180}
                    tick={{ ...AXIS_PROPS.tick, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLES.contentStyle}
                    labelStyle={TOOLTIP_STYLES.labelStyle}
                    itemStyle={TOOLTIP_STYLES.itemStyle}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.danger}
                    radius={[0, 4, 4, 0]}
                    name="Occurrences"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
