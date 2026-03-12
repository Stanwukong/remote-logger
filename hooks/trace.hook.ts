import { useQuery } from "@tanstack/react-query";
import { traceService } from "@/services/trace.service";

export const traceQueryKeys = {
  all: ["traces"] as const,
  list: (projectId: string, params?: Record<string, string>) =>
    [...traceQueryKeys.all, "list", projectId, params] as const,
  detail: (projectId: string, traceId: string) =>
    [...traceQueryKeys.all, "detail", projectId, traceId] as const,
  spans: (projectId: string, traceId: string) =>
    [...traceQueryKeys.all, "spans", projectId, traceId] as const,
};

export const useTraces = (
  projectId: string,
  params?: Record<string, string>
) => {
  return useQuery({
    queryKey: traceQueryKeys.list(projectId, params),
    queryFn: () => traceService.getTraces(projectId, params),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

export const useTraceDetail = (projectId: string, traceId: string) => {
  return useQuery({
    queryKey: traceQueryKeys.detail(projectId, traceId),
    queryFn: () => traceService.getTraceDetail(projectId, traceId),
    enabled: !!projectId && !!traceId,
  });
};

export const useTraceSpans = (projectId: string, traceId: string) => {
  return useQuery({
    queryKey: traceQueryKeys.spans(projectId, traceId),
    queryFn: () => traceService.getTraceSpans(projectId, traceId),
    enabled: !!projectId && !!traceId,
  });
};
