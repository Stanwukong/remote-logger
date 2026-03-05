import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// USER PREFERENCE SERVICE
// ============================================

export const userPreferenceService = {
  /**
   * Get the current user's favorite projects.
   */
  getFavorites: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        "/preferences/favorites"
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch favorites",
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
   * Add a project to the user's favorites.
   * @param projectId - The ID of the project to favorite.
   */
  addFavorite: async (projectId: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/preferences/favorites",
        { projectId }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to add favorite",
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
   * Remove a project from the user's favorites.
   * @param projectId - The ID of the project to unfavorite.
   */
  removeFavorite: async (projectId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        "/preferences/favorites",
        { data: { projectId } }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to remove favorite",
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
   * Check if a specific project is favorited by the current user.
   * @param projectId - The ID of the project to check.
   */
  checkFavorite: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/preferences/favorites/${projectId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to check favorite status",
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
