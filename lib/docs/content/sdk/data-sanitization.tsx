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
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "pii-patterns", title: "PII Detection Patterns", level: 2 },
  { id: "presets", title: "Presets", level: 2 },
  { id: "custom-rules", title: "Custom Rules", level: 2 },
  { id: "audit-trail", title: "Audit Trail", level: 2 },
  { id: "url-sanitization", title: "URL Sanitization", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
];

export default function DataSanitizationPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/data-sanitization"
        title="Data Sanitization"
        description="PII detection, redaction, and privacy protection built into the SDK."
      >
        <DocH2 id="overview">Overview</DocH2>
        <DocP>
          Apperio includes a built-in data sanitizer that automatically detects
          and redacts Personally Identifiable Information (PII) before log
          data leaves the browser. This ensures sensitive data never reaches
          your logging backend.
        </DocP>
        <DocP>
          Sanitization runs on all log data automatically when enabled (the
          default). It supports 10+ detection patterns out of the box and
          can be extended with custom rules.
        </DocP>

        <DocCallout type="info">
          Sanitization happens <DocStrong>client-side</DocStrong> before any
          data is transmitted. Sensitive values are replaced with redaction
          markers like <InlineCode>[EMAIL_REDACTED]</InlineCode> and never
          sent to the server.
        </DocCallout>

        <DocH2 id="pii-patterns">PII Detection Patterns</DocH2>
        <DocP>
          The SDK detects the following PII patterns by default:
        </DocP>
        <DocTable
          headers={["Pattern", "Example Input", "Redacted Output"]}
          rows={[
            [
              "Email addresses",
              "user@example.com",
              "[EMAIL_REDACTED]",
            ],
            [
              "Social Security Numbers",
              "123-45-6789",
              "[SSN_REDACTED]",
            ],
            [
              "Credit card numbers",
              "4111-1111-1111-1111",
              "[CREDIT_CARD_REDACTED]",
            ],
            [
              "Phone numbers",
              "+1 (555) 123-4567",
              "[PHONE_REDACTED]",
            ],
            [
              "API keys",
              "sk_live_abc123xyz",
              "[API_KEY_REDACTED]",
            ],
            [
              "JWT tokens",
              "eyJhbGciOiJIUzI1NiJ9...",
              "[JWT_REDACTED]",
            ],
            [
              "IP addresses",
              "192.168.1.100",
              "[IP_REDACTED]",
            ],
            [
              "AWS access keys",
              "AKIA1234567890ABCDEF",
              "[AWS_KEY_REDACTED]",
            ],
            [
              "Password fields",
              'password: "secret123"',
              'password: "[PASSWORD_REDACTED]"',
            ],
            [
              "Authorization headers",
              "Bearer eyJhbGci...",
              "Bearer [TOKEN_REDACTED]",
            ],
          ]}
        />

        <DocH2 id="presets">Presets</DocH2>
        <DocP>
          Three presets control how aggressively the sanitizer operates:
        </DocP>

        <DocH3 id="strict">STRICT</DocH3>
        <DocP>
          Maximum protection. Detects all patterns including partial matches
          and ambiguous values. Best for healthcare, finance, and regulated
          environments.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "...",
  apiKey: "...",
  sanitization: {
    enabled: true,
    preset: "STRICT",
  },
});`}
        />

        <DocH3 id="balanced">BALANCED (Default)</DocH3>
        <DocP>
          Sensible defaults for most applications. Catches common PII patterns
          with high confidence while minimizing false positives.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// BALANCED is the default - no explicit config needed
Apperio.init({
  projectId: "...",
  apiKey: "...",
  // sanitization.preset defaults to "BALANCED"
});`}
        />

        <DocH3 id="lenient">LENIENT</DocH3>
        <DocP>
          Minimal sanitization. Only catches high-confidence matches like
          full SSN patterns, Luhn-valid credit card numbers, and explicit
          API key formats. Suitable for internal tools where PII risk is low.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "...",
  apiKey: "...",
  sanitization: {
    enabled: true,
    preset: "LENIENT",
  },
});`}
        />

        <DocH2 id="custom-rules">Custom Rules</DocH2>
        <DocP>
          Add custom sanitization rules to handle domain-specific sensitive
          data:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "...",
  apiKey: "...",
  sanitization: {
    enabled: true,
    preset: "BALANCED",
    customRules: [
      {
        // Redact internal employee IDs
        pattern: /EMP-\d{6}/g,
        replacement: "[EMPLOYEE_ID_REDACTED]",
        description: "Internal employee identifier",
      },
      {
        // Redact medical record numbers
        pattern: /MRN-[A-Z]{2}\d{8}/g,
        replacement: "[MRN_REDACTED]",
        description: "Medical record number",
      },
      {
        // Redact custom API tokens
        pattern: /myapp_[a-zA-Z0-9]{32}/g,
        replacement: "[CUSTOM_TOKEN_REDACTED]",
        description: "Application-specific API token",
      },
    ],
  },
});`}
        />

        <DocCallout type="warning">
          Custom rules are applied in addition to the preset patterns, not
          instead of them. To disable built-in patterns entirely, set{" "}
          <InlineCode>{"sanitization.enabled = false"}</InlineCode> and handle
          sanitization manually.
        </DocCallout>

        <DocH2 id="audit-trail">Audit Trail</DocH2>
        <DocP>
          When sanitization redacts data, it creates an audit trail entry
          recording what was sanitized without revealing the original value.
          This helps with compliance and debugging.
        </DocP>
        <CodeBlock
          language="json"
          code={`{
  "message": "User profile loaded",
  "data": {
    "name": "John Doe",
    "email": "[EMAIL_REDACTED]",
    "phone": "[PHONE_REDACTED]"
  },
  "metadata": {
    "sanitization": {
      "fieldsRedacted": 2,
      "patterns": ["email", "phone"],
      "timestamp": "2026-03-07T10:30:00Z"
    }
  }
}`}
        />

        <DocP>
          The audit trail is included in the log entry's metadata, so you can
          search for sanitized entries in the dashboard and understand what
          types of PII your application is handling.
        </DocP>

        <DocH2 id="url-sanitization">URL Sanitization</DocH2>
        <DocP>
          Network request URLs are automatically sanitized to remove
          potentially sensitive query parameters:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Before sanitization:
