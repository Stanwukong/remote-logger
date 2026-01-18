// sdk-config.types.ts
// ============================================
// SDK CONFIGURATION TYPES
// ============================================

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export type StrictMode = "LENIENT" | "BALANCED" | "STRICT";
export type RuleSeverity = "low" | "medium" | "high" | "critical";
export type RuleCategory = "pii" | "financial" | "authentication" | "custom";

/**
 * Auto-capture configuration for SDK
 */
export interface AutoCaptureConfig {
  errors: boolean;
  performance: boolean;
  userInteractions: boolean;
  networkRequests: boolean;
  consoleMessages: boolean;
  pageViews: boolean;
}

/**
 * Custom sanitization rule
 */
export interface CustomRule {
  pattern: string;
  replacement: string;
  description: string;
  severity: RuleSeverity;
  category: RuleCategory;
}

/**
 * Retention policy configuration
 */
export interface RetentionPolicy {
  maxAge: number; // in days
  maxSize: number; // in MB
  autoDelete: boolean;
  archiveBeforeDelete: boolean;
}

/**
 * Preset sanitization configuration
 */
export interface PresetConfig {
  auditEnabled: boolean;
  anonymizationEnabled: boolean;
  sensitiveFields: string[];
  retentionPolicy: RetentionPolicy;
}

/**
 * Data sanitization configuration
 */
export interface SanitizationConfig {
  enabled: boolean;
  strictMode: StrictMode;
  presetConfig: PresetConfig;
  customRules: CustomRule[];
}

/**
 * Main SDK Configuration interface
 */
export interface SDKConfig {
  projectId: string;
  minLogLevel: LogLevel;
  batchSize: number;
  flushIntervalMs: number;
  environment?: string;
  serviceName?: string;
  autoCapture: AutoCaptureConfig;
  sanitization: SanitizationConfig;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Default SDK configuration
 */
export const DEFAULT_SDK_CONFIG: Omit<SDKConfig, "projectId"> = {
  minLogLevel: "info",
  batchSize: 10,
  flushIntervalMs: 5000,
  environment: "",
  serviceName: "",
  autoCapture: {
    errors: true,
    performance: true,
    userInteractions: false,
    networkRequests: true,
    consoleMessages: false,
    pageViews: true,
  },
  sanitization: {
    enabled: true,
    strictMode: "BALANCED",
    presetConfig: {
      auditEnabled: false,
      anonymizationEnabled: false,
      sensitiveFields: [],
      retentionPolicy: {
        maxAge: 30,
        maxSize: 10,
        autoDelete: false,
        archiveBeforeDelete: false,
      },
    },
    customRules: [],
  },
};
