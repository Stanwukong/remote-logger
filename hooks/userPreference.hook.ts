// ============================================
// TANSTACK QUERY HOOKS FOR USER PREFERENCES
// ============================================

import { queryClient } from "@/lib/query/client";
import { userPreferenceService } from "@/services/userPreference.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for user preferences
export const preferenceQueryKeys = {
  all: ["preferences"] as const,
  favorites: () =>
    [...preferenceQueryKeys.all, "favorites"] as const,
  checkFavorite: (projectId: string) =>
    [...preferenceQueryKeys.all, "favorites", "check", projectId] as const,
};

// ============================================
// USER PREFERENCE QUERY HOOKS
// ============================================

export const useFavorites = () => {
  return useQuery({
    queryKey: preferenceQueryKeys.favorites(),
    queryFn: () => userPreferenceService.getFavorites(),
    staleTime: 30_000,
  });
};

export const useCheckFavorite = (projectId: string) => {
  return useQuery({
    queryKey: preferenceQueryKeys.checkFavorite(projectId),
    queryFn: () => userPreferenceService.checkFavorite(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// USER PREFERENCE MUTATION HOOKS
// ============================================

export const useAddFavorite = () => {
  return useMutation({
    mutationFn: (projectId: string) =>
      userPreferenceService.addFavorite(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: preferenceQueryKeys.favorites(),
      });
    },
  });
};

export const useRemoveFavorite = () => {
  return useMutation({
    mutationFn: (projectId: string) =>
      userPreferenceService.removeFavorite(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: preferenceQueryKeys.favorites(),
      });
    },
  });
};
