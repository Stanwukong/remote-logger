"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAdjacentDocs } from "@/lib/docs/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DocsContentProps {
  slug: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Main content wrapper with consistent typography, title, and prev/next navigation */
export function DocsContent({
  slug,
  title,
  description,
  children,
}: DocsContentProps) {
  const { prev, next } = getAdjacentDocs(slug);

  return (
    <article className="flex-1 min-w-0 max-w-3xl mx-auto px-6 py-10 lg:px-8">
      {/* Page header */}
      <header className="mb-8 pb-6 border-b border-border-subtle">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-text-secondary">{description}</p>
        )}
      </header>

      {/* Main content - applies prose-like typography */}
      <div className="docs-prose">{children}</div>

      {/* Prev / Next navigation */}
      <footer className="mt-16 pt-6 border-t border-border-subtle">
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-signal transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-text-muted">Previous</div>
                <div className="font-medium">{prev.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-signal transition-colors group text-right"
            >
              <div>
                <div className="text-xs text-text-muted">Next</div>
                <div className="font-medium">{next.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </footer>
    </article>
  );
}

/* ─── Reusable doc typography primitives ────────────────────────────────── */

export function DocH2({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-xl font-display font-bold text-text-primary mt-12 mb-4 scroll-mt-20"
    >
      {children}
    </h2>
  );
}

export function DocH3({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold text-text-primary mt-8 mb-3 scroll-mt-20"
    >
      {children}
    </h3>
  );
}

export function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-secondary leading-7 mb-4">{children}</p>
  );
}

export function DocUl({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside text-text-secondary leading-7 mb-4 space-y-1 pl-2">
      {children}
    </ul>
  );
}

export function DocOl({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal list-inside text-text-secondary leading-7 mb-4 space-y-1 pl-2">
      {children}
    </ol>
  );
}

export function DocLi({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function DocStrong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-text-primary">{children}</strong>
  );
}

export function DocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      className="text-signal hover:underline"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}

/** A callout / alert box */
export function DocCallout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "danger" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-l-signal bg-signal-muted",
    warning: "border-l-status-warn bg-status-warn/5",
    danger: "border-l-status-danger bg-status-danger/5",
    tip: "border-l-data bg-data-muted",
  };

  const labels = {
    info: "Info",
    warning: "Warning",
    danger: "Danger",
    tip: "Tip",
  };

  return (
    <div
      className={cn(
        "border-l-4 rounded-r-md p-4 my-4",
        styles[type]
      )}
    >
      {(title || labels[type]) && (
        <p className="text-sm font-semibold text-text-primary mb-1">
          {title || labels[type]}
        </p>
      )}
      <div className="text-sm text-text-secondary leading-relaxed">
        {children}
      </div>
    </div>
  );
}

/** Table wrapper for consistent styling */
export function DocTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border-subtle">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-elevated border-b border-border-subtle">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left font-semibold text-text-primary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border-faint last:border-b-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 text-text-secondary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** HTTP method badge */
export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-signal/15 text-signal",
    POST: "bg-data/15 text-data",
    PUT: "bg-status-warn/15 text-status-warn",
    PATCH: "bg-status-warn/15 text-status-warn",
    DELETE: "bg-status-danger/15 text-status-danger",
  };

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold",
        colors[method.toUpperCase()] || "bg-bg-elevated text-text-muted"
      )}
    >
      {method.toUpperCase()}
    </span>
  );
}

/** Endpoint display */
export function EndpointBlock({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated border border-border-subtle my-3">
      <MethodBadge method={method} />
      <div className="min-w-0">
        <code className="text-sm font-mono text-text-primary break-all">
          {path}
        </code>
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
