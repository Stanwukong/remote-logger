import { SignUpType } from "@/lib/schemas/auth";
import axios, { AxiosError } from "axios";
import { apiClient } from "./config";
import { ApiResponse } from "@/types/api";
import { ApiError, handleApiError } from "./auth.service";
import {
  LogEntry,
  LogFilters,
  LogSummary,
  LogTrends,
  UniqueError,
} from "@/types/analytics";
import { queryClient } from "@/lib/query/client";
import { useMutation } from "@tanstack/react-query";

export const logService = {
  // Create a new log entry (typically from SDK)
  createLog: async (
    projectId: string,
    logData: Omit<LogEntry, "id" | "projectId">
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<LogEntry>>(
        `/${projectId}/logs`,
        logData
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create log",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get all logs for a project with filters
  getAllLogs: async (projectId: string, filters: LogFilters = {}) => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await apiClient.get<ApiResponse>(
        `/${projectId}/logs?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch logs",
          response.status,
          response.data.errors
        );
      }

      return {
        logs: response.data.data || [],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get a specific log by ID
  getLogById: async (projectId: string, logId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<LogEntry>>(
        `/${projectId}/logs/${logId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch log",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get log summary for a project
  getLogsSummary: async (projectId: string, timeRange?: string) => {
    try {
      const params = timeRange ? `?timeRange=${timeRange}` : "";
      const response = await apiClient.get<ApiResponse<LogSummary>>(
        `/${projectId}/logs/summary${params}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch log summary",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get log trends (volume over time)
  getLogTrends: async (
    projectId: string,
    timeRange: string = "24h",
    interval: string = "1h"
  ) => {
    try {
      const response = await apiClient.get<ApiResponse<LogTrends>>(
        `/${projectId}/logs/trends?timeRange=${timeRange}&interval=${interval}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch log trends",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get distinct values for a specific field
  getDistinctValues: async (projectId: string, field: string) => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `/${projectId}/logs/distinct-values/${field}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || `Failed to fetch distinct ${field} values`,
          response.status,
          response.data.errors
        );
      }

      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get unique error messages
  getUniqueErrors: async (projectId: string, timeRange?: string) => {
    try {
      const params = timeRange ? `?timeRange=${timeRange}` : "";
      const response = await apiClient.get<ApiResponse<UniqueError[]>>(
        `/${projectId}/logs/unique-errors${params}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch unique errors",
          response.status,
          response.data.errors
        );
      }

      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete logs based on filters
  deleteLogs: async (projectId: string, filters: LogFilters) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/${projectId}/logs`,
        { data: filters }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete logs",
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



export const getAllLogs = logService.getAllLogs;
export const getLogById = logService.getLogById;
export const createLog = logService.createLog;
export const getLogSummary = logService.getLogsSummary;
export const getLogTrends = logService.getLogTrends;
export const getDistinctValues = logService.getDistinctValues;
export const getUniqueErrors = logService.getUniqueErrors;
export const deleteLogs = logService.deleteLogs;
