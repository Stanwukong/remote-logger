import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { waitlistService, WaitlistStatus } from "@/services/waitlist.service";

export const waitlistQueryKeys = {
  all: ["waitlist"] as const,
  list: (params?: Record<string, unknown>) =>
    [...waitlistQueryKeys.all, "list", params] as const,
  stats: () => [...waitlistQueryKeys.all, "stats"] as const,
};

export const useWaitlistEntries = (params: {
  page?: number;
  limit?: number;
  status?: WaitlistStatus;
  search?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: waitlistQueryKeys.list(params as Record<string, unknown>),
    queryFn: () => waitlistService.list(params),
    staleTime: 10000,
  });
};

export const useWaitlistStats = () => {
  return useQuery({
    queryKey: waitlistQueryKeys.stats(),
    queryFn: () => waitlistService.getStats(),
    staleTime: 15000,
  });
};

function invalidateWaitlist() {
  queryClient.invalidateQueries({ queryKey: waitlistQueryKeys.all });
}

export const useApproveEntry = () => {
  return useMutation({
    mutationFn: (id: string) => waitlistService.approve(id),
    onSuccess: invalidateWaitlist,
  });
};

export const useRejectEntry = () => {
  return useMutation({
    mutationFn: (id: string) => waitlistService.reject(id),
    onSuccess: invalidateWaitlist,
  });
};

export const useSendInvite = () => {
  return useMutation({
    mutationFn: (id: string) => waitlistService.sendInvite(id),
    onSuccess: invalidateWaitlist,
  });
};

export const useBulkApprove = () => {
  return useMutation({
    mutationFn: (ids: string[]) => waitlistService.bulkApprove(ids),
    onSuccess: invalidateWaitlist,
  });
};
