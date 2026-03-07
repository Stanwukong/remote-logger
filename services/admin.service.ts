import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// TYPES
// ============================================

export interface AdminUserStats {
  totalUsers: number;
  newThisWeek: number;
  newThisMonth: number;
  activeUsersToday: number;
  totalOrganizations: number;
  newOrgsThisWeek: number;
}

export interface AdminUsageStats {
  totalLogs: number;
  logsToday: number;
  logsThisWeek: number;
  logsThisMonth: number;
  totalProjects: number;
  activeProjects: number;
  avgLogsPerProject: number;
  topProjectsByVolume: Array<{
    projectId: string;
    name: string;
    logCount: number;
  }>;
}

export interface AdminStats {
  userStats: AdminUserStats;
  usageStats: AdminUsageStats;
}

export interface AdminSystemHealth {
  mongodb: {
    status: string;
    connections: number;
    dbSize: number;
  };
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  nodeVersion: string;
}

export interface AdminUsageTrend {
  date: string;
  logs: number;
  errors: number;
  users: number;
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "developer" | "admin";
  joinedAt: string;
  oauthProvider?: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface AdminOrganization {
  _id: string;
  name: string;
  slug: string;
  plan: string;
  billingEmail?: string;
  members: Array<{
    user: string;
    role: string;
  }>;
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// ADMIN SERVICE
// ============================================

export const adminService = {
  /**
   * Get combined admin stats (user + usage KPIs).
   */
  getStats: async (): Promise<AdminStats> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminStats>>(
        "/admin/stats"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch admin stats",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * List users with pagination, search, and role filter.
   */
  listUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ data: AdminUser[]; meta: PaginationMeta }> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.role) searchParams.append("role", params.role);

      const response = await apiClient.get<
        ApiResponse<AdminUser[]> & { meta: PaginationMeta }
      >(`/admin/users?${searchParams.toString()}`);

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to list users",
          response.status,
          response.data.errors
        );
      }

      return {
        data: response.data.data!,
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Update a user's role.
   */
  updateUserRole: async (
    userId: string,
    role: string
  ): Promise<AdminUser> => {
    try {
      const response = await apiClient.put<ApiResponse<AdminUser>>(
        `/admin/users/${userId}`,
        { role }
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update user role",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * List organizations with pagination and search.
   */
  listOrganizations: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: AdminOrganization[]; meta: PaginationMeta }> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);

      const response = await apiClient.get<
        ApiResponse<AdminOrganization[]> & { meta: PaginationMeta }
      >(`/admin/organizations?${searchParams.toString()}`);

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to list organizations",
          response.status,
          response.data.errors
        );
      }

      return {
        data: response.data.data!,
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get system health information.
   */
  getSystemHealth: async (): Promise<AdminSystemHealth> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminSystemHealth>>(
        "/admin/system"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch system health",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get usage trends over a given number of days.
   */
  getUsageTrends: async (days: number = 30): Promise<AdminUsageTrend[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUsageTrend[]>>(
        `/admin/usage-trends?days=${days}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch usage trends",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
