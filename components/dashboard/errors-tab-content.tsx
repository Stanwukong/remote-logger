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
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";
import { DashboardOverview } from "@/types/dashboard";
import { AlertTriangle, Bug } from "lucide-react";

interface ErrorsTabContentProps {
  overviewData: DashboardOverview | null;
}

export function ErrorsTabContent({ overviewData }: ErrorsTabContentProps) {
  if (!overviewData) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No error data available
      </div>
    );
  }

  const { summary, topIssues } = overviewData;

  const criticalErrors = topIssues.recentCriticalErrors || [];
  const errorChartData = criticalErrors.length > 0
    ? criticalErrors.slice(0, 8).map((error: { message?: string; count?: number }, idx: number) => ({
        name: error.message
          ? error.message.length > 25
            ? error.message.substring(0, 25) + "..."
            : error.message
          : `Error ${idx + 1}`,
        count: error.count || 1,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-status-danger">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Errors</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {summary.totalErrors.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-status-danger/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warn">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Error Rate</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {summary.errorRate.toFixed(2)}%
                </p>
              </div>
              <Bug className="h-8 w-8 text-status-warn/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-data-info">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-text-secondary">Most Frequent Error</p>
              <p className="text-sm font-mono text-text-primary mt-2 truncate">
                {topIssues.mostFrequentError || "None detected"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Distribution Chart */}
      {errorChartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Critical Error Distribution
            </CardTitle>
            <CardDescription className="text-text-muted">
              Recent critical errors by occurrence count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorChartData} layout="vertical" barSize={14}>
                  <CartesianGrid {...GRID_PROPS} horizontal={false} />
                  <XAxis type="number" {...AXIS_PROPS} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    {...AXIS_PROPS}
                    width={200}
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="h-12 w-12 text-text-muted mb-4" />
            <p className="text-text-secondary font-display text-lg">No critical errors</p>
            <p className="text-text-muted text-sm mt-1">All systems running smoothly</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
