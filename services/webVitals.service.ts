import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// WEB VITALS SERVICE
// ============================================

export interface WebVitalMetric {
  name: string;
  count: number;
  p50: number;
  p75: number;
  p95: number;
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
}

export interface WebVitalHistoryPoint {
  bucket: string;
  vital: string;
  avgValue: number;
  count: number;
}

export interface WebVitalPageData {
  url: string;
  vitals: Array<{
    name: string;
    avgValue: number;
    count: number;
  }>;
  totalSamples: number;
}

export const webVitalsService = {
  /**
   * Get aggregated web vitals metrics (p50, p75, p95, rating distribution).
   */
  getWebVitals: async (
    projectId: string,
    timeRange?: string,
    page?: string
  ) => {
    try {
      const params = new URLSearchParams();
      if (timeRange) params.append("timeRange", timeRange);
      if (page) params.append("page", page);
      const response = await apiClient.get(
        `/${projectId}/web-vitals?${params}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch web vitals",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get time-bucketed web vitals history for charting.
   */
  getHistory: async (
    projectId: string,
    timeRange?: string,
    interval?: string
  ) => {
    try {
      const params = new URLSearchParams();
      if (timeRange) params.append("timeRange", timeRange);
      if (interval) params.append("interval", interval);
      const response = await apiClient.get(
        `/${projectId}/web-vitals/history?${params}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch web vitals history",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Get web vitals aggregated per page URL.
   */
  getByPage: async (projectId: string, timeRange?: string) => {
    try {
      const params = new URLSearchParams();
      if (timeRange) params.append("timeRange", timeRange);
      const response = await apiClient.get(
        `/${projectId}/web-vitals/pages?${params}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch web vitals by page",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
