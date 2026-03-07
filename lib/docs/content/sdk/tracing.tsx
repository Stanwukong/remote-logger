import {
  DocsContent,
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocStrong,
  DocCallout,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "what-is-tracing", title: "What is Tracing?", level: 2 },
  { id: "trace-context", title: "Trace Context", level: 2 },
  { id: "custom-spans", title: "Custom Spans", level: 2 },
  { id: "automatic-tracing", title: "Automatic Tracing", level: 2 },
  { id: "distributed-tracing", title: "Distributed Tracing", level: 2 },
  { id: "viewing-traces", title: "Viewing Traces", level: 2 },
];

export default function TracingPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="sdk/tracing"
        title="Tracing"
        description="Trace context propagation, custom spans, and distributed tracing."
      >
        <DocH2 id="what-is-tracing">What is Tracing?</DocH2>
        <DocP>
          Tracing helps you understand the flow of a request or operation
          through your application. A trace consists of one or more spans,
          each representing a unit of work. Together, they form a timeline
          showing exactly what happened and how long each step took.
        </DocP>
        <CodeBlock
          language="bash"
          code={`# Example trace for a checkout flow:
#
# [Trace: checkout-flow-abc123]
# |
# |-- [Span: validate-cart]          12ms
# |-- [Span: calculate-totals]       3ms
# |-- [Span: process-payment]      245ms
# |   |-- [Span: stripe-api-call]  230ms
# |-- [Span: create-order]          18ms
# |-- [Span: send-confirmation]     45ms
#
# Total: 323ms`}
        />

        <DocH2 id="trace-context">Trace Context</DocH2>
        <DocP>
          Monita supports trace context via the SDK's context system. You can
          attach a trace ID and additional context to groups of related log
          entries:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`import Monita from "monita";

// Generate a unique trace ID
const traceId = crypto.randomUUID();

// Log entries with trace context
Monita.info("Checkout started", {
  traceId,
  userId: "user_123",
  cartItems: 3,
});

// Later in the flow...
Monita.info("Payment processed", {
  traceId,             // Same trace ID links these events
  gateway: "stripe",
  amount: 49.99,
});

Monita.info("Order confirmed", {
  traceId,
  orderId: "order_456",
});`}
        />

        <DocCallout type="info">
          All log entries sharing the same <InlineCode>traceId</InlineCode>{" "}
          can be correlated in the dashboard, giving you a complete picture
          of the operation.
        </DocCallout>

        <DocH2 id="custom-spans">Custom Spans</DocH2>
        <DocP>
          Use the <InlineCode>context</InlineCode> field to create span-like
          entries that measure the duration of specific operations:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Measure an async operation
async function processOrder(orderId: string) {
  const traceId = crypto.randomUUID();
  const start = performance.now();

  Monita.debug("Order processing started", {
    traceId,
    orderId,
    spanName: "process-order",
    spanPhase: "start",
  });

  try {
    await validateInventory(orderId);
    await chargePayment(orderId);
    await createShipment(orderId);

    const duration = performance.now() - start;
    Monita.info("Order processing completed", {
      traceId,
      orderId,
      spanName: "process-order",
      spanPhase: "end",
      duration: Math.round(duration),
    });
  } catch (err) {
    const duration = performance.now() - start;
    Monita.error("Order processing failed", {
      traceId,
      orderId,
      error: err,
      spanName: "process-order",
      spanPhase: "error",
      duration: Math.round(duration),
    });
    throw err;
  }
}

// Helper for timing individual steps
async function withSpan(name: string, traceId: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    Monita.debug(name + " completed", {
      traceId,
      spanName: name,
      duration: Math.round(performance.now() - start),
    });
  } catch (err) {
    Monita.error(name + " failed", {
      traceId,
      spanName: name,
      duration: Math.round(performance.now() - start),
      error: err,
    });
    throw err;
  }
}`}
        />

        <DocH2 id="automatic-tracing">Automatic Tracing</DocH2>
        <DocP>
          The SDK automatically includes trace-like context with
          auto-instrumented events:
        </DocP>
        <DocUl>
          <DocLi>
            <DocStrong>Network requests</DocStrong> include request duration
            and response timing
          </DocLi>
          <DocLi>
            <DocStrong>Page loads</DocStrong> include navigation timing data
          </DocLi>
          <DocLi>
            <DocStrong>Performance entries</DocStrong> include measurement
            timestamps
          </DocLi>
        </DocUl>

        <CodeBlock
          language="json"
          code={`// Auto-captured network request with timing:
{
  "level": "info",
  "message": "POST /api/orders 201",
  "eventType": "network",
  "responseTime": 245,
  "data": {
    "method": "POST",
    "url": "/api/orders",
    "status": 201,
    "duration": 245,
    "initiator": "fetch"
  }
}`}
        />

        <DocH2 id="distributed-tracing">Distributed Tracing</DocH2>
        <DocP>
          For applications with a backend that also uses Monita, you can
          propagate trace context across the network boundary:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`// Frontend: Pass trace ID in request headers
const traceId = crypto.randomUUID();

Monita.info("Initiating API call", { traceId });

const response = await fetch("/api/process", {
  headers: {
    "X-Trace-Id": traceId,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ data: "..." }),
});

Monita.info("API call completed", {
  traceId,
  status: response.status,
});`}
        />
        <CodeBlock
          language="typescript"
          filename="backend/handler.ts"
          code={`// Backend: Read trace ID from incoming request
app.post("/api/process", (req, res) => {
  const traceId = req.headers["x-trace-id"];

  // Use the same trace ID in backend logs
  logger.info("Processing request", {
    traceId,
    step: "validation",
  });

  // Continue propagating to downstream services...
});`}
        />

        <DocH2 id="viewing-traces">Viewing Traces</DocH2>
        <DocP>
          In the Monita dashboard, you can filter logs by trace ID to see
          all events in a single trace. Use the log detail view to examine
          timing data and identify bottlenecks.
        </DocP>
        <DocUl>
          <DocLi>
            Search by <InlineCode>traceId</InlineCode> in the log stream
            filter
          </DocLi>
          <DocLi>
            Sort by timestamp to see the chronological flow
          </DocLi>
          <DocLi>
            Compare <InlineCode>duration</InlineCode> values across spans
            to find slow operations
          </DocLi>
        </DocUl>

        <DocCallout type="tip">
          Include the trace ID in error responses sent to users. When they
          report an issue, you can immediately search for all related events
          in Monita using that trace ID.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
