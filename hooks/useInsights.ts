import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectInsights,
  invalidateInsightsCache,
  getRootCause,
  askQuestion,
  getOptimizationSuggestions,
  getEnrichedInsights,
} from "@/services/insights.service";
import { InsightsFilters } from "@/types/insights.types";
import { toast } from "sonner";

// ============================================
// INSIGHTS HOOKS
// ============================================

/**
 * Hook to fetch project insights
 */
export const useProjectInsights = (
  projectId: string,
  filters?: InsightsFilters
) => {
  return useQuery({
    queryKey: ["insights", projectId, filters],
    queryFn: () => getProjectInsights(projectId, filters),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to invalidate insights cache
 */
export const useInvalidateInsightsCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => invalidateInsightsCache(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["insights", projectId] });
      toast.success("Insights cache refreshed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to refresh insights");
    },
  });
};

// ============================================
// AI INSIGHTS HOOKS
// ============================================

/**
 * Hook to fetch root cause analysis for an error (lazy — enabled flag)
 */
export const useRootCause = (
  projectId: string,
  errorId: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["rootCause", projectId, errorId],
    queryFn: () => getRootCause(projectId, errorId),
    enabled: !!projectId && !!errorId && enabled,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1,
  });
};

/**
 * Hook to ask a natural language question (mutation)
 */
export const useAskQuestion = () => {
  return useMutation({
    mutationFn: ({ projectId, question }: { projectId: string; question: string }) =>
      askQuestion(projectId, question),
    onError: (error: any) => {
      toast.error(error.message || "Failed to process question");
    },
  });
};

/**
 * Hook to fetch optimization suggestions
 */
export const useOptimizationSuggestions = (projectId: string) => {
  return useQuery({
    queryKey: ["optimizationSuggestions", projectId],
    queryFn: () => getOptimizationSuggestions(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch enriched insights (statistical + AI)
 */
export const useEnrichedInsights = (
  projectId: string,
  options: { timeRange?: number } = {}
) => {
  return useQuery({
    queryKey: ["enrichedInsights", projectId, options],
    queryFn: () => getEnrichedInsights(projectId, options),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};
