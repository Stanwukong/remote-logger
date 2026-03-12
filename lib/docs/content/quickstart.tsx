import {
  DocsContent,
  DocH2,
  DocP,
  DocStrong,
  DocCallout,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "install-the-sdk", title: "Step 1: Install the SDK", level: 2 },
  { id: "initialize-apperio", title: "Step 2: Initialize Apperio", level: 2 },
  { id: "send-your-first-log", title: "Step 3: Send Your First Log", level: 2 },
  { id: "view-in-dashboard", title: "Step 4: View in Dashboard", level: 2 },
  { id: "enable-auto-capture", title: "Step 5: Enable Auto-Capture", level: 2 },
  { id: "whats-next", title: "What's Next", level: 2 },
];

export default function QuickStartPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="quickstart"
        title="Quick Start"
        description="Get Apperio running in your application in under 5 minutes."
      >
        <DocCallout type="tip" title="Prerequisites">
          You need a Apperio account and a project. Sign up at{" "}
          <InlineCode>https://loghive.vercel.app</InlineCode> and create your
          first project to get an API key.
        </DocCallout>

        <DocH2 id="install-the-sdk">Step 1: Install the SDK</DocH2>
        <DocP>
          Install the <InlineCode>apperio</InlineCode> package from npm:
        </DocP>
        <CodeBlock language="bash" code="npm install apperio" />
        <DocP>Or use your preferred package manager:</DocP>
        <CodeBlock
          language="bash"
          code={`yarn add apperio
# or
pnpm add apperio`}
        />

        <DocH2 id="initialize-apperio">Step 2: Initialize Apperio</DocH2>
        <DocP>
          Import and initialize Apperio at the entry point of your application.
          You need your project ID and API key from the Apperio dashboard.
        </DocP>
        <CodeBlock
          language="typescript"
          filename="src/index.ts"
          code={`import Apperio from "apperio";

Apperio.init({
  projectId: "YOUR_PROJECT_ID",
  apiKey: "YOUR_API_KEY",
  environment: "production",
  autoCapture: {
    errors: true,
    performance: true,
    network: true,
    console: true,
  },
});`}
        />

        <DocCallout type="info">
          Replace <InlineCode>YOUR_PROJECT_ID</InlineCode> and{" "}
          <InlineCode>YOUR_API_KEY</InlineCode> with the values from your
          project settings page. You can find these under{" "}
          <DocStrong>Project Settings &gt; API Key</DocStrong>.
        </DocCallout>

        <DocH2 id="send-your-first-log">Step 3: Send Your First Log</DocH2>
        <DocP>
          Use the logging API to send events at any level. Apperio supports six
          log levels: <InlineCode>trace</InlineCode>,{" "}
          <InlineCode>debug</InlineCode>, <InlineCode>info</InlineCode>,{" "}
          <InlineCode>warn</InlineCode>, <InlineCode>error</InlineCode>, and{" "}
          <InlineCode>fatal</InlineCode>.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Simple info log
Apperio.info("Application started successfully");

// Log with structured data
Apperio.info("User signed in", {
  userId: "user_123",
  method: "oauth",
  provider: "github",
});

// Log an error with context
try {
  await fetchUserData();
} catch (err) {
  Apperio.error("Failed to fetch user data", {
    error: err,
    retryCount: 3,
  });
}`}
        />

        <DocH2 id="view-in-dashboard">Step 4: View in Dashboard</DocH2>
        <DocP>
          Open the Apperio dashboard at{" "}
          <InlineCode>https://loghive.vercel.app</InlineCode> and navigate to
          your project. You will see your logs appearing in real-time in the
          log stream view.
        </DocP>
        <DocP>
          The dashboard provides multiple views for your data:
        </DocP>
        <CodeBlock
          language="bash"
          code={`# Dashboard views available:
# - Log Stream: Real-time log viewer with filtering
# - Error Analysis: Grouped errors with stack traces
# - Performance: Web Vitals and response time charts
# - Activity: User sessions and interaction tracking
# - Alerts: Notification rules and alert history`}
        />

        <DocH2 id="enable-auto-capture">Step 5: Enable Auto-Capture</DocH2>
        <DocP>
          With auto-capture enabled, Apperio automatically instruments your
          application to collect errors, performance data, and more without any
          additional code:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "YOUR_PROJECT_ID",
  apiKey: "YOUR_API_KEY",
  autoCapture: {
    errors: true,           // Uncaught errors & unhandled rejections
    performance: true,      // Core Web Vitals (LCP, FID, CLS)
    network: true,          // XHR and Fetch request tracking
    console: true,          // Console.log/warn/error capture
    pageviews: true,        // Page navigation tracking
    interactions: true,     // Click and form submission tracking
  },
});

// That's it! Apperio handles the rest automatically.`}
        />

        <DocH2 id="whats-next">What's Next</DocH2>
        <DocP>
          Now that you have Apperio running, explore these topics to get the
          most out of the platform:
        </DocP>
        <CodeBlock
          language="bash"
          code={`# Recommended reading order:
# 1. SDK Configuration - Fine-tune capture settings
# 2. Data Sanitization - Configure PII protection
# 3. Error Tracking   - Advanced error grouping
# 4. Alert Rules      - Set up notifications
# 5. Team Management  - Invite collaborators`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
