"use client";

import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "cards" | "table";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-md border border-border-subtle bg-bg-base overflow-hidden">
      <button
        onClick={() => onChange("cards")}
        className={`flex items-center justify-center w-8 h-7 transition-colors ${
          mode === "cards"
            ? "bg-signal/15 text-signal"
            : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
        }`}
        title="Card view"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onChange("table")}
        className={`flex items-center justify-center w-8 h-7 border-l border-border-subtle transition-colors ${
          mode === "table"
            ? "bg-signal/15 text-signal"
            : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
        }`}
        title="Table view"
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
