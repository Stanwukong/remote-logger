import {
  DocsContent,
  DocH2,
  DocH3,
  DocP,
  DocCallout,
  DocTable,
  CodeBlock,
  InlineCode,
  DocsTableOfContents,
  type TocItem,
} from "@/components/docs";

const toc: TocItem[] = [
  { id: "app-router-setup", title: "App Router Setup", level: 2 },
  { id: "client-init", title: "Client-Side Initialization", level: 2 },
  { id: "server-logging", title: "Server-Side Logging", level: 2 },
  { id: "middleware-integration", title: "Middleware Integration", level: 2 },
  { id: "error-handling", title: "Error Handling", level: 2 },
  { id: "route-handlers", title: "Route Handler Logging", level: 2 },
  { id: "env-variables", title: "Environment Variables", level: 2 },
  { id: "pages-router", title: "Pages Router (Legacy)", level: 2 },
];

export default function NextjsGuidePage() {
  return (
    <div className="flex">
      <DocsContent
        slug="guides/nextjs"
        title="Next.js Integration"
        description="Set up Monita with Next.js App Router and Pages Router."
      >
        <DocH2 id="app-router-setup">App Router Setup</DocH2>
        <DocP>
          With Next.js App Router, the SDK should be initialized client-side
          since it relies on browser APIs. Create a provider component marked
          with <InlineCode>"use client"</InlineCode>:
        </DocP>

        <CodeBlock
          language="bash"
          code="npm install monita"
        />

        <CodeBlock
          language="typescript"
          filename="app/providers/MonitaProvider.tsx"
          code={`"use client";

import { useEffect, useRef } from "react";
import Monita from "monita";

export function MonitaProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      Monita.init({
        projectId: process.env.NEXT_PUBLIC_MONITA_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_MONITA_API_KEY!,
        environment: process.env.NODE_ENV,
        autoCapture: {
          errors: true,
          performance: true,
          network: true,
          pageviews: true,
        },
      });
      initialized.current = true;
    }

    return () => {
      Monita.flush();
    };
  }, []);

  return <>{children}</>;
}`}
        />

        <DocP>
          Add the provider to your root layout:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="app/layout.tsx"
          code={`import { MonitaProvider } from "./providers/MonitaProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MonitaProvider>
          {children}
        </MonitaProvider>
      </body>
    </html>
  );
}`}
        />

        <DocCallout type="info">
          The SDK uses browser APIs like <InlineCode>window</InlineCode>,{" "}
          <InlineCode>PerformanceObserver</InlineCode>, and{" "}
          <InlineCode>XMLHttpRequest</InlineCode>. It must be initialized in
          a client component, not a server component.
        </DocCallout>

        <DocH2 id="client-init">Client-Side Initialization</DocH2>
        <DocP>
          For pages that need logging before the provider mounts, you can also
          initialize in a client component directly:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="app/dashboard/MonitaInit.tsx"
          code={`"use client";

import { useEffect, useRef } from "react";
import Monita from "monita";

export function MonitaInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      Monita.init({
        projectId: process.env.NEXT_PUBLIC_MONITA_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_MONITA_API_KEY!,
      });
      initialized.current = true;
    }
  }, []);

  return null; // Renders nothing
}

// Usage in a server component layout:
// <MonitaInit />
// <DashboardContent />`}
        />

        <DocH2 id="server-logging">Server-Side Logging</DocH2>
        <DocP>
          For server-side logging in Server Components, Server Actions, or
          Route Handlers, you can send logs directly to the Monita API:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="lib/server-logger.ts"
          code={`const API_BASE = process.env.MONITA_API_URL
  || "https://loghive-server.vercel.app/api/v1";
const PROJECT_ID = process.env.MONITA_PROJECT_ID;
const API_KEY = process.env.MONITA_API_KEY;

interface ServerLogOptions {
  level: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  data?: Record<string, any>;
  service?: string;
}

export async function serverLog(options: ServerLogOptions) {
  try {
    await fetch(API_BASE + "/" + PROJECT_ID + "/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY!,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        level: options.level,
        message: options.message,
        data: options.data,
        service: options.service || "nextjs-server",
        environment: process.env.NODE_ENV,
      }),
    });
  } catch (err) {
    console.error("Failed to send server log:", err);
  }
}

// Usage in a Server Component or Server Action:
// await serverLog({
//   level: "info",
//   message: "Page rendered",
//   data: { page: "/dashboard" },
// });`}
        />

        <DocCallout type="warning">
          Server-side environment variables (without{" "}
          <InlineCode>NEXT_PUBLIC_</InlineCode> prefix) are only available
          in server-side code. Use separate env vars for server and client.
        </DocCallout>

        <DocH2 id="middleware-integration">Middleware Integration</DocH2>
        <DocP>
          Log requests passing through Next.js middleware for observability
          into routing decisions:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="middleware.ts"
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();

  // Log to Monita (fire-and-forget)
  const logData = {
    timestamp: new Date().toISOString(),
    level: "info",
    message: "Middleware: " + request.method + " " + request.nextUrl.pathname,
    service: "nextjs-middleware",
    data: {
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get("user-agent"),
      duration: Date.now() - start,
    },
  };

  // Non-blocking log send
  fetch(process.env.MONITA_API_URL + "/" + process.env.MONITA_PROJECT_ID + "/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.MONITA_API_KEY!,
    },
    body: JSON.stringify(logData),
  }).catch(() => {
    // Silently fail - don't block the request
  });

  return response;
}`}
        />

        <DocH2 id="error-handling">Error Handling</DocH2>
        <DocP>
          Use Next.js error files with Monita for comprehensive error
          reporting:
        </DocP>

        <DocH3 id="global-error">Global Error Handler</DocH3>
        <CodeBlock
          language="typescript"
          filename="app/error.tsx"
          code={`"use client";

