import {
  DocsContent,
  DocH2,
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
  { id: "auth-methods", title: "Authentication Methods", level: 2 },
  { id: "jwt-auth", title: "JWT Authentication", level: 2 },
  { id: "api-key-auth", title: "API Key Authentication", level: 2 },
  { id: "oauth", title: "OAuth Authentication", level: 2 },
  { id: "signup", title: "User Signup", level: 2 },
  { id: "login", title: "User Login", level: 2 },
  { id: "error-codes", title: "Error Codes", level: 2 },
];

export default function ApiAuthenticationPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="api/authentication"
        title="Authentication"
        description="JWT tokens, API keys, and OAuth for securing API access."
      >
        <DocH2 id="auth-methods">Authentication Methods</DocH2>
        <DocP>
          Apperio supports three authentication methods depending on the use
          case:
        </DocP>
        <DocTable
          headers={["Method", "Used For", "Header"]}
          rows={[
            [
              <DocStrong key="jwt">JWT Token</DocStrong>,
              "Dashboard API access, data queries",
              <InlineCode key="jh">Authorization: Bearer &lt;token&gt;</InlineCode>,
            ],
            [
              <DocStrong key="api">API Key</DocStrong>,
              "SDK log ingestion",
              <InlineCode key="ah">X-API-Key: &lt;key&gt;</InlineCode>,
            ],
            [
              <DocStrong key="oauth">OAuth</DocStrong>,
              "Social login (GitHub, Google)",
              "Via OAuth flow",
            ],
          ]}
        />

        <DocH2 id="jwt-auth">JWT Authentication</DocH2>
        <DocP>
          Most API endpoints require a JWT token obtained by logging in. The
          token is sent in the <InlineCode>Authorization</InlineCode> header
          with a <InlineCode>Bearer</InlineCode> prefix.
        </DocP>
        <CodeBlock
          language="bash"
          code={`# Include JWT in requests
curl -X GET https://loghive-server.vercel.app/api/v1/projects \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`}
        />
        <CodeBlock
          language="typescript"
          filename="example.ts"
          code={`// JavaScript/TypeScript usage
const response = await fetch("https://loghive-server.vercel.app/api/v1/projects", {
  headers: {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json",
  },
});`}
        />
        <DocCallout type="info">
          JWT tokens expire after <DocStrong>10 hours</DocStrong>. After
          expiration, you need to log in again to get a new token.
        </DocCallout>

        <DocH2 id="api-key-auth">API Key Authentication</DocH2>
        <DocP>
          API keys are used by the SDK for log ingestion. Each project has a
          unique API key that can be regenerated from the dashboard.
        </DocP>
        <CodeBlock
          language="bash"
          code={`# Send logs with API key
curl -X POST https://loghive-server.vercel.app/api/v1/PROJECT_ID/logs \\
  -H "X-API-Key: your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "timestamp": "2026-03-07T10:30:00Z",
    "level": "info",
    "message": "Test log entry"
  }'`}
        />
        <DocP>
          API keys only grant access to the log ingestion endpoint for the
          specific project. They cannot be used to query data or manage
          settings.
        </DocP>

        <DocH2 id="oauth">OAuth Authentication</DocH2>
        <DocP>
          Apperio supports OAuth login via GitHub and Google. The OAuth flow
          is handled by the frontend and backend together:
        </DocP>
        <EndpointBlock
          method="POST"
          path="/api/v1/users/oauth/login"
          description="Authenticate via OAuth provider"
        />
        <CodeBlock
          language="json"
          code={`// Request body
{
  "provider": "github",  // or "google"
  "code": "oauth_authorization_code",
  "redirectUri": "https://loghive.vercel.app/callback"
}

// Response
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}`}
        />

        <DocH2 id="signup">User Signup</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/users/signup"
          description="Register a new user account"
        />
        <CodeBlock
          language="bash"
          code={`curl -X POST https://loghive-server.vercel.app/api/v1/users/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePassword123"
  }'`}
        />
        <CodeBlock
          language="json"
          code={`// Response (201 Created)
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "abc123",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}`}
        />

        <DocH2 id="login">User Login</DocH2>
        <EndpointBlock
          method="POST"
          path="/api/v1/users/login"
          description="Authenticate and receive a JWT token"
        />
        <CodeBlock
          language="bash"
          code={`curl -X POST https://loghive-server.vercel.app/api/v1/users/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane@example.com",
    "password": "securePassword123"
  }'`}
        />
        <CodeBlock
          language="json"
          code={`// Response (200 OK)
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "abc123",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}`}
        />

        <DocH2 id="error-codes">Error Codes</DocH2>
        <DocTable
          headers={["Status", "Code", "Description"]}
          rows={[
            ["401", "UNAUTHORIZED", "Missing or invalid authentication token"],
            ["401", "TOKEN_EXPIRED", "JWT token has expired (10hr limit)"],
            ["403", "FORBIDDEN", "Valid token but insufficient permissions"],
            ["403", "INVALID_API_KEY", "API key does not match any project"],
            ["429", "RATE_LIMITED", "Too many requests (default: 100/min)"],
          ]}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
