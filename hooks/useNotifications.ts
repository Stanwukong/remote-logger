import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notification.service";
import { NotificationFilters } from "@/types/notification.types";
import { toast } from "sonner";

// ============================================
// NOTIFICATION HOOKS
// ============================================

/**
 * Hook to fetch user notifications
 */
export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => getNotifications(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadCount = () => {
  const { data } = useNotifications({ read: false, limit: 1 });
  return data?.unreadCount || 0;
};
