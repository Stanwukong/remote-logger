// Alert Rules and Events Types

export interface AlertRule {
  _id: string;
  name: string;
  projectId: string;
  condition: {
    level: string;
    keyword: number;
    frequency?: number;
    intervalMinutes: number;
  };
  isActive: boolean;
  notifyChannels: string[];
  notificationConfig?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AlertEvent {
  _id: string;
  projectId: string;
  ruleId: string;
  ruleName: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  status: "active" | "acknowledged" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  count: number;
  metadata?: any;
  notes?: string;
}

export interface CreateAlertRuleData {
  name: string;
  projectId: string;
  condition: {
    level: string;
    keyword: number;
    frequency?: number;
    intervalMinutes: number;
  };
  isActive?: boolean;
  notifyChannels?: string[];
  notificationConfig?: Record<string, any>;
}

export interface UpdateAlertRuleData {
  name?: string;
  condition?: {
    level: string;
    keyword: number;
    frequency?: number;
    intervalMinutes: number;
  };
  isActive?: boolean;
  notifyChannels?: string[];
  notificationConfig?: Record<string, any>;
}

export interface AlertEventFilters {
  status?: "active" | "acknowledged" | "resolved";
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface AcknowledgeAlertData {
  acknowledgedBy?: string;
  notes?: string;
}
