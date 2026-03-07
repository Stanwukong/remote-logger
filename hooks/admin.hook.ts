// ============================================
// TANSTACK QUERY HOOKS FOR ADMIN DASHBOARD
// ============================================

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { adminService } from "@/services/admin.service";

// Centralized query keys for admin
export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: () => [...adminQueryKeys.all, "stats"] as const,
  users: (params?: Record<string, unknown>) =>
    [...adminQueryKeys.all, "users", params] as const,
  organizations: (params?: Record<string, unknown>) =>
    [...adminQueryKeys.all, "organizations", params] as const,
  systemHealth: () => [...adminQueryKeys.all, "system-health"] as const,
  usageTrends: (days: number) =>
    [...adminQueryKeys.all, "usage-trends", days] as const,
};

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetch combined admin stats (user + usage KPIs).
 * Auto-refreshes every 30 seconds.
 */
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: () => adminService.getStats(),
    refetchInterval: 30000,
    staleTime: 15000,
  });
};

/**
 * List users with pagination, search, and role filter.
 */
export const useAdminUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery({
    queryKey: adminQueryKeys.users(params as Record<string, unknown>),
    queryFn: () => adminService.listUsers(params),
    staleTime: 10000,
  });
};

/**
 * List organizations with pagination and search.
 */
export const useAdminOrganizations = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: adminQueryKeys.organizations(params as Record<string, unknown>),
    queryFn: () => adminService.listOrganizations(params),
    staleTime: 10000,
  });
};

/**
 * Fetch system health information.
 * Auto-refreshes every 15 seconds.
 */
export const useAdminSystemHealth = () => {
  return useQuery({
    queryKey: adminQueryKeys.systemHealth(),
    queryFn: () => adminService.getSystemHealth(),
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

/**
 * Fetch usage trends for a given number of days.
 */
export const useAdminUsageTrends = (days: number = 30) => {
  return useQuery({
    queryKey: adminQueryKeys.usageTrends(days),
    queryFn: () => adminService.getUsageTrends(days),
    staleTime: 60000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Update a user's role.
 * Invalidates admin users and stats on success.
 */
export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users(),
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.stats(),
      });
    },
  });
};
