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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";
import { DashboardOverview, PerformanceData } from "@/types/dashboard";
import { Activity, Users, BarChart3, Globe } from "lucide-react";

interface UsageTabContentProps {
  overviewData: DashboardOverview | null;
  performanceData: PerformanceData | null;
}

export function UsageTabContent({ overviewData, performanceData }: UsageTabContentProps) {
  if (!overviewData) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No usage data available
      </div>
    );
  }

  const { summary, realTime, health } = overviewData;

  const perfData = performanceData?.status === "success" ? performanceData.data : null;

  const projectDistribution = [
    { name: "Healthy", value: health.healthyProjects },
    { name: "Warning", value: health.warningProjects },
    { name: "Critical", value: health.criticalProjects },
  ].filter((item) => item.value > 0);

  const pageLoadData = perfData?.pageLoadTimes?.slice(0, 6).map((page) => ({
    name: page.page
      ? page.page.length > 20
        ? page.page.substring(0, 20) + "..."
        : page.page
      : "Unknown",
    loadTime: page.loadTime || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Usage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-signal">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Logs</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {summary.totalLogs.toLocaleString()}
                </p>
              </div>
              <Activity className="h-6 w-6 text-signal/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-data-info">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Active Users</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {realTime.activeUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-6 w-6 text-data-info/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-ok">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Projects</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {summary.totalProjects}
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-status-ok/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warn">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Current RPS</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {realTime.currentRPS.toLocaleString()}
                </p>
              </div>
              <Globe className="h-6 w-6 text-status-warn/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Project Health Breakdown
            </CardTitle>
            <CardDescription className="text-text-muted">
              Distribution across {summary.totalProjects} project{summary.totalProjects !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {projectDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      stroke="none"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {projectDistribution.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            _entry.name === "Healthy"
                              ? CHART_COLORS.ok
                              : _entry.name === "Warning"
                              ? CHART_COLORS.warn
                              : CHART_COLORS.danger
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={TOOLTIP_STYLES.contentStyle}
                      labelStyle={TOOLTIP_STYLES.labelStyle}
                      itemStyle={TOOLTIP_STYLES.itemStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <p className="text-sm">No project data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Page Load Times */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Page Load Times
            </CardTitle>
            <CardDescription className="text-text-muted">
              {pageLoadData.length > 0
                ? `${pageLoadData.length} page${pageLoadData.length !== 1 ? "s" : ""} monitored`
                : "No page load data yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {pageLoadData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageLoadData} layout="vertical" barSize={12}>
                    <CartesianGrid {...GRID_PROPS} horizontal={false} />
                    <XAxis type="number" {...AXIS_PROPS} unit="ms" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      {...AXIS_PROPS}
                      width={150}
                      tick={{ ...AXIS_PROPS.tick, fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLES.contentStyle}
                      labelStyle={TOOLTIP_STYLES.labelStyle}
                      itemStyle={TOOLTIP_STYLES.itemStyle}
                      formatter={(value: number) => [`${value}ms`, "Load Time"]}
                    />
                    <Bar
                      dataKey="loadTime"
                      fill={CHART_COLORS.data}
                      radius={[0, 4, 4, 0]}
                      name="Load Time"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <div className="text-center">
                    <Globe className="h-10 w-10 mx-auto mb-2 text-data-info/30" />
                    <p className="text-sm">Enable page load monitoring</p>
                    <p className="text-xs mt-1">Install the SDK to track page performance</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
