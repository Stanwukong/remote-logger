import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
  { href: "#company", label: "Company" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl md:text-xl font-semibold">LogHive</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
