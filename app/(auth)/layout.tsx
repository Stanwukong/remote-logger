import type React from "react";
import { Header } from "@/components/landing/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="flex-1 p-6 bg-muted/20">{children}</main>
      </div>
    </header>
  );
}
