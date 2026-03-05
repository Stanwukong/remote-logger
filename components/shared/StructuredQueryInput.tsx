"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StructuredQueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  label: string;
  /** The text that will be inserted into the input. */
  insertText: string;
  /** Optional description shown to the right of the label. */
  description?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FIELD_PREFIXES = ["level:", "service:", "environment:", "eventType:"] as const;

const KEYWORDS = ["AND", "OR", "NOT"] as const;

const FIELD_VALUES: Record<string, Suggestion[]> = {
  "level:": [
    { label: "trace", insertText: "trace", description: "Lowest severity" },
    { label: "debug", insertText: "debug", description: "Diagnostic info" },
    { label: "info", insertText: "info", description: "General information" },
    { label: "warn", insertText: "warn", description: "Potential issue" },
    { label: "error", insertText: "error", description: "Error occurred" },
    { label: "fatal", insertText: "fatal", description: "Critical failure" },
  ],
  "eventType:": [
    { label: "error", insertText: "error", description: "Error events" },
    { label: "performance", insertText: "performance", description: "Perf metrics" },
    { label: "interaction", insertText: "interaction", description: "User clicks" },
    { label: "network", insertText: "network", description: "HTTP requests" },
    { label: "console", insertText: "console", description: "Console output" },
    { label: "pageview", insertText: "pageview", description: "Page navigations" },
  ],
};

/** Suggestions shown when the input is empty or at a generic position. */
const ROOT_SUGGESTIONS: Suggestion[] = [
  ...FIELD_PREFIXES.map((p) => ({
    label: p,
    insertText: p,
    description: "Field filter",
  })),
  ...KEYWORDS.map((k) => ({
    label: k,
    insertText: k + " ",
    description: "Operator",
  })),
];

// ---------------------------------------------------------------------------
// Parse helper
// ---------------------------------------------------------------------------

