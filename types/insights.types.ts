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

// ============================================
// AI Insights Types
// ============================================

export interface RootCauseAnalysis {
  analysis: string;
  source: "ai" | "heuristic";
  confidence: "high" | "medium" | "low";
}

export interface AskQuestionResponse {
  answer: string;
  source: "ai" | "heuristic";
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  priority: string;
  source: "ai" | "heuristic";
}

export interface EnrichedInsights {
  insights: ProjectInsights;
  aiSummary: string | null;
  anomalyCount: number;
  source: "ai" | "heuristic";
}
