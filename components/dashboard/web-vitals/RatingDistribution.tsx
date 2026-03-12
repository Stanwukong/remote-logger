"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { CHART_COLORS } from "@/lib/charts/observatory-theme";

interface RatingDistributionProps {
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
  vitalName: string;
}

const RATING_COLORS = [CHART_COLORS.ok, CHART_COLORS.warn, CHART_COLORS.danger];

function getOverallRating(
  goodCount: number,
  needsImprovementCount: number,
  poorCount: number
): string {
  const total = goodCount + needsImprovementCount + poorCount;
  if (total === 0) return "No data";
  const goodPct = goodCount / total;
  if (goodPct >= 0.75) return "Good";
  if (goodPct >= 0.5) return "Needs Improvement";
  return "Poor";
}

export function RatingDistribution({
  goodCount,
  needsImprovementCount,
  poorCount,
  vitalName,
}: RatingDistributionProps) {
  const total = goodCount + needsImprovementCount + poorCount;

  const chartData = [
    { name: "Good", value: goodCount },
    { name: "Needs Improvement", value: needsImprovementCount },
    { name: "Poor", value: poorCount },
  ].filter((d) => d.value > 0);

  const overallRating = getOverallRating(
    goodCount,
    needsImprovementCount,
    poorCount
  );

  if (total === 0) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
        <h3 className="font-display font-semibold text-text-primary mb-2">
          {vitalName} Rating Distribution
        </h3>
        <p className="text-text-muted text-sm text-center py-8">
          No rating data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <h3 className="font-display font-semibold text-text-primary mb-4">
        {vitalName} Rating Distribution
      </h3>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => {
                const originalIndex =
                  entry.name === "Good"
                    ? 0
                    : entry.name === "Needs Improvement"
                    ? 1
                    : 2;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={RATING_COLORS[originalIndex]}
                  />
                );
              })}
            </Pie>
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-text-secondary">{value}</span>
              )}
            />
            {/* Center label */}
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-text-primary"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-display)",
              }}
            >
              {overallRating}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-text-muted"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {total} samples
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Percentage breakdown */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center">
          <p className="text-xs text-text-muted">Good</p>
          <p className="font-mono text-sm text-signal font-medium">
            {total > 0 ? ((goodCount / total) * 100).toFixed(0) : 0}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">Needs Work</p>
          <p className="font-mono text-sm text-status-warn font-medium">
            {total > 0
              ? ((needsImprovementCount / total) * 100).toFixed(0)
              : 0}
            %
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">Poor</p>
          <p className="font-mono text-sm text-status-danger font-medium">
            {total > 0 ? ((poorCount / total) * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
