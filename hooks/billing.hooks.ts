// hooks/billing.hooks.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { billingService } from "@/services/billing.service";
import { ChangePlanPayload, CheckoutPayload } from "@/types/billing.types";

// ============================================
// QUERY KEYS
// ============================================

export const billingQueryKeys = {
  all: ["billing"] as const,
  subscription: () => [...billingQueryKeys.all, "subscription"] as const,
  usage: () => [...billingQueryKeys.all, "usage"] as const,
  plans: () => [...billingQueryKeys.all, "plans"] as const,
  invoices: () => [...billingQueryKeys.all, "invoices"] as const,
};

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Get the current user's subscription.
 */
export const useSubscription = () => {
  return useQuery({
    queryKey: billingQueryKeys.subscription(),
    queryFn: () => billingService.getSubscription(),
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Get current usage with plan limits and percentages.
 * Auto-refreshes every 60 seconds.
 */
export const useUsage = () => {
  return useQuery({
    queryKey: billingQueryKeys.usage(),
    queryFn: () => billingService.getUsage(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60_000, // Refresh every minute
  });
};

/**
 * Get all available plan configurations.
 */
export const usePlans = () => {
  return useQuery({
    queryKey: billingQueryKeys.plans(),
    queryFn: () => billingService.getPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes (plans rarely change)
  });
};

/**
 * Get invoice history.
 */
export const useInvoices = () => {
  return useQuery({
    queryKey: billingQueryKeys.invoices(),
    queryFn: () => billingService.getInvoices(),
    staleTime: 60 * 1000,
  });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Change the current plan.
 */
export const useChangePlan = () => {
  return useMutation({
    mutationFn: (payload: ChangePlanPayload) =>
      billingService.changePlan(payload),
    onSuccess: () => {
      // Invalidate all billing queries after plan change
      queryClient.invalidateQueries({
        queryKey: billingQueryKeys.all,
      });
    },
  });
};

/**
 * Create a checkout session for plan upgrade.
 */
export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      billingService.createCheckout(payload),
  });
};

/**
 * Create a billing portal session.
 */
export const useCreatePortal = () => {
  return useMutation({
    mutationFn: () => billingService.createPortal(),
  });
};
