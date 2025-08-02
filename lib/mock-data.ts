import type { LogEntry, Project, ErrorSummary, ChartDataPoint } from "@/types/analytics"

// Mock projects data
export const mockProjects: Project[] = [
  {
    id: "web-app",
    name: "Web Application",
    environment: "production",
    status: "healthy",
    lastEvent: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    errorCount: 23,
    totalEvents: 28400,
    errorRate: 1.8,
    avgResponseTime: 245,
    uptime: 99.9,
    activeUsers: 1247,
    avgPageLoad: 1200,
  },
  {
    id: "api-service",
    name: "API Service",
    environment: "production",
    status: "warning",
    lastEvent: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    errorCount: 45,
    totalEvents: 15600,
    errorRate: 2.9,
    avgResponseTime: 380,
    uptime: 99.5,
    activeUsers: 892,
    avgPageLoad: 850,
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    environment: "production",
    status: "critical",
    lastEvent: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    errorCount: 78,
    totalEvents: 9200,
    errorRate: 8.5,
    avgResponseTime: 1200,
    uptime: 97.2,
    activeUsers: 456,
    avgPageLoad: 2100,
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    environment: "production",
    status: "healthy",
    lastEvent: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    errorCount: 5,
    totalEvents: 3400,
    errorRate: 0.3,
    avgResponseTime: 180,
    uptime: 100,
    activeUsers: 23,
    avgPageLoad: 650,
  },
]

// Mock error summaries
export const mockErrorSummaries: ErrorSummary[] = [
  {
    id: "1",
    type: "TypeError",
    message: "Cannot read property 'id' of undefined",
    count: 156,
    affectedProjects: ["web-app", "mobile-app"],
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    trend: "up",
  },
  {
    id: "2",
    type: "NetworkError",
    message: "Failed to fetch user data",
    count: 89,
    affectedProjects: ["api-service"],
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    trend: "down",
  },
  {
    id: "3",
    type: "ReferenceError",
    message: "analytics is not defined",
    count: 67,
    affectedProjects: ["web-app"],
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    trend: "stable",
  },
  {
    id: "4",
    type: "ChunkLoadError",
    message: "Loading chunk 2 failed",
    count: 45,
    affectedProjects: ["web-app", "admin-panel"],
    lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    trend: "down",
  },
]

// Generate mock chart data
export const generateMockChartData = (hours = 24): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
    data.push({
      timestamp,
      errors: Math.floor(Math.random() * 50) + 10,
      warnings: Math.floor(Math.random() * 100) + 20,
      info: Math.floor(Math.random() * 200) + 50,
      performance: Math.floor(Math.random() * 30) + 5,
      network: Math.floor(Math.random() * 40) + 10,
    })
  }

  return data
}

