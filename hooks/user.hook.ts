// ============================================
// TANSTACK QUERY HOOKS FOR USER PROFILE
// ============================================

import { queryClient } from "@/lib/query/client";
import {
  userService,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for user
export const userQueryKeys = {
  all: ["user"] as const,
  profile: () =>
    [...userQueryKeys.all, "profile"] as const,
};

// ============================================
// USER QUERY HOOKS
// ============================================

export const useProfile = () => {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes (profile data changes infrequently)
  });
};

// ============================================
// USER MUTATION HOOKS
// ============================================

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.profile(),
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      userService.changePassword(data),
  });
};

// ============================================
// GDPR HOOKS
// ============================================

export const useExportData = () => {
  return useMutation({
    mutationFn: () => userService.exportData(),
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (confirmEmail: string) =>
      userService.deleteAccount(confirmEmail),
  });
};
