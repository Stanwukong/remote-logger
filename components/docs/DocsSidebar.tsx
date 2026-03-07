"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNavigation } from "@/lib/docs/navigation";
import { ChevronDown, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function slugToPath(slug: string): string {
  return `/docs/${slug}`;
}

function SidebarNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const currentSlug = pathname.replace("/docs/", "").replace("/docs", "");

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className="flex flex-col gap-1 py-4" aria-label="Documentation">
      {docsNavigation.map((section) => {
        const isCollapsed = collapsed[section.title] ?? false;
        const hasActive = section.items.some(
          (item) => item.slug === currentSlug
        );

        return (
          <div key={section.title} className="mb-2">
            <button
              onClick={() => toggleSection(section.title)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
                "text-text-muted hover:text-text-secondary transition-colors duration-150",
                hasActive && "text-text-secondary"
              )}
            >
              <span>{section.title}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isCollapsed && "-rotate-90"
                )}
              />
            </button>

            {!isCollapsed && (
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = item.slug === currentSlug;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={slugToPath(item.slug)}
                        onClick={onNavigate}
                        className={cn(
                          "block px-3 py-1.5 ml-2 text-sm rounded-md transition-colors duration-150",
                          "border-l-2",
                          isActive
                            ? "border-l-signal text-signal bg-signal-muted font-medium"
                            : "border-l-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/** Desktop sidebar - fixed on left */
export function DocsSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-border-subtle bg-bg-base h-screen sticky top-0 overflow-y-auto scrollbar-hide">
      <div className="p-4 border-b border-border-subtle">
        <Link
          href="/docs/introduction"
          className="flex items-center gap-2 text-text-primary hover:text-signal transition-colors"
        >
          <span className="font-display text-lg font-bold">Monita</span>
          <span className="text-xs text-text-muted font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border-faint">
            docs
          </span>
        </Link>
      </div>
      <SidebarNavContent />
    </aside>
  );
}

/** Mobile sidebar trigger + sheet */
export function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center justify-between px-4 h-14">
        <Link
          href="/docs/introduction"
          className="flex items-center gap-2 text-text-primary"
        >
          <span className="font-display text-lg font-bold">Monita</span>
          <span className="text-xs text-text-muted font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border-faint">
            docs
          </span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-bg-base p-0">
            <SheetHeader className="p-4 border-b border-border-subtle">
              <SheetTitle className="text-text-primary font-display">
                Documentation
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto flex-1 px-2">
              <SidebarNavContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
