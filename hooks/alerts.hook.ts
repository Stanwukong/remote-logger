// ============================================
// TANSTACK QUERY HOOKS FOR ALERTS
// ============================================

import { queryClient } from "@/lib/query/client";
import {
  alertService,
  alertRuleService,
  Alert,
  AlertRule,
  AlertFilters,
  AlertStats,
  CreateAlertRuleData,
  UpdateAlertRuleData,
} from "@/services/alert.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for alerts
export const alertQueryKeys = {
  all: ["alerts"] as const,
  list: (projectId: string | undefined, filters: AlertFilters) =>
    [...alertQueryKeys.all, "list", projectId || "user", filters] as const,
  stats: (projectId: string | undefined) =>
    [...alertQueryKeys.all, "stats", projectId || "user"] as const,
  distinct: (projectId: string | undefined, field: string) =>
    [...alertQueryKeys.all, "distinct", projectId || "user", field] as const,
};

// Centralized query keys for alert rules
export const alertRuleQueryKeys = {
  all: ["alert-rules"] as const,
  list: (projectId: string) =>
    [...alertRuleQueryKeys.all, "list", projectId] as const,
  byId: (ruleId: string) =>
    [...alertRuleQueryKeys.all, "detail", ruleId] as const,
};

// ============================================
// ALERT QUERY HOOKS
// ============================================

