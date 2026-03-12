"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApperioStore } from "@/store/apperio-store";

export function useAutoRefresh() {
  const queryClient = useQueryClient();
  const enabled = useApperioStore((s) => s.autoRefreshEnabled);
  const interval = useApperioStore((s) => s.autoRefreshInterval);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries();
    }, interval);
    return () => clearInterval(id);
  }, [enabled, interval, queryClient]);
}
