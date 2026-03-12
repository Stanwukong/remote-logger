// ============================================
// TANSTACK QUERY HOOKS FOR REGRESSIONS
// ============================================

import {
  regressionService,
  ComparePerformanceRequest,
} from "@/services/regression.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for regressions
export const regressionQueryKeys = {
  all: ["regressions"] as const,
  detect: (projectId: string, params?: { timeRange?: string; metric?: string }) =>
    [...regressionQueryKeys.all, "detect", projectId, params] as const,
  baseline: (projectId: string, params?: { timeRange?: string }) =>
    [...regressionQueryKeys.all, "baseline", projectId, params] as const,
};

// ============================================
// REGRESSION QUERY HOOKS
// ============================================

export const useDetectRegressions = (
  projectId: string,
  params?: { timeRange?: string; metric?: string }
) => {
  return useQuery({
    queryKey: regressionQueryKeys.detect(projectId, params),
    queryFn: () =>
      regressionService.detectRegressions(projectId, params?.timeRange, params?.metric),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useBaseline = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: regressionQueryKeys.baseline(projectId, params),
    queryFn: () =>
      regressionService.getBaseline(projectId, params?.timeRange),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// REGRESSION MUTATION HOOKS
// ============================================

export const useComparePerformance = (projectId: string) => {
  return useMutation({
    mutationFn: (data: ComparePerformanceRequest) =>
      regressionService.comparePerformance(projectId, data),
  });
};
