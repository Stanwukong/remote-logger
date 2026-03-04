"use client";

import { Project } from "@/types/project.types";
import { ObservatoryMetricCard } from "./ObservatoryMetricCard";
import { SignalDot } from "@/components/shared/SignalDot";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";
import { Activity, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

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

  const history = responseTime?.history ?? [];
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
      {history.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
          <div className="flex items-center gap-2 text-text-primary mb-1">
            <Clock className="w-5 h-5 text-data-info" />
            <h3 className="font-display font-semibold">Response Time Trend</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Historical trend of average response times (ms)
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid {...GRID_PROPS} />
                <XAxis
                  dataKey="timestamp"
                  {...AXIS_PROPS}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  {...AXIS_PROPS}
                  tickFormatter={(val) => `${val}ms`}
                />
                <Tooltip
                  {...TOOLTIP_STYLES}
                  labelFormatter={(label) => new Date(String(label)).toLocaleString()}
                  formatter={(value: number | string) => [
                    `${Number(value).toFixed(1)}ms`,
                    "Avg Response Time",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="avgResponseTime"
                  stroke={CHART_COLORS.signal}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: CHART_COLORS.signal,
                    stroke: "var(--bg-surface)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
