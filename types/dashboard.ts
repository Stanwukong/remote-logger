export interface DashboardFiltersWithUser {
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  environment?: string[];
  logLevels?: string[];
  eventTypes?: string[];
  services?: string[];
  specificProjectIds?: string[];
}

export interface DashboardOverview {
  health: {
    criticalProjects: number;
    healthyProjects: number;
    warningProjects: number;
  };
  realTime: {
    activeUsers: number;
    currentErrorRate: number;
    currentRPS: number;
  };
  summary: {
    averageResponseTime: number;
    errorRate: number;
    totalErrors: number;
    totalLogs: number;
    totalProjects: number;
  };
  topIssues: {
    mostFrequentError: string | null;
    recentCriticalErrors: any[];
    slowestEndpoint: string | null
  }
  trends: {
    errorRateChange: number;
    logVolumeChange: number
  }
}

export interface MetricData {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: "up" | "down" | "neutral";
  variant?: "destructive" | "warning" | "default" | "success";
  subtitle?: string;
  details?: string;

}


export interface PerformanceData {
  status: string;
  message: string;
  data: {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    slowestEndpoints: Array<{
      endpoint?: string;
      responseTime?: number;
    }>;
    pageLoadTimes: Array<{
      page?: string;
      loadTime?: number;
    }>;
    networkStats: {
      averageRequestTime: number;
      failureRate: number;
      slowRequests: number;
      totalRequests: number;
    };
  };
  filters: {
    userId: string;
    timeRange: {
      start: string;
      end: string;
    };
  };
  timestamp: string;
}

export interface PerformanceMetricData {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: "up" | "down" | "neutral";
  variant?: "default" | "destructive" | "warning" | "success";
  subtitle: string;
  details: string;
}