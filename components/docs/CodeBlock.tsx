"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
}

/**
 * Simple CSS-based syntax highlighting.
 * Tokenizes code into keywords, strings, comments, numbers, etc.
 * No external dependencies required.
 */
function highlightSyntax(code: string, language?: string): string {
  if (!language) return escapeHtml(code);

  let result = escapeHtml(code);

  // Comments (must be first to avoid matching inside strings)
  // Single-line comments
  result = result.replace(
    /(\/\/.*?)$/gm,
    '<span class="syntax-comment">$1</span>'
  );
  // Multi-line comments
  result = result.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="syntax-comment">$1</span>'
  );
  // Hash comments (bash, python)
  if (["bash", "shell", "sh", "python", "py", "yaml", "yml"].includes(language)) {
    result = result.replace(
      /^(#.*)$/gm,
      '<span class="syntax-comment">$1</span>'
    );
  }

  // Strings (double and single quoted, template literals)
  result = result.replace(
    /(&quot;(?:[^&]|&(?!quot;))*?&quot;)/g,
    '<span class="syntax-string">$1</span>'
  );
  result = result.replace(
    /(&#x27;(?:[^&]|&(?!#x27;))*?&#x27;)/g,
    '<span class="syntax-string">$1</span>'
  );
  result = result.replace(
    /(`[^`]*?`)/g,
    '<span class="syntax-string">$1</span>'
  );

  // Numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="syntax-number">$1</span>'
  );

  // TypeScript/JavaScript keywords
  if (
    ["typescript", "ts", "javascript", "js", "tsx", "jsx"].includes(
      language
    )
  ) {
    const keywords = [
      "import",
      "export",
      "from",
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "extends",
      "new",
      "this",
      "typeof",
      "instanceof",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "default",
      "switch",
      "case",
      "break",
      "continue",
      "interface",
      "type",
      "enum",
      "implements",
      "abstract",
      "private",
      "protected",
      "public",
      "static",
      "readonly",
      "as",
      "in",
      "of",
      "void",
      "null",
      "undefined",
      "true",
      "false",
    ];
    const kwPattern = new RegExp(
      `\\b(${keywords.join("|")})\\b`,
      "g"
    );
    result = result.replace(
      kwPattern,
      '<span class="syntax-keyword">$1</span>'
    );
  }

  // Bash keywords
  if (["bash", "shell", "sh"].includes(language)) {
    const bashKw = [
      "if",
      "then",
      "else",
      "fi",
      "for",
      "do",
      "done",
      "while",
      "case",
      "esac",
      "function",
      "return",
      "exit",
      "export",
      "source",
      "echo",
      "cd",
      "npm",
      "npx",
      "yarn",
      "pnpm",
      "curl",
      "sudo",
      "mkdir",
      "cat",
    ];
    const kwPattern = new RegExp(
      `\\b(${bashKw.join("|")})\\b`,
      "g"
    );
    result = result.replace(
      kwPattern,
      '<span class="syntax-keyword">$1</span>'
    );
  }

  // JSON keywords
  if (["json", "jsonc"].includes(language)) {
    result = result.replace(
      /\b(true|false|null)\b/g,
      '<span class="syntax-keyword">$1</span>'
    );
  }

  // Function calls (word followed by parenthesis)
  result = result.replace(
    /\b([a-zA-Z_]\w*)\s*(?=\()/g,
    '<span class="syntax-function">$1</span>'
  );

  // Types (PascalCase words)
  result = result.replace(
    /\b([A-Z][a-zA-Z0-9]*)\b/g,
    '<span class="syntax-type">$1</span>'
  );

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const languageLabels: Record<string, string> = {
  typescript: "TypeScript",
  ts: "TypeScript",
  tsx: "TSX",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  python: "Python",
  py: "Python",
  yaml: "YAML",
  yml: "YAML",
  curl: "cURL",
  http: "HTTP",
};

export function CodeBlock({
  code,
  language,
  filename,
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const highlighted = useMemo(
    () => highlightSyntax(code.trim(), language),
    [code, language]
  );

  const lines = code.trim().split("\n");
  const label = language ? languageLabels[language] || language : undefined;

  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle overflow-hidden my-4 group",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between h-9 px-4 bg-bg-elevated border-b border-border-faint">
        <div className="flex items-center gap-2">
          {filename ? (
            <span className="text-xs text-text-muted font-mono">
              {filename}
            </span>
          ) : label ? (
            <span className="text-xs text-text-muted font-mono">{label}</span>
          ) : null}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-signal" />
              <span className="text-signal">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="bg-bg-void overflow-x-auto">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((_, i) => (
                <tr key={i} className="leading-relaxed">
                  <td className="py-0 px-3 text-right text-xs text-text-muted select-none font-mono w-10 align-top">
                    {i + 1}
                  </td>
                  <td className="py-0 pr-4 text-sm font-mono">
                    <span
                      className="text-text-code"
                      dangerouslySetInnerHTML={{
                        __html: highlightSyntax(lines[i], language),
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="p-4 text-sm leading-relaxed font-mono text-text-code overflow-x-auto">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        )}
      </div>
    </div>
  );
}

/** Inline code span for use within paragraphs */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-bg-elevated text-signal text-sm font-mono border border-border-faint">
      {children}
    </code>
  );
}