// GET /api/users?token=abc123&api_key=sk_live_xyz

// After sanitization:
// GET /api/users?token=[REDACTED]&api_key=[REDACTED]`}
        />
        <DocP>
          Common parameter names that are redacted include:{" "}
          <InlineCode>token</InlineCode>, <InlineCode>api_key</InlineCode>,{" "}
          <InlineCode>secret</InlineCode>, <InlineCode>password</InlineCode>,{" "}
          <InlineCode>auth</InlineCode>, and <InlineCode>session</InlineCode>.
        </DocP>

        <DocH2 id="configuration">Configuration</DocH2>
        <DocP>
          Full sanitization configuration reference:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`interface SanitizationConfig {
  // Enable/disable sanitization entirely
  enabled: boolean;          // default: true

  // Preset level of detection
  preset: "STRICT" | "BALANCED" | "LENIENT";  // default: "BALANCED"

  // Additional custom rules
  customRules?: Array<{
    pattern: RegExp;         // Regex pattern to match
    replacement: string;     // Replacement string
    description?: string;    // Human-readable description
  }>;
}`}
        />

        <DocCallout type="tip">
          In development, you may want to disable sanitization to see full
          data for debugging. Use environment-based configuration to enable
          sanitization only in production:
        </DocCallout>

        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "...",
  apiKey: "...",
  sanitization: {
    enabled: process.env.NODE_ENV === "production",
    preset: "STRICT",
  },
});`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
