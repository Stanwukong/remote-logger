import { useMutation, useQuery } from "@tanstack/react-query";
import { integrationService } from "@/services/integration.service";
import { queryClient } from "@/lib/query/client";
import {
  ConnectIntegrationPayload,
  IntegrationActionPayload,
} from "@/types/integration.types";

// ============================================
// QUERY KEYS
// ============================================

export const integrationQueryKeys = {
  all: ["integrations"] as const,
  available: () => [...integrationQueryKeys.all, "available"] as const,
  connected: (projectId?: string) =>
    [...integrationQueryKeys.all, "connected", projectId ?? "all"] as const,
  detail: (id: string) =>
    [...integrationQueryKeys.all, "detail", id] as const,
  type: (type: string) =>
    [...integrationQueryKeys.all, "type", type] as const,
};

// ============================================
// QUERY HOOKS
// ============================================

/** Fetch all available integration types. */
export const useAvailableIntegrations = () => {
  return useQuery({
    queryKey: integrationQueryKeys.available(),
    queryFn: () => integrationService.getAvailableIntegrations(),
    staleTime: 10 * 60 * 1000, // 10 minutes — rarely changes
  });
};

/** Fetch connected integrations for the current user. */
export const useConnectedIntegrations = (projectId?: string) => {
  return useQuery({
    queryKey: integrationQueryKeys.connected(projectId),
    queryFn: () => integrationService.getConnectedIntegrations(projectId),
    staleTime: 60 * 1000,
  });
};

/** Fetch a single integration by ID. */
export const useIntegrationDetail = (id: string) => {
  return useQuery({
    queryKey: integrationQueryKeys.detail(id),
    queryFn: () => integrationService.getIntegrationById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

/** Fetch integration type metadata by slug. */
export const useIntegrationType = (type: string) => {
  return useQuery({
    queryKey: integrationQueryKeys.type(type),
    queryFn: () => integrationService.getIntegrationType(type),
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

/** Connect a new integration. */
export const useConnectIntegration = () => {
  return useMutation({
    mutationFn: ({
      type,
      data,
    }: {
      type: string;
      data: ConnectIntegrationPayload;
    }) => integrationService.connectIntegration(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: integrationQueryKeys.all,
      });
    },
  });
};

/** Disconnect an integration. */
export const useDisconnectIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => integrationService.disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: integrationQueryKeys.all,
      });
    },
  });
};

/** Test an existing integration. */
export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => integrationService.testIntegration(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({
        queryKey: integrationQueryKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: integrationQueryKeys.connected(),
      });
    },
  });
};

/** Execute an action on a connected integration. */
export const useIntegrationAction = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: IntegrationActionPayload;
    }) => integrationService.executeAction(id, data),
  });
};
