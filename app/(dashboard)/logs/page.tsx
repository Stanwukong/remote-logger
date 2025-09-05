

"use client";

import { Suspense } from "react";
import LogsExplorerContent from "@/components/logs/LogsExplorer";

export default function LogsExplorer() {
  

  return (
    <Suspense fallback={
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    }>
      <LogsExplorerContent />
    </Suspense>
  );
}
