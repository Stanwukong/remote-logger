import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useApperioStore } from "@/store/apperio-store";

describe("Apperio Store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    act(() => {
      useApperioStore.getState().reset();
    });
  });

  // ============================================
  // Auth state
  // ============================================

  describe("currentUser", () => {
    it("starts with null currentUser", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.currentUser).toBeNull();
    });

    it("sets current user", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setCurrentUser({
          id: "u1",
          email: "test@apperio.dev",
          name: "Test User",
        });
      });

      expect(result.current.currentUser).toEqual({
        id: "u1",
        email: "test@apperio.dev",
        name: "Test User",
      });
    });

    it("clears current user on logout", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setCurrentUser({
          id: "u1",
          email: "test@apperio.dev",
        });
      });

      expect(result.current.currentUser).not.toBeNull();

      act(() => {
        result.current.setCurrentUser(null);
      });

      expect(result.current.currentUser).toBeNull();
    });
  });

  // ============================================
  // Project context
  // ============================================

  describe("currentProjectId", () => {
    it("starts with null currentProjectId", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.currentProjectId).toBeNull();
    });

    it("sets project ID", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setCurrentProjectId("proj_123");
      });

      expect(result.current.currentProjectId).toBe("proj_123");
    });

    it("clears project ID", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setCurrentProjectId("proj_123");
      });

      act(() => {
        result.current.setCurrentProjectId(null);
      });

      expect(result.current.currentProjectId).toBeNull();
    });
  });

  // ============================================
  // Time range
  // ============================================

  describe("timeRange", () => {
    it("defaults to 24h", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.selectedTimeRange).toBe("24h");
    });

    it("sets time range", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setTimeRange("7d");
      });

      expect(result.current.selectedTimeRange).toBe("7d");
    });

    it("clears custom range when selecting a preset", () => {
      const { result } = renderHook(() => useApperioStore());

      // First set a custom range
      const customRange = {
        start: new Date("2026-01-01"),
        end: new Date("2026-01-15"),
      };
      act(() => {
        result.current.setCustomTimeRange(customRange);
      });

      expect(result.current.selectedTimeRange).toBe("custom");
      expect(result.current.customTimeRange).toEqual(customRange);

      // Now set a preset - should clear custom
      act(() => {
        result.current.setTimeRange("1h");
      });

      expect(result.current.selectedTimeRange).toBe("1h");
      expect(result.current.customTimeRange).toBeNull();
    });

    it("sets custom time range and switches to custom mode", () => {
      const { result } = renderHook(() => useApperioStore());

      const customRange = {
        start: new Date("2026-02-01"),
        end: new Date("2026-02-28"),
      };

      act(() => {
        result.current.setCustomTimeRange(customRange);
      });

      expect(result.current.selectedTimeRange).toBe("custom");
      expect(result.current.customTimeRange).toEqual(customRange);
    });

    it("setting null custom range reverts to 24h", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setCustomTimeRange({
          start: new Date(),
          end: new Date(),
        });
      });

      expect(result.current.selectedTimeRange).toBe("custom");

      act(() => {
        result.current.setCustomTimeRange(null);
      });

      expect(result.current.selectedTimeRange).toBe("24h");
    });
  });

  // ============================================
  // Environment filter
  // ============================================

  describe("environment", () => {
    it("defaults to all", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.selectedEnvironment).toBe("all");
    });

    it("sets environment filter", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setSelectedEnvironment("production");
      });

      expect(result.current.selectedEnvironment).toBe("production");
    });
  });

  // ============================================
  // Auto-refresh
  // ============================================

  describe("autoRefresh", () => {
    it("defaults to disabled with 30s interval", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.autoRefreshEnabled).toBe(false);
      expect(result.current.autoRefreshInterval).toBe(30000);
    });

    it("toggles auto-refresh", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.toggleAutoRefresh();
      });

      expect(result.current.autoRefreshEnabled).toBe(true);

      act(() => {
        result.current.toggleAutoRefresh();
      });

      expect(result.current.autoRefreshEnabled).toBe(false);
    });

    it("sets auto-refresh interval", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setAutoRefreshInterval(60000);
      });

      expect(result.current.autoRefreshInterval).toBe(60000);
    });
  });

  // ============================================
  // UI state
  // ============================================

  describe("UI state", () => {
    it("sidebar defaults to expanded", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it("toggles sidebar", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarCollapsed).toBe(false);
    });

    it("sets sidebar collapsed state directly", () => {
      const { result } = renderHook(() => useApperioStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it("manages detail panel state", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.detailPanelOpen).toBe(false);

      act(() => {
        result.current.setDetailPanelOpen(true);
      });

      expect(result.current.detailPanelOpen).toBe(true);
    });

    it("manages theme", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.theme).toBe("dark");

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.theme).toBe("light");
    });
  });

  // ============================================
  // Legacy filters
  // ============================================

  describe("legacy filters", () => {
    it("manages filter level", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.filterLevel).toBe("all");

      act(() => {
        result.current.setFilterLevel("error");
      });

      expect(result.current.filterLevel).toBe("error");
    });

    it("manages search query", () => {
      const { result } = renderHook(() => useApperioStore());
      expect(result.current.searchQuery).toBe("");

      act(() => {
        result.current.setSearchQuery("TypeError");
      });

      expect(result.current.searchQuery).toBe("TypeError");
    });
  });

  // ============================================
  // Reset
  // ============================================

  describe("reset", () => {
    it("resets all state to initial values", () => {
      const { result } = renderHook(() => useApperioStore());

      // Change various state values
      act(() => {
        result.current.setCurrentUser({ id: "u1", email: "test@test.com" });
        result.current.setCurrentProjectId("proj_123");
        result.current.setTimeRange("7d");
        result.current.setSelectedEnvironment("production");
        result.current.setAutoRefreshEnabled(true);
        result.current.setSidebarCollapsed(true);
        result.current.setTheme("light");
        result.current.setFilterLevel("error");
        result.current.setSearchQuery("test");
      });

      // Verify state was changed
      expect(result.current.currentUser).not.toBeNull();
      expect(result.current.selectedTimeRange).toBe("7d");

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify all values are back to defaults
      expect(result.current.currentUser).toBeNull();
      expect(result.current.currentProjectId).toBeNull();
      expect(result.current.selectedTimeRange).toBe("24h");
      expect(result.current.customTimeRange).toBeNull();
      expect(result.current.selectedEnvironment).toBe("all");
      expect(result.current.autoRefreshEnabled).toBe(false);
      expect(result.current.autoRefreshInterval).toBe(30000);
      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.detailPanelOpen).toBe(false);
      expect(result.current.theme).toBe("dark");
      expect(result.current.filterLevel).toBe("all");
      expect(result.current.searchQuery).toBe("");
    });
  });
});
