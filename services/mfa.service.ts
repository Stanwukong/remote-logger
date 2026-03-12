import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// MFA SERVICE
// ============================================

export interface MfaSetupResponse {
  qrCodeDataUrl: string;
  secret: string;
  backupCodes: string[];
}

export interface MfaStatusResponse {
  mfaEnabled: boolean;
  backupCodesRemaining: number;
}

export const mfaService = {
  /**
   * Initiate MFA setup. Returns QR code, secret, and backup codes.
   */
  setupMfa: async (): Promise<MfaSetupResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>("/users/mfa/setup");

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to set up MFA",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Verify TOTP code and enable MFA.
   */
  verifyMfa: async (token: string, backupCodes: string[]): Promise<void> => {
    try {
      const response = await apiClient.post<ApiResponse>("/users/mfa/verify", {
        token,
        backupCodes,
      });

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to verify MFA",
          response.status,
          response.data.errors
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Disable MFA (requires current TOTP code).
   */
  disableMfa: async (token: string): Promise<void> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/users/mfa/disable",
        { token }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to disable MFA",
          response.status,
          response.data.errors
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Validate TOTP during login (no JWT needed, uses mfaToken).
   */
  validateMfa: async (mfaToken: string, token: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/users/mfa/validate",
        { mfaToken, token }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "MFA validation failed",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get MFA status for the authenticated user.
   */
  getMfaStatus: async (): Promise<MfaStatusResponse> => {
    try {
      const response = await apiClient.get<ApiResponse>("/users/mfa/status");

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get MFA status",
          response.status,
          response.data.errors
        );
      }

      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
