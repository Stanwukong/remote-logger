// ============================================
// TANSTACK QUERY HOOKS FOR API TOKENS
// ============================================

import { queryClient } from "@/lib/query/client";
import {
  apiTokenService,
  CreateTokenPayload,
} from "@/services/apiToken.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for API tokens
export const apiTokenQueryKeys = {
  all: ["apiTokens"] as const,
  list: () => [...apiTokenQueryKeys.all, "list"] as const,
};

// ============================================
// API TOKEN QUERY HOOKS
// ============================================

export const useApiTokens = () => {
  return useQuery({
    queryKey: apiTokenQueryKeys.list(),
    queryFn: () => apiTokenService.listTokens(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ============================================
// API TOKEN MUTATION HOOKS
// ============================================

export const useCreateToken = () => {
  return useMutation({
    mutationFn: (data: CreateTokenPayload) =>
      apiTokenService.createToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiTokenQueryKeys.list(),
      });
    },
  });
};

export const useRevokeToken = () => {
  return useMutation({
    mutationFn: (tokenId: string) =>
      apiTokenService.revokeToken(tokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiTokenQueryKeys.list(),
      });
    },
  });
};
