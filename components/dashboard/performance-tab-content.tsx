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
import { PerformanceData } from "@/types/dashboard";
import { Gauge, Timer, Zap, Network } from "lucide-react";

interface PerformanceTabContentProps {
  performanceData: PerformanceData | null;
}

export function PerformanceTabContent({ performanceData }: PerformanceTabContentProps) {
  if (!performanceData || performanceData.status !== "success" || !performanceData.data) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No performance data available
      </div>
    );
  }

  const { data } = performanceData;
  const { networkStats } = data;

  const responseTimeData = [
    { name: "Average", time: data.averageResponseTime, fill: CHART_COLORS.signal },
    { name: "P95", time: data.p95ResponseTime, fill: CHART_COLORS.data },
    { name: "P99", time: data.p99ResponseTime, fill: CHART_COLORS.warn },
  ];

  const slowEndpointsData = data.slowestEndpoints.slice(0, 6).map((ep) => ({
    name: ep.endpoint
      ? ep.endpoint.length > 30
        ? ep.endpoint.substring(0, 30) + "..."
        : ep.endpoint
      : "Unknown",
    responseTime: ep.responseTime || 0,
  }));

  const successRate = networkStats.totalRequests > 0
    ? ((networkStats.totalRequests - (networkStats.failureRate * networkStats.totalRequests) / 100) / networkStats.totalRequests) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-signal">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Avg Response</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {data.averageResponseTime === 0 ? "< 1" : data.averageResponseTime}ms
                </p>
              </div>
              <Timer className="h-6 w-6 text-signal/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-data-info">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">P95 Response</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {data.p95ResponseTime === 0 ? "< 1" : data.p95ResponseTime}ms
                </p>
              </div>
              <Zap className="h-6 w-6 text-data-info/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-ok">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Success Rate</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {successRate.toFixed(1)}%
                </p>
              </div>
              <Gauge className="h-6 w-6 text-status-ok/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warn">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Requests</p>
                <p className="text-2xl font-bold font-mono text-text-primary">
                  {networkStats.totalRequests.toLocaleString()}
                </p>
              </div>
              <Network className="h-6 w-6 text-status-warn/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Percentiles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Response Time Percentiles
            </CardTitle>
            <CardDescription className="text-text-muted">
              Average, P95, and P99 response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData} barSize={48}>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="name" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} unit="ms" />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLES.contentStyle}
                    labelStyle={TOOLTIP_STYLES.labelStyle}
                    itemStyle={TOOLTIP_STYLES.itemStyle}
                    formatter={(value: number) => [`${value}ms`, "Response Time"]}
                  />
                  <Bar
                    dataKey="time"
                    fill={CHART_COLORS.signal}
                    radius={[4, 4, 0, 0]}
                    name="Response Time"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Slowest Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display text-text-primary">
              Slowest Endpoints
            </CardTitle>
            <CardDescription className="text-text-muted">
              {slowEndpointsData.length > 0
                ? `${slowEndpointsData.length} endpoint${slowEndpointsData.length !== 1 ? "s" : ""} identified`
                : "All endpoints performing optimally"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {slowEndpointsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slowEndpointsData} layout="vertical" barSize={12}>
                    <CartesianGrid {...GRID_PROPS} horizontal={false} />
                    <XAxis type="number" {...AXIS_PROPS} unit="ms" />
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
                      formatter={(value: number) => [`${value}ms`, "Response Time"]}
                    />
                    <Bar
                      dataKey="responseTime"
                      fill={CHART_COLORS.warn}
                      radius={[0, 4, 4, 0]}
                      name="Response Time"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <div className="text-center">
                    <Zap className="h-10 w-10 mx-auto mb-2 text-signal/30" />
                    <p className="text-sm">All endpoints performing well</p>
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
