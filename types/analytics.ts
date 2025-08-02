export interface LogEntry {
  id: string
  projectId: string
  timestamp: string
  level: "trace" | "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  data?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
    url?: string
    lineNumber?: number
    columnNumber?: number
  }
  service?: string
  environment?: string
  context?: Record<string, any>
  eventType?: "error" | "performance" | "interaction" | "network" | "console" | "pageview"
  userAgent?: string
  url?: string
  referrer?: string
}

export interface Project {
  id: string
  name: string
  environment: string
  status: "healthy" | "warning" | "critical"
  lastEvent: string
  errorCount: number
  totalEvents: number
  errorRate: number
  avgResponseTime: number
  uptime: number
  activeUsers: number
  avgPageLoad: number
}

export interface ErrorSummary {
  id: string
  type: string
  message: string
  count: number
  affectedProjects: string[]
  lastSeen: string
  trend: "up" | "down" | "stable"
}

export interface MetricData {
  timestamp: string
  value: number
  label?: string
}

export interface ChartDataPoint {
  timestamp: string
  errors: number
  warnings: number
  info: number
  performance: number
  network: number
}

export interface LogFilters {
  level?: LogEntry['level'] | 'all';
  source?: string;
  service?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface LogSummary {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  uniqueServices: number;
  timeRange: {
    from: string;
    to: string;
  };
}

export interface LogTrends {
  timeRange: string;
  data: Array<{
    timestamp: string;
    total: number;
    error: number;
    warn: number;
    info: number;
    debug: number;
  }>;
}

export interface UniqueError {
  message: string;
  count: number;
  lastOccurred: string;
  firstOccurred: string;
  affectedServices: string[];
}

export type TimeRange = "24h" | "7d" | "30d" | "custom"
export type Environment = "production" | "staging" | "development" | "all"


const generateMockLogs = (seed?: number, count: number = 20): LogEntry[] => {
  // Updated mockLevels to include "fatal"
  const mockLevels: LogEntry["level"][] = ["info", "warn", "error", "debug", "trace", "fatal"];
  const mockProjects = ["web-app", "api-service", "mobile-app", "analytics", "auth-service"];
  const mockServices = ["frontend", "backend", "database", "cache", "queue", "auth"];
  const mockEventTypes: NonNullable<LogEntry["eventType"]>[] = ["error", "performance", "interaction", "network", "console", "pageview"];
  const messages = [
    "User login successful",
    "Failed to fetch data from API",
    "Database connection established",
    "Image upload failed: file too large",
    "New user registered",
    "Payment processed successfully",
    "Invalid input received for form",
    "Service health check passed",
    "Rate limit exceeded for user",
    "Cache hit for user profile",
    "Unhandled promise rejection",
    "Background job completed",
    "Authentication token expired",
    "Resource not found: /api/v1/users/123",
    "Performance bottleneck detected in rendering",
    "Critical system failure detected", // Added a message for fatal errors
  ];

  const logs: LogEntry[] = [];
  const random = (s: number) => {
    let x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    const currentSeed = seed ? seed + i : i;
    const rand = (max: number) => Math.floor(random(currentSeed + max) * max);

    const timestamp = new Date(Date.now() - rand(1000 * 60 * 60 * 24 * 30)).toISOString(); // Last 30 days
    const level = mockLevels[rand(mockLevels.length)];
    const projectId = mockProjects[rand(mockProjects.length)];
    const service = mockServices[rand(mockServices.length)];
    const message = messages[rand(messages.length)];
    const id = `log-${currentSeed}-${Date.now()}`;

    const log: LogEntry = {
      id,
      projectId,
      timestamp,
      level,
      message,
      service: rand(2) === 0 ? service : undefined, // Sometimes no service
      environment: rand(2) === 0 ? "production" : "development",
      userAgent: rand(2) === 0 ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36" : undefined,
      url: rand(2) === 0 ? `https://example.com/path/${rand(100)}` : undefined,
      referrer: rand(2) === 0 ? `https://referrer.com/page/${rand(50)}` : undefined,
      eventType: rand(2) === 0 ? mockEventTypes[rand(mockEventTypes.length)] : undefined,
    };

    // Generate error details more frequently for 'error' and 'fatal' levels
    if ((level === "error" || level === "fatal") && rand(2) === 0) {
      log.error = {
        name: level === "fatal" ? "FatalError" : "TypeError",
        message: level === "fatal" ? "Application crashed due to unrecoverable error" : "Cannot read properties of undefined (reading 'map')",
        stack: `at Function.render (webpack://_N_E/./node_modules/next/dist/compiled/next-server/app-render.runtime.dev.js:1:13098)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async Promise.all (index 0)\n    at async doRender (webpack://_N_E/./node_modules/next/dist/compiled/next-server/app-render.runtime.dev.js:1:13500)`,
        url: `/src/components/MyComponent.js`,
        lineNumber: rand(500),
        columnNumber: rand(100),
      };
    }

    if (rand(2) === 0) {
      log.data = {
        userId: `user-${rand(1000)}`,
        sessionId: `session-${rand(10000)}`,
        ipAddress: `192.168.1.${rand(255)}`,
      };
    }

    if (rand(2) === 0) {
      log.context = {
        component: `Component${rand(20)}`,
        function: `handleAction${rand(15)}`,
        requestId: `req-${rand(99999)}`,
      };
    }

    logs.push(log);
  }
  return logs;
};