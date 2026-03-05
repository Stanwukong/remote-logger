// ============================================
// TANSTACK QUERY HOOKS FOR AI SUGGESTIONS
// ============================================

import { queryClient } from "@/lib/query/client";
import {
  aiSuggestionService,
  AcceptSuggestionData,
} from "@/services/aiSuggestion.service";
import { alertRuleQueryKeys } from "@/hooks/alerts.hook";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for AI suggestions
export const aiSuggestionQueryKeys = {
  all: ["ai-suggestions"] as const,
  byProject: (projectId: string) =>
    [...aiSuggestionQueryKeys.all, "project", projectId] as const,
};

// ============================================
// AI SUGGESTION QUERY HOOKS
// ============================================

export const useAISuggestions = (projectId: string) => {
  return useQuery({
    queryKey: aiSuggestionQueryKeys.byProject(projectId),
    queryFn: () => aiSuggestionService.getSuggestions(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// AI SUGGESTION MUTATION HOOKS
// ============================================

export const useAcceptSuggestion = (projectId: string) => {
  return useMutation({
    mutationFn: (data: AcceptSuggestionData) =>
      aiSuggestionService.acceptSuggestion(projectId, data),
    onSuccess: () => {
      // Invalidate suggestions since the accepted one should no longer appear
      queryClient.invalidateQueries({
        queryKey: aiSuggestionQueryKeys.byProject(projectId),
      });
      // Invalidate alert rules since a new rule was created from the suggestion
      queryClient.invalidateQueries({
        queryKey: alertRuleQueryKeys.all,
      });
    },
  });
};
