"use client";

import { useState } from "react";
import { useAdminStats, useAdminUsageTrends } from "@/hooks/admin.hook";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  CHART_COLORS,
  GRID_PROPS,
  AXIS_PROPS,
  TOOLTIP_STYLES,
} from "@/lib/charts/observatory-theme";
import {
  Users,
  UserPlus,
  Activity,
  ScrollText,
  Folder,
  BarChart3,
  Building2,
  TrendingUp,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// KPI Card component
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card className="bg-bg-surface border-border-subtle">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
              {label}
            </p>
            <p
              className={`text-2xl font-display font-bold tracking-tight ${
                accent ? "text-signal" : "text-text-primary"
              }`}
            >
              {typeof value === "number" ? formatCompact(value) : value}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              accent ? "bg-signal/10 text-signal" : "bg-bg-elevated text-text-muted"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminOverviewPage() {
  const [trendDays, setTrendDays] = useState(30);
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: trends, isLoading: trendsLoading } =
    useAdminUsageTrends(trendDays);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  const userStats = stats?.userStats;
  const usageStats = stats?.usageStats;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        description="Platform-wide KPIs and usage analytics"
        badge={<Badge variant="outline" className="text-signal border-signal/30">Admin</Badge>}
      />

      {/* Row 1: User KPIs */}
      <div>
        <h3 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
          User &amp; Growth
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Users"
            value={userStats?.totalUsers ?? 0}
            icon={Users}
            accent
          />
          <KpiCard
            label="New This Week"
            value={userStats?.newThisWeek ?? 0}
            icon={UserPlus}
          />
          <KpiCard
            label="New This Month"
            value={userStats?.newThisMonth ?? 0}
            icon={TrendingUp}
          />
          <KpiCard
            label="Active Today"
            value={userStats?.activeUsersToday ?? 0}
            icon={Activity}
          />
        </div>
      </div>

      {/* Row 2: Usage KPIs */}
      <div>
        <h3 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
          Usage
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Logs"
            value={usageStats?.totalLogs ?? 0}
            icon={ScrollText}
            accent
          />
          <KpiCard
            label="Logs Today"
            value={usageStats?.logsToday ?? 0}
            icon={ScrollText}
          />
          <KpiCard
            label="Total Projects"
            value={usageStats?.totalProjects ?? 0}
            icon={Folder}
          />
          <KpiCard
            label="Active Projects"
            value={usageStats?.activeProjects ?? 0}
            icon={Folder}
          />
        </div>
      </div>

      {/* Row 3: Extra KPIs */}
      <div>
        <h3 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
          Averages &amp; Organizations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Avg Logs/Project"
            value={usageStats?.avgLogsPerProject ?? 0}
            icon={BarChart3}
          />
          <KpiCard
            label="Total Organizations"
            value={userStats?.totalOrganizations ?? 0}
            icon={Building2}
          />
          <KpiCard
            label="New Orgs This Week"
            value={userStats?.newOrgsThisWeek ?? 0}
            icon={Building2}
          />
          <KpiCard
            label="Logs This Month"
            value={usageStats?.logsThisMonth ?? 0}
            icon={ScrollText}
          />
        </div>
      </div>

      {/* Usage Trends Chart */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-display text-text-primary">
            Usage Trends
          </CardTitle>
          <div className="flex gap-1">
            {[7, 14, 30].map((d) => (
              <Button
                key={d}
                variant={trendDays === d ? "default" : "ghost"}
                size="sm"
                className={
                  trendDays === d
                    ? "bg-signal/15 text-signal hover:bg-signal/20 text-xs h-7"
                    : "text-text-muted hover:text-text-primary text-xs h-7"
                }
                onClick={() => setTrendDays(d)}
              >
                {d}d
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends || []}>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis
                  dataKey="date"
                  {...AXIS_PROPS}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis {...AXIS_PROPS} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLES.contentStyle}
                  labelStyle={TOOLTIP_STYLES.labelStyle}
                  itemStyle={TOOLTIP_STYLES.itemStyle}
                />
                <Area
                  type="monotone"
                  dataKey="logs"
                  stroke={CHART_COLORS.signal}
                  fill={CHART_COLORS.signal}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Logs"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke={CHART_COLORS.danger}
                  fill={CHART_COLORS.danger}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Errors"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={CHART_COLORS.data}
                  fill={CHART_COLORS.data}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Projects by Volume */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-base font-display text-text-primary">
            Top 10 Projects by Log Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!usageStats?.topProjectsByVolume?.length ? (
            <p className="text-sm text-text-muted text-center py-8">
              No project data available yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, (usageStats.topProjectsByVolume.length * 40) + 20)}>
              <BarChart
                data={usageStats.topProjectsByVolume}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
              >
                <CartesianGrid {...GRID_PROPS} horizontal={false} />
                <XAxis type="number" {...AXIS_PROPS} />
                <YAxis
                  dataKey="name"
                  type="category"
                  {...AXIS_PROPS}
                  width={140}
                  tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLES.contentStyle}
                  labelStyle={TOOLTIP_STYLES.labelStyle}
                  itemStyle={TOOLTIP_STYLES.itemStyle}
                  formatter={(value: number) => [formatCompact(value), "Logs"]}
                />
                <Bar
                  dataKey="logCount"
                  fill={CHART_COLORS.signal}
                  radius={[0, 4, 4, 0]}
                  name="Log Count"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
