import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// API TOKEN SERVICE
// ============================================

export interface CreateTokenPayload {
  name: string;
  scopes: string[];
  expiresAt?: string | null;
}

export interface ApiToken {
  _id: string;
  userId: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTokenWithRawToken extends ApiToken {
  rawToken: string;
}

export const apiTokenService = {
  /**
   * Create a new personal API token.
   * Returns the token object with the raw token (shown once).
   */
  createToken: async (payload: CreateTokenPayload): Promise<ApiTokenWithRawToken> => {
    try {
      const response = await apiClient.post<ApiResponse<ApiTokenWithRawToken>>(
        "/tokens",
        payload
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create token",
          response.status,
          response.data.errors
        );
      }

      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error; // TypeScript needs this for return type
    }
  },

  /**
   * List all active tokens for the current user.
   * Never returns raw token values.
   */
  listTokens: async (): Promise<ApiToken[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ApiToken[]>>(
        "/tokens"
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to list tokens",
          response.status,
          response.data.errors
        );
      }

      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Revoke (deactivate) a token by ID.
   */
  revokeToken: async (tokenId: string): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/tokens/${tokenId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to revoke token",
          response.status,
          response.data.errors
        );
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
