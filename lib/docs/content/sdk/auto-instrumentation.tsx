import {
  DocsContent,
  DocH2,
  DocP,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "what-gets-captured", title: "What Gets Captured", level: 2 },
  { id: "error-capture", title: "Error Capture", level: 2 },
  { id: "performance-capture", title: "Performance Capture", level: 2 },
  { id: "network-capture", title: "Network Capture", level: 2 },
  { id: "console-capture", title: "Console Capture", level: 2 },
  { id: "pageview-capture", title: "Pageview Capture", level: 2 },
  { id: "interaction-capture", title: "Interaction Capture", level: 2 },
  { id: "selective-capture", title: "Selective Configuration", level: 2 },
];

export default function AutoInstrumentationPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/auto-instrumentation"
        title="Auto-Instrumentation"
        description="Automatic event capture for errors, performance, network, console, pageviews, and interactions."
      >
        <DocH2 id="what-gets-captured">What Gets Captured</DocH2>
        <DocP>
          When auto-instrumentation is enabled, the Apperio SDK patches browser
          APIs to capture events without any manual code. Each category can be
          independently toggled.
        </DocP>

        <DocTable
          headers={["Category", "Browser API Patched", "Data Captured"]}
          rows={[
            [
              "Errors",
              <InlineCode key="e1">window.onerror</InlineCode>,
              "Error name, message, stack trace, source URL, line/column",
            ],
            [
              "Errors",
              <InlineCode key="e2">unhandledrejection</InlineCode>,
              "Promise rejection reason, stack trace",
            ],
            [
              "Performance",
              <InlineCode key="p1">PerformanceObserver</InlineCode>,
              "LCP, FID, CLS, TTFB, INP values",
            ],
            [
              "Network",
              <InlineCode key="n1">XMLHttpRequest</InlineCode>,
              "URL, method, status, duration, request/response size",
            ],
            [
              "Network",
              <InlineCode key="n2">fetch()</InlineCode>,
              "URL, method, status, duration, headers",
            ],
            [
              "Console",
              <InlineCode key="c1">console.*</InlineCode>,
              "Log level, message, arguments",
            ],
            [
              "Pageviews",
              <InlineCode key="pv1">History API</InlineCode>,
              "URL, referrer, page title, navigation type",
            ],
            [
              "Interactions",
              <InlineCode key="i1">addEventListener</InlineCode>,
              "Element tag, text, CSS selector, event type",
            ],
          ]}
        />

        <DocH2 id="error-capture">Error Capture</DocH2>
        <DocP>
          The SDK listens for unhandled errors and promise rejections at the
          window level. Captured errors include full stack traces when available.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// These errors are captured automatically:

// 1. Runtime errors
function processData(data) {
  // TypeError: Cannot read properties of undefined
  return data.items.map(item => item.name);
}

// 2. Unhandled promise rejections
fetch("/api/data")
  .then(res => res.json())
  .then(data => processData(data));
  // No .catch() - rejection captured automatically

