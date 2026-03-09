import {
  DocsContent,
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocStrong,
  DocLink,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "what-is-apperio", title: "What is Apperio?", level: 2 },
  { id: "key-features", title: "Key Features", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 2 },
  { id: "platform-components", title: "Platform Components", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

export default function IntroductionPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="introduction"
        title="Introduction"
        description="Learn what Apperio is and how it helps you monitor your applications in real-time."
      >
        <DocH2 id="what-is-apperio">What is Apperio?</DocH2>
        <DocP>
          Apperio is a comprehensive observability and logging platform that helps
          developers monitor, debug, and optimize their applications in
          real-time. Stop guessing what is breaking in production -- Apperio
          gives you full visibility into your application's behavior with
          minimal setup.
        </DocP>
        <DocP>
          With a lightweight JavaScript SDK, a powerful REST API, and an
          intuitive dashboard, Apperio captures errors, tracks performance,
          monitors network requests, and provides actionable insights across
          your entire stack.
        </DocP>

        <DocH2 id="key-features">Key Features</DocH2>
        <DocUl>
          <DocLi>
            <DocStrong>Auto-Instrumentation</DocStrong> -- Automatically capture
            errors, performance metrics, network requests, console output,
            page views, and user interactions with zero manual code.
          </DocLi>
          <DocLi>
            <DocStrong>6-Level Logging</DocStrong> -- Full logging hierarchy
            from trace to fatal, with smart level assignment based on event
            context.
          </DocLi>
          <DocLi>
            <DocStrong>Real-Time Monitoring</DocStrong> -- WebSocket-powered live
            log streaming and dashboard updates as events happen.
          </DocLi>
          <DocLi>
            <DocStrong>PII Sanitization</DocStrong> -- Built-in detection and
            redaction of 10+ PII patterns including emails, SSNs, credit
            cards, API keys, and JWTs.
          </DocLi>
          <DocLi>
            <DocStrong>Performance Tracking</DocStrong> -- Core Web Vitals
            (LCP, FID, CLS, TTFB, INP), page load times, and endpoint
            response analysis.
          </DocLi>
          <DocLi>
            <DocStrong>Alerting System</DocStrong> -- Configurable alert rules
            with email, Slack, and webhook notification channels.
          </DocLi>
          <DocLi>
            <DocStrong>Team Collaboration</DocStrong> -- Multi-project
            management with team members, roles, and shared dashboards.
          </DocLi>
        </DocUl>

        <DocH2 id="how-it-works">How It Works</DocH2>
        <DocP>
          Apperio follows a simple three-step flow to collect, process, and
          visualize your application data:
        </DocP>

        <CodeBlock
          language="bash"
          code={`# 1. Your App (SDK)
#    Captures events automatically or via manual API calls
#    Batches logs (default: 10 per batch, every 5 seconds)
#    Sanitizes PII data before transmission
#           |
#           v
# 2. Apperio API (Backend)
#    Receives log batches via POST /:projectId/logs
#    Validates and stores in MongoDB
#    Broadcasts to WebSocket subscribers
#    Evaluates alert rules
#           |
#           v
# 3. Dashboard (Frontend)
#    Real-time log stream viewer
#    Analytics and charting
#    Error grouping and analysis
#    Performance monitoring`}
        />

        <DocCallout type="tip" title="Minimal Performance Impact">
          The SDK batches logs and uses exponential backoff retry logic to
          minimize network overhead. Default configuration sends at most 2
          requests per 10 seconds.
        </DocCallout>

        <DocH2 id="platform-components">Platform Components</DocH2>
        <DocTable
          headers={["Component", "Technology", "Description"]}
          rows={[
            [
              "JavaScript SDK",
              <InlineCode key="sdk">npm install apperio</InlineCode>,
              "Lightweight client library for log capture and transmission",
            ],
            [
              "REST API",
              "Express.js + MongoDB",
              "Backend service for log ingestion, querying, and analytics",
            ],
            [
              "Dashboard",
              "Next.js + React",
              "Web interface for visualization, monitoring, and management",
            ],
          ]}
        />

        <DocH2 id="next-steps">Next Steps</DocH2>
        <DocUl>
          <DocLi>
            <DocLink href="/docs/quickstart">Quick Start</DocLink> -- Get up and
            running in 5 minutes
          </DocLi>
          <DocLi>
            <DocLink href="/docs/installation">Installation</DocLink> -- Detailed
            setup instructions
          </DocLi>
          <DocLi>
            <DocLink href="/docs/sdk/overview">SDK Overview</DocLink> -- Explore
            the full logging API
          </DocLi>
          <DocLi>
            <DocLink href="/docs/api/authentication">API Reference</DocLink> --
            REST API documentation
          </DocLi>
        </DocUl>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
