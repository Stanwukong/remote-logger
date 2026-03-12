import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// ============================================
// Mock next/navigation with controllable state
// ============================================

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = "/dashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

// ============================================
// Mock Zustand store with controllable state
// ============================================

let mockStoreTimeRange = "24h";
let mockCustomTimeRange: { start: Date; end: Date } | null = null;
const mockSetTimeRange = vi.fn((range: string) => {
  mockStoreTimeRange = range;
});
const mockSetCustomTimeRange = vi.fn((range: any) => {
  mockCustomTimeRange = range;
});

vi.mock("@/store/apperio-store", () => ({
  useApperioStore: (selector: any) =>
    selector({
      selectedTimeRange: mockStoreTimeRange,
      setTimeRange: mockSetTimeRange,
      customTimeRange: mockCustomTimeRange,
      setCustomTimeRange: mockSetCustomTimeRange,
    }),
}));

// Import after mocks
import { useTimeRange } from "@/hooks/useTimeRange";

describe("useTimeRange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreTimeRange = "24h";
    mockCustomTimeRange = null;
    mockSearchParams = new URLSearchParams();
    mockPathname = "/dashboard";
    mockReplace.mockClear();
  });

  it("returns the default time range (24h)", () => {
    const { result } = renderHook(() => useTimeRange());

    expect(result.current.timeRange).toBe("24h");
    expect(result.current.customTimeRange).toBeNull();
  });

  it("setTimeRange updates the store and navigates", () => {
    const { result } = renderHook(() => useTimeRange());

    act(() => {
      result.current.setTimeRange("7d");
    });

    expect(mockSetTimeRange).toHaveBeenCalledWith("7d");
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("timeRange=7d"),
      { scroll: false }
    );
  });

  it("setTimeRange removes URL param for default 24h", () => {
    mockStoreTimeRange = "7d";
    mockSearchParams = new URLSearchParams("timeRange=7d");

    const { result } = renderHook(() => useTimeRange());

    act(() => {
      result.current.setTimeRange("24h");
    });

    expect(mockSetTimeRange).toHaveBeenCalledWith("24h");
    // When setting 24h (the default), the timeRange param should be removed from URL
    expect(mockReplace).toHaveBeenCalledWith("/dashboard", { scroll: false });
  });

  it("getTimeRangeParams returns correct date range for preset", () => {
    const { result } = renderHook(() => useTimeRange());

    const params = result.current.getTimeRangeParams();

    expect(params).toHaveProperty("startDate");
    expect(params).toHaveProperty("endDate");

    // startDate should be ~24h ago
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Should be approximately 24 hours (allow 1 minute tolerance)
    expect(diffHours).toBeGreaterThan(23.9);
    expect(diffHours).toBeLessThan(24.1);
  });

  it("getTimeRangeParams returns correct range for 1h", () => {
    mockStoreTimeRange = "1h";

    const { result } = renderHook(() => useTimeRange());

    const params = result.current.getTimeRangeParams();
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    expect(diffHours).toBeGreaterThan(0.9);
    expect(diffHours).toBeLessThan(1.1);
  });

  it("getTimeRangeParams returns correct range for 7d", () => {
    mockStoreTimeRange = "7d";

    const { result } = renderHook(() => useTimeRange());

    const params = result.current.getTimeRangeParams();
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    expect(diffDays).toBeGreaterThan(6.9);
    expect(diffDays).toBeLessThan(7.1);
  });

  it("getTimeRangeParams returns correct range for 30d", () => {
    mockStoreTimeRange = "30d";

    const { result } = renderHook(() => useTimeRange());

    const params = result.current.getTimeRangeParams();
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    expect(diffDays).toBeGreaterThan(29.9);
    expect(diffDays).toBeLessThan(30.1);
  });

  it("getTimeRangeParams uses custom range when set", () => {
    const customStart = new Date("2026-01-01T00:00:00.000Z");
    const customEnd = new Date("2026-01-15T00:00:00.000Z");
    mockStoreTimeRange = "custom";
    mockCustomTimeRange = { start: customStart, end: customEnd };

    const { result } = renderHook(() => useTimeRange());

    const params = result.current.getTimeRangeParams();

    expect(params.startDate).toBe(customStart.toISOString());
    expect(params.endDate).toBe(customEnd.toISOString());
  });

  it("preserves existing search params when setting time range", () => {
    mockSearchParams = new URLSearchParams("level=error&service=api");
    mockPathname = "/projects/p1/logs";

    const { result } = renderHook(() => useTimeRange());

    act(() => {
      result.current.setTimeRange("6h");
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("level=error"),
      { scroll: false }
    );
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("service=api"),
      { scroll: false }
    );
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("timeRange=6h"),
      { scroll: false }
    );
  });
});
