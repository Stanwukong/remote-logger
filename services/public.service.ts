import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

/**
 * Public API client — no authentication headers.
 * Used for status and changelog pages that are accessible without login.
 */
const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Types
// ============================================

export interface ComponentStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  description: string;
  responseTime?: number;
}

export interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  createdAt: string;
  updatedAt: string;
  updates: Array<{ message: string; status: string; timestamp: string }>;
}

export interface UptimeMetrics {
  last24h: number;
  last7d: number;
  last30d: number;
  last90d: number;
}

export interface SystemStatus {
  status: "operational" | "degraded" | "outage";
  components: ComponentStatus[];
  incidents: Incident[];
  uptime: UptimeMetrics;
  checkedAt: string;
}

export interface ChangelogEntry {
  _id: string;
  version: string;
  title: string;
  date: string;
  category: "feature" | "improvement" | "bugfix" | "security" | "performance";
  description: string;
  highlights: string[];
  author?: string;
  createdAt: string;
}

export interface ChangelogMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChangelogParams {
  page?: number;
  limit?: number;
  category?: string;
}

// ============================================
// PUBLIC SERVICE
// ============================================

export const publicService = {
  /**
   * Get system status — no auth required.
   */
  getStatus: async (): Promise<SystemStatus> => {
    const response = await publicClient.get<{
      status: string;
      data: SystemStatus;
    }>("/public/status");
    return response.data.data;
  },

  /**
   * Get changelog entries — no auth required.
   */
  getChangelog: async (
    params?: ChangelogParams
  ): Promise<{ entries: ChangelogEntry[]; meta: ChangelogMeta }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.category) searchParams.append("category", params.category);

    const response = await publicClient.get<{
      status: string;
      data: ChangelogEntry[];
      meta: ChangelogMeta;
    }>(`/public/changelog?${searchParams.toString()}`);

    return {
      entries: response.data.data,
      meta: response.data.meta,
    };
  },
};