// Generate mock log entries
export const generateMockLogs = (projectId?: string, count = 50): LogEntry[] => {
  const logs: LogEntry[] = []
  const projects = projectId ? [projectId] : mockProjects.map((p) => p.id)

  const errorTypes = ["TypeError", "ReferenceError", "NetworkError", "ChunkLoadError", "SyntaxError"]
  const services = ["frontend", "api", "auth", "payment", "notification"]
  const environments = ["production", "staging", "development"]
  const eventTypes: Array<keyof typeof messages> = ["error", "performance", "interaction", "network", "console", "pageview"]
  const levels: LogEntry["level"][] = ["trace", "debug", "info", "warn", "error", "fatal"]

  const messages = {
    error: [
      "Cannot read property 'id' of undefined",
      "Failed to fetch user data",
      "Network request failed",
      "Authentication token expired",
      "Database connection timeout",
    ],
    performance: [
      "Page load time exceeded threshold",
      "Large resource detected",
      "Slow database query",
      "Memory usage high",
      "CPU usage spike detected",
    ],
    network: [
      "API request completed successfully",
      "Request timeout",
      "Rate limit exceeded",
      "Invalid response format",
      "Connection refused",
    ],
    pageview: [
      "User navigated to dashboard",
      "Page view recorded",
      "Route change detected",
      "User session started",
      "Page refresh detected",
    ],
    interaction: ["Button clicked", "Form submitted", "Modal opened", "Tab switched", "Scroll event detected"],
    console: [
      "Console error captured",
      "Warning logged to console",
      "Debug information logged",
      "Deprecation warning",
      "Performance warning",
    ],
  }

  for (let i = 0; i < count; i++) {
    const projectId = projects[Math.floor(Math.random() * projects.length)]
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const environment = environments[Math.floor(Math.random() * environments.length)]

    const messageList = messages[eventType] || messages.error
    const message = messageList[Math.floor(Math.random() * messageList.length)]

    const log: LogEntry = {
      id: `log_${i}_${Date.now()}`,
      projectId,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      level,
      message,
      service,
      environment,
      eventType,
      url: `https://app.example.com/${Math.random().toString(36).substr(2, 8)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }

    // Add error details for error events
    if (eventType === "error" || level === "error") {
      log.error = {
        name: errorTypes[Math.floor(Math.random() * errorTypes.length)],
        message,
        stack: `Error: ${message}\n    at Object.handleClick (app.js:123:45)\n    at HTMLButtonElement.<anonymous> (app.js:456:78)`,
        url: log.url,
        lineNumber: Math.floor(Math.random() * 1000) + 1,
        columnNumber: Math.floor(Math.random() * 100) + 1,
      }
    }

    // Add performance data
    if (eventType === "performance") {
      log.data = {
        loadTime: Math.floor(Math.random() * 3000) + 500,
        resourceSize: Math.floor(Math.random() * 1000000) + 10000,
        cacheHit: Math.random() > 0.3,
      }
    }

    logs.push(log)
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Performance metrics mock data
export const mockPerformanceData = {
  coreWebVitals: {
    lcp: { good: 65, needsImprovement: 25, poor: 10 },
    fid: { good: 85, needsImprovement: 10, poor: 5 },
    cls: { good: 70, needsImprovement: 20, poor: 10 },
  },
  pagePerformance: [
    { url: "/dashboard", avgLoadTime: 1200, p95: 2100, p99: 3500, sessions: 1247, bounceRate: 12.5 },
    { url: "/projects", avgLoadTime: 890, p95: 1500, p99: 2200, sessions: 892, bounceRate: 8.3 },
    { url: "/analytics", avgLoadTime: 1450, p95: 2800, p99: 4200, sessions: 567, bounceRate: 15.2 },
    { url: "/settings", avgLoadTime: 650, p95: 1100, p99: 1800, sessions: 234, bounceRate: 6.7 },
  ],
  resources: [
    { name: "main.js", avgLoadTime: 450, size: 245000, cacheHitRate: 85 },
    { name: "vendor.js", avgLoadTime: 680, size: 890000, cacheHitRate: 92 },
    { name: "styles.css", avgLoadTime: 120, size: 45000, cacheHitRate: 95 },
    { name: "images/hero.jpg", avgLoadTime: 890, size: 156000, cacheHitRate: 78 },
  ],
}

// Network data
export const mockNetworkData = {
  endpoints: [
    { url: "/api/users", successRate: 98.5, avgResponseTime: 245, requests: 15600 },
    { url: "/api/projects", successRate: 99.2, avgResponseTime: 180, requests: 8900 },
    { url: "/api/analytics", successRate: 96.8, avgResponseTime: 420, requests: 5600 },
    { url: "/api/auth", successRate: 99.8, avgResponseTime: 95, requests: 12300 },
  ],
  statusCodes: {
    "200": 89.5,
    "201": 5.2,
    "400": 2.1,
    "401": 1.8,
    "404": 0.9,
    "500": 0.5,
  },
  failedRequests: [
    { url: "/api/users/123", error: "User not found", count: 45, lastSeen: "2 minutes ago" },
    { url: "/api/projects", error: "Database timeout", count: 23, lastSeen: "8 minutes ago" },
    { url: "/api/analytics", error: "Rate limit exceeded", count: 18, lastSeen: "15 minutes ago" },
  ],
}
