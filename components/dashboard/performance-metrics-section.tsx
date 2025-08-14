// src/components/dashboard/performance-metrics-section.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, CheckCircle, Cpu, HardDrive, Network, Timer } from "lucide-react";

// Define a type for each performance metric card's data
export interface PerformanceMetricCardData {
  title: string;
  value: string;
  change: string;
  changeColorClass: string; // Tailwind class for text color (e.g., 'text-green-600')
  icon: React.ElementType; // Lucide icon for the title
  trendIcon: React.ElementType; // Lucide icon for the trend indicator
  subtitle: string;
  progressValue: number;
}

interface PerformanceMetricsSectionProps {
  metrics: PerformanceMetricCardData[];
}

export function PerformanceMetricsSection({ metrics }: PerformanceMetricsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <metric.icon className="w-4 h-4 mr-2" />
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              <metric.trendIcon className={`h-3 w-3 ${metric.changeColorClass}`} />
              <span className={metric.changeColorClass}>{metric.change}</span>
              <span className="text-muted-foreground">{metric.subtitle}</span>
            </div>
            <Progress value={metric.progressValue} className="h-2 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Example usage data for the parent component
export const defaultPerformanceMetrics: PerformanceMetricCardData[] = [
  {
    title: "Avg Response Time",
    value: "245ms",
    change: "-12ms",
    changeColorClass: "text-green-600",
    icon: Timer,
    trendIcon: TrendingDown,
    subtitle: "from last hour",
    progressValue: 75,
  },
  {
    title: "System Load",
    value: "68%",
    change: "+5%",
    changeColorClass: "text-orange-600",
    icon: Cpu,
    trendIcon: TrendingUp,
    subtitle: "from last hour",
    progressValue: 68,
  },
  {
    title: "Storage Used",
    value: "2.4GB",
    change: "+180MB",
    changeColorClass: "text-blue-600",
    icon: HardDrive,
    trendIcon: TrendingUp,
    subtitle: "today",
    progressValue: 45,
  },
  {
    title: "Uptime",
    value: "99.9%",
    change: "30 days",
    changeColorClass: "text-green-600",
    icon: Network,
    trendIcon: CheckCircle,
    subtitle: "no incidents",
    progressValue: 99.9,
  },
];
