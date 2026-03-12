import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { anomalyService } from "@/services/anomaly.service";
import { AnomalyFilters } from "@/types/anomaly.types";
import { toast } from "sonner";

// ============================================
// ANOMALY HOOKS
// ============================================

/**
 * Fetch anomalies for a project with optional filters
 */
export const useAnomalies = (
  projectId: string,
  filters?: AnomalyFilters
) => {
  return useQuery({
    queryKey: ["anomalies", projectId, filters],
    queryFn: () => anomalyService.getAnomalies(projectId, filters),
    enabled: !!projectId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Fetch anomaly stats for a project
 */
export const useAnomalyStats = (projectId: string) => {
  return useQuery({
    queryKey: ["anomaly-stats", projectId],
    queryFn: () => anomalyService.getAnomalyStats(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
};

/**
 * Acknowledge an anomaly
 */
export const useAcknowledgeAnomaly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (anomalyId: string) =>
      anomalyService.acknowledgeAnomaly(anomalyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anomalies"] });
      queryClient.invalidateQueries({ queryKey: ["anomaly-stats"] });
      toast.success("Anomaly acknowledged");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to acknowledge anomaly");
    },
  });
};

/**
 * Resolve an anomaly
 */
export const useResolveAnomaly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (anomalyId: string) =>
      anomalyService.resolveAnomaly(anomalyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anomalies"] });
      queryClient.invalidateQueries({ queryKey: ["anomaly-stats"] });
      toast.success("Anomaly resolved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve anomaly");
    },
  });
};

/**
 * Trigger a manual anomaly scan
 */
export const useTriggerScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      anomalyService.triggerScan(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anomalies"] });
      queryClient.invalidateQueries({ queryKey: ["anomaly-stats"] });
      toast.success(
        `Scan complete: ${data?.detected || 0} anomalies detected`
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to trigger scan");
    },
  });
};
