"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInvoices, useSubscription } from "@/hooks/billing.hooks";
import {
  ArrowLeft,
  Download,
  Loader2,
  Receipt,
  FileText,
} from "lucide-react";
import Link from "next/link";

/**
 * Format cents to dollar display.
 */
function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get badge variant for invoice status.
 */
function getStatusVariant(
  status: string
): "status-ok" | "status-warn" | "status-danger" {
  switch (status) {
    case "paid":
      return "status-ok";
    case "pending":
      return "status-warn";
    case "failed":
      return "status-danger";
    default:
      return "status-warn";
  }
}

export default function InvoicesPage() {
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: subscription } = useSubscription();

  if (invoicesLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Invoices"
          description="View your billing history"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      </div>
    );
  }

  const isEmpty = !invoices || invoices.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View your billing history"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/billing">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Billing
            </Link>
          </Button>
        }
      />

      <Card className="border-border-subtle bg-bg-surface">
        <CardHeader>
          <CardTitle className="text-text-primary font-display text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-text-muted" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-10 h-10 text-text-muted mb-3" />
              <h3 className="text-sm font-medium text-text-primary mb-1">
                No invoices yet
              </h3>
              <p className="text-sm text-text-muted max-w-sm">
                {subscription?.plan === "developer"
                  ? "You are on the free Developer plan. Upgrade to a paid plan to see invoices."
                  : "Invoice history will appear here after your first billing cycle."}
              </p>
              {subscription?.plan === "developer" && (
                <Button variant="signal" size="sm" className="mt-4" asChild>
                  <Link href="/billing/plans">View Plans</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border-faint text-xs font-medium text-text-muted uppercase tracking-wider">
                <div className="col-span-3">Date</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Invoice rows */}
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border-faint last:border-b-0 items-center hover:bg-bg-elevated/30 transition-colors"
                >
                  <div className="col-span-3 text-sm text-text-primary">
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="col-span-3 text-sm text-text-secondary truncate">
                    {invoice.description}
                  </div>
                  <div className="col-span-2 text-sm font-medium text-text-primary">
                    {formatAmount(invoice.amount)}
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant={getStatusVariant(invoice.status)}
                      className="capitalize text-[10px]"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-text-muted hover:text-text-primary"
                      onClick={() => {
                        // Mock download - in production this would download a PDF
                        toast("Invoice download is not available in demo mode");
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple toast fallback for the download button
function toast(message: string) {
  if (typeof window !== "undefined") {
    import("sonner").then(({ toast: sonnerToast }) => {
      sonnerToast.info(message);
    });
  }
}
