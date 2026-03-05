// ============================================
// TANSTACK QUERY HOOKS FOR FUNNELS
// ============================================

import {
  funnelService,
  FunnelAnalysisRequest,
} from "@/services/funnel.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for funnels
export const funnelQueryKeys = {
  all: ["funnels"] as const,
  popularPaths: (projectId: string, params?: { limit?: number; timeRange?: string }) =>
    [...funnelQueryKeys.all, "popular-paths", projectId, params] as const,
};

// ============================================
// FUNNEL QUERY HOOKS
// ============================================

export const usePopularPaths = (
  projectId: string,
  params?: { limit?: number; timeRange?: string }
) => {
  return useQuery({
    queryKey: funnelQueryKeys.popularPaths(projectId, params),
    queryFn: () =>
      funnelService.getPopularPaths(projectId, params?.limit, params?.timeRange),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// FUNNEL MUTATION HOOKS
// ============================================

export const useAnalyzeFunnel = (projectId: string) => {
  return useMutation({
    mutationFn: (data: FunnelAnalysisRequest) =>
      funnelService.analyzeFunnel(projectId, data),
  });
};
