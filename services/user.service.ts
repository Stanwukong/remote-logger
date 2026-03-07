import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// USER SERVICE
// ============================================

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface OAuthLoginPayload {
  provider: string;
  code: string;
  redirectUri: string;
}

export const userService = {
  /**
   * Get the current authenticated user's profile.
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        "/users/profile"
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch profile",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Update the current user's profile.
   * @param payload - The profile fields to update.
   */
  updateProfile: async (payload: UpdateProfilePayload) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        "/users/profile",
        payload
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update profile",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Change the current user's password.
   * @param payload - The current and new password.
   */
  changePassword: async (payload: ChangePasswordPayload) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        "/users/change-password",
        payload
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to change password",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Authenticate via OAuth provider.
   * @param payload - The OAuth provider, authorization code, and redirect URI.
   */
  oauthLogin: async (payload: OAuthLoginPayload) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/users/oauth/login",
        payload
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "OAuth login failed",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Export all user data as a ZIP file download (GDPR).
   * Returns a Blob that can be downloaded by the client.
   */
  exportData: async (): Promise<Blob> => {
    try {
      const response = await apiClient.post(
        "/users/data-export",
        {},
        { responseType: "blob", timeout: 120000 }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error; // unreachable but satisfies TS
    }
  },

  /**
   * Permanently delete the user's account and all associated data (GDPR).
   * @param confirmEmail - The user must type their email to confirm deletion.
   */
  deleteAccount: async (confirmEmail: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/users/data-deletion",
        { confirmEmail }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete account",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
