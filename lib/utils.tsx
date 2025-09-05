import { DashboardOverview, MetricData } from "@/types/dashboard";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bug,
  CheckCircle,
  Globe,
  Info,
  Shield,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLevelIcon = (level: string) => {
  switch (level) {
    case "error":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "warn":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "info":
      return <Info className="w-4 h-4 text-blue-500" />;
    case "debug":
      return <Bug className="w-4 h-4 text-gray-500" />;
    case "trace":
      return <Zap className="w-4 h-4 text-gray-400" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

export const getLevelColor = (level: string) => {
  switch (level) {
    case "error":
      return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
    case "warn":
      return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20";
    case "info":
      return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
    case "debug":
      return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20";
    case "trace":
      return "border-l-gray-400 bg-gray-50/30 dark:bg-gray-950/10";
    default:
      return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20";
  }
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: format(date, "MMM dd"),
    time: format(date, "HH:mm:ss.SSS"),
  };
};

export const mapDashboardToMetrics = (
  dashboardData: DashboardOverview
): MetricData[] => {
  if (!dashboardData) return [];

  const { summary, realTime, health, topIssues, trends } = dashboardData;

  return [
    {
      title: "Total Logs",
      value: summary.totalLogs.toLocaleString(),
      change:
        trends.logVolumeChange > 0
          ? `+${trends.logVolumeChange.toFixed(1)}%`
          : `${trends.logVolumeChange.toFixed(1)}%`,
      icon: Activity,
      trend:
        trends.logVolumeChange > 0
          ? "up"
          : trends.logVolumeChange < 0
          ? "down"
          : "neutral",
      subtitle: "vs previous period",
      details: `${realTime.currentRPS.toLocaleString()} requests/sec currently`,
    },
    {
      title: "Error Rate",
      value: `${summary.errorRate.toFixed(2)}%`,
      change:
        trends.errorRateChange > 0
          ? `+${trends.errorRateChange.toFixed(1)}%`
          : `${trends.errorRateChange.toFixed(1)}%`,
      icon: AlertTriangle,
      trend:
        trends.errorRateChange > 0
          ? "up"
          : trends.errorRateChange < 0
          ? "down"
          : "neutral",
      variant:
        summary.errorRate > 5
          ? "destructive"
          : summary.errorRate > 1
          ? "warning"
          : "default",
      subtitle: "vs previous period",
      details: `${summary.totalErrors.toLocaleString()} total errors`,
    },
    {
      title: "Active Users",
      value: realTime.activeUsers.toLocaleString(),
      change: realTime.activeUsers > 0 ? "online" : "offline",
      icon: Users,
      trend: realTime.activeUsers > 0 ? "up" : "neutral",
      subtitle: "currently active",
      details: `${realTime.currentRPS.toLocaleString()} requests/sec`,
    },
    {
      title: "Response Time",
      value: `${summary.averageResponseTime}ms`,
      change:
        summary.averageResponseTime < 200
          ? "excellent"
          : summary.averageResponseTime < 500
          ? "good"
          : "needs attention",
      icon: Timer,
      trend:
        summary.averageResponseTime < 200
          ? "up"
          : summary.averageResponseTime < 500
          ? "neutral"
          : "down",
      variant: summary.averageResponseTime > 500 ? "warning" : "default",
      subtitle: "average response",
      details: topIssues.slowestEndpoint
        ? `Slowest: ${topIssues.slowestEndpoint}`
        : "All endpoints performing well",
    },
    {
      title: "Project Health",
      value: `${health.healthyProjects}/${summary.totalProjects}`,
      change:
        health.criticalProjects > 0
          ? `${health.criticalProjects} critical`
          : health.warningProjects > 0
          ? `${health.warningProjects} warnings`
          : "all healthy",
      icon: Shield,
      trend:
        health.criticalProjects > 0
          ? "down"
          : health.warningProjects > 0
          ? "neutral"
          : "up",
      variant:
        health.criticalProjects > 0
          ? "destructive"
          : health.warningProjects > 0
          ? "warning"
          : "success",
      subtitle: "projects healthy",
      details: `${health.healthyProjects} healthy, ${health.warningProjects} warning, ${health.criticalProjects} critical`,
    },
  ];
};

export const mapDashboardToHealthStatus = (
  dashboardData: DashboardOverview
) => {
  if (!dashboardData)
    return { status: "unknown", message: "No data available" };

  const { health, summary, topIssues } = dashboardData;
  const totalProjects = health.healthyProjects + health.warningProjects + health.criticalProjects;

  if (health.criticalProjects > 0) {
    return {
      status: "critical",
      message: `${health.criticalProjects} project${
        health.criticalProjects > 1 ? "s" : ""
      } require immediate attention`,
      details: topIssues.mostFrequentError
        ? `Most frequent error: ${topIssues.mostFrequentError}`
        : undefined,
    };
  }

  if (health.warningProjects > 0) {
    return {
      status: "warning",
      message: `${health.warningProjects} project${
        health.warningProjects > 1 ? "s" : ""
      } showing warnings`,
      details: `Error rate: ${summary.errorRate.toFixed(2)}%`,
    };
  }

  if (health.healthyProjects === totalProjects && totalProjects > 0) {
    return {
      status: "healthy",
      message: `All ${totalProjects} projects running smoothly`,
      details: `Average response time: ${summary.averageResponseTime}ms`,
    };
  }

  return {
    status: "unknown",
    message: "System status unclear",
    details: "Insufficient data to determine health status",
  };
};

export const mapPerformanceToMetrics = (
  performanceData
)=> {
  if (
    !performanceData ||
    performanceData.status !== "success" ||
    !performanceData.data
  ) {
    return [];
  }

  const { data } = performanceData;
  const { networkStats } = data;

  // Calculate success rate
  const successRate =
    networkStats.totalRequests > 0
      ? ((networkStats.totalRequests -
          (networkStats.failureRate * networkStats.totalRequests) / 100) /
          networkStats.totalRequests) *
        100
      : 100;

  // Determine performance grades
  const getResponseTimeGrade = (time: number) => {
    if (time === 0) return "excellent";
    if (time < 200) return "excellent";
    if (time < 500) return "good";
    if (time < 1000) return "fair";
    return "poor";
  };

  // const getFailureRateStatus = (rate: number) => {
  //   if (rate === 0) return "excellent";
  //   if (rate < 1) return "good";
  //   if (rate < 5) return "warning";
  //   return "critical";
  // };

  return [
    {
      title: "Average Response Time",
      value:
        data.averageResponseTime === 0
          ? "< 1ms"
          : `${data.averageResponseTime}ms`,
      change: getResponseTimeGrade(data.averageResponseTime),
      icon: Timer,
      trend:
        data.averageResponseTime < 200
          ? "up"
          : data.averageResponseTime < 500
          ? "neutral"
          : "down",
      variant:
        data.averageResponseTime > 1000
          ? "destructive"
          : data.averageResponseTime > 500
          ? "warning"
          : "success",
      subtitle: "response speed",
      details:
        networkStats.totalRequests > 0
          ? `${networkStats.totalRequests.toLocaleString()} total requests processed`
          : "No requests in time period",
    },
    {
      title: "P95 Response Time",
      value: data.p95ResponseTime === 0 ? "< 1ms" : `${data.p95ResponseTime}ms`,
      change:
        data.p95ResponseTime < data.averageResponseTime
          ? "better than average"
          : data.p95ResponseTime > data.averageResponseTime * 2
          ? "needs attention"
          : "within range",
      icon: BarChart3,
      trend:
        data.p95ResponseTime < 500
          ? "up"
          : data.p95ResponseTime < 1000
          ? "neutral"
          : "down",
      variant:
        data.p95ResponseTime > 2000
          ? "destructive"
          : data.p95ResponseTime > 1000
          ? "warning"
          : "default",
      subtitle: "95th percentile",
      details:
        data.p99ResponseTime > 0
          ? `P99: ${data.p99ResponseTime}ms`
          : "Fast response times across the board",
    },
    {
      title: "Network Requests",
      value: networkStats.totalRequests.toLocaleString(),
      change:
        networkStats.totalRequests > 1000
          ? "high volume"
          : networkStats.totalRequests > 100
          ? "moderate"
          : networkStats.totalRequests > 0
          ? "low volume"
          : "no activity",
      icon: Activity,
      trend: networkStats.totalRequests > 0 ? "up" : "neutral",
      variant:
        networkStats.failureRate > 5
          ? "destructive"
          : networkStats.failureRate > 1
          ? "warning"
          : "default",
      subtitle: "total requests",
      details:
        networkStats.averageRequestTime > 0
          ? `Average network time: ${networkStats.averageRequestTime}ms`
          : "Network performance optimal",
    },
    {
      title: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      change:
        networkStats.failureRate === 0
          ? "perfect"
          : networkStats.failureRate < 1
          ? "excellent"
          : networkStats.failureRate < 5
          ? "good"
          : "critical",
      icon: CheckCircle,
      trend:
        networkStats.failureRate === 0
          ? "up"
          : networkStats.failureRate < 5
          ? "neutral"
          : "down",
      variant:
        networkStats.failureRate > 5
          ? "destructive"
          : networkStats.failureRate > 1
          ? "warning"
          : "success",
      subtitle: `${networkStats.failureRate.toFixed(1)}% failure rate`,
      details:
        networkStats.slowRequests > 0
          ? `${networkStats.slowRequests} slow requests detected`
          : "All requests performing within normal parameters",
    },
    {
      title: "Slow Endpoints",
      value: data.slowestEndpoints.length.toString(),
      change:
        data.slowestEndpoints.length === 0
          ? "all fast"
          : data.slowestEndpoints.length < 3
          ? "manageable"
          : "review needed",
      icon: AlertTriangle,
      trend:
        data.slowestEndpoints.length === 0
          ? "up"
          : data.slowestEndpoints.length < 5
          ? "neutral"
          : "down",
      variant:
        data.slowestEndpoints.length > 10
          ? "destructive"
          : data.slowestEndpoints.length > 3
          ? "warning"
          : "default",
      subtitle: "endpoints need optimization",
      details:
        data.slowestEndpoints.length > 0
          ? `Slowest: ${data.slowestEndpoints[0]?.endpoint || "endpoint"} (${
              data.slowestEndpoints[0]?.responseTime || 0
            }ms)`
          : "All endpoints performing optimally",
    },
    {
      title: "Page Load Performance",
      value:
        data.pageLoadTimes.length > 0
          ? `${data.pageLoadTimes.length} pages`
          : "No data",
      change:
        data.pageLoadTimes.length > 0 ? "tracking active" : "no page data",
      icon: Globe,
      trend: data.pageLoadTimes.length > 0 ? "up" : "neutral",
      variant: "default",
      subtitle: "pages monitored",
      details:
        data.pageLoadTimes.length > 0
          ? `Fastest load: ${Math.min(
              ...data.pageLoadTimes.map((p) => p.loadTime || 0)
            )}ms`
          : "Enable page load monitoring for detailed insights",
    },
  ];
};

export const mapPerformanceToOverallStatus = (
  performanceData
) => {
  if (
    !performanceData ||
    performanceData.status !== "success" ||
    !performanceData.data
  ) {
    return {
      status: "unknown",
      message: "Performance data unavailable",
      grade: "N/A",
    };
  }

  const { data } = performanceData;
  const { networkStats } = data;

  // Calculate overall performance grade
  const avgResponseGrade =
    data.averageResponseTime < 200
      ? 4
      : data.averageResponseTime < 500
      ? 3
      : data.averageResponseTime < 1000
      ? 2
      : 1;

  const failureRateGrade =
    networkStats.failureRate === 0
      ? 4
      : networkStats.failureRate < 1
      ? 3
      : networkStats.failureRate < 5
      ? 2
      : 1;

  const endpointGrade =
    data.slowestEndpoints.length === 0
      ? 4
      : data.slowestEndpoints.length < 3
      ? 3
      : data.slowestEndpoints.length < 10
      ? 2
      : 1;

  const overallGrade = Math.round(
    (avgResponseGrade + failureRateGrade + endpointGrade) / 3
  );

  if (overallGrade >= 4) {
    return {
      status: "excellent",
      message: "All systems performing optimally",
      grade: "A+",
      details: `Average response: ${data.averageResponseTime || 0}ms, ${
        networkStats.failureRate
      }% failure rate`,
    };
  }

  if (overallGrade >= 3) {
    return {
      status: "good",
      message: "Performance within acceptable ranges",
      grade: "B+",
      details: `Some optimization opportunities identified`,
    };
  }

  if (overallGrade >= 2) {
    return {
      status: "warning",
      message: "Performance issues detected",
      grade: "C",
      details: `${
        data.slowestEndpoints.length
      } slow endpoints, ${networkStats.failureRate.toFixed(1)}% failure rate`,
    };
  }

  return {
    status: "critical",
    message: "Critical performance issues require attention",
    grade: "D",
    details: `High latency and failure rates affecting user experience`,
  };
};
