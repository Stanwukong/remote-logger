import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertRuleService } from "@/services/alert.service";
import { alertEventsService } from "@/services/alert-events.service";
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
    queryFn: () => alertRuleService.getRulesByProject(projectId),
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
      ruleData,
    }: {
      projectId: string;
      ruleData: CreateAlertRuleData;
    }) => alertRuleService.createRule(ruleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule created successfully");
    },
    onError: (error: Error) => {
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
    }: {
      ruleId: string;
      updates: UpdateAlertRuleData;
      apiKey: string;
      projectId: string;
    }) => alertRuleService.updateRule(ruleId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule updated successfully");
    },
    onError: (error: Error) => {
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
    }: {
      ruleId: string;
      apiKey: string;
      projectId: string;
    }) => alertRuleService.deleteRule(ruleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertRules", variables.projectId],
      });
      toast.success("Alert rule deleted successfully");
    },
    onError: (error: Error) => {
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
    queryFn: () => alertEventsService.getAlertEvents(projectId, filters),
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
    }: {
      alertId: string;
      data?: AcknowledgeAlertData;
      projectId: string;
    }) => alertEventsService.acknowledgeAlert(alertId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alertEvents", variables.projectId],
      });
      toast.success("Alert acknowledged successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to acknowledge alert");
    },
  });
};
