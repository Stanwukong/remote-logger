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
  { id: "package-managers", title: "Package Managers", level: 2 },
  { id: "cdn-usage", title: "CDN Usage", level: 2 },
  { id: "environment-setup", title: "Environment Setup", level: 2 },
  { id: "framework-notes", title: "Framework-Specific Notes", level: 2 },
  { id: "typescript-support", title: "TypeScript Support", level: 2 },
  { id: "verifying-installation", title: "Verifying Installation", level: 2 },
];

export default function InstallationPage() {
  return (
    <div className="flex">
      <DocsContent
        slug="installation"
        title="Installation"
        description="Install the Apperio SDK and configure it for your project."
      >
        <DocH2 id="package-managers">Package Managers</DocH2>
        <DocP>
          Apperio is published as <InlineCode>apperio</InlineCode> on npm. Install
          it with your preferred package manager:
        </DocP>

        <DocH3 id="npm">npm</DocH3>
        <CodeBlock language="bash" code="npm install apperio" />

        <DocH3 id="yarn">Yarn</DocH3>
        <CodeBlock language="bash" code="yarn add apperio" />

        <DocH3 id="pnpm">pnpm</DocH3>
        <CodeBlock language="bash" code="pnpm add apperio" />

        <DocP>
          The package includes TypeScript declarations out of the box. No
          separate <InlineCode>@types</InlineCode> package is needed.
        </DocP>

        <DocH2 id="cdn-usage">CDN Usage</DocH2>
        <DocP>
          You can also load Apperio directly via a script tag for quick
          prototyping or non-bundled environments:
        </DocP>
        <CodeBlock
          language="html"
          code={`<script src="https://unpkg.com/apperio@latest/dist/index.js"></script>
<script>
  // Apperio is available as a global
  Apperio.init({
    projectId: "YOUR_PROJECT_ID",
    apiKey: "YOUR_API_KEY",
  });
</script>`}
        />

        <DocCallout type="warning">
          The CDN version is best for prototyping. For production use, install
          via a package manager to benefit from tree-shaking and proper
          bundling.
        </DocCallout>

        <DocH2 id="environment-setup">Environment Setup</DocH2>
        <DocP>
          Store your project credentials as environment variables to keep them
          out of source code:
        </DocP>
        <CodeBlock
          language="bash"
          filename=".env"
          code={`APPERIO_PROJECT_ID=your_project_id_here
APPERIO_API_KEY=your_api_key_here`}
        />

        <DocP>Then reference them during initialization:</DocP>
        <CodeBlock
          language="typescript"
          filename="src/monitoring.ts"
          code={`import Apperio from "apperio";

Apperio.init({
  projectId: process.env.APPERIO_PROJECT_ID,
  apiKey: process.env.APPERIO_API_KEY,
  environment: process.env.NODE_ENV || "development",
});`}
        />

        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [
              <InlineCode key="pid">APPERIO_PROJECT_ID</InlineCode>,
              "Yes",
              "Your project ID from the Apperio dashboard",
            ],
            [
              <InlineCode key="ak">APPERIO_API_KEY</InlineCode>,
              "Yes",
              "API key for authenticating SDK requests",
            ],
            [
              <InlineCode key="env">NODE_ENV</InlineCode>,
              "No",
              "Environment tag (development, staging, production)",
            ],
          ]}
        />

        <DocH2 id="framework-notes">Framework-Specific Notes</DocH2>

        <DocH3 id="react-cra">React (Create React App)</DocH3>
        <DocP>
          Prefix environment variables with <InlineCode>REACT_APP_</InlineCode>:
        </DocP>
        <CodeBlock
          language="bash"
          filename=".env"
          code={`REACT_APP_APPERIO_PROJECT_ID=your_project_id
REACT_APP_APPERIO_API_KEY=your_api_key`}
        />

        <DocH3 id="nextjs-env">Next.js</DocH3>
        <DocP>
          For client-side usage, prefix with{" "}
          <InlineCode>NEXT_PUBLIC_</InlineCode>:
        </DocP>
        <CodeBlock
          language="bash"
          filename=".env.local"
          code={`NEXT_PUBLIC_APPERIO_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPERIO_API_KEY=your_api_key`}
        />

        <DocH3 id="vite-env">Vite</DocH3>
        <DocP>
          Prefix with <InlineCode>VITE_</InlineCode> and access via{" "}
          <InlineCode>import.meta.env</InlineCode>:
        </DocP>
        <CodeBlock
          language="bash"
          filename=".env"
          code={`VITE_APPERIO_PROJECT_ID=your_project_id
VITE_APPERIO_API_KEY=your_api_key`}
        />

        <DocH2 id="typescript-support">TypeScript Support</DocH2>
        <DocP>
          The SDK ships with full TypeScript declarations. All configuration
          options, log methods, and event types are strongly typed:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`import Apperio from "apperio";
import type { LoggerConfig, LogLevel } from "apperio";

const config: LoggerConfig = {
  projectId: "my-project",
  apiKey: "my-key",
  environment: "production",
  logLevel: "info" as LogLevel,
};

Apperio.init(config);`}
        />

        <DocH2 id="verifying-installation">Verifying Installation</DocH2>
        <DocP>
          After installation, verify everything is working by sending a test
          log:
        </DocP>
        <CodeBlock
          language="typescript"
          code={`import Apperio from "apperio";

Apperio.init({
  projectId: "YOUR_PROJECT_ID",
  apiKey: "YOUR_API_KEY",
});

// Send a test log
Apperio.info("Apperio SDK installed successfully", {
  timestamp: new Date().toISOString(),
  version: "1.0.4",
});

// Check your Apperio dashboard - the log should appear
// within a few seconds.`}
        />

        <DocCallout type="tip">
          If logs do not appear in the dashboard, check the browser console for
          any SDK error messages. Common issues include incorrect API keys or
          network connectivity problems.
        </DocCallout>
      </DocsContent>
      <DocsTableOfContents items={toc} />
    </div>
  );
}
