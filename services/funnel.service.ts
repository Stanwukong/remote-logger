import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// FUNNEL SERVICE
// ============================================

export interface FunnelStep {
  eventType: string;
  filters?: Record<string, any>;
}

export interface FunnelAnalysisRequest {
  steps: FunnelStep[];
  timeRange?: string;
}

export const funnelService = {
  /**
   * Analyze funnel conversion for a project
   * POST /api/v1/funnels/:projectId/analyze
   * @param projectId - The project ID
   * @param data - Funnel steps and optional time range
   */
  analyzeFunnel: async (projectId: string, data: FunnelAnalysisRequest) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/funnels/${projectId}/analyze`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to analyze funnel",
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
   * Get popular user paths for a project
   * GET /api/v1/funnels/:projectId/popular-paths
   * @param projectId - The project ID
   * @param limit - Maximum number of paths to return
   * @param timeRange - Time range filter (e.g., "24h", "7d", "30d")
   */
  getPopularPaths: async (
    projectId: string,
    limit?: number,
    timeRange?: string
  ) => {
    try {
      const params: Record<string, string> = {};
      if (limit !== undefined) {
        params.limit = limit.toString();
      }
      if (timeRange) {
        params.timeRange = timeRange;
      }

      const response = await apiClient.get<ApiResponse>(
        `/funnels/${projectId}/popular-paths`,
        { params }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch popular paths",
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
export const analyzeFunnel = funnelService.analyzeFunnel;
export const getPopularPaths = funnelService.getPopularPaths;
