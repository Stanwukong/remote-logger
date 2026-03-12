import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

export interface TraceSummary {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  spanCount: number;
  rootSpanName: string;
  hasErrors: number;
  services: string[];
}

export interface SpanData {
  spanId: string;
  traceId: string;
  parentSpanId: string | null;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  level: string;
  service: string;
  logCount: number;
  hasErrors: number;
}

export const traceService = {
  getTraces: async (projectId: string, params?: Record<string, string>) => {
    try {
      const searchParams = new URLSearchParams(params);
      const response = await apiClient.get(
        `/${projectId}/traces?${searchParams.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch traces",
          response.status,
          response.data.errors
        );
      }

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getTraceDetail: async (projectId: string, traceId: string) => {
    try {
      const response = await apiClient.get(
        `/${projectId}/traces/${traceId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch trace detail",
          response.status,
          response.data.errors
        );
      }

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getTraceSpans: async (projectId: string, traceId: string) => {
    try {
      const response = await apiClient.get(
        `/${projectId}/traces/${traceId}/spans`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch trace spans",
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
