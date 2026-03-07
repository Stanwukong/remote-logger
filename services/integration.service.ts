import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import { ApiResponse } from "@/types/api";
import {
  IntegrationType,
  Integration,
  ConnectIntegrationPayload,
  IntegrationActionPayload,
} from "@/types/integration.types";

const BASE = "/integrations/manage";

export const integrationService = {
  // ============================================
  // QUERIES
  // ============================================

  /**
   * List all available integration types with setup info.
   */
  getAvailableIntegrations: async () => {
    try {
      const response = await apiClient.get<ApiResponse<IntegrationType[]>>(
        `${BASE}/available`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch available integrations",
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
   * List connected integrations for the current user.
   */
  getConnectedIntegrations: async (projectId?: string) => {
    try {
      const params = projectId ? `?projectId=${projectId}` : "";
      const response = await apiClient.get<ApiResponse<Integration[]>>(
        `${BASE}/connected${params}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch connected integrations",
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
   * Get a single integration by ID.
   */
  getIntegrationById: async (id: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Integration>>(
        `${BASE}/${id}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch integration",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get integration type metadata by slug.
   */
  getIntegrationType: async (type: string) => {
    try {
      const response = await apiClient.get<ApiResponse<IntegrationType>>(
        `${BASE}/type/${type}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch integration type",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  // ============================================
  // MUTATIONS
  // ============================================

  /**
   * Connect a new integration.
   */
  connectIntegration: async (
    type: string,
    data: ConnectIntegrationPayload
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<Integration>>(
        `${BASE}/${type}/connect`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to connect integration",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Test an existing integration connection.
   */
  testIntegration: async (id: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ success: boolean }>
      >(`${BASE}/${id}/test`);
      return {
        success: response.data.status === "success",
        message: response.data.message || "",
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Disconnect (remove) an integration.
   */
  disconnectIntegration: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${BASE}/${id}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to disconnect integration",
          response.status,
          response.data.errors
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Execute an action on a connected integration.
   */
  executeAction: async (
    id: string,
    data: IntegrationActionPayload
  ) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `${BASE}/${id}/action`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to execute integration action",
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
