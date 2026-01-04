import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  alertService,
  getAlertRules,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
} from "@/services/alert.service";
import {
  alertEventsService,
  getAlertEvents,
  acknowledgeAlert,
} from "@/services/alert-events.service";
import {
  AlertRule,
  CreateAlertRuleData,
  UpdateAlertRuleData,
  AlertEventFilters,
  AcknowledgeAlertData,
} from "@/types/alert.types";
import { toast } from "sonner";

// ============================================
// ALERT RULES HOOKS
// ============================================

/**
 * Hook to fetch alert rules for a project
 */
export const useAlertRules = (projectId: string, apiKey: string) => {
  return useQuery({
    queryKey: ["alertRules", projectId],
    queryFn: () => getAlertRules(projectId, apiKey),
    enabled: !!projectId && !!apiKey,
  });
};

/**
 * Hook to create a new alert rule
 */
export const useCreateAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      ruleData,
    }: {
      projectId: string;
      ruleData: CreateAlertRuleData;
    }) => createAlertRule(projectId, ruleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create alert rule");
    },
  });
};

/**
 * Hook to update an alert rule
 */
export const useUpdateAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      updates,
      apiKey,
      projectId,
    }: {
      ruleId: string;
      updates: UpdateAlertRuleData;
      apiKey: string;
      projectId: string;
    }) => updateAlertRule(ruleId, updates, apiKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update alert rule");
    },
  });
};

/**
 * Hook to delete an alert rule
 */
export const useDeleteAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      apiKey,
      projectId,
    }: {
      ruleId: string;
      apiKey: string;
      projectId: string;
    }) => deleteAlertRule(ruleId, apiKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete alert rule");
    },
  });
};

// ============================================
// ALERT EVENTS HOOKS
// ============================================

/**
 * Hook to fetch alert events for a project
 */
export const useAlertEvents = (
  projectId: string,
  filters?: AlertEventFilters
) => {
  return useQuery({
    queryKey: ["alertEvents", projectId, filters],
    queryFn: () => getAlertEvents(projectId, filters),
    enabled: !!projectId,
  });
};

/**
 * Hook to acknowledge an alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      data,
      projectId,
    }: {
      alertId: string;
      data?: AcknowledgeAlertData;
      projectId: string;
    }) => acknowledgeAlert(alertId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertEvents", variables.projectId],
      });
      toast.success("Alert acknowledged successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to acknowledge alert");
    },
  });
};