// Hook to get alerts with filtering, sorting, and pagination
export const useAlerts = (projectId?: string, filters: AlertFilters = {}) => {
  return useQuery({
    queryKey: alertQueryKeys.list(projectId, filters),
    queryFn: () => alertService.getAlerts(projectId, filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
};

// Hook to get alert statistics for dashboard
export const useAlertStats = (projectId?: string) => {
  return useQuery({
    queryKey: alertQueryKeys.stats(projectId),
    queryFn: () => alertService.getAlertStats(projectId),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Hook to get distinct values for filtering
export const useAlertDistinctValues = (
  projectId: string | undefined,
  field: "severity" | "status" | "tags" | "ruleId"
) => {
  return useQuery({
    queryKey: alertQueryKeys.distinct(projectId, field),
    queryFn: () => alertService.getDistinctValues(projectId || "", field),
    enabled: !!field,
    staleTime: 5 * 60 * 1000, // 5 minutes (distinct values change slowly)
  });
};

// User-scoped hooks (convenience wrappers)
export const useUserAlerts = (filters: AlertFilters = {}) => {
  return useAlerts(undefined, filters);
};

export const useUserAlertStats = () => {
  return useAlertStats(undefined);
};

// ============================================
// ALERT RULE QUERY HOOKS
// ============================================

// Hook to get alert rules by project
export const useAlertRules = (projectId: string) => {
  return useQuery({
    queryKey: alertRuleQueryKeys.list(projectId),
    queryFn: () => alertRuleService.getRulesByProject(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get a specific alert rule by ID
export const useAlertRule = (ruleId: string) => {
  return useQuery({
    queryKey: alertRuleQueryKeys.byId(ruleId),
    queryFn: () => alertRuleService.getRuleById(ruleId),
    enabled: !!ruleId,
    staleTime: 5 * 60 * 1000, // 5 minutes (individual rules don't change often)
  });
};

// ============================================
// ALERT MUTATION HOOKS
// ============================================

// Hook to update alert status (acknowledge, resolve, snooze)
export const useUpdateAlertStatus = () => {
  return useMutation({
    mutationFn: ({
      alertId,
      status,
    }: {
      alertId: string;
      status: "acknowledged" | "resolved" | "snoozed";
    }) => alertService.updateAlertStatus(alertId, status),
    onSuccess: (updatedAlert, { alertId, status }) => {
      // Update the specific alert in all relevant queries
      queryClient.setQueriesData(
        { queryKey: alertQueryKeys.all, exact: false },
        (oldData: any) => {
          if (oldData?.data?.length) {
            return {
              ...oldData,
              data: oldData.data.map((alert: Alert) =>
                alert._id === alertId
                  ? { ...alert, status, updatedAt: new Date().toISOString() }
                  : alert
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate stats to reflect status change
      queryClient.invalidateQueries({
        queryKey: alertQueryKeys.stats(updatedAlert?.data?.projectId),
      });
    },
  });
};

// Hook to bulk update multiple alerts
export const useBulkUpdateAlerts = () => {
  return useMutation({
    mutationFn: ({
      alertIds,
      status,
    }: {
      alertIds: string[];
      status: "acknowledged" | "resolved" | "snoozed";
    }) => alertService.bulkUpdateAlerts(alertIds, status),
    onSuccess: (result, { alertIds, status }) => {
      // Update multiple alerts in all relevant queries
      queryClient.setQueriesData(
        { queryKey: alertQueryKeys.all, exact: false },
        (oldData: any) => {
          if (oldData?.data?.length) {
            return {
              ...oldData,
              data: oldData.data.map((alert: Alert) =>
                alertIds.includes(alert._id)
                  ? { ...alert, status, updatedAt: new Date().toISOString() }
                  : alert
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate all stats queries since we don't know which projects were affected
      queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
};

// Hook to delete alerts
export const useDeleteAlerts = () => {
  return useMutation({
    mutationFn: ({
      alertIds,
      softDelete = true,
    }: {
      alertIds: string[];
      softDelete?: boolean;
    }) => alertService.deleteAlerts(alertIds, softDelete),
    onSuccess: (result, { alertIds, softDelete }) => {
      if (softDelete) {
        // For soft delete, update status to resolved
        queryClient.setQueriesData(
          { queryKey: alertQueryKeys.all, exact: false },
          (oldData: any) => {
            if (oldData?.data?.length) {
              return {
                ...oldData,
                data: oldData.data.map((alert: Alert) =>
                  alertIds.includes(alert._id)
                    ? {
                        ...alert,
                        status: "resolved" as const,
                        updatedAt: new Date().toISOString(),
                        metadata: {
                          ...alert.metadata,
                          deleted: true,
                          deletedAt: new Date().toISOString(),
                        },
                      }
                    : alert
                ),
              };
            }
            return oldData;
          }
        );
      } else {
        // For hard delete, remove alerts from cache
        queryClient.setQueriesData(
          { queryKey: alertQueryKeys.all, exact: false },
          (oldData: any) => {
            if (oldData?.data?.length) {
              return {
                ...oldData,
                data: oldData.data.filter(
                  (alert: Alert) => !alertIds.includes(alert._id)
                ),
              };
            }
            return oldData;
          }
        );
      }

      // Invalidate stats to reflect the deletion
      queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
};

// Hook to auto-resolve old alerts
export const useAutoResolveOldAlerts = () => {
  return useMutation({
    mutationFn: (olderThanDays: number = 30) =>
      alertService.autoResolveOldAlerts(olderThanDays),
    onSuccess: () => {
      // Invalidate all alert queries since this affects multiple alerts
      queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
};

// Legacy acknowledge hooks for backward compatibility
export const useAcknowledgeSingleAlert = () => {
  return useMutation({
    mutationFn: (alertId: string) =>
      alertService.acknowledgeSingleAlert(alertId),
    onSuccess: (updatedAlert, alertId) => {
      // Update the specific alert in cache
      queryClient.setQueriesData(
        { queryKey: alertQueryKeys.all, exact: false },
        (oldData: any) => {
          if (oldData?.data?.length) {
            return {
              ...oldData,
              data: oldData.data.map((alert: Alert) =>
                alert._id === alertId
                  ? {
                      ...alert,
                      status: "acknowledged" as const,
                      updatedAt: new Date().toISOString(),
                    }
                  : alert
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: alertQueryKeys.stats(updatedAlert?.data?.projectId),
      });
    },
  });
};

export const useAcknowledgeMultipleAlerts = () => {
  return useMutation({
    mutationFn: (alertIds: string[]) =>
      alertService.acknowledgeMultipleAlerts(alertIds),
    onSuccess: (result, alertIds) => {
      // Update multiple alerts in cache
      queryClient.setQueriesData(
        { queryKey: alertQueryKeys.all, exact: false },
        (oldData: any) => {
          if (oldData?.data?.length) {
            return {
              ...oldData,
              data: oldData.data.map((alert: Alert) =>
                alertIds.includes(alert._id)
                  ? {
                      ...alert,
                      status: "acknowledged" as const,
                      updatedAt: new Date().toISOString(),
                    }
                  : alert
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate all stats
      queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    },
  });
};

// ============================================
// ALERT RULE MUTATION HOOKS
// ============================================

// Hook to create alert rule
export const useCreateAlertRule = () => {
  return useMutation({
    mutationFn: ({ data }: { data: CreateAlertRuleData }) =>
      alertRuleService.createRule(data),
  });
};

// Hook to update alert rule
export const useUpdateAlertRule = () => {
  return useMutation({
    mutationFn: ({
      ruleId,
      data,
    }: {
      ruleId: string;
      data: UpdateAlertRuleData;
    }) => alertRuleService.updateRule(ruleId, data),
    onSuccess: (updatedRule, { ruleId }) => {
      // Update the specific rule in cache
      if (updatedRule) {
        queryClient.setQueryData(alertRuleQueryKeys.byId(ruleId), updatedRule);

        // Update rule in lists
        queryClient.setQueriesData(
          { queryKey: alertRuleQueryKeys.all, exact: false },
          (oldData: any) => {
            if (oldData?.data?.length) {
              return {
                ...oldData,
                data: oldData.data.map((rule: AlertRule) =>
                  rule._id === ruleId ? updatedRule.data : rule
                ),
              };
            }
            return oldData;
          }
        );
      }
    },
  });
};

// Hook to delete alert rule
export const useDeleteAlertRule = () => {
  return useMutation({
    mutationFn: (ruleId: string) => alertRuleService.deleteRule(ruleId),
    onSuccess: (_, ruleId) => {
      // Remove rule from all caches
      queryClient.removeQueries({ queryKey: alertRuleQueryKeys.byId(ruleId) });

      // Remove from lists
      queryClient.setQueriesData(
        { queryKey: alertRuleQueryKeys.all, exact: false },
        (oldData: any) => {
          if (oldData?.data?.length) {
            return {
              ...oldData,
              data: oldData.data.filter(
                (rule: AlertRule) => rule._id !== ruleId
              ),
            };
          }
          return oldData;
        }
      );
    },
  });
};

// ============================================
// UTILITY HOOKS
// ============================================

// Hook to prefetch alerts (useful for navigation)
export const usePrefetchAlerts = () => {
  return (projectId: string, filters: AlertFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: alertQueryKeys.list(projectId, filters),
      queryFn: () => alertService.getAlerts(projectId, filters),
      staleTime: 30 * 1000,
    });
  };
};

// Hook to prefetch alert rules
export const usePrefetchAlertRules = () => {
  return (projectId: string) => {
    queryClient.prefetchQuery({
      queryKey: alertRuleQueryKeys.list(projectId),
      queryFn: () => alertRuleService.getRulesByProject(projectId),
      staleTime: 2 * 60 * 1000,
    });
  };
};

// Hook to invalidate all alert-related queries (useful for manual refresh)
export const useInvalidateAlerts = () => {
  return () => {
    queryClient.invalidateQueries({ queryKey: alertQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: alertRuleQueryKeys.all });
  };
};
