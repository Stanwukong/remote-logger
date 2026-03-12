import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// AI SUGGESTION SERVICE
// ============================================

export interface AcceptSuggestionData {
  suggestionId: string;
  ruleConfig: Record<string, any>;
}

export const aiSuggestionService = {
  /**
   * Get AI-generated alert rule suggestions for a project
   * GET /api/v1/ai-suggestions/:projectId/suggestions
   * @param projectId - The project ID
   */
  getSuggestions: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/ai-suggestions/${projectId}/suggestions`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch AI suggestions",
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
   * Accept an AI suggestion and create an alert rule from it
   * POST /api/v1/ai-suggestions/:projectId/suggestions/accept
   * @param projectId - The project ID
   * @param data - Suggestion ID and rule configuration to apply
   */
  acceptSuggestion: async (projectId: string, data: AcceptSuggestionData) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/ai-suggestions/${projectId}/suggestions/accept`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to accept suggestion",
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
export const getSuggestions = aiSuggestionService.getSuggestions;
export const acceptSuggestion = aiSuggestionService.acceptSuggestion;
