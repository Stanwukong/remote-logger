import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  AlertRule,
  CreateAlertRuleData,
  UpdateAlertRuleData,
} from "@/types/alert.types";

// ============================================
// ALERT RULES SERVICE
// ============================================

export const alertService = {
  /**
   * Create a new alert rule for a project
   * @param projectId - The project ID
   * @param ruleData - Alert rule configuration
   */
  createAlertRule: async (projectId: string, ruleData: CreateAlertRuleData) => {
    try {
      // Get the project's API key for authentication
      const response = await apiClient.post<ApiResponse<AlertRule>>(
        "/alerts",
        { ...ruleData, projectId },
        {
          headers: {
            "x-api-key": ruleData.projectId, // Note: In production, get actual API key
          },
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create alert rule",
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
   * Get all alert rules for a project
   * @param projectId - The project ID
   * @param apiKey - The project's API key
   */
  getAlertRules: async (projectId: string, apiKey: string) => {
    try {
      const response = await apiClient.get<ApiResponse<AlertRule[]>>(
        "/alerts",
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert rules",
          response.status,
          response.data.errors
        );
      }

      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get a specific alert rule by ID
   * @param ruleId - The alert rule ID
   * @param apiKey - The project's API key
   */
  getAlertRuleById: async (ruleId: string, apiKey: string) => {
    try {
      const response = await apiClient.get<ApiResponse<AlertRule>>(
        `/alerts/${ruleId}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert rule",
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
   * Update an existing alert rule
   * @param ruleId - The alert rule ID
   * @param updates - Updated alert rule data
   * @param apiKey - The project's API key
   */
  updateAlertRule: async (
    ruleId: string,
    updates: UpdateAlertRuleData,
    apiKey: string
  ) => {
    try {
      const response = await apiClient.put<ApiResponse<AlertRule>>(
        `/alerts/${ruleId}`,
        updates,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update alert rule",
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
   * Delete an alert rule
   * @param ruleId - The alert rule ID
   * @param apiKey - The project's API key
   */
  deleteAlertRule: async (ruleId: string, apiKey: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/alerts/${ruleId}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete alert rule",
          response.status,
          response.data.errors
        );
      }

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Export individual functions for convenience
export const createAlertRule = alertService.createAlertRule;
export const getAlertRules = alertService.getAlertRules;
export const getAlertRuleById = alertService.getAlertRuleById;
export const updateAlertRule = alertService.updateAlertRule;
export const deleteAlertRule = alertService.deleteAlertRule;
