import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";

// ============================================
// CUSTOM DASHBOARD SERVICE
// ============================================

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutItem {
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CreateDashboardData {
  name: string;
  description?: string;
  projectId?: string;
}

export interface UpdateDashboardData {
  name?: string;
  description?: string;
  isShared?: boolean;
}

export interface AddWidgetData {
  type: string;
  title: string;
  config: Record<string, any>;
  position: WidgetPosition;
}

export interface UpdateWidgetData {
  title?: string;
  config?: Record<string, any>;
  position?: WidgetPosition;
}

export const customDashboardService = {
  /**
   * Get all dashboards for the current user
   * GET /api/v1/custom-dashboards
   */
  getDashboards: async () => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/custom-dashboards`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch dashboards",
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
   * Create a new custom dashboard
   * POST /api/v1/custom-dashboards
   * @param data - Dashboard name, optional description, and optional projectId
   */
  createDashboard: async (data: CreateDashboardData) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/custom-dashboards`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create dashboard",
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
   * Get a dashboard by ID
   * GET /api/v1/custom-dashboards/:dashboardId
   * @param dashboardId - The dashboard ID
   */
  getDashboardById: async (dashboardId: string) => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/custom-dashboards/${dashboardId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch dashboard",
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
   * Update a dashboard
   * PUT /api/v1/custom-dashboards/:dashboardId
   * @param dashboardId - The dashboard ID
   * @param data - Fields to update (name, description, isShared)
   */
  updateDashboard: async (dashboardId: string, data: UpdateDashboardData) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/custom-dashboards/${dashboardId}`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update dashboard",
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
   * Delete a dashboard
   * DELETE /api/v1/custom-dashboards/:dashboardId
   * @param dashboardId - The dashboard ID
   */
  deleteDashboard: async (dashboardId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/custom-dashboards/${dashboardId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete dashboard",
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
   * Update widget layout for a dashboard
   * PUT /api/v1/custom-dashboards/:dashboardId/layout
   * @param dashboardId - The dashboard ID
   * @param layout - Array of widget positions
   */
  updateLayout: async (dashboardId: string, layout: LayoutItem[]) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/custom-dashboards/${dashboardId}/layout`,
        { layout }
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update layout",
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
   * Add a widget to a dashboard
   * POST /api/v1/custom-dashboards/:dashboardId/widgets
   * @param dashboardId - The dashboard ID
   * @param data - Widget type, title, config, and position
   */
  addWidget: async (dashboardId: string, data: AddWidgetData) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/custom-dashboards/${dashboardId}/widgets`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to add widget",
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
   * Update a widget in a dashboard
   * PUT /api/v1/custom-dashboards/:dashboardId/widgets/:widgetId
   * @param dashboardId - The dashboard ID
   * @param widgetId - The widget ID
   * @param data - Fields to update (title, config, position)
   */
  updateWidget: async (
    dashboardId: string,
    widgetId: string,
    data: UpdateWidgetData
  ) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        `/custom-dashboards/${dashboardId}/widgets/${widgetId}`,
        data
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update widget",
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
   * Remove a widget from a dashboard
   * DELETE /api/v1/custom-dashboards/:dashboardId/widgets/:widgetId
   * @param dashboardId - The dashboard ID
   * @param widgetId - The widget ID
   */
  removeWidget: async (dashboardId: string, widgetId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/custom-dashboards/${dashboardId}/widgets/${widgetId}`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to remove widget",
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
   * Duplicate a dashboard
   * POST /api/v1/custom-dashboards/:dashboardId/duplicate
   * @param dashboardId - The dashboard ID to duplicate
   */
  duplicateDashboard: async (dashboardId: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `/custom-dashboards/${dashboardId}/duplicate`
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to duplicate dashboard",
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

// Export individual functions for convenience
export const getDashboards = customDashboardService.getDashboards;
export const createDashboard = customDashboardService.createDashboard;
export const getDashboardById = customDashboardService.getDashboardById;
export const updateDashboard = customDashboardService.updateDashboard;
export const deleteDashboard = customDashboardService.deleteDashboard;
export const updateLayout = customDashboardService.updateLayout;
export const addWidget = customDashboardService.addWidget;
export const updateWidget = customDashboardService.updateWidget;
export const removeWidget = customDashboardService.removeWidget;
export const duplicateDashboard = customDashboardService.duplicateDashboard;
