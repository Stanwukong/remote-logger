import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import { ProjectInsights, InsightsFilters } from "@/types/insights.types";

// ============================================
// INSIGHTS SERVICE
// ============================================

export const insightsService = {
  /**
   * Get insights and recommendations for a project
   * @param projectId - The project ID
   * @param filters - Optional filters (timeRange, includeRecommendations)
   */
  getProjectInsights: async (
    projectId: string,
    filters: InsightsFilters = {}
  ) => {
    try {
      const params = new URLSearchParams();
      if (filters.timeRange) {
        params.append("timeRange", filters.timeRange.toString());
      }
      if (filters.includeRecommendations !== undefined) {
        params.append(
          "includeRecommendations",
          filters.includeRecommendations.toString()
        );
      }

      const response = await apiClient.get<ApiResponse<ProjectInsights>>(
        `/insights/${projectId}?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project insights",
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
   * Invalidate the insights cache for a project
   * @param projectId - The project ID
   */
  invalidateCache: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/insights/${projectId}/invalidate`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to invalidate cache",
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
export const getProjectInsights = insightsService.getProjectInsights;
export const invalidateInsightsCache = insightsService.invalidateCache;
