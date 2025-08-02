"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { useState } from "react";
import { CommandPalette } from "@/components/command-palette";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar onCommandOpen={() => setCommandOpen(true)} />
            <main className="flex-1 p-6 bg-muted/20">{children}</main>
          </div>
        </div>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
