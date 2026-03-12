import { useQuery } from "@tanstack/react-query";
import { webVitalsService } from "@/services/webVitals.service";

/**
 * Hook to fetch aggregated web vitals metrics (LCP, CLS, INP).
 */
export const useWebVitals = (projectId: string, timeRange?: string) =>
  useQuery({
    queryKey: ["web-vitals", projectId, timeRange],
    queryFn: () => webVitalsService.getWebVitals(projectId, timeRange),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });

/**
 * Hook to fetch time-bucketed web vitals history for charting.
 */
export const useWebVitalsHistory = (
  projectId: string,
  timeRange?: string,
  interval?: string
) =>
  useQuery({
    queryKey: ["web-vitals-history", projectId, timeRange, interval],
    queryFn: () => webVitalsService.getHistory(projectId, timeRange, interval),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });

/**
 * Hook to fetch web vitals aggregated per page URL.
 */
export const useWebVitalsByPage = (projectId: string, timeRange?: string) =>
  useQuery({
    queryKey: ["web-vitals-pages", projectId, timeRange],
    queryFn: () => webVitalsService.getByPage(projectId, timeRange),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
