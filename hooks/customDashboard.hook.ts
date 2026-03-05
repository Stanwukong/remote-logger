// ============================================
// TANSTACK QUERY HOOKS FOR CUSTOM DASHBOARDS
// ============================================

import { queryClient } from "@/lib/query/client";
import {
  customDashboardService,
  CreateDashboardData,
  UpdateDashboardData,
  LayoutItem,
  AddWidgetData,
  UpdateWidgetData,
} from "@/services/customDashboard.service";
import { useMutation, useQuery } from "@tanstack/react-query";

// Centralized query keys for custom dashboards
export const customDashboardQueryKeys = {
  all: ["custom-dashboards"] as const,
  list: () =>
    [...customDashboardQueryKeys.all, "list"] as const,
  detail: (dashboardId: string) =>
    [...customDashboardQueryKeys.all, "detail", dashboardId] as const,
};

// ============================================
// CUSTOM DASHBOARD QUERY HOOKS
// ============================================

export const useCustomDashboards = () => {
  return useQuery({
    queryKey: customDashboardQueryKeys.list(),
    queryFn: () => customDashboardService.getDashboards(),
    staleTime: 30_000,
  });
};

export const useCustomDashboard = (dashboardId: string) => {
  return useQuery({
    queryKey: customDashboardQueryKeys.detail(dashboardId),
    queryFn: () => customDashboardService.getDashboardById(dashboardId),
    enabled: !!dashboardId,
    staleTime: 30_000,
  });
};

// ============================================
// CUSTOM DASHBOARD MUTATION HOOKS
// ============================================

export const useCreateDashboard = () => {
  return useMutation({
    mutationFn: (data: CreateDashboardData) =>
      customDashboardService.createDashboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.list(),
      });
    },
  });
};

export const useUpdateDashboard = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      data,
    }: {
      dashboardId: string;
      data: UpdateDashboardData;
    }) => customDashboardService.updateDashboard(dashboardId, data),
    onSuccess: (_, { dashboardId }) => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.detail(dashboardId),
      });
    },
  });
};

export const useDeleteDashboard = () => {
  return useMutation({
    mutationFn: (dashboardId: string) =>
      customDashboardService.deleteDashboard(dashboardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.list(),
      });
    },
  });
};

export const useUpdateLayout = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      layout,
    }: {
      dashboardId: string;
      layout: LayoutItem[];
    }) => customDashboardService.updateLayout(dashboardId, layout),
    onSuccess: (_, { dashboardId }) => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.detail(dashboardId),
      });
    },
  });
};

export const useAddWidget = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      data,
    }: {
      dashboardId: string;
      data: AddWidgetData;
    }) => customDashboardService.addWidget(dashboardId, data),
    onSuccess: (_, { dashboardId }) => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.detail(dashboardId),
      });
    },
  });
};

export const useUpdateWidget = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      widgetId,
      data,
    }: {
      dashboardId: string;
      widgetId: string;
      data: UpdateWidgetData;
    }) => customDashboardService.updateWidget(dashboardId, widgetId, data),
    onSuccess: (_, { dashboardId }) => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.detail(dashboardId),
      });
    },
  });
};

export const useRemoveWidget = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      widgetId,
    }: {
      dashboardId: string;
      widgetId: string;
    }) => customDashboardService.removeWidget(dashboardId, widgetId),
    onSuccess: (_, { dashboardId }) => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.detail(dashboardId),
      });
    },
  });
};

export const useDuplicateDashboard = () => {
  return useMutation({
    mutationFn: (dashboardId: string) =>
      customDashboardService.duplicateDashboard(dashboardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customDashboardQueryKeys.list(),
      });
    },
  });
};
