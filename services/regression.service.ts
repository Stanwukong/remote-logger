import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// REGRESSION SERVICE
// ============================================

export interface ComparePerformanceRequest {
  baselineStart: string;
  baselineEnd: string;
  comparisonStart: string;
  comparisonEnd: string;
}

export const regressionService = {
  /**
   * Detect performance regressions for a project
   * GET /api/v1/regressions/:projectId/detect
   * @param projectId - The project ID
   * @param timeRange - Time range filter (e.g., "24h", "7d", "30d")
   * @param metric - Specific metric to check for regressions
   */
  detectRegressions: async (
    projectId: string,
    timeRange?: string,
    metric?: string
  ) => {
    try {
      const params: Record<string, string> = {};
      if (timeRange) {
        params.timeRange = timeRange;
      }
      if (metric) {
        params.metric = metric;
      }

      const response = await apiClient.get<ApiResponse>(
        `/regressions/${projectId}/detect`,
        { params }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to detect regressions",
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
   * Get performance baseline for a project
   * GET /api/v1/regressions/:projectId/baseline
   * @param projectId - The project ID
   * @param timeRange - Time range for baseline calculation
   */
  getBaseline: async (projectId: string, timeRange?: string) => {
    try {
      const params: Record<string, string> = {};
      if (timeRange) {
        params.timeRange = timeRange;
      }

      const response = await apiClient.get<ApiResponse>(
        `/regressions/${projectId}/baseline`,
        { params }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch performance baseline",
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
   * Compare performance between two time periods
   * POST /api/v1/regressions/:projectId/compare
   * @param projectId - The project ID
   * @param data - Baseline and comparison period start/end dates
   */
  comparePerformance: async (
    projectId: string,
    data: ComparePerformanceRequest
  ) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/regressions/${projectId}/compare`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to compare performance",
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

// Export individual functions for convenience
export const detectRegressions = regressionService.detectRegressions;
export const getBaseline = regressionService.getBaseline;
export const comparePerformance = regressionService.comparePerformance;
