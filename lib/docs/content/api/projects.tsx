import {
  DocsContent,
  DocH2,
  DocH3,
  DocP,
  DocStrong,
  DocCallout,
  DocTable,
  CodeBlock,
  EndpointBlock,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "list-projects", title: "List Projects", level: 2 },
  { id: "create-project", title: "Create Project", level: 2 },
  { id: "get-project", title: "Get Project", level: 2 },
  { id: "update-project", title: "Update Project", level: 2 },
  { id: "delete-project", title: "Delete Project", level: 2 },
  { id: "api-key-management", title: "API Key Management", level: 2 },
  { id: "team-management", title: "Team Management", level: 2 },
  { id: "project-stats", title: "Project Statistics", level: 2 },
];

export default function ApiProjectsPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="api/projects"
        title="Projects API"
        description="Create, manage, and configure projects and team members."
      >
        <DocH2 id="overview">Overview</DocH2>
        <DocP>
          Projects are the top-level organizational unit in Monita. Each
          project has its own API key, log data, team members, and
          configuration. All project endpoints require JWT authentication.
        </DocP>

        <DocH2 id="list-projects">List Projects</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/projects"
          description="Get all projects owned by or shared with the authenticated user"
        />
        <CodeBlock
          language="bash"
          code={`curl "https://loghive-server.vercel.app/api/v1/projects" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />
        <CodeBlock
          language="json"
          code={`// Response (200 OK)
{
  "status": "success",
  "data": [
    {
      "id": "proj_abc123",
      "name": "My Web App",
      "description": "Production web application",
      "environment": "production",
      "logCount": 15420,
      "errorRate": 2.3,
      "status": "active",
      "createdAt": "2026-01-15T08:00:00Z"
    }
  ]
}`}
        />

        <DocH2 id="create-project">Create Project</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/projects"
          description="Create a new project"
        />
        <CodeBlock
          language="bash"
          code={`curl -X POST "https://loghive-server.vercel.app/api/v1/projects" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My New App",
    "description": "Staging environment for my app",
    "environment": "staging"
  }'`}
        />
        <CodeBlock
          language="json"
          code={`// Response (201 Created)
{
  "status": "success",
  "data": {
    "id": "proj_xyz789",
    "name": "My New App",
    "description": "Staging environment for my app",
    "apiKey": "mk_a1b2c3d4e5f6...",
    "owner": "user_abc123",
    "status": "active",
    "createdAt": "2026-03-07T10:30:00Z"
  }
}`}
        />

        <DocCallout type="info">
          The API key is returned only when the project is created. Store
          it securely. You can regenerate it later, but the old key will
          stop working immediately.
        </DocCallout>

        <DocH2 id="get-project">Get Project</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/projects/:id"
          description="Get project details by ID"
        />

        <DocH2 id="update-project">Update Project</DocH2>
        <EndpointBlock
          method="PUT"
          path="/api/v1/projects/:id"
          description="Update project settings"
        />
        <CodeBlock
          language="bash"
          code={`curl -X PUT "https://loghive-server.vercel.app/api/v1/projects/PROJ_ID" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Updated App Name",
    "description": "Updated description"
  }'`}
        />

        <DocH2 id="delete-project">Delete Project</DocH2>
        <EndpointBlock
          method="DELETE"
          path="/api/v1/projects/:id"
          description="Delete a project and all its data"
        />
        <DocCallout type="danger">
          Deleting a project permanently removes all associated logs, alert
          rules, and configuration. This action cannot be undone.
        </DocCallout>

        <DocH2 id="api-key-management">API Key Management</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/projects/:id/regenerate-api-key"
          description="Generate a new API key (invalidates the old one)"
        />
        <CodeBlock
          language="bash"
          code={`curl -X POST "https://loghive-server.vercel.app/api/v1/projects/PROJ_ID/regenerate-api-key" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        />
        <CodeBlock
          language="json"
          code={`// Response
{
  "status": "success",
  "data": {
    "apiKey": "mk_new_key_here..."
  }
}`}
        />
        <DocCallout type="warning">
          Regenerating an API key immediately invalidates the previous key.
          Update your SDK configuration with the new key to avoid log
          ingestion failures.
        </DocCallout>

        <DocH2 id="team-management">Team Management</DocH2>

        <DocH3 id="add-member">Add Team Member</DocH3>
        <EndpointBlock
          method="POST"
          path="/api/v1/projects/:projectId/team-members"
          description="Invite a user to the project"
        />
        <CodeBlock
          language="json"
          code={`// Request body
{
  "email": "teammate@example.com",
  "role": "admin"  // "admin" or "viewer"
}`}
        />

        <DocH3 id="update-role">Update Member Role</DocH3>
        <EndpointBlock
          method="PUT"
          path="/api/v1/projects/:projectId/team-members/role"
          description="Change a team member's role"
        />

        <DocH3 id="remove-member">Remove Team Member</DocH3>
        <EndpointBlock
          method="DELETE"
          path="/api/v1/projects/:projectId/team-members"
          description="Remove a user from the project"
        />

        <DocTable
          headers={["Role", "Permissions"]}
          rows={[
            [
              <DocStrong key="o">Owner</DocStrong>,
              "Full access: settings, team, data, deletion",
            ],
            [
              <DocStrong key="a">Admin</DocStrong>,
              "Manage logs, alerts, and view settings",
            ],
            [
              <DocStrong key="v">Viewer</DocStrong>,
              "Read-only access to logs and dashboards",
            ],
          ]}
        />

        <DocH2 id="project-stats">Project Statistics</DocH2>
        <EndpointBlock
          method="GET"
          path="/api/v1/projects/:id/stats"
          description="Get aggregated project metrics"
        />
        <CodeBlock
          language="json"
          code={`// Response
{
  "status": "success",
  "data": {
    "totalLogs": 15420,
    "errorRate": 2.3,
    "averageResponseTime": 245,
    "logCountToday": 1230,
    "errorCountToday": 28,
    "topErrors": [
      { "message": "TypeError: Cannot read...", "count": 45 },
      { "message": "NetworkError: Failed...", "count": 23 }
    ]
  }
}`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
