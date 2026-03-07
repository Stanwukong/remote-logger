import {
  DocsContent,
  DocH2,
  DocH3,
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
  { id: "core-web-vitals", title: "Core Web Vitals", level: 2 },
  { id: "lcp", title: "LCP - Largest Contentful Paint", level: 3 },
  { id: "fid", title: "FID - First Input Delay", level: 3 },
  { id: "cls", title: "CLS - Cumulative Layout Shift", level: 3 },
  { id: "ttfb", title: "TTFB - Time to First Byte", level: 3 },
  { id: "inp", title: "INP - Interaction to Next Paint", level: 3 },
  { id: "measurement", title: "How Metrics Are Measured", level: 2 },
  { id: "dashboard-view", title: "Dashboard Visualization", level: 2 },
  { id: "performance-budgets", title: "Performance Budgets", level: 2 },
];

export default function WebVitalsPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/web-vitals"
        title="Web Vitals"
        description="Monitor Core Web Vitals and performance metrics automatically."
      >
        <DocH2 id="core-web-vitals">Core Web Vitals</DocH2>
        <DocP>
          Core Web Vitals are a set of metrics defined by Google that measure
          real-world user experience. Monita captures these automatically when{" "}
          <InlineCode>autoCapture.performance</InlineCode> is enabled.
        </DocP>

        <DocH3 id="lcp">LCP - Largest Contentful Paint</DocH3>
        <DocP>
          Measures how long it takes for the largest visible element (image,
          text block, video) to render on screen. LCP reflects perceived load
          speed.
        </DocP>
        <DocTable
          headers={["Rating", "Threshold", "User Experience"]}
          rows={[
            ["Good", "< 2.5s", "Page feels fast, content appears quickly"],
            ["Needs Improvement", "2.5s - 4.0s", "Noticeable delay before content"],
            ["Poor", "> 4.0s", "Users may abandon the page"],
          ]}
        />

        <DocH3 id="fid">FID - First Input Delay</DocH3>
        <DocP>
          Measures the delay between the user's first interaction (click, tap,
          key press) and the browser's response. FID reflects input
          responsiveness.
        </DocP>
        <DocTable
          headers={["Rating", "Threshold", "User Experience"]}
          rows={[
            ["Good", "< 100ms", "Interactions feel instant"],
            ["Needs Improvement", "100ms - 300ms", "Slight lag noticeable"],
            ["Poor", "> 300ms", "Interface feels sluggish or frozen"],
          ]}
        />

        <DocH3 id="cls">CLS - Cumulative Layout Shift</DocH3>
        <DocP>
          Measures the total unexpected visual movement of page elements during
          the page lifecycle. CLS reflects visual stability.
        </DocP>
        <DocTable
          headers={["Rating", "Threshold", "User Experience"]}
          rows={[
            ["Good", "< 0.1", "Page layout is stable"],
            ["Needs Improvement", "0.1 - 0.25", "Occasional content jumps"],
            ["Poor", "> 0.25", "Frequent, disruptive layout shifts"],
          ]}
        />

        <DocH3 id="ttfb">TTFB - Time to First Byte</DocH3>
        <DocP>
          Measures the time from when the browser makes a request to when it
          receives the first byte of the response. TTFB reflects server
          responsiveness.
        </DocP>
        <DocTable
          headers={["Rating", "Threshold", "User Experience"]}
          rows={[
            ["Good", "< 800ms", "Server responds quickly"],
            ["Needs Improvement", "800ms - 1800ms", "Noticeable wait for content"],
            ["Poor", "> 1800ms", "Long wait before anything happens"],
          ]}
        />

        <DocH3 id="inp">INP - Interaction to Next Paint</DocH3>
        <DocP>
          Measures the latency of all user interactions throughout the page
          lifecycle, reporting the worst-case delay. INP replaced FID as a
          Core Web Vital in 2024.
        </DocP>
        <DocTable
          headers={["Rating", "Threshold", "User Experience"]}
          rows={[
            ["Good", "< 200ms", "All interactions feel responsive"],
            ["Needs Improvement", "200ms - 500ms", "Some interactions lag"],
            ["Poor", "> 500ms", "Frequent interaction delays"],
          ]}
        />

        <DocH2 id="measurement">How Metrics Are Measured</DocH2>
        <DocP>
          The SDK uses the browser <InlineCode>PerformanceObserver</InlineCode>{" "}
          API to capture metrics. Measurements happen passively and do not
          impact application performance.
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// The SDK automatically sets up observers like:
// (You do NOT need to write this code - it happens internally)

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "largest-contentful-paint") {
      // LCP value captured and logged
    }
    if (entry.entryType === "first-input") {
      // FID value captured and logged
    }
    if (entry.entryType === "layout-shift") {
      // CLS accumulated and logged
    }
  }
});`}
        />

        <DocP>Each metric generates a log entry like:</DocP>
        <CodeBlock
          language="json"
          code={`{
  "level": "info",
  "message": "Web Vital: LCP = 1847ms",
  "eventType": "performance",
  "data": {
    "metric": "LCP",
    "value": 1847,
    "rating": "good",
    "navigationType": "navigate"
  }
}`}
        />

        <DocCallout type="info">
          Web Vital metrics require browser support for{" "}
          <InlineCode>PerformanceObserver</InlineCode>. All modern browsers
          (Chrome, Edge, Firefox, Safari 15+) support this API. On
          unsupported browsers, performance capture is silently skipped.
        </DocCallout>

        <DocH2 id="dashboard-view">Dashboard Visualization</DocH2>
        <DocP>
          The Monita dashboard provides dedicated views for performance data:
        </DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Web Vital Gauges</DocStrong> -- Color-coded gauges
            showing current LCP, FID, CLS, TTFB, and INP values
          </DocLi>
          <DocLi>
            <DocStrong>Trend Charts</DocStrong> -- Time series showing how
            metrics change over hours, days, or weeks
          </DocLi>
          <DocLi>
            <DocStrong>Page Load Distribution</DocStrong> -- Histogram of
            page load times across your application
          </DocLi>
          <DocLi>
            <DocStrong>Slowest Endpoints</DocStrong> -- Rankings of the
            slowest network endpoints affecting performance
          </DocLi>
        </DocUl>

        <DocH2 id="performance-budgets">Performance Budgets</DocH2>
        <DocP>
          Use Monita alert rules to set performance budgets and get notified
          when metrics exceed thresholds:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Example alert rule (configured via dashboard or API):
{
  "name": "LCP Budget Exceeded",
  "projectId": "your-project",
  "condition": {
    "field": "data.metric",
    "operator": "equals",
    "value": "LCP"
  },
  "threshold": {
    "field": "data.value",
    "operator": "greaterThan",
    "value": 2500
  },
  "channels": ["email", "slack"],
  "cooldownMinutes": 30
}`}
        />

        <DocCallout type="tip">
          Set separate budgets for each Web Vital. A page that has good LCP
          but poor CLS still delivers a bad user experience. Monitor all five
          metrics together for a complete picture.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
