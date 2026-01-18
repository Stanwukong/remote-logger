// Insights and Recommendations Types

export interface ProjectInsights {
  projectId: string;
  timeRange: number;
  summary: {
    totalLogs: number;
    errorRate: number;
    warningRate: number;
    averageLogsPerHour: number;
  };
  trends: {
    logVolume: "increasing" | "decreasing" | "stable";
    errorRate: "increasing" | "decreasing" | "stable";
  };
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  topIssues: TopIssue[];
}

export interface Anomaly {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  detectedAt: string;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
}

export interface TopIssue {
  issue: string;
  count: number;
  impact: "low" | "medium" | "high";
}

export interface InsightsFilters {
  timeRange?: number;
  includeRecommendations?: boolean;
}
