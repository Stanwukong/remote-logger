"use client";

import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  CHART_COLORS,
  GRID_PROPS,
  AXIS_PROPS,
} from "@/lib/charts/observatory-theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TimeSeriesDataPoint {
  timestamp: string;
  [key: string]: string | number;
}

interface TimeSeriesConfig {
  key: string;
  label: string;
  color: string;
  type?: "line" | "area";
  strokeDasharray?: string;
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  series: TimeSeriesConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showBrush?: boolean;
  xAxisKey?: string;
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number, name: string) => string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Default chart palette (references Observatory CSS custom properties)
// ---------------------------------------------------------------------------

const DEFAULT_CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatValue?: (value: number, name: string) => string;
}

function CustomTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg shadow-xl p-3 text-sm">
      <p className="text-text-muted text-xs mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-semibold font-mono">
            {formatValue
              ? formatValue(entry.value, entry.name)
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Legend
// ---------------------------------------------------------------------------

interface LegendEntry {
  value: string;
  color: string;
  dataKey?: string;
}

function CustomLegend({ payload }: { payload?: LegendEntry[] }) {
  if (!payload?.length) return null;
  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5 font-body text-xs text-text-secondary">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TimeSeriesChart({
  data,
  series,
  height = 300,
  showGrid = true,
  showLegend = true,
  showBrush = false,
  xAxisKey = "timestamp",
  formatXAxis,
  formatYAxis,
  formatTooltip,
  className,
}: TimeSeriesChartProps) {
  // Empty state
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-text-muted text-sm",
          className
        )}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  // Determine if we need an AreaChart or LineChart.
  // If any series requests "area" (or leaves it as default), use AreaChart as
  // the container since it supports both <Area> and <Line> children.
  const hasArea = series.some((s) => s.type !== "line");
  const ChartContainer = hasArea ? AreaChart : LineChart;

  // Resolve colors: fall back to default palette when a series has no color.
  const resolvedSeries = series.map((s, idx) => ({
    ...s,
    color: s.color || DEFAULT_CHART_PALETTE[idx % DEFAULT_CHART_PALETTE.length],
    type: s.type ?? "area",
  }));

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {/* Gradient definitions for area fills */}
          <defs>
            {resolvedSeries
              .filter((s) => s.type === "area")
              .map((s) => (
                <linearGradient
                  key={`gradient-${s.key}`}
                  id={`gradient-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray={GRID_PROPS.strokeDasharray}
              stroke={GRID_PROPS.stroke}
              strokeOpacity={GRID_PROPS.strokeOpacity}
              vertical={false}
            />
          )}

          <XAxis
            dataKey={xAxisKey}
            {...AXIS_PROPS}
            tickFormatter={formatXAxis}
            stroke={CHART_COLORS.grid}
          />

          <YAxis
            {...AXIS_PROPS}
            tickFormatter={formatYAxis}
            stroke={CHART_COLORS.grid}
            width={48}
          />

          <Tooltip
            content={
              <CustomTooltip formatValue={formatTooltip} />
            }
            cursor={{
              stroke: "var(--border-subtle)",
              strokeDasharray: "4 4",
            }}
          />

          {showLegend && (
            <Legend content={<CustomLegend />} />
          )}

          {/* Render series */}
          {resolvedSeries.map((s) =>
            s.type === "area" ? (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#gradient-${s.key})`}
                fillOpacity={1}
                strokeDasharray={s.strokeDasharray}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: s.color,
                  fill: "var(--bg-surface)",
                }}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.strokeDasharray}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: s.color,
                  fill: "var(--bg-surface)",
                }}
              />
            )
          )}

          {showBrush && (
            <Brush
              dataKey={xAxisKey}
              height={28}
              fill="var(--bg-elevated)"
              stroke="var(--border-subtle)"
              travellerWidth={8}
              tickFormatter={formatXAxis}
            />
          )}
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
