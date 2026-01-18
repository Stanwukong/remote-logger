import { ApiError, handleApiError } from "./auth.service";
import { apiClient } from "./config";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: string[];
  meta?: any;
}

export interface Alert {
  _id: string;
  projectId: string;
  ruleId: string;
  logId: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "acknowledged" | "resolved" | "snoozed";
  notifyChannels: string[];
  metadata: {
    log?: any;
    statusHistory?: Array<{
      status: string;
      userId?: string;
      timestamp: string;
    }>;
    deleted?: boolean;
    deletedAt?: string;
    autoResolved?: boolean;
    autoResolvedReason?: string;
  };
  triggeredAt: string;
  acknowledgedAt?: string;
  updatedAt: string;
  environment?: string;
  tags?: string[];
}

export interface AlertStats {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  snoozed: number;
  bySeverity: {
    info: number;
    warning: number;
    critical: number;
  };
  byTimeRange: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export interface AlertFilters {
  page?: number;
  limit?: number;
  severity?: "info" | "warning" | "critical";
  status?: "active" | "acknowledged" | "resolved" | "snoozed";
  ruleId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
}

export interface AlertRule {
  _id: string;
  name: string;
  projectId: string;
  condition: {
    level?: string;
    keyword?: string;
    frequency?: number;
    intervalMinutes?: number;
  };
  isActive: boolean;
  notifyChannels: string[];
  notificationConfig: {
    emails?: string[];
    slackWebhookUrl?: string;
    webhookUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRuleData {
  name: string;
  projectId: string;
  condition: {
    level: string;
    keyword?: string;
    frequency?: number;
    intervalMinutes?: number;
  };
  isActive?: boolean;
  notifyChannels?: string[];
  notificationConfig?: {
    emails?: string[];
    slackWebhookUrl?: string;
    webhookUrl?: string;
  };
}

export interface UpdateAlertRuleData extends Partial<CreateAlertRuleData> {
  projectId?: string;
}

export const alertService = {
  /**
   * Get alerts with filtering, sorting, and pagination
   * GET /api/alerts/:projectId or GET /api/alerts (user-scoped)
   */
  getAlerts: async (projectId?: string, filters?: AlertFilters)=> {
    try {
      const endpoint = projectId ? `/alerts/${projectId}` : `/alerts`;
      const response = await apiClient.get<ApiResponse<Alert[]>>(
        endpoint,
        {
          params: filters
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alerts",
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
   * Get alert statistics for dashboard
   * GET /api/alerts/:projectId/stats or GET /api/alerts/stats (user-scoped)
   */
  getAlertStats: async (projectId?: string) => {
    try {
      const endpoint = projectId ? `/alerts/${projectId}/stats` : `/alerts/stats`;
      const response = await apiClient.get<ApiResponse<AlertStats>>(
        endpoint
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert statistics",
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
   * Update alert status (acknowledge, resolve, snooze)
   * PATCH /api/alerts/:alertId/status
   */
  updateAlertStatus: async (
    alertId: string, 
    status: "acknowledged" | "resolved" | "snoozed"
  )=> {
    try {
      const response = await apiClient.patch<ApiResponse<Alert>>(
        `/alerts/${alertId}/status`,
        { status }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update alert status",
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
   * Bulk update multiple alerts
   * PATCH /api/alerts/bulk-update
   */
  bulkUpdateAlerts: async (
    alertIds: string[], 
    status: "acknowledged" | "resolved" | "snoozed"
  )=> {
    try {
      const response = await apiClient.patch<ApiResponse<{ modifiedCount: number; matchedCount: number }>>(
        `/alerts/bulk-update`,
        { alertIds, status }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to bulk update alerts",
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
   * Delete alerts (with optional soft delete)
   * DELETE /api/alerts
   */
  deleteAlerts: async (
    alertIds: string[], 
    softDelete: boolean = true
  ) => {
    try {
      const response = await apiClient.delete<ApiResponse<{ deletedCount: number; softDelete: boolean }>>(
        `/alerts`,
        {
          params: { soft: softDelete.toString() },
          data: { alertIds }
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete alerts",
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
   * Get distinct values for filtering
   * GET /api/alerts/:projectId/distinct/:field
   */
  getDistinctValues: async (
    projectId: string, 
    field: "severity" | "status" | "tags" | "ruleId"
  ) => {
    try {
      const response = await apiClient.get<ApiResponse<{ field: string; values: string[] }>>(
        `/alerts/${projectId}/distinct/${field}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get distinct values",
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
   * Auto-resolve old alerts
   * POST /api/alerts/auto-resolve
   */
  autoResolveOldAlerts: async (
    olderThanDays: number = 30
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<{ modifiedCount: number; matchedCount: number; olderThanDays: number }>>(
        `/alerts/auto-resolve`,
        { olderThanDays }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to auto-resolve old alerts",
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
   * Acknowledge single alert (legacy)
   * POST /api/alerts/:alertId/acknowledge
   */
  acknowledgeSingleAlert: async (alertId: string) => {
    try {
      const response = await apiClient.post<ApiResponse<Alert>>(
        `/alerts/${alertId}/acknowledge`,
        {}
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to acknowledge alert",
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
   * Bulk acknowledge alerts (legacy)
   * POST /api/alerts/acknowledge
   */
  acknowledgeMultipleAlerts: async (
    alertIds: string[]
  ) => {
    try {
      const response = await apiClient.post<ApiResponse<{ modifiedCount: number; matchedCount: number }>>(
        `/alerts/acknowledge`,
        { alertIds }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to acknowledge alerts",
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

export const alertRuleService = {
  /**
   * Create alert rule
   * POST /api/alert-rules
   */
  createRule: async (data: CreateAlertRuleData) => {
    try {
      const response = await apiClient.post<ApiResponse<AlertRule>>(
        `/alert-rules`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create alert rule",
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
   * Get rules by project
   * GET /api/alert-rules
   */
  getRulesByProject: async (projectId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<AlertRule[]>>(
        `/alert-rules`,
        {
          headers: {
            'X-Project-ID': projectId
          }
        }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert rules",
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
   * Get rule by ID
   * GET /api/alert-rules/:id
   */
  getRuleById: async (ruleId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<AlertRule>>(
        `/alert-rules/${ruleId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch alert rule",
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
   * Update alert rule
   * PUT /api/alert-rules/:id
   */
  updateRule: async (ruleId: string, data: UpdateAlertRuleData) => {
    try {
      const response = await apiClient.put<ApiResponse<AlertRule>>(
        `/alert-rules/${ruleId}`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update alert rule",
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
   * Delete alert rule
   * DELETE /api/alert-rules/:id
   */
  deleteRule: async (ruleId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/alert-rules/${ruleId}`);

      // Handle 204 No Content response
      if (response.status === 204) {
        return;
      }

      if (response.data && response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete alert rule",
          response.status,
          response.data.errors
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Helper functions for common operations
export const alertHelpers = {
  /**
   * Get severity color for UI
   */
  getSeverityColor: (severity: Alert["severity"]): string => {
    switch (severity) {
      case "critical":
        return "red";
      case "warning":
        return "yellow";
      case "info":
        return "blue";
      default:
        return "gray";
    }
  },

  /**
   * Get status color for UI
   */
  getStatusColor: (status: Alert["status"]): string => {
    switch (status) {
      case "active":
        return "red";
      case "acknowledged":
        return "yellow";
      case "resolved":
        return "green";
      case "snoozed":
        return "gray";
      default:
        return "gray";
    }
  },

  /**
   * Format alert title for display
   */
  formatAlertTitle: (alert: Alert): string => {
    return `${alert.title} (${alert.severity.toUpperCase()})`;
  },

  /**
   * Check if alert is actionable
   */
  isActionable: (alert: Alert): boolean => {
    return alert.status === "active" || alert.status === "snoozed";
  },

  /**
   * Get relative time string
   */
  getRelativeTime: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  },

  /**
   * Filter alerts by status
   */
  filterByStatus: (alerts: Alert[], status: Alert["status"]): Alert[] => {
    return alerts.filter(alert => alert.status === status);
  },

  /**
   * Filter alerts by severity
   */
  filterBySeverity: (alerts: Alert[], severity: Alert["severity"]): Alert[] => {
    return alerts.filter(alert => alert.severity === severity);
  },

  /**
   * Sort alerts by triggered date (newest first)
   */
  sortByTriggeredDate: (alerts: Alert[]): Alert[] => {
    return [...alerts].sort((a, b) => 
      new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
    );
  },

  /**
   * Group alerts by severity
   */
  groupBySeverity: (alerts: Alert[]): Record<Alert["severity"], Alert[]> => {
    return alerts.reduce((groups, alert) => {
      const severity = alert.severity;
      if (!groups[severity]) {
        groups[severity] = [];
      }
      groups[severity].push(alert);
      return groups;
    }, {} as Record<Alert["severity"], Alert[]>);
  },
};
