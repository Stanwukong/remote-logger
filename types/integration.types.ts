export type IntegrationTypeSlug =
  | "github"
  | "jira"
  | "pagerduty"
  | "discord"
  | "teams"
  | "linear";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export type IntegrationCategory =
  | "issue_tracking"
  | "incident_management"
  | "communication";

/**
 * Metadata about an available integration type (from GET /available).
 */
export interface IntegrationType {
  type: IntegrationTypeSlug;
  displayName: string;
  description: string;
  category: IntegrationCategory;
  requiredFields: string[];
  optionalFields: string[];
  supportedActions: string[];
}

/**
 * A connected integration record from the backend.
 */
export interface Integration {
  _id: string;
  organizationId?: string;
  projectId?: string;
  type: IntegrationTypeSlug;
  status: IntegrationStatus;
  config: IntegrationConfig;
  metadata: IntegrationMetadata;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfig {
  accessToken?: string;
  refreshToken?: string;
  webhookUrl?: string;
  baseUrl?: string;
  repo?: string;
  project?: string;
  serviceId?: string;
  channelId?: string;
  teamId?: string;
  email?: string;
}

export interface IntegrationMetadata {
  installationId?: string;
  workspaceName?: string;
  lastSyncAt?: string;
  syncErrors?: string[];
}

export interface ConnectIntegrationPayload {
  config: Record<string, string>;
  projectId?: string;
  organizationId?: string;
}

export interface IntegrationActionPayload {
  action: string;
  payload: Record<string, any>;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
}

export interface IntegrationActionResult {
  success: boolean;
  data?: any;
  message?: string;
}

/**
 * Field definitions for integration setup form rendering.
 */
export interface IntegrationFieldDef {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  placeholder: string;
  helpText?: string;
  required: boolean;
}

/**
 * Static integration metadata for the marketplace (icons, field definitions, etc.)
 */
export interface IntegrationMarketplaceItem extends IntegrationType {
  slug: IntegrationTypeSlug;
  iconName: string;
  fields: IntegrationFieldDef[];
}
