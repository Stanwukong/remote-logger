"use client";

import { Project } from "@/types/project.types";
import { ObservatoryMetricCard } from "./ObservatoryMetricCard";
import { SignalDot } from "@/components/shared/SignalDot";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Activity, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

const responseTimeChartConfig = {
  avgResponseTime: {
    label: "Avg Response Time",
    color: "var(--signal)",
  },
} satisfies ChartConfig;

interface PerformanceTabContentProps {
  performance: Project["analytics"]["performance"];
  responseTime: Project["analytics"]["responseTime"];
  usage: Project["analytics"]["usage"];
}

export function PerformanceTabContent({
  performance,
  responseTime,
  usage,
}: PerformanceTabContentProps) {
  const metrics = performance?.metrics;
  const totalRequests = metrics?.totalRequests ?? 0;
  const successfulRequests = metrics?.successfulRequests ?? 0;
  const avgResponseTime = metrics?.avgResponseTime;
  const health = performance?.health ?? "unknown";

  const successRate =
    totalRequests > 0
      ? Math.round((successfulRequests / totalRequests) * 100)
      : 0;

  const healthStatus =
    health === "excellent" || health === "good"
      ? "ok"
      : health === "poor" || health === "critical"
      ? "danger"
      : "warn";

  const chartData = (responseTime?.trends ?? []).map((point) => ({
    hour: (() => {
      try {
        const d = new Date(point._id?.hour ?? "");
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        return point._id?.hour ?? "";
      }
    })(),
    avgResponseTime: Math.round((point.avgResponseTime ?? 0) * 100) / 100,
  }));

  const insights = usage?.insights ?? [];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ObservatoryMetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          subtitle="Last period"
          icon={Activity}
        />
        <ObservatoryMetricCard
          title="Successful Requests"
          value={successfulRequests.toLocaleString()}
          subtitle={`${successRate}% success rate`}
          icon={CheckCircle}
          variant="success"
        />
        <ObservatoryMetricCard
          title="Avg Response Time"
          value={
            avgResponseTime != null
              ? `${avgResponseTime.toFixed(0)}ms`
              : "N/A"
          }
          subtitle={`Health: ${health}`}
          icon={Clock}
          variant={
            health === "poor" || health === "critical"
              ? "danger"
              : health === "fair"
              ? "warning"
              : "success"
          }
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
        <div className="flex items-center gap-2 text-text-primary mb-4">
          <Zap className="w-5 h-5 text-signal" />
          <h3 className="font-display font-semibold">Performance Insights</h3>
        </div>

        <div className="p-3 rounded-lg border mb-4"
          style={{
            backgroundColor:
              health === "poor" || health === "critical"
                ? "var(--status-danger-bg, rgba(239, 68, 68, 0.1))"
                : "var(--signal-bg, rgba(0, 217, 126, 0.05))",
            borderColor:
              health === "poor" || health === "critical"
                ? "var(--status-danger)"
                : "var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-text-secondary" />
            <span className="text-sm text-text-primary">
              System health is currently{" "}
              <strong className="capitalize">{health}</strong> based on
              recent performance metrics.
            </span>
            <SignalDot status={healthStatus} size="sm" />
          </div>
        </div>

        {insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-secondary">Key Insights</h4>
            <ul className="space-y-1.5">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                  <SignalDot status="info" size="sm" className="mt-1.5 shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Response Time Chart */}
      {chartData.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
          <div className="flex items-center gap-2 text-text-primary mb-1">
            <Clock className="w-5 h-5 text-data-info" />
            <h3 className="font-display font-semibold">Response Time Trend</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Historical trend of average response times (ms)
          </p>

          <ChartContainer config={responseTimeChartConfig} className="min-h-[280px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="perfResponseTimeGrad" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(val) => `${val}ms`}
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
                fill="url(#perfResponseTimeGrad)"
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
        </div>
      )}
    </div>
  );
}
