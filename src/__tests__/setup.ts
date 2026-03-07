import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";

// ============================================
// Mock Next.js navigation
// ============================================

const pushMock = vi.fn();
const replaceMock = vi.fn();
const backMock = vi.fn();
const prefetchMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    back: backMock,
    prefetch: prefetchMock,
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

// ============================================
// Mock Next.js Link component
// ============================================

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) => {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return `<a href="${href}" ${Object.entries(props)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ")}>${children}</a>`;
  },
}));

// ============================================
// Mock next-themes
// ============================================

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
    resolvedTheme: "dark",
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ============================================
// Mock window.matchMedia
// ============================================

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ============================================
// Mock ResizeObserver
// ============================================

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = MockResizeObserver as any;

// ============================================
// Mock IntersectionObserver
// ============================================

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

window.IntersectionObserver = MockIntersectionObserver as any;

// ============================================
// Reset mocks between tests
// ============================================

beforeEach(() => {
  pushMock.mockClear();
  replaceMock.mockClear();
  backMock.mockClear();
  prefetchMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================
// Suppress specific console warnings in tests
// ============================================

const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Suppress React act() warnings and known harmless warnings
  if (
    typeof args[0] === "string" &&
    (args[0].includes("act(") ||
      args[0].includes("Not implemented: HTMLFormElement") ||
      args[0].includes("Error: Uncaught"))
  ) {
    return;
  }
  originalConsoleError(...args);
};
