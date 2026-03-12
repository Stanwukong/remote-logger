"use client";

import { useState, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  CHART_COLORS,
  GRID_PROPS,
  AXIS_PROPS,
  ANIMATION_CONFIG,
  CURSOR_BAR_PROPS,
} from "@/lib/charts/observatory-theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BarChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface BarSeriesConfig {
  key: string;
  label: string;
  color: string;
  stackId?: string;
}

interface ObservatoryBarChartProps {
  data: BarChartDataPoint[];
  series: BarSeriesConfig[];
  height?: number;
  layout?: "horizontal" | "vertical";
  showGrid?: boolean;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  barSize?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Default chart palette
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
  formatValue?: (value: number) => string;
}

function CustomTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg shadow-2xl p-3 text-sm border border-border-subtle"
      style={{
        backgroundColor: "rgba(11, 18, 32, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "opacity 200ms ease-in-out",
      }}
    >
      <p className="text-text-muted text-xs mb-2.5 font-medium">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 min-w-[160px]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: entry.color,
                  boxShadow: `0 0 6px ${entry.color}`,
                }}
              />
              <span className="text-text-secondary text-xs">{entry.name}</span>
            </div>
            <span
              className="text-text-primary font-semibold text-xs font-mono"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatValue
                ? formatValue(entry.value)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
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

interface CustomLegendProps {
  payload?: LegendEntry[];
  hoveredSeries: string | null;
  onSeriesHover: (dataKey: string | null) => void;
}

function CustomLegend({ payload, hoveredSeries, onSeriesHover }: CustomLegendProps) {
  if (!payload?.length) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((entry, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 font-body text-xs text-text-secondary cursor-pointer select-none"
          style={{
            opacity: hoveredSeries === null || hoveredSeries === entry.dataKey ? 1 : 0.4,
            transition: "opacity 200ms ease-in-out",
          }}
          onMouseEnter={() => onSeriesHover(entry.dataKey || null)}
          onMouseLeave={() => onSeriesHover(null)}
        >
          <div
            className="h-3 shrink-0 rounded-sm"
            style={{
              width: "10px",
              backgroundColor: entry.color,
            }}
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

export function ObservatoryBarChart({
  data,
  series,
  height = 300,
  layout = "vertical",
  showGrid = true,
  showLegend = true,
  formatValue,
  barSize,
  className,
}: ObservatoryBarChartProps) {
  // Hover state for legend interaction
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  const handleSeriesHover = useCallback((dataKey: string | null) => {
    setHoveredSeries(dataKey);
  }, []);

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

  // Resolve colors: fall back to default palette when a series has no color.
  const resolvedSeries = series.map((s, idx) => ({
    ...s,
    color: s.color || DEFAULT_CHART_PALETTE[idx % DEFAULT_CHART_PALETTE.length],
  }));

  // Recharts "layout" prop controls axis orientation:
  //   layout="vertical"   → categories on Y axis, values on X axis (horizontal bars)
  //   layout="horizontal" → categories on X axis, values on Y axis (vertical bars, default)
  // Our prop uses "vertical" to mean vertical bars (the common default), so we
  // invert when passing to Recharts.
  const rechartsLayout = layout === "horizontal" ? "vertical" : "horizontal";

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={rechartsLayout}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="16%"
        >
          {/* SVG gradient definitions for each series */}
          <defs>
            {resolvedSeries.map((s) => (
              <linearGradient
                key={`bar-gradient-${s.key}`}
                id={`bar-gradient-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>

          {showGrid && (
            <CartesianGrid
              stroke={GRID_PROPS.stroke}
              strokeOpacity={GRID_PROPS.strokeOpacity}
              vertical={layout === "vertical"}
              horizontal={layout === "horizontal"}
            />
          )}

          {layout === "vertical" ? (
            <>
              <XAxis
                dataKey="name"
                {...AXIS_PROPS}
                stroke={CHART_COLORS.grid}
              />
              <YAxis
                {...AXIS_PROPS}
                stroke={CHART_COLORS.grid}
                tickFormatter={formatValue}
                width={48}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                {...AXIS_PROPS}
                stroke={CHART_COLORS.grid}
                tickFormatter={formatValue}
              />
              <YAxis
                dataKey="name"
                type="category"
                {...AXIS_PROPS}
                stroke={CHART_COLORS.grid}
                width={100}
              />
            </>
          )}

          <Tooltip
            content={<CustomTooltip formatValue={formatValue} />}
            cursor={CURSOR_BAR_PROPS}
          />

          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  hoveredSeries={hoveredSeries}
                  onSeriesHover={handleSeriesHover}
                />
              }
            />
          )}

          {resolvedSeries.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={`url(#bar-gradient-${s.key})`}
              stackId={s.stackId}
              barSize={barSize}
              radius={
                layout === "vertical"
                  ? [4, 4, 0, 0]      // Rounded top for vertical bars
                  : [0, 4, 4, 0]      // Rounded right for horizontal bars
              }
              style={{
                cursor: "pointer",
                transition: "opacity 200ms ease-in-out",
              }}
              opacity={hoveredSeries === null || hoveredSeries === s.key ? 1 : 0.2}
              animationDuration={ANIMATION_CONFIG.animationDuration}
              animationEasing={ANIMATION_CONFIG.animationEasing}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
