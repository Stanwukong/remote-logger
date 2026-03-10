import {
  DocsContent,
  DocH2,
  DocH3,
  DocP,
  DocStrong,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  EndpointBlock,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "alert-rules", title: "Alert Rules", level: 2 },
  { id: "create-rule", title: "Create Alert Rule", level: 2 },
  { id: "list-rules", title: "List Alert Rules", level: 2 },
  { id: "update-rule", title: "Update Alert Rule", level: 2 },
  { id: "delete-rule", title: "Delete Alert Rule", level: 2 },
  { id: "alert-events", title: "Alert Events", level: 2 },
  { id: "manage-events", title: "Manage Alert Events", level: 2 },
  { id: "notification-channels", title: "Notification Channels", level: 2 },
];

export default function ApiAlertsPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="api/alerts"
        title="Alerts API"
        description="Configure alert rules and manage alert events and notifications."
      >
        <DocH2 id="alert-rules">Alert Rules</DocH2>
        <DocP>
          Alert rules define conditions that trigger notifications. When a log
          entry matches a rule's conditions, an alert event is created and
          notifications are sent via configured channels.
        </DocP>

        <DocH2 id="create-rule">Create Alert Rule</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/alert-rules"
          description="Create a new alert rule"
        />
        <CodeBlock
          language="bash"
          code={`curl -X POST "https://apperioserver.onrender.com/api/v1/alert-rules" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "High Error Rate Alert",
    "projectId": "proj_abc123",
    "enabled": true,
    "conditions": {
      "level": "error",
      "threshold": 10,
      "timeWindow": "5m",
      "operator": "greaterThan"
    },
    "channels": {
      "email": true,
      "slack": true,
      "webhook": false
    },
    "cooldownMinutes": 15
  }'`}
        />
        <CodeBlock
          language="json"
          code={`// Response (201 Created)
{
  "status": "success",
  "data": {
    "id": "rule_xyz789",
    "name": "High Error Rate Alert",
    "projectId": "proj_abc123",
    "enabled": true,
    "conditions": {
      "level": "error",
      "threshold": 10,
      "timeWindow": "5m",
      "operator": "greaterThan"
    },
    "channels": {
      "email": true,
      "slack": true,
      "webhook": false
    },
    "cooldownMinutes": 15,
    "lastTriggered": null,
    "createdAt": "2026-03-07T10:30:00Z"
  }
}`}
        />

        <DocH2 id="list-rules">List Alert Rules</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/alert-rules/:projectId"
          description="Get all alert rules for a project"
        />
        <CodeBlock
          language="bash"
          code={`curl "https://apperioserver.onrender.com/api/v1/alert-rules/proj_abc123" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />

        <DocH2 id="update-rule">Update Alert Rule</DocH2>
        <EndpointBlock
          method="PUT"
          path="/api/v1/alert-rules/:id"
          description="Update an existing alert rule"
        />
        <CodeBlock
          language="bash"
          code={`curl -X PUT "https://apperioserver.onrender.com/api/v1/alert-rules/RULE_ID" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "enabled": false,
    "cooldownMinutes": 30
  }'`}
        />

        <DocH2 id="delete-rule">Delete Alert Rule</DocH2>
        <EndpointBlock
          method="DELETE"
          path="/api/v1/alert-rules/:id"
          description="Delete an alert rule"
        />

        <DocH2 id="alert-events">Alert Events</DocH2>
        <DocP>
          Alert events are created when log data matches a rule's conditions.
          Each event records when the alert fired, what triggered it, and
          its current status.
        </DocP>

        <EndpointBlock
          method="GET"
          path="/api/v1/alerts/:projectId"
          description="Get alert events for a project"
        />
        <CodeBlock
          language="json"
          code={`// Response
{
  "status": "success",
  "data": [
    {
      "id": "alert_001",
      "ruleId": "rule_xyz789",
      "ruleName": "High Error Rate Alert",
      "projectId": "proj_abc123",
      "status": "active",
      "triggeredAt": "2026-03-07T10:35:00Z",
      "triggerData": {
        "errorCount": 15,
        "timeWindow": "5m",
        "threshold": 10
      },
      "acknowledgedAt": null,
      "resolvedAt": null
    }
  ]
}`}
        />

        <EndpointBlock
          method="GET"
          path="/api/v1/alerts/stats"
          description="Get alert statistics across all projects"
        />

        <DocH2 id="manage-events">Manage Alert Events</DocH2>

        <DocH3 id="acknowledge">Acknowledge Alert</DocH3>
        <EndpointBlock
          method="POST"
          path="/api/v1/alerts/:alertId/acknowledge"
          description="Acknowledge an active alert"
        />

        <DocH3 id="update-status">Update Alert Status</DocH3>
        <EndpointBlock
          method="PATCH"
          path="/api/v1/alerts/:alertId/status"
          description="Update alert status (active, acknowledged, resolved)"
        />
        <CodeBlock
          language="json"
          code={`// Request body
{
  "status": "resolved"
}`}
        />

        <DocH3 id="bulk-update">Bulk Update</DocH3>
        <EndpointBlock
          method="PATCH"
          path="/api/v1/alerts/bulk-update"
          description="Update multiple alerts at once"
        />
        <CodeBlock
          language="json"
          code={`// Request body
{
  "alertIds": ["alert_001", "alert_002", "alert_003"],
  "status": "resolved"
}`}
        />

        <DocH3 id="auto-resolve">Auto-Resolve</DocH3>
        <EndpointBlock
          method="POST"
          path="/api/v1/alerts/auto-resolve"
          description="Auto-resolve alerts older than a specified time"
        />

        <DocH2 id="notification-channels">Notification Channels</DocH2>
        <DocP>
          Alert rules can notify through multiple channels:
        </DocP>
        <DocTable
          headers={["Channel", "Configuration", "Details"]}
          rows={[
            [
              <DocStrong key="e">Email</DocStrong>,
              "Automatic (uses account email)",
              "Sends email to project owner and admins",
            ],
            [
              <DocStrong key="s">Slack</DocStrong>,
              "Webhook URL in project settings",
              "Posts to configured Slack channel",
            ],
            [
              <DocStrong key="w">Webhook</DocStrong>,
              "Custom URL in project settings",
              "Sends POST request with alert payload",
            ],
          ]}
        />
        <DocP>
          Configure notification channels via the project integration
          settings:
        </DocP>
        <EndpointBlock
          method="PUT"
          path="/api/v1/projects/:projectId/integration-settings"
          description="Update Slack/webhook integration URLs"
        />
        <CodeBlock
          language="json"
          code={`// Request body
{
  "slackWebhookUrl": "https://hooks.slack.com/services/T.../B.../...",
  "webhookUrl": "https://your-app.com/api/apperio-webhook"
}`}
        />

        <DocCallout type="tip">
          Use the <InlineCode>cooldownMinutes</InlineCode> setting to prevent
          notification flooding. After an alert fires, the same rule will not
          trigger again until the cooldown period expires.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
