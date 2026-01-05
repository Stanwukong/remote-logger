import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  ActivityFeedResponse,
  ActivityFiltersValues,
  ActivityStats,
  Alert,
  ErrorDetails,
  ErrorDistributionItem,
  ErrorStats,
  ErrorTimelinePoint,
  ErrorTrend,
  Granularity,
  OverviewStats,
  PagePerformance,
  PerformanceScore,
  PerformanceTimelinePoint,
  ResourcePerformance,
  SessionsResponse,
  SessionStats,
  SlowestEndpoint,
  TimeRange,
  TopError,
  UserJourney,
  WebVitalsSummary,
  Session,
  SessionEvent,
} from "@/types/analytics.types";

const BASE_URL = "/analytics";

export const analyticsService = {
  // --- Error Analytics ---
  getErrorTimeline: async (
    projectId: string,
    timeRange: TimeRange = "24h",
    granularity: Granularity = "hour"
  ) => {
    try {
      const response = await apiClient.get<ErrorTimelinePoint[]>(
        `${BASE_URL}/${projectId}/errors/timeline`,
        {
          params: { timeRange, granularity },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getTopErrors: async (
    projectId: string,
    limit: number = 10,
    timeRange: TimeRange = "24h"
  ) => {
    try {
      const response = await apiClient.get<TopError[]>(
        `${BASE_URL}/${projectId}/errors/top`,
        {
          params: { limit, timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getErrorDistribution: async (
    projectId: string,
    timeRange: TimeRange = "24h"
  ) => {
    try {
      const response = await apiClient.get<ErrorDistributionItem[]>(
        `${BASE_URL}/${projectId}/errors/distribution`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getErrorStats: async (projectId: string, timeRange: TimeRange = "24h") => {
    try {
      const response = await apiClient.get<ErrorStats>(
        `${BASE_URL}/${projectId}/errors/stats`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getErrorDetails: async (projectId: string, errorId: string) => {
    try {
      const response = await apiClient.get<ErrorDetails>(
        `${BASE_URL}/${projectId}/errors/${errorId}/details`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getErrorTrends: async (
    projectId: string,
    timeRange: TimeRange = "7d",
    groupBy: Granularity = "day"
  ) => {
    try {
      const response = await apiClient.get<ErrorTrend[]>(
        `${BASE_URL}/${projectId}/errors/trends`,
        {
          params: { timeRange, groupBy },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // --- Performance Analytics ---
  getPerformanceTimeline: async (
    projectId: string,
    timeRange: TimeRange = "24h",
    metric: string = "all"
  ) => {
    try {
      const response = await apiClient.get<PerformanceTimelinePoint[]>(
        `${BASE_URL}/${projectId}/performance/timeline`,
        {
          params: { timeRange, metric },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getWebVitals: async (projectId: string, timeRange: TimeRange = "24h") => {
    try {
      const response = await apiClient.get<WebVitalsSummary>(
        `${BASE_URL}/${projectId}/performance/web-vitals`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getResourcePerformance: async (
    projectId: string,
    timeRange: TimeRange = "24h",
    limit: number = 10
  ) => {
    try {
      const response = await apiClient.get<ResourcePerformance[]>(
        `${BASE_URL}/${projectId}/performance/resources`,
        {
          params: { timeRange, limit },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getPagePerformance: async (
    projectId: string,
    timeRange: TimeRange = "24h",
    limit: number = 10
  ) => {
    try {
      const response = await apiClient.get<PagePerformance[]>(
        `${BASE_URL}/${projectId}/performance/pages`,
        {
          params: { timeRange, limit },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getPerformanceScore: async (
    projectId: string,
    timeRange: TimeRange = "24h"
  ) => {
    try {
      const response = await apiClient.get<PerformanceScore>(
        `${BASE_URL}/${projectId}/performance/score`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSlowestEndpoints: async (
    projectId: string,
    timeRange: TimeRange = "24h",
    limit: number = 10
  ) => {
    try {
      const response = await apiClient.get<SlowestEndpoint[]>(
        `${BASE_URL}/${projectId}/performance/slowest`,
        {
          params: { timeRange, limit },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // --- Real-Time Activity Feed ---
  getActivityFeed: async (
    projectId: string,
    params: {
      page?: number;
      limit?: number;
      level?: string[];
      eventType?: string[];
      service?: string[];
      environment?: string[];
      search?: string;
    }
  ) => {
    try {
      const response = await apiClient.get<ActivityFeedResponse>(
        `${BASE_URL}/${projectId}/activity/feed`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getActivityStats: async (projectId: string, timeRange: TimeRange = "1h") => {
    try {
      const response = await apiClient.get<ActivityStats>(
        `${BASE_URL}/${projectId}/activity/stats`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getActivityFilterValues: async (projectId: string) => {
    try {
      const response = await apiClient.get<ActivityFiltersValues>(
        `${BASE_URL}/${projectId}/activity/filters/values`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // --- Session Analytics ---
  getSessions: async (
    projectId: string,
    params: {
      page?: number;
      limit?: number;
      timeRange?: TimeRange;
    }
  ) => {
    try {
      const response = await apiClient.get<SessionsResponse>(
        `${BASE_URL}/${projectId}/sessions`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSessionDetails: async (projectId: string, sessionId: string) => {
    try {
      const response = await apiClient.get<Session>(
        `${BASE_URL}/${projectId}/sessions/${sessionId}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSessionTimeline: async (projectId: string, sessionId: string) => {
    try {
      const response = await apiClient.get<SessionEvent[]>(
        `${BASE_URL}/${projectId}/sessions/${sessionId}/timeline`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSessionStats: async (projectId: string, timeRange: TimeRange = "24h") => {
    try {
      const response = await apiClient.get<SessionStats>(
        `${BASE_URL}/${projectId}/sessions/stats`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getCommonJourneys: async (
    projectId: string,
    timeRange: TimeRange = "7d",
    limit: number = 10
  ) => {
    try {
      const response = await apiClient.get<UserJourney[]>(
        `${BASE_URL}/${projectId}/sessions/journeys`,
        {
          params: { timeRange, limit },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // --- Cross-Dashboard ---
  getOverview: async (projectId: string, timeRange: TimeRange = "24h") => {
    try {
      const response = await apiClient.get<OverviewStats>(
        `${BASE_URL}/${projectId}/overview`,
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  exportData: async (projectId: string, payload: any) => {
    try {
      // Axios handles download with 'blob' response type if needed, but the API response type is not specified as a file stream in the example response.
      // Assuming JSON/CSV textual response for now, or we might need `responseType: 'blob'`
      const response = await apiClient.post(
        `${BASE_URL}/${projectId}/export`,
        payload
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getAlerts: async (
    projectId: string,
    params: { severity?: string; status?: string } = {}
  ) => {
    try {
      const response = await apiClient.get<Alert[]>(
        `${BASE_URL}/${projectId}/alerts`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
