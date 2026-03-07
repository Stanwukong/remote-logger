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
  { id: "full-config", title: "Full Configuration", level: 2 },
  { id: "required-options", title: "Required Options", level: 2 },
  { id: "optional-options", title: "Optional Options", level: 2 },
  { id: "auto-capture-config", title: "Auto-Capture Settings", level: 2 },
  { id: "sanitization-presets", title: "Sanitization Presets", level: 2 },
  { id: "batching-config", title: "Batching Configuration", level: 2 },
  { id: "examples", title: "Configuration Examples", level: 2 },
];

export default function SdkConfigurationPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/configuration"
        title="Configuration"
        description="Complete reference for all Monita SDK configuration options."
      >
        <DocH2 id="full-config">Full Configuration</DocH2>
        <DocP>
          The <InlineCode>Monita.init()</InlineCode> method accepts a
          configuration object with the following shape:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`interface LoggerConfig {
  // Required
  projectId: string;
  apiKey: string;

  // Optional - General
  environment?: string;          // default: "production"
  service?: string;              // Service/app name tag
  apiEndpoint?: string;          // default: "https://loghive-server.vercel.app/api/v1"
  logLevel?: LogLevel;           // Minimum level to capture: "trace" | "debug" | "info" | "warn" | "error" | "fatal"

  // Optional - Batching
  batchSize?: number;            // default: 10
  flushInterval?: number;        // default: 5000 (ms)
  maxRetries?: number;           // default: 3
  maxBufferSize?: number;        // default: 1000

  // Optional - Auto-capture
  autoCapture?: {
    errors?: boolean;            // default: true
    performance?: boolean;       // default: true
    network?: boolean;           // default: true
    console?: boolean;           // default: false
    pageviews?: boolean;         // default: true
    interactions?: boolean;      // default: false
  };

  // Optional - Data sanitization
  sanitization?: {
    enabled?: boolean;           // default: true
    preset?: "STRICT" | "BALANCED" | "LENIENT";  // default: "BALANCED"
    customRules?: SanitizationRule[];
  };
}`}
        />

        <DocH2 id="required-options">Required Options</DocH2>
        <DocTable
          headers={["Option", "Type", "Description"]}
          rows={[
            [
              <InlineCode key="pid">projectId</InlineCode>,
              <InlineCode key="pidt">string</InlineCode>,
              "Your project's unique identifier from the Monita dashboard",
            ],
            [
              <InlineCode key="ak">apiKey</InlineCode>,
              <InlineCode key="akt">string</InlineCode>,
              "API key for authenticating requests (found in project settings)",
            ],
          ]}
        />

        <DocH2 id="optional-options">Optional Options</DocH2>
        <DocTable
          headers={["Option", "Default", "Description"]}
          rows={[
            [
              <InlineCode key="env">environment</InlineCode>,
              <InlineCode key="envd">"production"</InlineCode>,
              "Environment tag attached to all log entries",
            ],
            [
              <InlineCode key="svc">service</InlineCode>,
              <InlineCode key="svcd">undefined</InlineCode>,
              "Optional service name for multi-service architectures",
            ],
            [
              <InlineCode key="api">apiEndpoint</InlineCode>,
              "Production URL",
              "Override the API endpoint for self-hosted or local development",
            ],
            [
              <InlineCode key="ll">logLevel</InlineCode>,
              <InlineCode key="lld">"trace"</InlineCode>,
              "Minimum severity level to capture. Logs below this level are discarded.",
            ],
          ]}
        />

        <DocH2 id="auto-capture-config">Auto-Capture Settings</DocH2>
        <DocP>
          Auto-capture controls which browser events the SDK instruments
          automatically. Each can be toggled independently:
        </DocP>
        <DocTable
          headers={["Setting", "Default", "What It Captures"]}
          rows={[
            [
              <InlineCode key="err">errors</InlineCode>,
              <InlineCode key="errd">true</InlineCode>,
              "window.onerror and unhandledrejection events",
            ],
            [
              <InlineCode key="perf">performance</InlineCode>,
              <InlineCode key="perfd">true</InlineCode>,
              "PerformanceObserver entries (LCP, FID, CLS, TTFB, INP)",
            ],
            [
              <InlineCode key="net">network</InlineCode>,
              <InlineCode key="netd">true</InlineCode>,
              "XMLHttpRequest and Fetch API calls with timing data",
            ],
            [
              <InlineCode key="con">console</InlineCode>,
              <InlineCode key="cond">false</InlineCode>,
              "Intercepts console.log, console.warn, console.error",
            ],
            [
              <InlineCode key="pv">pageviews</InlineCode>,
              <InlineCode key="pvd">true</InlineCode>,
              "Page load events and History API navigation",
            ],
            [
              <InlineCode key="int">interactions</InlineCode>,
              <InlineCode key="intd">false</InlineCode>,
              "Click events on elements and form submissions",
            ],
          ]}
        />

        <DocCallout type="info">
          Console capture is disabled by default to avoid recursive loops
          (the SDK itself uses console methods internally). Enable it only
          if you need to track console output from your application.
        </DocCallout>

        <DocH2 id="sanitization-presets">Sanitization Presets</DocH2>
        <DocP>
          The SDK includes built-in PII detection and redaction. Three presets
          control the aggressiveness of sanitization:
        </DocP>
        <DocTable
          headers={["Preset", "Patterns Detected", "Best For"]}
          rows={[
            [
              <DocStrong key="s">STRICT</DocStrong>,
              "All 10+ patterns including partial matches",
              "Healthcare, finance, and highly regulated industries",
            ],
            [
              <DocStrong key="b">BALANCED</DocStrong>,
              "Common PII: emails, SSNs, credit cards, API keys",
              "Most applications (default)",
            ],
            [
              <DocStrong key="l">LENIENT</DocStrong>,
              "Only high-confidence matches (full SSNs, credit cards)",
              "Internal tools with low PII risk",
            ],
          ]}
        />

        <CodeBlock
          language="typescript"
          code={`Monita.init({
  projectId: "...",
  apiKey: "...",
  sanitization: {
    enabled: true,
    preset: "STRICT",
    customRules: [
      {
        pattern: /INTERNAL-\\d{6}/g,
        replacement: "[INTERNAL_ID]",
        description: "Redact internal reference numbers",
      },
    ],
  },
});`}
        />

        <DocH2 id="batching-config">Batching Configuration</DocH2>
        <DocP>
          Fine-tune how the SDK batches and delivers log entries:
        </DocP>
        <DocTable
          headers={["Option", "Default", "Description"]}
          rows={[
            [
              <InlineCode key="bs">batchSize</InlineCode>,
              <InlineCode key="bsd">10</InlineCode>,
              "Number of logs to accumulate before sending a batch",
            ],
            [
              <InlineCode key="fi">flushInterval</InlineCode>,
              <InlineCode key="fid">5000</InlineCode>,
              "Maximum time (ms) between batch sends",
            ],
            [
              <InlineCode key="mr">maxRetries</InlineCode>,
              <InlineCode key="mrd">3</InlineCode>,
              "Number of retry attempts for failed requests",
            ],
            [
              <InlineCode key="mb">maxBufferSize</InlineCode>,
              <InlineCode key="mbd">1000</InlineCode>,
              "Maximum logs held in memory (oldest dropped when exceeded)",
            ],
          ]}
        />

        <DocH2 id="examples">Configuration Examples</DocH2>
        <DocH3 id="dev-config">Development</DocH3>
        <CodeBlock
          language="typescript"
          code={`Monita.init({
  projectId: "dev-project",
  apiKey: "dev-key",
  environment: "development",
  apiEndpoint: "http://localhost:5000/api/v1",
  logLevel: "trace",            // Capture everything
  autoCapture: {
    errors: true,
    performance: true,
    network: true,
    console: true,              // Capture console in dev
    pageviews: true,
    interactions: true,         // Track clicks in dev
  },
});`}
        />

        <DocH3 id="prod-config">Production</DocH3>
        <CodeBlock
          language="typescript"
          code={`Monita.init({
  projectId: process.env.MONITA_PROJECT_ID,
  apiKey: process.env.MONITA_API_KEY,
  environment: "production",
  service: "web-app",
  logLevel: "info",             // Skip trace/debug in prod
  batchSize: 20,                // Larger batches for efficiency
  flushInterval: 10000,         // Less frequent flushes
  autoCapture: {
    errors: true,
    performance: true,
    network: true,
    console: false,             // Skip console in prod
    pageviews: true,
    interactions: false,
  },
  sanitization: {
    enabled: true,
    preset: "STRICT",
  },
});`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
