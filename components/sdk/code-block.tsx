"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  language,
  code,
  title,
  showCopy = true,
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  const getIcon = () => {
    if (language === "bash" || language === "shell") {
      return <Terminal className="w-3.5 h-3.5 text-text-muted" />;
    }
    return <FileCode className="w-3.5 h-3.5 text-text-muted" />;
  };

  const getLanguageLabel = () => {
    const labels: Record<string, string> = {
      typescript: "TypeScript",
      tsx: "TSX",
      javascript: "JavaScript",
      jsx: "JSX",
      bash: "Terminal",
      shell: "Terminal",
      json: "JSON",
      yaml: "YAML",
      text: "Plain Text",
    };
    return labels[language] || language;
  };

  return (
    <div
      className={cn(
        "relative group rounded-lg overflow-hidden",
        "border border-white/[0.06] bg-bg-void/80",
        className
      )}
    >
      {/* Header bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {/* Traffic light dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-status-danger/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-status-warn/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-status-ok/60" />
            </div>
            {getIcon()}
            <span className="text-xs font-mono text-text-muted">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider">
              {getLanguageLabel()}
            </span>
            {showCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-text-muted hover:text-signal hover:bg-signal/10"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-signal" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="overflow-x-auto scrollbar-hide">
        <pre
          className={cn(
            "p-4 text-sm font-mono leading-relaxed text-text-primary/90",
            !title && "rounded-lg"
          )}
        >
          {showLineNumbers ? (
            <code className={`language-${language}`}>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="inline-block w-8 text-right mr-4 text-text-muted/40 select-none text-xs leading-relaxed">
                    {i + 1}
                  </span>
                  <span className="flex-1">{line}</span>
                </div>
              ))}
            </code>
          ) : (
            <code className={`language-${language}`}>{code}</code>
          )}
        </pre>
      </div>

      {/* Floating copy button for title-less blocks */}
      {showCopy && !title && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bg-elevated/80 backdrop-blur-sm text-text-muted hover:text-signal hover:bg-signal/10 border border-white/[0.06]"
        >
          {copied ? (
            <Check className="w-3 h-3 text-signal" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  );
}
