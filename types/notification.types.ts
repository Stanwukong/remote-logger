// Notification Types

export interface Notification {
  _id: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  read: boolean;
  metadata?: any;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: "info" | "warning" | "error" | "success";
  read?: boolean;
}
