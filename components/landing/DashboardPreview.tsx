"use client";

import { useState, useEffect } from "react";
import { SignalDot } from "@/components/shared/SignalDot";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

interface LogEntry {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  service: string;
  timestamp: string;
}

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
}

const levelStyles: Record<string, string> = {
  error: "text-level-error bg-level-error/10",
  warn: "text-level-warn bg-level-warn/10",
  info: "text-level-info bg-level-info/10",
  debug: "text-level-debug bg-level-debug/10",
};

export function DashboardPreview() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      level: "info",
      message: "User authentication successful",
      service: "auth-service",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      level: "error",
      message: "Database connection timeout",
      service: "api-service",
      timestamp: new Date(Date.now() - 30000).toISOString(),
    },
    {
      id: "3",
      level: "warn",
      message: "High memory usage detected",
      service: "worker-service",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: "4",
      level: "info",
      message: "Payment processed: $49.99",
      service: "billing-service",
      timestamp: new Date(Date.now() - 90000).toISOString(),
    },
  ]);

  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: "Total Logs", value: 1234567, change: 12.5, trend: "up" },
    { label: "Error Rate", value: 2.3, change: -8.2, trend: "down" },
    { label: "Response Time", value: 142, change: -15, trend: "down" },
    { label: "Uptime", value: 99.9, change: 0.1, trend: "up" },
  ]);

  const [chartData, setChartData] = useState([
    40, 60, 30, 80, 45, 70, 55, 90, 35, 65, 50, 75,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(2, 11),
        level: ["info", "warn", "error", "debug"][
          Math.floor(Math.random() * 4)
        ] as LogEntry["level"],
        message: [
          "Request processed successfully",
          "Cache miss for key user:123",
          "API rate limit exceeded",
          "Background job started",
          "File upload completed",
          "Session token refreshed",
        ][Math.floor(Math.random() * 6)],
        service: [
          "api-service",
          "auth-service",
          "worker-service",
          "billing-service",
        ][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);

      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: m.value + (Math.random() - 0.5) * (m.value * 0.01),
          change: (Math.random() - 0.5) * 20,
          trend: (Math.random() > 0.5 ? "up" : "down") as "up" | "down",
        }))
      );

      setChartData((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 100),
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formatMetric = (value: number, label: string) => {
    if (label === "Total Logs") return `${(value / 1000000).toFixed(1)}M`;
    if (label === "Response Time") return `${Math.round(value)}ms`;
    if (label === "Uptime" || label === "Error Rate")
      return `${value.toFixed(1)}%`;
    return Math.round(value).toString();
  };

  const metricIcons = [
    <Activity key="a" className="w-3.5 h-3.5 text-signal" />,
    <AlertTriangle key="b" className="w-3.5 h-3.5 text-status-danger" />,
    <Clock key="c" className="w-3.5 h-3.5 text-data" />,
    <CheckCircle key="d" className="w-3.5 h-3.5 text-status-ok" />,
  ];

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-4 px-4 py-3 bg-bg-elevated border-b border-border-faint">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 h-7 rounded-md bg-bg-void/80 flex items-center px-3">
          <span className="text-xs text-text-muted font-code">
            app.monita.dev/dashboard
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SignalDot status="ok" size="sm" />
          <span className="text-[10px] text-text-muted">Live</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-text-primary">
              Dashboard
            </h3>
            <p className="text-[10px] text-text-muted">
              Real-time overview
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-border-faint bg-bg-void/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-text-muted">
                  {metric.label}
                </span>
                {metricIcons[i]}
              </div>
              <div className="text-base font-bold text-text-primary">
                {formatMetric(metric.value, metric.label)}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-signal" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-status-danger" />
                )}
                <span
                  className={`text-[10px] ${
                    metric.trend === "up"
                      ? "text-signal"
                      : "text-status-danger"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Logs side by side */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Mini chart */}
          <div className="p-3 rounded-lg border border-border-faint bg-bg-void/50">
            <p className="text-[10px] text-text-muted mb-2">
              Log Volume (24h)
            </p>
            <div className="flex items-end gap-0.5 h-16">
              {chartData.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-signal/40 rounded-t hover:bg-signal/60 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Log feed */}
          <div className="p-3 rounded-lg border border-border-faint bg-bg-void/50">
            <p className="text-[10px] text-text-muted mb-2">Live Logs</p>
            <div className="space-y-1.5">
              {logs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-2 text-[10px]"
                >
                  <span
                    className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${
                      levelStyles[log.level]
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-text-primary truncate flex-1 font-code">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
