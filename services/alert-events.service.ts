import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  AlertEvent,
  AlertEventFilters,
  AcknowledgeAlertData,
} from "@/types/alert.types";

// ============================================
// ALERT EVENTS SERVICE
// ============================================

export const alertEventsService = {
  /**
   * Get alert events for a project with optional filters
   * @param projectId - The project ID
   * @param filters - Optional filters for alert events
   */
  getAlertEvents: async (
    projectId: string,
    filters: AlertEventFilters = {}
  ) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<AlertEvent[]>>(
        `/events/${projectId}/alerts?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert events",
          response.status,
          response.data.errors
        );
      }

      return {
        events: response.data.data || [],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Acknowledge an alert event
   * @param alertId - The alert event ID
   * @param data - Acknowledgment data (optional notes and user)
   */
  acknowledgeAlert: async (
    alertId: string,
    data: AcknowledgeAlertData = {}
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<AlertEvent>>(
        `/events/alerts/${alertId}/acknowledge`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to acknowledge alert",
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
export const getAlertEvents = alertEventsService.getAlertEvents;
export const acknowledgeAlert = alertEventsService.acknowledgeAlert;
