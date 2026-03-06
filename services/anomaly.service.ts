import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import { Anomaly, AnomalyFilters, AnomalyStats } from "@/types/anomaly.types";

// ============================================
// ANOMALY SERVICE
// ============================================

export const anomalyService = {
  /**
   * Get anomalies for a project
   */
  getAnomalies: async (projectId: string, filters: AnomalyFilters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.acknowledged !== undefined)
        params.append("acknowledged", String(filters.acknowledged));
      if (filters.resolved !== undefined)
        params.append("resolved", String(filters.resolved));
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.limit) params.append("limit", String(filters.limit));
      if (filters.offset) params.append("offset", String(filters.offset));

      const response = await apiClient.get<ApiResponse<Anomaly[]>>(
        `/anomalies/${projectId}?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch anomalies",
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
   * Get anomaly stats for a project
   */
  getAnomalyStats: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<AnomalyStats>>(
        `/anomalies/${projectId}/stats`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch anomaly stats",
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
   * Acknowledge an anomaly
   */
  acknowledgeAnomaly: async (anomalyId: string) => {
    try {
      const response = await apiClient.patch<ApiResponse<Anomaly>>(
        `/anomalies/${anomalyId}/acknowledge`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to acknowledge anomaly",
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
   * Resolve an anomaly
   */
  resolveAnomaly: async (anomalyId: string) => {
    try {
      const response = await apiClient.patch<ApiResponse<Anomaly>>(
        `/anomalies/${anomalyId}/resolve`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to resolve anomaly",
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
   * Trigger a manual anomaly scan for a project
   */
  triggerScan: async (projectId: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ detected: number }>
      >(`/anomalies/${projectId}/scan`);

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to trigger scan",
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
