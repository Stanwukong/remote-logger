"use client";

import { ReferenceLine, ReferenceArea } from "recharts";
import { Anomaly } from "@/types/anomaly.types";

interface AnomalyOverlayProps {
  anomalies: Anomaly[];
  xAxisKey?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "var(--status-danger, #ef4444)",
  warning: "var(--status-warn, #f59e0b)",
  info: "var(--data-info, #4d8ef8)",
};

/**
 * Renders Recharts ReferenceLine elements at anomaly timestamps.
 * Usage: spread the returned elements inside an AreaChart / LineChart.
 *
 * ```tsx
 * <AreaChart data={data}>
 *   {renderAnomalyMarkers(anomalies)}
 *   ...
 * </AreaChart>
 * ```
 */
export function renderAnomalyMarkers(
  anomalies: Anomaly[],
  xAxisKey: string = "timestamp"
) {
  if (!anomalies || anomalies.length === 0) return null;

  return anomalies.map((anomaly) => {
    const color = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.info;
    const ts = anomaly.detectedAt;

    return (
      <ReferenceLine
        key={anomaly._id}
        x={ts}
        stroke={color}
        strokeDasharray="4 3"
        strokeWidth={1.5}
        strokeOpacity={0.7}
        label={{
          value: anomaly.type === "error_spike" ? "!" : anomaly.type === "error_rate_increase" ? "E" : "A",
          position: "top",
          fill: color,
          fontSize: 10,
          fontWeight: 600,
        }}
      />
    );
  });
}

/**
 * Component version — renders a list of ReferenceLine elements.
 * Must be used as a direct child of a Recharts chart.
 */
export function AnomalyOverlay({ anomalies, xAxisKey = "timestamp" }: AnomalyOverlayProps) {
  return <>{renderAnomalyMarkers(anomalies, xAxisKey)}</>;
}
