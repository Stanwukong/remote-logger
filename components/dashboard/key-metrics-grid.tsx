// src/components/dashboard/key-metrics-grid.tsx
import { SummaryWidget } from "@/components/summary-widget"; // Assuming this is an existing component
import { Activity, AlertTriangle, Zap, Users, LucideIcon } from "lucide-react";

// Define a type for the data each SummaryWidget expects
interface MetricData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon; // Lucide icon component
  trend: "up" | "down" | "neutral";
  subtitle: string;
  details: string;
  variant?: "default" | "destructive" | "warning"; // Assuming SummaryWidget accepts a variant
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

// Example usage data for the parent component
export const defaultKeyMetrics: MetricData[] = [
  {
    title: "Total Logs (24h)",
    value: "1,234,567",
    change: "+12.5%",
    icon: Activity,
    trend: "up",
    subtitle: "vs yesterday",
    details: "Peak: 89K/hour at 2:00 PM",
  },
  {
    title: "Active Errors",
    value: "23",
    change: "-8.2%",
    icon: AlertTriangle,
    trend: "down",
    variant: "destructive",
    subtitle: "vs last hour",
    details: "3 critical, 8 high, 12 medium",
  },
  {
    title: "Alert Rules",
    value: "8",
    change: "+2",
    icon: Zap,
    trend: "up",
    variant: "warning",
    subtitle: "active rules",
    details: "2 triggered in last hour",
  },
  {
    title: "Projects",
    value: "12",
    change: "+1",
    icon: Users,
    trend: "up",
    subtitle: "total projects",
    details: "11 active, 1 paused",
  },
];
