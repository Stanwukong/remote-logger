"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Server,
  Loader2,
} from "lucide-react";

import { analyticsService } from "@/services/analytics.service";
import { TimeRange } from "@/types/analytics.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AnalyticsPerformanceProps {
  projectId: string;
}

const AnalyticsPerformance = ({ projectId }: AnalyticsPerformanceProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [selectedMetric, setSelectedMetric] = useState("lcp");

  // Queries
  const timelineQuery = useQuery({
    queryKey: ["performanceTimeline", projectId, timeRange],
    queryFn: () =>
      analyticsService.getPerformanceTimeline(projectId, timeRange),
  });

  const webVitalsQuery = useQuery({
    queryKey: ["webVitals", projectId, timeRange],
    queryFn: () => analyticsService.getWebVitals(projectId, timeRange),
  });

  const resourceQuery = useQuery({
    queryKey: ["resourcePerformance", projectId, timeRange],
    queryFn: () =>
      analyticsService.getResourcePerformance(projectId, timeRange),
  });

  const pageQuery = useQuery({
    queryKey: ["pagePerformance", projectId, timeRange],
    queryFn: () => analyticsService.getPagePerformance(projectId, timeRange),
  });

  const isLoading =
    timelineQuery.isLoading ||
    webVitalsQuery.isLoading ||
    resourceQuery.isLoading ||
    pageQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "good")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "needs-improvement")
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getPerformanceScore = (loadTime: number) => {
    if (loadTime < 1000)
      return { score: "Good", color: "text-green-600", bg: "bg-green-50" };
    if (loadTime < 2000)
      return { score: "Fair", color: "text-orange-600", bg: "bg-orange-50" };
    return { score: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  // Derived metrics for display cards
  // Note: API response for web vitals assumes avg and p75.
  // We'll map these to the cards.
  const metrics = [
    {
      label: "LCP (P75)",
      value: `${(webVitalsQuery.data?.lcp.p75 ?? 0 / 1000).toFixed(2)}s`,
      change: "0ms", // Placeholder as API doesn't return change for this endpoint example
      trend: "stable",
      icon: Activity,
      color: "text-orange-500",
      status:
        (webVitalsQuery.data?.lcp.p75 ?? 0) < 2500
          ? "good"
          : "needs-improvement",
    },
    {
      label: "FCP (P75)",
      value: `${(webVitalsQuery.data?.fcp.p75 ?? 0 / 1000).toFixed(2)}s`,
      change: "0ms",
      trend: "stable",
      icon: Clock,
      color: "text-green-500",
      status:
        (webVitalsQuery.data?.fcp.p75 ?? 0) < 1800
          ? "good"
          : "needs-improvement",
    },
    {
      label: "CLS (P75)",
      value: (webVitalsQuery.data?.cls.p75 ?? 0).toFixed(3),
      change: "0",
      trend: "stable",
      icon: Zap,
      color: "text-blue-500",
      status:
        (webVitalsQuery.data?.cls.p75 ?? 0) < 0.1
          ? "good"
          : "needs-improvement",
    },
    {
      // Placeholder for API latency or similar if available
      label: "Avg Load Time",
      value: "1.2s", // Mock or derived
      change: "-120ms",
      trend: "down",
      icon: Server,
      color: "text-purple-500",
      status: "good",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Performance Analytics
          </h2>
          <p className="text-muted-foreground">
            Monitor Core Web Vitals and application performance
          </p>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <Badge
                  variant="outline"
                  className={`${getStatusColor(metric.status)} capitalize`}
                >
                  {metric.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-600">{metric.label}</div>
                {/* Trend logic would go here if data available */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Performance Timeline
            </h2>
            <div className="flex gap-2">
              {[
                { key: "lcp", label: "LCP" },
                { key: "fcp", label: "FCP" },
                { key: "ttfb", label: "TTFB" },
              ].map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedMetric === metric.key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineQuery.data ?? []}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any) => `${Math.round(value)}ms`}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resourceQuery.data?.map((resource, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-gray-900 truncate flex-1 block max-w-full">
                      {resource.name}
                    </span>
                    <span className="text-sm text-gray-600 ml-2 whitespace-nowrap">
                      {resource.calls} calls
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Avg</div>
                      <div className="font-medium text-gray-900">
                        {Math.round(resource.avgDuration)}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">P95</div>
                      <div className="font-medium text-gray-900">
                        {Math.round(resource.p95)}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">P99</div>
                      <div className="font-medium text-gray-900">
                        {Math.round(resource.p99)}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Errors</div>
                      <div
                        className={`font-medium ${
                          resource.errors > 10
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {resource.errors}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar for avg duration */}
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        resource.avgDuration < 200
                          ? "bg-green-500"
                          : resource.avgDuration < 400
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (resource.avgDuration / 1000) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Page Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Page Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pageQuery.data?.map((page, idx) => {
                const score = getPerformanceScore(page.loadTime);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {page.page}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${score.color} ${score.bg}`}
                      >
                        {score.score}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Load</div>
                        <div className="font-medium">
                          {(page.loadTime / 1000).toFixed(2)}s
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">FCP</div>
                        <div className="font-medium">{page.fcp}ms</div>
                      </div>
                      <div>
                        <div className="text-gray-500">LCP</div>
                        <div className="font-medium">
                          {(page.lcp / 1000).toFixed(2)}s
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">CLS</div>
                        <div className="font-medium">{page.cls.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Core Web Vitals Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Largest Contentful Paint
              </h3>
              <Badge
                variant="outline"
                className={
                  webVitalsQuery.data?.lcp.avg ?? 0 < 2500
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }
              >
                {webVitalsQuery.data?.lcp.avg ?? 0 < 2500
                  ? "Good"
                  : "Needs Work"}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {((webVitalsQuery.data?.lcp.avg ?? 0) / 1000).toFixed(2)}s
            </div>
            <div className="text-xs text-gray-500">
              Target: &lt; 2.5s for good experience
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                First Contentful Paint
              </h3>
              <Badge
                variant="outline"
                className={
                  webVitalsQuery.data?.fcp.avg ?? 0 < 1800
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }
              >
                {webVitalsQuery.data?.fcp.avg ?? 0 < 1800
                  ? "Good"
                  : "Needs Work"}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {((webVitalsQuery.data?.fcp.avg ?? 0) / 1000).toFixed(2)}s
            </div>
            <div className="text-xs text-gray-500">
              Target: &lt; 1.8s for good experience
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Cumulative Layout Shift
              </h3>
              <Badge
                variant="outline"
                className={
                  webVitalsQuery.data?.cls.avg ?? 0 < 0.1
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }
              >
                {webVitalsQuery.data?.cls.avg ?? 0 < 0.1
                  ? "Good"
                  : "Needs Work"}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {(webVitalsQuery.data?.cls.avg ?? 0).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              Target: &lt; 0.1 for good experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPerformance;
