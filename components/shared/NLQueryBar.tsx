"use client";

import { useState, useCallback } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIResponseCard } from "./AIResponseCard";

interface NLQueryBarProps {
  onSubmit: (question: string) => void;
  response?: { answer: string; source: "ai" | "heuristic" } | null;
  isLoading?: boolean;
  suggestions?: string[];
  placeholder?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Show me error spikes",
  "What's causing slow responses?",
  "Compare this week vs last",
  "Which service has the most errors?",
];

export function NLQueryBar({
  onSubmit,
  response,
  isLoading = false,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Ask a question about your logs...",
}: NLQueryBarProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  }, [question, isLoading, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setQuestion("");
      }
    },
    [handleSubmit]
  );

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    onSubmit(suggestion);
  };

  return (
    <div className="space-y-3">
      {/* Input container */}
      <div className="bg-bg-surface border border-border-faint rounded-xl p-3 transition-all focus-within:border-signal focus-within:ring-[3px] focus-within:ring-signal/10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-signal shrink-0" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none font-body disabled:opacity-50"
          />
          {question && !isLoading && (
            <button
              onClick={() => setQuestion("")}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <Button
            variant="signal"
            size="sm"
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="rounded-lg px-3 py-1.5 text-sm font-medium"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Suggestion chips — show when input is empty and no response */}
      {!question && !response && !isLoading && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-bg-elevated border border-border-subtle rounded-full px-3 py-1.5 text-[13px] text-signal cursor-pointer hover:bg-signal/10 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="bg-bg-surface border border-border-faint rounded-xl p-4 border-l-[3px] border-l-signal">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-signal" />
            <span className="text-sm text-text-secondary">Analyzing your data</span>
            <span className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ai-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ai-dot [animation-delay:160ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ai-dot [animation-delay:320ms]" />
            </span>
          </div>
        </div>
      )}

      {/* Response */}
      {response && !isLoading && (
        <AIResponseCard
          content={response.answer}
          source={response.source}
        />
      )}
    </div>
  );
}