import { useEffect } from "react";
import Monita from "monita";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Monita.error("Next.js page error", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`}
        />

        <DocH3 id="not-found">Not Found Handler</DocH3>
        <CodeBlock
          language="typescript"
          filename="app/not-found.tsx"
          code={`import Monita from "monita";

export default function NotFound() {
  // Note: This is a server component, so use serverLog
  // or handle client-side
  return (
    <div>
      <h2>Page Not Found</h2>
      <NotFoundLogger />
    </div>
  );
}

// Client component for logging
"use client";
function NotFoundLogger() {
  useEffect(() => {
    Monita.warn("404 - Page not found", {
      url: window.location.href,
      referrer: document.referrer,
    });
  }, []);
  return null;
}`}
        />

        <DocH2 id="route-handlers">Route Handler Logging</DocH2>
        <DocP>
          Log API route handler activity for server-side observability:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="app/api/users/route.ts"
          code={`import { NextResponse } from "next/server";
import { serverLog } from "@/lib/server-logger";

export async function GET(request: Request) {
  const start = Date.now();

  try {
    const users = await fetchUsers();

    await serverLog({
      level: "info",
      message: "GET /api/users",
      data: {
        status: 200,
        count: users.length,
        duration: Date.now() - start,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    await serverLog({
      level: "error",
      message: "GET /api/users failed",
      data: {
        error: err instanceof Error ? err.message : "Unknown error",
        duration: Date.now() - start,
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}`}
        />

        <DocH2 id="env-variables">Environment Variables</DocH2>
        <DocP>
          Configure your <InlineCode>.env.local</InlineCode> with both
          client-side and server-side variables:
        </DocP>
        <CodeBlock
          language="bash"
          filename=".env.local"
          code={`# Client-side (exposed to browser)
NEXT_PUBLIC_MONITA_PROJECT_ID=your_project_id
NEXT_PUBLIC_MONITA_API_KEY=your_api_key

# Server-side only (not exposed to browser)
MONITA_PROJECT_ID=your_project_id
MONITA_API_KEY=your_api_key
MONITA_API_URL=https://loghive-server.vercel.app/api/v1`}
        />

        <DocTable
          headers={["Variable", "Scope", "Used By"]}
          rows={[
            [
              <InlineCode key="c1">NEXT_PUBLIC_MONITA_PROJECT_ID</InlineCode>,
              "Client",
              "SDK initialization in browser",
            ],
            [
              <InlineCode key="c2">NEXT_PUBLIC_MONITA_API_KEY</InlineCode>,
              "Client",
              "SDK API authentication",
            ],
            [
              <InlineCode key="s1">MONITA_PROJECT_ID</InlineCode>,
              "Server",
              "Server-side logging, middleware",
            ],
            [
              <InlineCode key="s2">MONITA_API_KEY</InlineCode>,
              "Server",
              "Server-side API authentication",
            ],
            [
              <InlineCode key="s3">MONITA_API_URL</InlineCode>,
              "Server",
              "API base URL for server logging",
            ],
          ]}
        />

        <DocH2 id="pages-router">Pages Router (Legacy)</DocH2>
        <DocP>
          If you are using the Pages Router, initialize Monita in{" "}
          <InlineCode>_app.tsx</InlineCode>:
        </DocP>
        <CodeBlock
          language="typescript"
          filename="pages/_app.tsx"
          code={`import { useEffect, useRef } from "react";
import Monita from "monita";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      Monita.init({
        projectId: process.env.NEXT_PUBLIC_MONITA_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_MONITA_API_KEY!,
        environment: process.env.NODE_ENV,
      });
      initialized.current = true;
    }
  }, []);

  return <Component {...pageProps} />;
}`}
        />

        <DocCallout type="tip">
          For new projects, use the App Router setup. The Pages Router
          integration is provided for compatibility with existing projects
          that have not yet migrated.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
