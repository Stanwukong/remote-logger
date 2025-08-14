import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import { BulkDeletePayload, Project, ProjectCreateData, ProjectFilters, ProjectsAnalytics, ProjectsSummary, ProjectStats, ProjectUpdateData } from "@/types/project.types";

// ============================================
// PROJECTS SERVICE
// ============================================

export const projectService = {
  /**
   * Get all projects for the current user with optional filters.
   * @param filters - An object containing filters like `isArchived` or `tag`.
   */
  getAllProjects: async (filters: ProjectFilters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });


      const response = await apiClient.get<ApiResponse<Project[]>>(
        `/projects?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch projects",
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
   * Get a specific project by its ID.
   * @param projectId - The ID of the project to fetch.
   */
  getProjectById: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(
        `/projects/${projectId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project",
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
   * Get a project by its API key.
   * @param apiKey - The API key for the project.
   */
  getProjectByApiKey: async (apiKey: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(
        `/projects/by-api-key`,
        { headers: { "x-api-key": apiKey } }
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project by API key",
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
   * Get summary statistics for all projects.
   */
  getProjectsSummary: async () => {
    try {
      const response = await apiClient.get<ApiResponse<ProjectsSummary>>(
        `/projects/summary`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project summary",
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
   * Get analytics data for all projects.
   */
  getProjectsAnalytics: async () => {
    try {
      const response = await apiClient.get<ApiResponse<ProjectsAnalytics>>(
        `/projects/analytics`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project analytics",
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
   * Get usage statistics for a single project.
   * @param projectId - The ID of the project.
   */
  getProjectStats: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<ProjectStats>>(
        `/projects/${projectId}/stats`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch project stats",
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
   * Create a new project.
   * @param projectData - The data for the new project.
   */
  createProject: async (projectData: ProjectCreateData) => {
    try {
      const response = await apiClient.post<ApiResponse<Project>>(
        "/projects",
        projectData
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create project",
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
   * Update an existing project.
   * @param projectId - The ID of the project to update.
   * @param projectData - The data to update.
   */
  updateProject: async (projectId: string, projectData: ProjectUpdateData) => {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `/projects/${projectId}`,
        projectData
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update project",
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
   * Archive a project.
   * @param projectId - The ID of the project to archive.
   */
  archiveProject: async (projectId: string) => {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `/projects/${projectId}/archive`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to archive project",
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
   * Restore an archived project.
   * @param projectId - The ID of the project to restore.
   */
  restoreProject: async (projectId: string) => {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `/projects/${projectId}/restore`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to restore project",
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
   * Delete a project.
   * @param projectId - The ID of the project to delete.
   * @param hardDelete - Optional flag to perform a hard delete.
   */
  deleteProject: async (projectId: string, hardDelete = false) => {
    try {
      const params = hardDelete ? "?hard=true" : "";
      const response = await apiClient.delete<ApiResponse>(
        `/projects/${projectId}${params}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete project",
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
   * Bulk delete projects.
   * @param projectIds - An array of project IDs to delete.
   */
  bulkDeleteProjects: async (projectIds: string[]) => {
    try {
      const payload: BulkDeletePayload = { projectIds };
      const response = await apiClient.delete<ApiResponse>("/projects", {
        data: payload,
      });
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to bulk delete projects",
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
   * Regenerate a project's API key.
   * @param projectId - The ID of the project.
   */
  regenerateApiKey: async (projectId: string) => {
    try {
      const response = await apiClient.post<ApiResponse<Project>>(
        `/projects/${projectId}/regenerate-api-key`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to regenerate API key",
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
   * Update a project's rate limit configuration.
   * @param projectId - The ID of the project.
   * @param rateLimit - The new rate limit configuration.
   */
  updateRateLimit: async (
    projectId: string,
    rateLimit: { maxRequests: number; windowInMinutes: number }
  ) => {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `/projects/${projectId}/rate-limit`,
        rateLimit
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update rate limit",
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
