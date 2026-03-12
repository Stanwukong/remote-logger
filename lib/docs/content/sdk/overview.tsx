import {
  DocsContent,
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocStrong,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "logging-api", title: "Logging API", level: 2 },
  { id: "log-levels", title: "Log Levels", level: 2 },
  { id: "structured-data", title: "Structured Data", level: 2 },
  { id: "event-types", title: "Event Types", level: 2 },
  { id: "batching", title: "Batching and Delivery", level: 2 },
  { id: "lifecycle", title: "SDK Lifecycle", level: 2 },
];

export default function SdkOverviewPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/overview"
        title="SDK Overview"
        description="Core logging API, methods, and concepts for the Apperio SDK."
      >
        <DocH2 id="logging-api">Logging API</DocH2>
        <DocP>
          The Apperio SDK provides six log level methods that map directly to
          standard severity levels. Each method accepts a message string and an
          optional data object.
        </DocP>

        <CodeBlock
          language="typescript"
          code={`import Apperio from "apperio";

// Trace - very detailed diagnostic info
Apperio.trace("Entering function processOrder", { orderId: "abc123" });

// Debug - diagnostic information
Apperio.debug("Cache miss for user preferences", { userId: "user_1" });

// Info - general operational events
Apperio.info("Order completed successfully", { total: 49.99 });

// Warn - unexpected but non-critical events
Apperio.warn("API rate limit approaching", { remaining: 5 });

// Error - error events that should be investigated
Apperio.error("Payment processing failed", {
  error: new Error("Card declined"),
  orderId: "abc123",
});

// Fatal - critical failures requiring immediate action
Apperio.fatal("Database connection lost", { host: "db.example.com" });`}
        />

        <DocH2 id="log-levels">Log Levels</DocH2>
        <DocP>
          Log levels follow standard severity ordering. You can configure a
          minimum level to filter out lower-severity messages.
        </DocP>
        <DocTable
          headers={["Level", "Value", "Use Case"]}
          rows={[
            [
              <InlineCode key="t">trace</InlineCode>,
              "0",
              "Finest-grained diagnostic info, function entry/exit",
            ],
            [
              <InlineCode key="d">debug</InlineCode>,
              "1",
              "Detailed diagnostic data useful during development",
            ],
            [
              <InlineCode key="i">info</InlineCode>,
              "2",
              "General operational events, successful operations",
            ],
            [
              <InlineCode key="w">warn</InlineCode>,
              "3",
              "Unexpected events that are not errors but need attention",
            ],
            [
              <InlineCode key="e">error</InlineCode>,
              "4",
              "Error events that should be investigated",
            ],
            [
              <InlineCode key="f">fatal</InlineCode>,
              "5",
              "Critical failures requiring immediate action",
            ],
          ]}
        />

        <DocCallout type="info">
          The SDK uses smart log level assignment for auto-captured events. For
          example, uncaught errors are automatically logged at the{" "}
          <InlineCode>error</InlineCode> level, while performance metrics use{" "}
          <InlineCode>info</InlineCode>.
        </DocCallout>

        <DocH2 id="structured-data">Structured Data</DocH2>
        <DocP>
          Every log method accepts an optional second argument for structured
          data. This data is stored as JSON and is fully searchable in the
          dashboard.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Simple key-value data
Apperio.info("User action", {
  action: "click",
  element: "submit-button",
  page: "/checkout",
});

// Nested objects
Apperio.info("API response received", {
  endpoint: "/api/users",
  method: "GET",
  response: {
    status: 200,
    duration: 145,
    cached: false,
  },
});

// Error objects are automatically serialized
try {
  await riskyOperation();
} catch (err) {
  Apperio.error("Operation failed", {
    error: err,           // Stack trace captured automatically
    context: { step: 3 },
  });
}`}
        />

        <DocCallout type="warning">
          The SDK handles circular references in data objects automatically.
          You do not need to pre-process your data before logging.
        </DocCallout>

        <DocH2 id="event-types">Event Types</DocH2>
        <DocP>
          Each log entry can be tagged with an event type for categorization
          and filtering in the dashboard:
        </DocP>
        <DocTable
          headers={["Event Type", "Source", "Description"]}
          rows={[
            [
              <InlineCode key="err">error</InlineCode>,
              "Auto / Manual",
              "JavaScript errors, unhandled rejections",
            ],
            [
              <InlineCode key="perf">performance</InlineCode>,
              "Auto",
              "Core Web Vitals, page load metrics",
            ],
            [
              <InlineCode key="net">network</InlineCode>,
              "Auto",
              "XHR and Fetch request/response tracking",
            ],
            [
              <InlineCode key="con">console</InlineCode>,
              "Auto",
              "Console.log, warn, error interceptions",
            ],
            [
              <InlineCode key="pv">pageview</InlineCode>,
              "Auto",
              "Page navigation and route changes",
            ],
            [
              <InlineCode key="int">interaction</InlineCode>,
              "Auto",
              "Click events and form submissions",
            ],
          ]}
        />

        <DocH2 id="batching">Batching and Delivery</DocH2>
        <DocP>
          The SDK batches log entries to minimize network requests. By default,
          logs are sent when either condition is met:
        </DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Batch size threshold</DocStrong>: 10 log entries
            accumulated
          </DocLi>
          <DocLi>
            <DocStrong>Time interval</DocStrong>: 5 seconds since last flush
          </DocLi>
        </DocUl>

        <CodeBlock
          language="typescript"
          code={`Apperio.init({
  projectId: "my-project",
  apiKey: "my-key",
  batchSize: 20,        // Send when 20 logs accumulate
  flushInterval: 10000, // Or every 10 seconds
});`}
        />

        <DocP>
          The SDK also implements retry logic with exponential backoff. Failed
          requests are retried up to 3 times with increasing delay between
          attempts.
        </DocP>

        <DocH2 id="lifecycle">SDK Lifecycle</DocH2>
        <DocP>
          The SDK provides lifecycle methods for proper initialization and
          cleanup:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Initialize - call once at app startup
Apperio.init({ projectId: "...", apiKey: "..." });

// The SDK is now active and capturing events.

// Flush - manually send all buffered logs
await Apperio.flush();

// Destroy - clean up listeners and send remaining logs
Apperio.destroy();`}
        />

        <DocCallout type="tip">
          Call <InlineCode>Apperio.flush()</InlineCode> before critical
          navigation events (like page unload) to ensure all buffered logs
          are sent. The SDK attempts to flush automatically on{" "}
          <InlineCode>beforeunload</InlineCode>, but this is not guaranteed
          by all browsers.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
