// Time Ranges
export type TimeRange = "1h" | "24h" | "7d" | "30d" | "1w" | "1m";

// Granularity
export type Granularity = "hour" | "day" | "week";

// --- Error Analytics ---

export interface ErrorTimelinePoint {
  time: string;
  errors: number;
  warnings: number;
  fatal: number;
}

export interface TopError {
  message: string;
  count: number;
  lastSeen: string;
  affectedUsers: number;
  service: string;
  trend: "up" | "down" | "stable";
  hasMultipleStacks: boolean;
}

export interface ErrorDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ErrorStats {
  totalErrors: number;
  errorRate: number;
  affectedUsers: number;
  mttr: number;
  changes: {
    totalErrors: string;
    errorRate: string;
    affectedUsers: string;
    mttr: string;
  };
}

export interface ErrorDetails {
  message: string;
  occurrences: any[]; // Define more specific type if needed
  stats: {
    count: number;
    firstSeen: string;
    lastSeen: string;
    affectedUsers: number;
    services: string[];
    environments: string[];
    urls: string[];
  };
}

export interface ErrorTrend {
  time: string;
  total: number;
  errors: number;
  uniqueErrorCount: number;
  errorRate: number;
}

// --- Performance Analytics ---

export interface PerformanceTimelinePoint {
  time: string;
  lcp: number;
  fcp: number;
  ttfb: number;
  cls: number;
}

export interface WebVitalsSummary {
  lcp: { p75: number; avg: number };
  fcp: { p75: number; avg: number };
  cls: { p75: number; avg: number };
}

export interface ResourcePerformance {
  name: string;
  calls: number;
  avgDuration: number;
  p95: number;
  p99: number;
  errors: number;
}

export interface PagePerformance {
  page: string;
  views: number;
  loadTime: number;
  fcp: number;
  lcp: number;
  cls: number;
}

export interface PerformanceScore {
  score: number;
  grade: string;
  breakdown: {
    loadTime: { score: number; value: number };
    lcp: { score: number; value: number };
    fcp: { score: number; value: number };
    cls: { score: number; value: string | number };
  };
}

export interface SlowestEndpoint {
  url: string;
  method: string;
  avgDuration: number;
  maxDuration: number;
  calls: number;
}

// --- Activity Feed ---

export interface LogEntry {
  id: string; // Assuming logs have IDs
  timestamp: string; // ISO string
  level: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  eventType:
    | "error"
    | "performance"
    | "network"
    | "interaction"
    | "pageview"
    | "console";
  service: string;
  environment: string;
  message: string;
  userId?: string;
  url?: string;
}

export interface ActivityFeedResponse {
  status: string;
  data: LogEntry[];
  meta: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface ActivityStats {
  trace: number;
  debug: number;
  info: number;
  warn: number;
  error: number;
  fatal: number;
}

export interface ActivityFiltersValues {
  levels: string[];
  eventTypes: string[];
  services: string[];
  environments: string[];
}

// --- Session Analytics ---

export interface Session {
  id: string;
  userId: string;
  startTime: string;
  duration: number; // seconds
  pageViews: number;
  events: number;
  hasErrors: boolean;
  device: string;
  browser: string;
  country?: string;
  entryPage?: string;
  exitPage?: string;
  endTime?: string;
}

export interface SessionsResponse {
  status: string;
  data: Session[];
  meta: {
    current: number;
    total: number;
    count: number;
  };
}

export interface SessionEvent {
  type: "pageview" | "interaction" | "network" | "error";
  timestamp: string;
  url?: string;
  message?: string;
  data?: any;
  action?: string;
  element?: string;
  method?: string;
  status?: number;
  duration?: number;
}

export interface SessionStats {
  totalSessions: number;
  avgDuration: number;
  avgPageViews: number;
  sessionsWithErrors: number;
}

export interface UserJourney {
  journey: string[];
  count: number;
}

// --- Cross Dashboard ---

export interface OverviewStats {
  errors: ErrorStats;
  performance: PerformanceScore;
  activity: ActivityStats;
  sessions: SessionStats;
}

export interface Alert {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  status: "active" | "resolved";
  service: string;
  environment: string;
}
