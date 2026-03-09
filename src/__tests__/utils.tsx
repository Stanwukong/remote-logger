import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

// ============================================
// Test Query Client
// ============================================

/**
 * Creates a fresh QueryClient for each test with aggressive defaults
 * to prevent flaky tests (no retries, no caching).
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// ============================================
// All Providers Wrapper
// ============================================

interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

function AllProviders({ children, queryClient }: AllProvidersProps) {
  const client = queryClient ?? createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// ============================================
// Custom render
// ============================================

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

/**
 * Custom render that wraps components with all required providers
 * (QueryClient, etc.) for testing.
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AllProviders queryClient={queryClient}>{children}</AllProviders>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: queryClient ?? createTestQueryClient(),
  };
}

// ============================================
// Mock API Client
// ============================================

/**
 * Creates a mock API client that mirrors the real apiClient interface
 * but returns predictable responses for testing.
 */
export function createMockApiClient() {
  return {
    get: vi.fn().mockResolvedValue({ data: { status: "success", data: null } }),
    post: vi
      .fn()
      .mockResolvedValue({ data: { status: "success", data: null } }),
    put: vi.fn().mockResolvedValue({ data: { status: "success", data: null } }),
    delete: vi
      .fn()
      .mockResolvedValue({ data: { status: "success", data: null } }),
    patch: vi
      .fn()
      .mockResolvedValue({ data: { status: "success", data: null } }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
}

// ============================================
// Mock WebSocket
// ============================================

/**
 * Creates a mock WebSocket instance for testing real-time features.
 */
export function createMockWebSocket() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Callback = (...args: any[]) => void;
  const listeners: Record<string, Callback[]> = {};

  return {
    url: "ws://localhost:5000",
    readyState: 1, // OPEN
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn((event: string, callback: Callback) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    }),
    removeEventListener: vi.fn((event: string, callback: Callback) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((cb) => cb !== callback);
      }
    }),
    // Test helper: simulate receiving a message
    simulateMessage: (data: any) => {
      listeners["message"]?.forEach((cb) =>
        cb({ data: JSON.stringify(data) })
      );
    },
    // Test helper: simulate connection close
    simulateClose: () => {
      listeners["close"]?.forEach((cb) => cb({ code: 1000, reason: "Normal" }));
    },
    // Test helper: simulate error
    simulateError: (error: any) => {
      listeners["error"]?.forEach((cb) => cb(error));
    },
  };
}

// ============================================
// Test Data Factories
// ============================================

/**
 * Creates a mock project object for testing.
 */
export function createMockProject(overrides: Record<string, any> = {}) {
  return {
    _id: "proj_test_123",
    name: "Test Project",
    description: "A test project for unit tests",
    isActive: true,
    environment: "development",
    apiKey: "test-api-key-123",
    owner: "user_test_123",
    teamMembers: [],
    metrics: {
      logCount: 100,
      errorCount: 5,
      healthScore: 85,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    ...overrides,
  };
}

/**
 * Creates a mock log entry for testing.
 */
export function createMockLogEntry(overrides: Record<string, any> = {}) {
  return {
    _id: "log_test_123",
    projectId: "proj_test_123",
    timestamp: "2026-03-01T12:00:00.000Z",
    level: "info" as const,
    message: "Test log message",
    service: "test-service",
    environment: "development",
    eventType: "console" as const,
    ...overrides,
  };
}

/**
 * Creates a mock user object for testing.
 */
export function createMockUser(overrides: Record<string, any> = {}) {
  return {
    _id: "user_test_123",
    email: "test@apperio.dev",
    firstName: "Test",
    lastName: "User",
    role: "user",
    ...overrides,
  };
}

// ============================================
// Wait Utilities
// ============================================

/**
 * Waits for a specified number of milliseconds.
 * Useful for testing async behavior.
 */
export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Re-export everything from testing-library
export { render, screen, fireEvent, waitFor as waitForDOM } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
