// src/components/dashboard/key-metrics-grid.tsx
import { SummaryWidget } from "@/components/summary-widget"; // Assuming this is an existing component
import { LucideIcon } from "lucide-react";

// Define a type for the data each SummaryWidget expects
export interface MetricData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon; // Lucide icon component
  trend: string;
  subtitle?: string;
  details?: string;
  variant?: string // Assuming SummaryWidget accepts a variant
}

interface KeyMetricsGridProps {
  metrics: MetricData[];
}

export function KeyMetricsGrid({ metrics }: KeyMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <SummaryWidget key={index} {...metric} />
      ))}
    </div>
  );
}