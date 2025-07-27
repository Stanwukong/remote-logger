"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language: string
  code: string
  title?: string
  showCopy?: boolean
  className?: string
}

export function CodeBlock({ language, code, title, showCopy = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border/50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className={cn("bg-muted p-4 text-sm font-mono overflow-x-auto", title ? "rounded-b-lg" : "rounded-lg")}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
        {showCopy && !title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