export function parseStructuredQuery(query: string): {
  search?: string;
  levels?: string[];
  services?: string[];
  environments?: string[];
  eventTypes?: string[];
} {
  const result: {
    search?: string;
    levels?: string[];
    services?: string[];
    environments?: string[];
    eventTypes?: string[];
  } = {};

  const freeTextParts: string[] = [];

  // Tokenise: split on whitespace but keep field:value pairs intact
  const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip boolean operators – they're structural, not content
    if (token === "AND" || token === "OR" || token === "NOT") {
      // If NOT precedes a field:value, we intentionally skip it for now
      // (negation filtering is handled at the API layer).
      continue;
    }

    const colonIdx = token.indexOf(":");
    if (colonIdx > 0) {
      const field = token.substring(0, colonIdx).toLowerCase();
      const rawValue = token.substring(colonIdx + 1).replace(/^"|"$/g, "");

      if (!rawValue) continue;

      const values = rawValue.split(",").map((v) => v.trim()).filter(Boolean);

      switch (field) {
        case "level":
          result.levels = [...(result.levels ?? []), ...values];
          break;
        case "service":
          result.services = [...(result.services ?? []), ...values];
          break;
        case "environment":
          result.environments = [...(result.environments ?? []), ...values];
          break;
        case "eventtype":
          result.eventTypes = [...(result.eventTypes ?? []), ...values];
          break;
        default:
          // Unknown field – treat as free text
          freeTextParts.push(token);
          break;
      }
    } else {
      freeTextParts.push(token);
    }
  }

  if (freeTextParts.length > 0) {
    result.search = freeTextParts.join(" ");
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Determine the "word" the cursor is currently inside of by walking backwards
 * and forwards from the cursor position.
 */
function getCurrentWord(text: string, cursorPos: number): { word: string; start: number; end: number } {
  let start = cursorPos;
  while (start > 0 && text[start - 1] !== " ") {
    start--;
  }
  let end = cursorPos;
  while (end < text.length && text[end] !== " ") {
    end++;
  }
  return { word: text.substring(start, end), start, end };
}

function buildSuggestions(text: string, cursorPos: number): Suggestion[] {
  const { word, start } = getCurrentWord(text, cursorPos);

  if (!word) {
    return ROOT_SUGGESTIONS;
  }

  // Check if the current word is a recognised field prefix (e.g. "level:")
  for (const prefix of FIELD_PREFIXES) {
    if (word.startsWith(prefix)) {
      const valueFragment = word.substring(prefix.length).toLowerCase();
      const candidates = FIELD_VALUES[prefix];
      if (!candidates) return [];
      return candidates
        .filter((c) => c.label.toLowerCase().startsWith(valueFragment))
        .map((c) => ({
          ...c,
          // When inserting we replace the entire current word
          insertText: prefix + c.insertText,
        }));
    }
  }

  // Partial field prefix match (e.g. user typed "lev" → suggest "level:")
  const lower = word.toLowerCase();

  const matching: Suggestion[] = [];

  for (const prefix of FIELD_PREFIXES) {
    if (prefix.toLowerCase().startsWith(lower)) {
      matching.push({ label: prefix, insertText: prefix, description: "Field filter" });
    }
  }

  for (const kw of KEYWORDS) {
    if (kw.toLowerCase().startsWith(lower) && kw.toLowerCase() !== lower) {
      matching.push({ label: kw, insertText: kw + " ", description: "Operator" });
    }
  }

  // If we're after an operator or the text is empty around cursor, show root
  const prevToken = text.substring(0, start).trim().split(/\s+/).pop()?.toUpperCase();
  if (prevToken === "AND" || prevToken === "OR" || prevToken === "NOT") {
    if (matching.length === 0) {
      return FIELD_PREFIXES.map((p) => ({
        label: p,
        insertText: p,
        description: "Field filter",
      }));
    }
  }

  return matching;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StructuredQueryInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search logs... (e.g. level:error AND service:auth)",
  className,
}: StructuredQueryInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);

  // Derive suggestions from the current value + cursor position
  const suggestions = useMemo(() => buildSuggestions(value, cursorPos), [value, cursorPos]);

  // Keep selected index in bounds when suggestions change
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(suggestions.length - 1, 0)));
  }, [suggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (!dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll("[data-suggestion]");
    const item = items[selectedIndex];
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const applySuggestion = useCallback(
    (suggestion: Suggestion) => {
      const { start, end } = getCurrentWord(value, cursorPos);
      const before = value.substring(0, start);
      const after = value.substring(end);
      const needsSpace = after.length > 0 && after[0] !== " " ? " " : "";
      const trailingSpace = after.length === 0 ? " " : "";
      const newValue = before + suggestion.insertText + trailingSpace + needsSpace + after;

      onChange(newValue);
      setShowDropdown(false);

      // Move cursor to end of inserted text
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newPos = before.length + suggestion.insertText.length + trailingSpace.length;
          inputRef.current.setSelectionRange(newPos, newPos);
          inputRef.current.focus();
          setCursorPos(newPos);
        }
      });
    },
    [value, cursorPos, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (showDropdown && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % suggestions.length);
            return;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
            return;
          case "Tab":
            e.preventDefault();
            applySuggestion(suggestions[selectedIndex]);
            return;
          case "Enter":
            e.preventDefault();
            applySuggestion(suggestions[selectedIndex]);
            return;
          case "Escape":
            e.preventDefault();
            setShowDropdown(false);
            return;
        }
      }

      if (e.key === "Enter" && !showDropdown) {
        onSubmit?.();
      }

      if (e.key === "Escape" && !showDropdown) {
        inputRef.current?.blur();
      }
    },
    [showDropdown, suggestions, selectedIndex, applySuggestion, onSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setCursorPos(e.target.selectionStart ?? e.target.value.length);
      setShowDropdown(true);
      setSelectedIndex(0);
    },
    [onChange]
  );

  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPos(target.selectionStart ?? target.value.length);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowDropdown(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding so that click on suggestion can fire first
    setTimeout(() => setShowDropdown(false), 200);
  }, []);

  const handleClear = useCallback(() => {
    onChange("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input row */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
          "bg-bg-base border-border-faint",
          isFocused && "border-signal ring-1 ring-signal/20"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-text-muted" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          className={cn(
            "flex-1 bg-transparent text-sm text-text-primary font-mono",
            "placeholder:text-text-muted",
            "outline-none"
          )}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded p-0.5 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestion dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border",
            "bg-bg-surface border-border-subtle shadow-lg shadow-black/30"
          )}
          role="listbox"
        >
          {suggestions.map((suggestion, idx) => {
            const isSelected = idx === selectedIndex;
            const isField = FIELD_PREFIXES.includes(suggestion.label as typeof FIELD_PREFIXES[number]);
            const isKeyword = (KEYWORDS as readonly string[]).includes(suggestion.label);

            return (
              <div
                key={suggestion.label + idx}
                data-suggestion
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 text-sm font-mono cursor-pointer transition-colors",
                  isSelected ? "bg-signal/10 text-signal" : "text-text-primary hover:bg-white/5"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applySuggestion(suggestion);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span
                  className={cn(
                    isField && !isSelected && "text-signal",
                    isKeyword && !isSelected && "text-data-info"
                  )}
                >
                  {suggestion.label}
                </span>
                {suggestion.description && (
                  <span className="text-xs text-text-muted truncate">{suggestion.description}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Inline hint */}
      {isFocused && !value && (
        <p className="mt-1.5 text-[11px] text-text-muted font-mono">
          Tip: use <span className="text-signal">level:</span>error{" "}
          <span className="text-data-info">AND</span>{" "}
          <span className="text-signal">service:</span>auth to filter logs
        </p>
      )}
    </div>
  );
}
