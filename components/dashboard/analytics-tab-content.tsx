// src/components/dashboard/analytics-tab-content.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartCard } from "@/components/chart-card"; // Assuming this is an existing component
import { Badge } from "@/components/ui/badge";

// Define types for chart data if not already defined globally
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

// Define types for other analytics data
interface TopErrorSource {
  source: string;
  count: number;
  percentage: number;
}

interface ServicePerformance {
  service: string;
  responseTime: string;
  status: "good" | "excellent" | "poor"; // Added 'poor' for completeness
}

interface UsageStatistics {
  dailyLogVolume: string;
  storageUsed: string;
  apiRequests: string;
  activeIntegrations: number;
  quotaUsedPercentage: number;
}

interface AnalyticsTabContentProps {
  logLevelsChartData: ChartData;
  responseTimeChartData: ChartData;
  topErrorSources: TopErrorSource[];
  servicePerformance: ServicePerformance[];
  usageStatistics: UsageStatistics;
}

export function AnalyticsTabContent({
  logLevelsChartData,
  responseTimeChartData,
  topErrorSources,
  servicePerformance,
  usageStatistics,
}: AnalyticsTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Log Levels Distribution"
          description="Breakdown of log levels over time"
          type="bar"
          data={logLevelsChartData}
        />

        <ChartCard
          title="Response Time Trends"
          description="Average response times across services"
          type="line"
          data={responseTimeChartData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Error Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topErrorSources.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.source}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{item.service}</div>
                    <div className="text-xs text-muted-foreground">{item.responseTime}</div>
                  </div>
                  <Badge variant={item.status === "excellent" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Log Volume</span>
                <span className="font-semibold">{usageStatistics.dailyLogVolume}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="font-semibold">{usageStatistics.storageUsed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Requests</span>
                <span className="font-semibold">{usageStatistics.apiRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Integrations</span>
                <span className="font-semibold">{usageStatistics.activeIntegrations}</span>
              </div>
              <Progress value={usageStatistics.quotaUsedPercentage} className="h-2 mt-4" />
              <p className="text-xs text-muted-foreground">{usageStatistics.quotaUsedPercentage}% of monthly quota used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Example data for parent component
export const defaultLogLevelsChartData: ChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    { label: "Error", data: [120, 150, 180, 90, 200, 160, 140], backgroundColor: "hsl(var(--destructive))" },
    { label: "Warning", data: [300, 280, 350, 250, 400, 320, 290], backgroundColor: "hsl(var(--warning))" },
    { label: "Info", data: [1200, 1100, 1400, 1000, 1600, 1300, 1150], backgroundColor: "hsl(var(--primary))" },
  ],
};

export const defaultResponseTimeChartData: ChartData = {
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
  datasets: [
    { label: "API Service", data: [245, 230, 280, 320, 290, 260, 250], borderColor: "hsl(var(--primary))", backgroundColor: "hsl(var(--primary) / 0.1)" },
    { label: "Web App", data: [180, 170, 200, 240, 220, 190, 185], borderColor: "hsl(var(--secondary))", backgroundColor: "hsl(var(--secondary) / 0.1)" },
  ],
};

export const defaultTopErrorSources: TopErrorSource[] = [
  { source: "Database Connection", count: 45, percentage: 35 },
  { source: "API Timeout", count: 32, percentage: 25 },
  { source: "Auth Failure", count: 26, percentage: 20 },
  { source: "Network Error", count: 19, percentage: 15 },
  { source: "Other", count: 6, percentage: 5 },
];

export const defaultServicePerformance: ServicePerformance[] = [
  { service: "API Service", responseTime: "245ms", status: "good" },
  { service: "Web App", responseTime: "180ms", status: "excellent" },
  { service: "Workers", responseTime: "95ms", status: "excellent" },
  { service: "Database", responseTime: "12ms", status: "excellent" },
];

export const defaultUsageStatistics: UsageStatistics = {
  dailyLogVolume: "1.2M",
  storageUsed: "2.4GB",
  apiRequests: "45.2K",
  activeIntegrations: 8,
  quotaUsedPercentage: 65,
};
