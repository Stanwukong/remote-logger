import {
  DocsContent,
  DocH2,
  DocP,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  EndpointBlock,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "create-log", title: "Create Log Entry", level: 2 },
  { id: "query-logs", title: "Query Logs", level: 2 },
  { id: "get-log", title: "Get Single Log", level: 2 },
  { id: "log-summary", title: "Log Summary", level: 2 },
  { id: "log-trends", title: "Log Trends", level: 2 },
  { id: "unique-errors", title: "Unique Errors", level: 2 },
  { id: "delete-logs", title: "Delete Logs", level: 2 },
  { id: "log-schema", title: "Log Entry Schema", level: 2 },
];

export default function ApiLogsPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="api/logs"
        title="Logs API"
        description="Endpoints for log ingestion, querying, filtering, and analysis."
      >
        <DocH2 id="create-log">Create Log Entry</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/:projectId/logs"
          description="Ingest a log entry (API Key auth)"
        />
        <DocP>
          This is the primary ingestion endpoint used by the SDK. Requires API
          key authentication via the <InlineCode>X-API-Key</InlineCode> header.
        </DocP>
        <CodeBlock
          language="bash"
          code={`curl -X POST https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "timestamp": "2026-03-07T10:30:00.000Z",
    "level": "error",
    "message": "Database connection timeout",
    "service": "api-gateway",
    "environment": "production",
    "error": {
      "name": "MongoTimeoutError",
      "message": "Connection timed out after 30000ms",
      "stack": "MongoTimeoutError: Connection timed out..."
    },
    "data": {
      "host": "db.example.com",
      "port": 27017,
      "retryCount": 3
    }
  }'`}
        />
        <CodeBlock
          language="json"
          code={`// Response (201 Created)
{
  "status": "success",
  "message": "Log created successfully",
  "data": {
    "id": "log_abc123",
    "projectId": "PROJECT_ID",
    "timestamp": "2026-03-07T10:30:00.000Z",
    "level": "error",
    "message": "Database connection timeout"
  }
}`}
        />

        <DocH2 id="query-logs">Query Logs</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/:projectId/logs"
          description="Query logs with filters and pagination (JWT auth)"
        />
        <DocP>
          Retrieve logs with full filtering, search, and pagination support.
        </DocP>
        <DocTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            [
              <InlineCode key="p">page</InlineCode>,
              "number",
              "Page number (default: 1)",
            ],
            [
              <InlineCode key="l">limit</InlineCode>,
              "number",
              "Results per page (default: 50, max: 100)",
            ],
            [
              <InlineCode key="lv">level</InlineCode>,
              "string",
              "Filter by level (trace, debug, info, warn, error, fatal)",
            ],
            [
              <InlineCode key="s">search</InlineCode>,
              "string",
              "Full-text search on message field",
            ],
            [
              <InlineCode key="sf">startDate</InlineCode>,
              "string",
              "ISO date for range start",
            ],
            [
              <InlineCode key="ef">endDate</InlineCode>,
              "string",
              "ISO date for range end",
            ],
            [
              <InlineCode key="et">eventType</InlineCode>,
              "string",
              "Filter by event type",
            ],
            [
              <InlineCode key="svc">service</InlineCode>,
              "string",
              "Filter by service name",
            ],
            [
              <InlineCode key="env">environment</InlineCode>,
              "string",
              "Filter by environment",
            ],
            [
              <InlineCode key="sb">sortBy</InlineCode>,
              "string",
              "Sort field (default: timestamp)",
            ],
            [
              <InlineCode key="so">sortOrder</InlineCode>,
              "string",
              "asc or desc (default: desc)",
            ],
          ]}
        />
        <CodeBlock
          language="bash"
          code={`# Get recent error logs
curl "https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs?level=error&limit=20" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search logs with date range
curl "https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs?search=timeout&startDate=2026-03-01&endDate=2026-03-07" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />
        <CodeBlock
          language="json"
          code={`// Response (200 OK)
{
  "status": "success",
  "data": [
    {
      "id": "log_abc123",
      "timestamp": "2026-03-07T10:30:00Z",
      "level": "error",
      "message": "Database connection timeout",
      "service": "api-gateway",
      "environment": "production"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalRecords": 156
  }
}`}
        />

        <DocH2 id="get-log">Get Single Log</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/:projectId/logs/:logId"
          description="Get a specific log entry by ID (JWT auth)"
        />
        <CodeBlock
          language="bash"
          code={`curl "https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs/LOG_ID" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />

        <DocH2 id="log-summary">Log Summary</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/:projectId/logs/summary"
          description="Get aggregated log statistics (JWT auth)"
        />
        <DocP>
          Returns counts grouped by level, event type, and time period:
        </DocP>
        <CodeBlock
          language="json"
          code={`// Response
{
  "status": "success",
  "data": {
    "totalLogs": 15420,
    "byLevel": {
      "trace": 1200,
      "debug": 3400,
      "info": 8500,
      "warn": 1800,
      "error": 490,
      "fatal": 30
    },
    "byEventType": {
      "error": 520,
      "performance": 2100,
      "network": 8400,
      "console": 1200,
      "pageview": 3200
    }
  }
}`}
        />

        <DocH2 id="log-trends">Log Trends</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/:projectId/logs/trends"
          description="Get log volume trends over time (JWT auth)"
        />
        <DocTable
          headers={["Parameter", "Type", "Description"]}
          rows={[
            [
              <InlineCode key="tr">timeRange</InlineCode>,
              "string",
              'Time range: "1h", "24h", "7d", "30d"',
            ],
            [
              <InlineCode key="gr">granularity</InlineCode>,
              "string",
              '"minute", "hour", "day"',
            ],
          ]}
        />

        <DocH2 id="unique-errors">Unique Errors</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/:projectId/logs/unique-errors"
          description="Get unique error messages with counts (JWT auth)"
        />
        <DocP>
          Returns deduplicated error messages grouped by frequency, useful for
          identifying the most impactful issues.
        </DocP>

        <DocH2 id="delete-logs">Delete Logs</DocH2>
        <EndpointBlock
          method="DELETE"
          path="/api/v1/:projectId/logs"
          description="Delete logs matching filters (JWT auth)"
        />
        <DocCallout type="danger">
          This is a destructive operation. Deleted logs cannot be recovered.
          Use filters to target specific logs for deletion.
        </DocCallout>
        <CodeBlock
          language="bash"
          code={`# Delete all debug logs older than 7 days
curl -X DELETE "https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs?level=debug&endDate=2026-02-28" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />

        <DocH2 id="log-schema">Log Entry Schema</DocH2>
        <DocP>
          Complete schema for a log entry:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`interface LogEntry {
  projectId: string;
  timestamp: string;              // ISO 8601 format
  level: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  data?: Record<string, any>;     // Arbitrary structured data
  error?: {
    name: string;
    message: string;
    stack?: string;
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  service?: string;               // Service name tag
  environment?: string;           // e.g., "production", "staging"
  context?: Record<string, any>;  // Request/session context
  metadata?: any;                 // SDK metadata (sanitization info, etc.)
  eventType?: "error" | "performance" | "interaction"
             | "network" | "console" | "pageview";
  userAgent?: string;
  url?: string;                   // Page URL
  referrer?: string;
  responseTime?: number;          // For network events (ms)
}`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
