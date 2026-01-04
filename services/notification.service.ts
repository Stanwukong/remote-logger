import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  Notification,
  NotificationResponse,
  NotificationFilters,
} from "@/types/notification.types";

// ============================================
// NOTIFICATION SERVICE
// ============================================

export const notificationService = {
  /**
   * Get user notifications with pagination
   * @param filters - Optional filters (page, limit, type, read status)
   */
  getNotifications: async (filters: NotificationFilters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.type) params.append("type", filters.type);
      if (filters.read !== undefined) {
        params.append("read", filters.read.toString());
      }

      const response = await apiClient.get<ApiResponse<NotificationResponse>>(
        `/notifications?${params.toString()}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch notifications",
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
   * Mark a notification as read
   * @param notificationId - The notification ID
   */
  markAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.patch<ApiResponse<Notification>>(
        `/notifications/${notificationId}/read`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to mark notification as read",
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
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch<ApiResponse>(
        "/notifications/read-all"
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to mark all notifications as read",
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
export const getNotifications = notificationService.getNotifications;
export const markNotificationAsRead = notificationService.markAsRead;
export const markAllNotificationsAsRead = notificationService.markAllAsRead;
