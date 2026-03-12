import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  DashboardFiltersWithUser,
  PerformanceData,
  PerformanceMetricData,
} from "@/types/dashboard";

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  /**
   * Health check endpoint for monitoring.
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get<
        ApiResponse<{ status: string; timestamp: string }>
      >("/dashboard/health");
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Health check failed",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get dashboard overview with summary of all key metrics.
   * Passes includeComparison=true by default for period-over-period data + sparklines.
   */
  getOverview: async (params?: {
    startDate?: string;
    endDate?: string;
    includeComparison?: boolean;
    environment?: string;
    specificProjectIds?: string[];
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      searchParams.append(
        "includeComparison",
        params?.includeComparison !== false ? "true" : "false"
      );
      if (params?.environment)
        searchParams.append("environment", params.environment);
      if (params?.specificProjectIds) {
        params.specificProjectIds.forEach((id) =>
          searchParams.append("specificProjectIds", id)
        );
      }

      const response = await apiClient.get<ApiResponse>(
        `/dashboard/overview?${searchParams.toString()}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch dashboard overview",
          response.status,
          response.data.errors
        );
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get comprehensive dashboard metrics with optional filters.
   * @param filters - Optional filters for metrics data.
   */
  getMetrics: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse>(
        `/dashboard/metrics?${params.toString()}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch dashboard metrics",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get real-time metrics for live dashboard updates.
   */
  getRealTimeMetrics: async () => {
    try {
      const response = await apiClient.get<ApiResponse>("/dashboard/realtime");
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch real-time metrics",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get user analytics data.
   */
  getUserAnalytics: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        "/dashboard/analytics/users"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch user analytics",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get time series data for dashboard charts.
   * @param period - Optional time period for the data.
   * @param granularity - Optional granularity for the data points.
   */
  getTimeSeriesData: async (period?: string, granularity?: string) => {
    try {
      const params = new URLSearchParams();
      if (period) params.append("period", period);
      if (granularity) params.append("granularity", granularity);

      const response = await apiClient.get<ApiResponse>(
        `/dashboard/timeseries?${params.toString()}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch time series data",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get error analysis and error tracking data.
   */
  getErrorAnalysis: async () => {
    try {
      const response = await apiClient.get<ApiResponse>("/dashboard/errors");
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch error analysis",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get performance metrics for the dashboard.
   */
  getPerformanceMetrics: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        "/dashboard/performance"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch performance metrics",
          response.status,
          response.data.errors
        );
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get alerts and notifications for the dashboard.
   */
  getAlerts: async () => {
    try {
      const response = await apiClient.get<ApiResponse>("/dashboard/alerts");
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alerts",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get user's project list with basic health information.
   */
  getUserProjects: async () => {
    try {
      const response = await apiClient.get<ApiResponse>("/dashboard/projects");
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch user projects",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get project health overview for all user projects.
   */
  getProjectHealth: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        "/dashboard/projects/health"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project health",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Export dashboard data based on specified options.
   * @param exportOptions - Configuration for what data to export and in what format.
   */
  exportData: async (exportOptions) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/dashboard/export",
        exportOptions
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to export data",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get dashboard metrics for multiple users (admin function).
   * @param payload - Configuration for multi-user metrics request.
   */
  getMultiUserMetrics: async (payload) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/dashboard/admin/multi-user-metrics",
        payload
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch multi-user metrics",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
