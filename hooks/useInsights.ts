import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectInsights,
  invalidateInsightsCache,
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
