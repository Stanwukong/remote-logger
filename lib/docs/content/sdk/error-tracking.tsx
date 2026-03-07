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
  { id: "automatic-capture", title: "Automatic Error Capture", level: 2 },
  { id: "manual-logging", title: "Manual Error Logging", level: 2 },
  { id: "error-schema", title: "Error Data Schema", level: 2 },
  { id: "error-grouping", title: "Error Grouping", level: 2 },
  { id: "stack-traces", title: "Stack Traces", level: 2 },
  { id: "source-maps", title: "Source Maps", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
];

export default function ErrorTrackingPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/error-tracking"
        title="Error Tracking"
        description="Capture, group, and analyze errors in your application."
      >
        <DocH2 id="automatic-capture">Automatic Error Capture</DocH2>
        <DocP>
          With <InlineCode>autoCapture.errors</InlineCode> enabled (the
          default), the SDK automatically captures two types of errors:
        </DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Uncaught exceptions</DocStrong> via{" "}
            <InlineCode>window.onerror</InlineCode>
          </DocLi>
          <DocLi>
            <DocStrong>Unhandled promise rejections</DocStrong> via the{" "}
            <InlineCode>unhandledrejection</InlineCode> event
          </DocLi>
        </DocUl>
        <CodeBlock
          language="typescript"
          code={`// Both of these are captured automatically:

// 1. Synchronous errors
function riskyFunction() {
  const obj = null;
  obj.property; // TypeError - captured automatically
}

// 2. Async errors (unhandled promise rejections)
async function fetchData() {
  const res = await fetch("/api/broken-endpoint");
  if (!res.ok) throw new Error("API returned " + res.status);
  // If nothing catches this, it is captured automatically
}`}
        />

        <DocH2 id="manual-logging">Manual Error Logging</DocH2>
        <DocP>
          For errors you catch and handle, use the{" "}
          <InlineCode>Monita.error()</InlineCode> or{" "}
          <InlineCode>Monita.fatal()</InlineCode> methods to log them
          explicitly:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Log a caught error with context
try {
  await processPayment(order);
} catch (err) {
  Monita.error("Payment processing failed", {
    error: err,
    orderId: order.id,
    amount: order.total,
    gateway: "stripe",
  });

  // Handle the error in your UI
  showErrorMessage("Payment failed. Please try again.");
}

// Fatal errors - use for unrecoverable situations
try {
  await initializeDatabase();
} catch (err) {
  Monita.fatal("Database initialization failed", {
    error: err,
    connectionString: "[REDACTED]",
  });
  process.exit(1);
}`}
        />

        <DocH2 id="error-schema">Error Data Schema</DocH2>
        <DocP>
          Each captured error includes a structured error object with the
          following fields:
        </DocP>
        <DocTable
          headers={["Field", "Type", "Description"]}
          rows={[
            [
              <InlineCode key="n">name</InlineCode>,
              "string",
              "Error constructor name (TypeError, RangeError, etc.)",
            ],
            [
              <InlineCode key="m">message</InlineCode>,
              "string",
              "Error message text",
            ],
            [
              <InlineCode key="s">stack</InlineCode>,
              "string?",
              "Full stack trace if available",
            ],
            [
              <InlineCode key="u">url</InlineCode>,
              "string?",
              "Source file URL where the error occurred",
            ],
            [
              <InlineCode key="l">lineNumber</InlineCode>,
              "number?",
              "Line number in the source file",
            ],
            [
              <InlineCode key="c">columnNumber</InlineCode>,
              "number?",
              "Column number in the source file",
            ],
          ]}
        />

        <CodeBlock
          language="json"
          code={`{
  "level": "error",
  "message": "Uncaught TypeError: Cannot read properties of undefined",
  "eventType": "error",
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'map')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'map')\\n    at UserList (UserList.tsx:23:18)\\n    at renderWithHooks (react-dom.js:1234:22)",
    "url": "https://app.example.com/static/js/main.abc123.js",
    "lineNumber": 23,
    "columnNumber": 18
  },
  "url": "https://app.example.com/users",
  "userAgent": "Mozilla/5.0 ..."
}`}
        />

        <DocH2 id="error-grouping">Error Grouping</DocH2>
        <DocP>
          The Monita dashboard groups similar errors together based on their
          error message and source location. This helps you identify recurring
          issues and their frequency without being overwhelmed by individual
          occurrences.
        </DocP>
        <DocP>Errors are grouped by:</DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Error message pattern</DocStrong> (dynamic values are
            normalized)
          </DocLi>
          <DocLi>
            <DocStrong>Error name</DocStrong> (TypeError, RangeError, etc.)
          </DocLi>
          <DocLi>
            <DocStrong>Source location</DocStrong> (file, line, column when
            available)
          </DocLi>
        </DocUl>
        <DocP>
          You can view unique errors via the dashboard error analysis view or
          the API endpoint:
        </DocP>
        <CodeBlock
          language="bash"
          code="GET /api/v1/:projectId/logs/unique-errors"
        />

        <DocH2 id="stack-traces">Stack Traces</DocH2>
        <DocP>
          Stack traces are captured from the Error object's{" "}
          <InlineCode>stack</InlineCode> property. The Monita dashboard
          renders stack traces with syntax highlighting and frame collapsing
          for easy reading.
        </DocP>
        <DocP>
          For manually created errors, always use the{" "}
          <InlineCode>Error</InlineCode> constructor to ensure a stack trace
          is generated:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Good - includes stack trace
Monita.error("Operation failed", {
  error: new Error("Invalid state"),
});

// Less useful - no stack trace
Monita.error("Operation failed", {
  error: { message: "Invalid state" },
});`}
        />

        <DocH2 id="source-maps">Source Maps</DocH2>
        <DocP>
          In production, your JavaScript is typically minified and bundled,
          making stack traces difficult to read. Monita captures the raw stack
          trace as-is. To get readable traces:
        </DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Generate source maps</DocStrong> during your build
            process
          </DocLi>
          <DocLi>
            <DocStrong>Upload source maps</DocStrong> to your error tracking
            tool or keep them accessible for manual de-obfuscation
          </DocLi>
          <DocLi>
            <DocStrong>Use named functions</DocStrong> instead of anonymous
            arrows for clearer stack traces
          </DocLi>
        </DocUl>

        <CodeBlock
          language="typescript"
          code={`// Prefer named functions for better stack traces
function handleSubmit(event) {
  // ...
}

// Instead of anonymous arrows
const handleSubmit = (event) => {
  // ...
};`}
        />

        <DocH2 id="best-practices">Best Practices</DocH2>
        <DocUl>
          <DocLi>
            <DocStrong>Always include context</DocStrong> -- Pass relevant data
            (user IDs, request params, state) with error logs to aid debugging.
          </DocLi>
          <DocLi>
            <DocStrong>Use appropriate levels</DocStrong> --{" "}
            <InlineCode>error</InlineCode> for recoverable errors,{" "}
            <InlineCode>fatal</InlineCode> for unrecoverable crashes.
          </DocLi>
          <DocLi>
            <DocStrong>Avoid logging PII in errors</DocStrong> -- The
            sanitizer catches common patterns, but avoid including raw user
            input in error messages.
          </DocLi>
          <DocLi>
            <DocStrong>Set up alert rules</DocStrong> -- Configure alerts for
            new error types or error rate spikes via the dashboard.
          </DocLi>
        </DocUl>

        <DocCallout type="tip">
          Use the Monita dashboard's error grouping feature to quickly
          identify the most frequent and recent errors. Set alert rules to
          get notified when new error types appear or error rates spike.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
