import { useQuery } from "@tanstack/react-query";
import {
  publicService,
  SystemStatus,
  ChangelogEntry,
  ChangelogMeta,
  ChangelogParams,
} from "@/services/public.service";

/**
 * Hook for fetching system status.
 * Auto-refetches every 60 seconds.
 */
export const useStatus = () => {
  return useQuery<SystemStatus>({
    queryKey: ["public", "status"],
    queryFn: () => publicService.getStatus(),
    refetchInterval: 60 * 1000, // 60 seconds
    staleTime: 30 * 1000,
  });
};

/**
 * Hook for fetching changelog entries with pagination and category filter.
 */
export const useChangelog = (params?: ChangelogParams) => {
  return useQuery<{ entries: ChangelogEntry[]; meta: ChangelogMeta }>({
    queryKey: ["public", "changelog", params?.page, params?.limit, params?.category],
    queryFn: () => publicService.getChangelog(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
