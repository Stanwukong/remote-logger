import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// TYPES
// ============================================

export type WaitlistStatus = "pending" | "approved" | "rejected";

export interface WaitlistEntry {
  _id: string;
  email: string;
  position: number;
  referralCode: string;
  status: WaitlistStatus;
  inviteCode: string | null;
  approvedAt: string | null;
  invitedAt: string | null;
  signedUpAt: string | null;
  createdAt: string;
}

export interface WaitlistStats {
  pending: number;
  approved: number;
  rejected: number;
  signedUp: number;
  total: number;
}

export interface WaitlistPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// WAITLIST SERVICE
// ============================================

export const waitlistService = {
  list: async (params: {
    page?: number;
    limit?: number;
    status?: WaitlistStatus;
    search?: string;
    sort?: string;
  }): Promise<{ data: WaitlistEntry[]; meta: WaitlistPaginationMeta }> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.status) searchParams.append("status", params.status);
      if (params.search) searchParams.append("search", params.search);
      if (params.sort) searchParams.append("sort", params.sort);

      const response = await apiClient.get<
        ApiResponse<WaitlistEntry[]> & { meta: WaitlistPaginationMeta }
      >(`/waitlist?${searchParams.toString()}`);

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to list waitlist entries",
          response.status,
          response.data.errors
        );
      }

      return { data: response.data.data!, meta: response.data.meta };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getStats: async (): Promise<WaitlistStats> => {
    try {
      const response = await apiClient.get<ApiResponse<WaitlistStats>>(
        "/waitlist/stats"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch waitlist stats",
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

  approve: async (id: string): Promise<WaitlistEntry> => {
    try {
      const response = await apiClient.put<ApiResponse<WaitlistEntry>>(
        `/waitlist/${id}/approve`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to approve entry",
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

  reject: async (id: string): Promise<WaitlistEntry> => {
    try {
      const response = await apiClient.put<ApiResponse<WaitlistEntry>>(
        `/waitlist/${id}/reject`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to reject entry",
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

  sendInvite: async (
    id: string
  ): Promise<{ email: string; inviteCode: string; invitedAt: string }> => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ email: string; inviteCode: string; invitedAt: string }>
      >(`/waitlist/${id}/send-invite`);
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to send invite email",
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

  bulkApprove: async (
    ids: string[]
  ): Promise<Array<{ email: string; inviteCode: string }>> => {
    try {
      const response = await apiClient.post<
        ApiResponse<Array<{ email: string; inviteCode: string }>>
      >("/waitlist/bulk-approve", { ids });
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to bulk approve",
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