// 3. Explicit throws
throw new Error("Something went wrong");`}
        />

        <DocP>The captured error log entry includes:</DocP>
        <CodeBlock
          language="json"
          code={`{
  "level": "error",
  "message": "Uncaught TypeError: Cannot read properties of undefined",
  "eventType": "error",
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'map')",
    "stack": "TypeError: Cannot read properties...\\n    at processData (app.js:42:15)",
    "url": "https://example.com/app.js",
    "lineNumber": 42,
    "columnNumber": 15
  }
}`}
        />

        <DocH2 id="performance-capture">Performance Capture</DocH2>
        <DocP>
          Performance auto-capture uses the <InlineCode>PerformanceObserver</InlineCode>{" "}
          API to measure Core Web Vitals. Metrics are captured once per page load.
        </DocP>
        <DocTable
          headers={["Metric", "Full Name", "What It Measures"]}
          rows={[
            [
              "LCP",
              "Largest Contentful Paint",
              "Time until the largest visible element renders",
            ],
            [
              "FID",
              "First Input Delay",
              "Delay between first user interaction and browser response",
            ],
            [
              "CLS",
              "Cumulative Layout Shift",
              "Total unexpected visual movement of page elements",
            ],
            [
              "TTFB",
              "Time to First Byte",
              "Time from navigation start to first response byte",
            ],
            [
              "INP",
              "Interaction to Next Paint",
              "Latency of all user interactions during page lifecycle",
            ],
          ]}
        />

        <DocH2 id="network-capture">Network Capture</DocH2>
        <DocP>
          The SDK intercepts <InlineCode>XMLHttpRequest</InlineCode> and{" "}
          <InlineCode>fetch</InlineCode> to record all network requests with
          timing data:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// All of these are captured automatically:
fetch("/api/users");
axios.get("/api/products");

const xhr = new XMLHttpRequest();
xhr.open("POST", "/api/orders");
xhr.send(JSON.stringify({ item: "widget" }));`}
        />

        <DocP>Captured network log entry:</DocP>
        <CodeBlock
          language="json"
          code={`{
  "level": "info",
  "message": "GET /api/users 200",
  "eventType": "network",
  "responseTime": 145,
  "data": {
    "method": "GET",
    "url": "/api/users",
    "status": 200,
    "duration": 145
  }
}`}
        />

        <DocCallout type="info">
          Network capture automatically sanitizes query parameters that may
          contain sensitive data (tokens, API keys). The request body is not
          captured to avoid PII exposure.
        </DocCallout>

        <DocH2 id="console-capture">Console Capture</DocH2>
        <DocP>
          When enabled, the SDK intercepts <InlineCode>console.log</InlineCode>,{" "}
          <InlineCode>console.warn</InlineCode>, and{" "}
          <InlineCode>console.error</InlineCode> calls and forwards them as log
          entries.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// With console capture enabled:
console.log("User loaded", user);
// -> Captured as info log with eventType: "console"

console.warn("Deprecated API used");
// -> Captured as warn log

console.error("Failed to render component");
// -> Captured as error log`}
        />

        <DocCallout type="warning">
          Console capture is disabled by default. The SDK avoids recursive
          capture by not intercepting its own console calls, but enabling this
          in high-volume logging environments may increase data volume
          significantly.
        </DocCallout>

        <DocH2 id="pageview-capture">Pageview Capture</DocH2>
        <DocP>
          Pageview tracking captures navigation events including initial page
          loads and client-side route changes (via the History API):
        </DocP>
        <CodeBlock
          language="json"
          code={`{
  "level": "info",
  "message": "Pageview: /dashboard/analytics",
  "eventType": "pageview",
  "url": "https://example.com/dashboard/analytics",
  "referrer": "https://example.com/dashboard",
  "userAgent": "Mozilla/5.0 ..."
}`}
        />

        <DocH2 id="interaction-capture">Interaction Capture</DocH2>
        <DocP>
          When enabled, the SDK tracks click events and form submissions,
          capturing the target element context:
        </DocP>
        <CodeBlock
          language="json"
          code={`{
  "level": "info",
  "message": "User clicked: Submit Order",
  "eventType": "interaction",
  "data": {
    "type": "click",
    "element": "button",
    "text": "Submit Order",
    "selector": "#checkout-form > button.submit"
  }
}`}
        />

        <DocH2 id="selective-capture">Selective Configuration</DocH2>
        <DocP>
          Enable only the categories you need. Every combination is valid:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Errors only - minimal overhead
Apperio.init({
  projectId: "...",
  apiKey: "...",
  autoCapture: {
    errors: true,
    performance: false,
    network: false,
    console: false,
    pageviews: false,
    interactions: false,
  },
});

// Full observability - maximum data
Apperio.init({
  projectId: "...",
  apiKey: "...",
  autoCapture: {
    errors: true,
    performance: true,
    network: true,
    console: true,
    pageviews: true,
    interactions: true,
  },
});`}
        />
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
