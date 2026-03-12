export type AnomalyType =
  | "log_volume_spike"
  | "error_rate_increase"
  | "response_time_degradation"
  | "error_spike";

export type AnomalySeverity = "critical" | "warning" | "info";

export interface Anomaly {
  _id: string;
  projectId: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  metric: string;
  currentValue: number;
  baselineValue: number;
  deviation: number;
  percentChange: number;
  description: string;
  detectedAt: string;
  resolvedAt: string | null;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  metadata: Record<string, any>;
}

export interface AnomalyFilters {
  type?: AnomalyType;
  severity?: AnomalySeverity;
  acknowledged?: boolean;
  resolved?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AnomalyStats {
  total: number;
  openCritical: number;
  openWarnings: number;
  openInfo: number;
  resolvedToday: number;
  byType: Record<AnomalyType, number>;
}
