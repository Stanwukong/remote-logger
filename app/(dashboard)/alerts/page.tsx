"use client";

import { Suspense } from "react";
import { EnhancedAlertsPage } from "@/components/alerts/enhanced/EnhancedAlertsPage";
import { Loader2 } from "lucide-react";

export default function AlertsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-signal" />
        </div>
      }
    >
      <EnhancedAlertsPage />
    </Suspense>
  );
}
