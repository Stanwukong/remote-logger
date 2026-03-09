import {
  IntegrationMarketplaceItem,
  IntegrationTypeSlug,
  IntegrationFieldDef,
} from "@/types/integration.types";

/**
 * Field definitions for each integration type.
 * These tell the setup wizard which form fields to render.
 */
const fieldsByType: Record<IntegrationTypeSlug, IntegrationFieldDef[]> = {
  github: [
    {
      key: "accessToken",
      label: "Personal Access Token",
      type: "password",
      placeholder: "ghp_xxxxxxxxxxxx",
      helpText: "Generate a token at GitHub > Settings > Developer Settings > Personal access tokens. Needs 'repo' scope.",
      required: true,
    },
    {
      key: "repo",
      label: "Repository",
      type: "text",
      placeholder: "owner/repo",
      helpText: "The repository where issues will be created (e.g. acme/frontend).",
      required: true,
    },
  ],
  jira: [
    {
      key: "baseUrl",
      label: "Jira Base URL",
      type: "url",
      placeholder: "https://your-domain.atlassian.net",
      helpText: "Your Atlassian domain URL.",
      required: true,
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      placeholder: "you@company.com",
      helpText: "The email associated with your Atlassian account.",
      required: true,
    },
    {
      key: "accessToken",
      label: "API Token",
      type: "password",
      placeholder: "Enter your Jira API token",
      helpText: "Generate at id.atlassian.com > Security > API tokens.",
      required: true,
    },
    {
      key: "project",
      label: "Project Key",
      type: "text",
      placeholder: "PROJ",
      helpText: "The Jira project key where issues will be created.",
      required: true,
    },
  ],
  pagerduty: [
    {
      key: "accessToken",
      label: "Integration Key",
      type: "password",
      placeholder: "Enter your PagerDuty integration key",
      helpText: "Also called the routing key. Found under PagerDuty > Services > Integrations > Events API v2.",
      required: true,
    },
    {
      key: "serviceId",
      label: "Service ID",
      type: "text",
      placeholder: "PXXXXXX",
      helpText: "Optional. The PagerDuty service ID to associate incidents with.",
      required: false,
    },
  ],
  discord: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      placeholder: "https://discord.com/api/webhooks/...",
      helpText: "Create a webhook in Discord > Server Settings > Integrations > Webhooks.",
      required: true,
    },
  ],
  teams: [
    {
      key: "webhookUrl",
      label: "Incoming Webhook URL",
      type: "url",
      placeholder: "https://outlook.office.com/webhook/...",
      helpText: "Create an incoming webhook connector in your Teams channel settings.",
      required: true,
    },
  ],
  linear: [
    {
      key: "accessToken",
      label: "API Key",
      type: "password",
      placeholder: "lin_api_xxxxxxxxxxxx",
      helpText: "Generate at linear.app > Settings > API > Personal API keys.",
      required: true,
    },
    {
      key: "teamId",
      label: "Team ID",
      type: "text",
      placeholder: "Enter your Linear team ID",
      helpText: "Optional. The default team where issues will be created. Find it in Linear > Settings > Teams.",
      required: false,
    },
  ],
};

/**
 * Icon names (lucide-react) used as proxies for brand icons.
 */
const iconByType: Record<IntegrationTypeSlug, string> = {
  github: "Github",
  jira: "Ticket",
  pagerduty: "Siren",
  discord: "MessageSquare",
  teams: "MessagesSquare",
  linear: "LineChart",
};

/**
 * Static marketplace data that augments the dynamic data from the API.
 * Merge with the `IntegrationType[]` returned by `GET /available`.
 */
export function buildMarketplaceItems(
  apiTypes: Array<{
    type: string;
    displayName: string;
    description: string;
    category: string;
    requiredFields: string[];
    optionalFields: string[];
    supportedActions: string[];
  }>
): IntegrationMarketplaceItem[] {
  return apiTypes.map((t) => {
    const slug = t.type as IntegrationTypeSlug;
    return {
      ...t,
      type: slug,
      slug,
      category: t.category as IntegrationMarketplaceItem["category"],
      iconName: iconByType[slug] || "Plug",
      fields: fieldsByType[slug] || [],
    };
  });
}

/**
 * Fallback marketplace data when the API is not yet available.
 */
export const fallbackMarketplaceItems: IntegrationMarketplaceItem[] = [
  {
    type: "github",
    slug: "github",
    displayName: "GitHub",
    description: "Create issues and track bugs directly in your GitHub repositories from Apperio alerts.",
    category: "issue_tracking",
    requiredFields: ["accessToken", "repo"],
    optionalFields: [],
    supportedActions: ["create_issue"],
    iconName: "Github",
    fields: fieldsByType.github,
  },
  {
    type: "jira",
    slug: "jira",
    displayName: "Jira",
    description: "Create Jira tickets automatically from Apperio alerts and errors for seamless issue tracking.",
    category: "issue_tracking",
    requiredFields: ["accessToken", "baseUrl", "email", "project"],
    optionalFields: [],
    supportedActions: ["create_ticket"],
    iconName: "Ticket",
    fields: fieldsByType.jira,
  },
  {
    type: "pagerduty",
    slug: "pagerduty",
    displayName: "PagerDuty",
    description: "Trigger and resolve PagerDuty incidents automatically from Apperio alerts for on-call management.",
    category: "incident_management",
    requiredFields: ["accessToken"],
    optionalFields: ["serviceId"],
    supportedActions: ["trigger_incident", "resolve_incident"],
    iconName: "Siren",
    fields: fieldsByType.pagerduty,
  },
  {
    type: "discord",
    slug: "discord",
    displayName: "Discord",
    description: "Send alert notifications and error reports to your Discord channels via webhooks.",
    category: "communication",
    requiredFields: ["webhookUrl"],
    optionalFields: [],
    supportedActions: ["send_notification"],
    iconName: "MessageSquare",
    fields: fieldsByType.discord,
  },
  {
    type: "teams",
    slug: "teams",
    displayName: "Microsoft Teams",
    description: "Send alert notifications and incident reports to Microsoft Teams channels via incoming webhooks.",
    category: "communication",
    requiredFields: ["webhookUrl"],
    optionalFields: [],
    supportedActions: ["send_notification"],
    iconName: "MessagesSquare",
    fields: fieldsByType.teams,
  },
  {
    type: "linear",
    slug: "linear",
    displayName: "Linear",
    description: "Create Linear issues from Apperio alerts for streamlined project management and bug tracking.",
    category: "issue_tracking",
    requiredFields: ["accessToken"],
    optionalFields: ["teamId"],
    supportedActions: ["create_issue"],
    iconName: "LineChart",
    fields: fieldsByType.linear,
  },
];

/**
 * Category display names and descriptions.
 */
export const integrationCategories = [
  { key: "all", label: "All Integrations" },
  { key: "issue_tracking", label: "Issue Tracking" },
  { key: "incident_management", label: "Incident Management" },
  { key: "communication", label: "Communication" },
] as const;

/**
 * Get the fields definition for a given integration type slug.
 */
export function getFieldsForType(type: IntegrationTypeSlug): IntegrationFieldDef[] {
  return fieldsByType[type] || [];
}
