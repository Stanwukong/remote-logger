import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "./globals-animations.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Monita - Your app is trying to tell you something.",
  description:
    "Stop guessing what's breaking in production. Real-time logging, error tracking, and performance monitoring for modern applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmSans.variable} ${GeistMono.variable} font-body antialiased scrollbar-hide`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
          <Toaster richColors position="top-left" expand={true} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
