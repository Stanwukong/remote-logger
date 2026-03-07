"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  CHART_COLORS,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";

interface HistoryDataPoint {
  bucket: string;
  vital: string;
  avgValue: number;
  count: number;
}

interface WebVitalsChartProps {
  data: HistoryDataPoint[];
  selectedVital: string;
}

// Google thresholds for reference lines
const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
};

function formatUnit(vital: string, value: number): string {
  if (vital === "CLS") return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload[0]) return null;

  const value = payload[0].value;
  const vital = payload[0].payload.vital;

  return (
    <div
      className="rounded-lg border border-border-subtle/60 p-3 text-sm"
      style={{
        backgroundColor: "rgba(11, 18, 32, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div className="text-text-muted mb-1">{label}</div>
      <div className="text-text-primary font-medium">
        {vital}: {formatUnit(vital, value)}
      </div>
    </div>
  );
}

export function WebVitalsChart({ data, selectedVital }: WebVitalsChartProps) {
  const filteredData = data
    .filter((d) => d.vital === selectedVital)
    .map((d) => ({
      ...d,
      time: new Date(d.bucket).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  const threshold = THRESHOLDS[selectedVital];

  if (filteredData.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
        <p className="text-text-muted text-sm text-center py-12">
          No history data available for {selectedVital}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <div className="flex items-center gap-2 text-text-primary mb-1">
        <h3 className="font-display font-semibold">
          {selectedVital} History
        </h3>
      </div>
      <p className="text-sm text-text-muted mb-4">
        Average {selectedVital} values over time
        {selectedVital !== "CLS" ? " (ms)" : ""}
      </p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id="signalGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.signal}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.signal}
                  stopOpacity={0.02}
                />
              </linearGradient>
              <filter id="vitalGlow" height="200%">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="3"
                  result="blur"
                />
                <feFlood
                  floodColor={CHART_COLORS.signal}
                  floodOpacity="0.35"
                  result="color"
                />
                <feComposite
                  in="color"
                  in2="blur"
                  operator="in"
                  result="shadow"
                />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="time" {...AXIS_PROPS} />
            <YAxis
              {...AXIS_PROPS}
              tickFormatter={(val) => formatUnit(selectedVital, val)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--text-muted)",
                strokeOpacity: 0.3,
                strokeWidth: 1,
              }}
            />

            {/* Threshold reference lines */}
            {threshold && (
              <>
                <ReferenceLine
                  y={threshold.good}
                  stroke={CHART_COLORS.ok}
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: "Good",
                    position: "right",
                    fill: CHART_COLORS.ok,
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  y={threshold.poor}
                  stroke={CHART_COLORS.danger}
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: "Poor",
                    position: "right",
                    fill: CHART_COLORS.danger,
                    fontSize: 10,
                  }}
                />
              </>
            )}

            <Area
              type="monotone"
              dataKey="avgValue"
              stroke={CHART_COLORS.signal}
              strokeWidth={2}
              fill="url(#signalGradient)"
              filter="url(#vitalGlow)"
              dot={false}
              activeDot={{
                r: 5,
                fill: CHART_COLORS.signal,
                stroke: "var(--bg-surface)",
                strokeWidth: 2,
                style: { filter: "drop-shadow(0 0 6px var(--signal))" },
              }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
