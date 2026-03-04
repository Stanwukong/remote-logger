// project.types.ts
// ============================================
// PROJECTS TYPES
// ============================================

// A tag associated with a project.
export type ProjectTag = {
  id: string;
  name: string;
  createdAt: string;
};

// A team member associated with a project.
export type TeamMember = {
  id: string;
  userId: string;
  role: "owner" | "member";
  email: string;
};

// Integration settings for a project.
export type IntegrationSettings = {
  id: string;
  name: string;
  isEnabled: boolean;
  config: Record<string, any>;
};

// The main project data structure.
export type Project = {
  project: {
    _id: string;
    name: string;
    description?: string;
    apiKey: string;
    ownerId: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    teamMembers: Array<{
      user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      role: string;
      _id: string;
    }>;
    isActive: boolean;
    logCount: number;
    alertRuleCount: number;
    rateLimitConfig: {
      maxRequestsPerMinute: number;
      burstLimit: number;
    };
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  analytics: {
    overview: {
      totalLogs: number;
      errorLogs: number;
      recentLogs: number;
      errorRate: number;
      timeRange: string;
      lastUpdated: string;
    };
    responseTime: {
      current: {
        avgResponseTime: number;
        health: string;
      };
      history: Array<{
        timestamp: string;
        avgResponseTime: number;
      }>;
    };
    errors: {
      analysis: Array<{
        _id: {
          level: string;
          service: string;
          environment: string;
        };
        count: number;
        lastOccurrence: string;
      }>;
      topErrors: Array<{
        _id: string;
        count: number;
        lastSeen: string;
        services: string[];
        environments: string[];
      }>;
      health: string;
    };
    performance: {
      metrics: {
        totalRequests: number;
        successfulRequests: number;
        errorRequests: number;
        avgResponseTime: number | null;
      };
      health: string;
    };
    usage: {
      serviceBreakdown: Array<{
        _id: string;
        requestCount: number;
        errorCount: number;
        lastActivity: string;
      }>;
      environmentBreakdown: Array<{
        _id: string;
        requestCount: number;
        errorCount: number;
      }>;
      insights: string[];
    };
  };
  recommendations: {
    priority: string;
    categories: {
      performance: string[];
      reliability: string[];
      optimization: string[];
      monitoring: string[];
    };
    healthScore: number;
  };
};

// Data for creating a new project.
export type ProjectCreateData = {
  name: string;
  description?: string;
};

// Data for updating an existing project.
export type ProjectUpdateData = {
  name?: string;
  description?: string;
  isActive?: boolean;
  tags?: ProjectTag[];
  rateLimit?: {
    maxRequests: number;
    windowInMinutes: number;
  };
};

// Filters for fetching a list of projects.
export type ProjectFilters = {
  searchBy?: boolean;
  sortOrder?: any;
  includeInactive?: boolean;
};

export interface ProjectsSummary {
  totalProjects: number;
  activeProjects: number;
  inactiveProjects: number;
  totalLogsOverall: number; // Total logs across all projects (from LogModel)
  avgLogsPerProject: number; // Average logs per project
  maxLogsPerProject: number; // Max logs per project
  minLogsPerProject: number; // Min logs per project
  totalActiveErrorLogs: number; // NEW: Error logs from the last hour
  totalActiveProjects: number; // NEW: Projects with activity in last 24 hours
}

export interface ServicePerformance {
  service: string;
  responseTime: string;
  status: "good" | "excellent" | "poor" | "warning" | "critical"; // Added more statuses for completeness
}

export interface UsageStatistics {
  dailyLogVolume: string;
  storageUsed: string;
  apiRequests: string;
  activeIntegrations: number;
  quotaUsedPercentage: number;
}

export type ProjectsAnalytics = {
  data: {
    logVolumeChartData: ChartData;
    errorDistributionChartData: ChartData;
    logLevelsChartData: ChartData;
    responseTimeChartData: ChartData;
    topErrorSources: TopErrorSource[];
    servicePerformance: ServicePerformance[];
    usageStatistics: UsageStatistics;
  };
  meta?: {
    generatedAt?: string;
    responseTime: number;
    cacheHit: boolean;
    queryCount: number;
  };
};

export interface TopErrorSource {
  source: string;
  count: number;
  percentage: number;
}

// Usage statistics for a single project.
export type ProjectStats = {
  totalLogs: number;
  dailyLogCount: { date: string; count: number }[];
};

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

// Payload for bulk deletion.
export type BulkDeletePayload = {
  projectIds: string[];
};
