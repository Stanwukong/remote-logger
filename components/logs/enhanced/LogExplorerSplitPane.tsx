"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LogExplorerSplitPaneProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplitPercentage?: number;
  minSplitPercentage?: number;
  maxSplitPercentage?: number;
}

export function LogExplorerSplitPane({
  leftPanel,
  rightPanel,
  defaultSplitPercentage = 50,
  minSplitPercentage = 30,
  maxSplitPercentage = 70,
}: LogExplorerSplitPaneProps) {
  const [splitPercentage, setSplitPercentage] = useState(defaultSplitPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newPercentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      const clampedPercentage = Math.min(
        Math.max(newPercentage, minSplitPercentage),
        maxSplitPercentage
      );

      setSplitPercentage(clampedPercentage);
    },
    [isDragging, minSplitPercentage, maxSplitPercentage]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex h-full w-full relative",
        isDragging && "select-none cursor-col-resize"
      )}
    >
      {/* Left Panel */}
      <div
        className="h-full overflow-auto border-r border-border-subtle bg-bg-base"
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "w-1 h-full cursor-col-resize relative group hover:bg-signal/20 transition-colors",
          isDragging && "bg-signal/30"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-0.5 h-12 bg-signal rounded-full shadow-[var(--glow-signal-sm)]" />
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="h-full overflow-auto bg-bg-surface"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
