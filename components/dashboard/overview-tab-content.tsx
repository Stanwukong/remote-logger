// src/components/dashboard/overview-tab-content.tsx
import { ChartCard } from "@/components/chart-card"; // Assuming this is an existing component
import { ProjectHealthCard } from "@/components/project-health-card"; // Assuming this is an existing component
import { AlertsOverview } from "@/components/alerts-overview"; // Assuming this is an existing component

// Define types for chart data if not already defined globally
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
  }[];
}

export interface OverviewTabContentProps {
  logVolumeChartData: ChartData;
  errorDistributionChartData: ChartData;
  // ProjectHealthCard and AlertsOverview are assumed to fetch their own data or take no props
}

export function OverviewTabContent({
  logVolumeChartData,
  errorDistributionChartData,
}: OverviewTabContentProps) {
  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Log Volume Trends"
          description="Logs per hour over the last 24 hours"
          type="line"
          data={logVolumeChartData}
        />
        <ChartCard
          title="Error Distribution"
          description="Error types and frequency in the last 24 hours"
          type="pie"
          data={errorDistributionChartData}
        />
      </div>

      {/* Project Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectHealthCard />
        </div>
        <div>
          <AlertsOverview />
        </div>
      </div>
    </div>
  );
}

// Example chart data for the parent component
export const defaultLogVolumeChartData: ChartData = {
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
  datasets: [
    {
      label: "Logs",
      data: [12000, 8000, 15000, 25000, 35000, 28000, 18000],
      borderColor: "hsl(var(--primary))",
      backgroundColor: "hsl(var(--primary) / 0.1)",
    },
  ],
};

export const defaultErrorDistributionChartData: ChartData = {
  labels: ["Database Errors", "API Timeouts", "Auth Failures", "Network Issues", "Other"],
  datasets: [
    {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
            "hsl(var(--destructive))",
            "hsl(var(--destructive) / 0.8)",
            "hsl(var(--destructive) / 0.6)",
            "hsl(var(--destructive) / 0.4)",
            "hsl(var(--destructive) / 0.2)",
        ],
        label: ""
    },
  ],
};
