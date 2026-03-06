"use client";

import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface SparklineProps {
  /** Array of numeric values to plot */
  data: number[];
  /** Stroke and gradient color (CSS variable or hex) */
  color?: string;
  /** Chart height in pixels */
  height?: number;
  /** Whether to show gradient fill under the line */
  gradient?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Minimal sparkline chart for embedding in MetricCards.
 *
 * No axes, grid, tooltip, legend, or dots — pure shape.
 * Uses Recharts AreaChart with a gradient fill.
 */
export function Sparkline({
  data,
  color = "var(--signal)",
  height = 48,
  gradient = true,
  className,
}: SparklineProps) {
  // Convert raw numbers into Recharts-compatible data points
  const chartData = useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data]
  );

  // Generate a stable gradient ID based on color to avoid collisions
  const gradientId = useMemo(
    () => `sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, "")}`,
    [color]
  );

  if (!data || data.length < 2) {
    return <div className={cn("w-full", className)} style={{ height }} />;
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          {gradient && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={gradient ? `url(#${gradientId})` : "none"}
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
