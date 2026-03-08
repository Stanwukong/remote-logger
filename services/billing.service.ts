// services/billing.service.ts

import { ApiResponse } from "@/types/api";
import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import {
  Subscription,
  UsageData,
  PlanConfig,
  Invoice,
  CheckoutSession,
  PortalSession,
  LimitCheckResult,
  ChangePlanPayload,
  CheckoutPayload,
} from "@/types/billing.types";

// ============================================
// BILLING SERVICE
// ============================================

export const billingService = {
  /**
   * Get the current user's subscription.
   */
  getSubscription: async (): Promise<Subscription> => {
    try {
      const response = await apiClient.get<ApiResponse<Subscription>>(
        "/billing/subscription"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get subscription",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get current usage with plan limits and percentages.
   */
  getUsage: async (): Promise<UsageData> => {
    try {
      const response = await apiClient.get<ApiResponse<UsageData>>(
        "/billing/usage"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get usage data",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get all available plan configurations.
   */
  getPlans: async (): Promise<PlanConfig[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PlanConfig[]>>(
        "/billing/plans"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get plans",
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
   * Get invoice history.
   */
  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Invoice[]>>(
        "/billing/invoices"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to get invoices",
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
   * Create a checkout session for plan upgrade.
   */
  createCheckout: async (payload: CheckoutPayload): Promise<CheckoutSession> => {
    try {
      const response = await apiClient.post<ApiResponse<CheckoutSession>>(
        "/billing/checkout",
        payload
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create checkout",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Create a billing portal session.
   */
  createPortal: async (): Promise<PortalSession> => {
    try {
      const response = await apiClient.post<ApiResponse<PortalSession>>(
        "/billing/portal"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create portal session",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Change current plan.
   */
  changePlan: async (payload: ChangePlanPayload): Promise<Subscription> => {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        "/billing/change-plan",
        payload
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to change plan",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Cancel the current subscription.
   */
  cancelSubscription: async (): Promise<Subscription> => {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        "/billing/cancel"
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to cancel subscription",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Check a specific resource limit.
   */
  checkLimit: async (resource: string): Promise<LimitCheckResult> => {
    try {
      const response = await apiClient.post<ApiResponse<LimitCheckResult>>(
        "/billing/check-limit",
        { resource }
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to check limit",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
