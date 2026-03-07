"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React strict mode
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state") as "github" | "google" | null;

    if (!code || !state || !["github", "google"].includes(state)) {
      toast.error("Invalid OAuth callback. Please try again.");
      router.replace("/login");
      return;
    }

    authService
      .oauthLogin(code, state)
      .then(() => {
        toast.success("Welcome to Monita!");
        router.replace("/dashboard");
      })
      .catch((err: any) => {
        toast.error(err?.message || "OAuth sign in failed. Please try again.");
        router.replace("/login");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-signal animate-spin" />
      <p className="text-text-primary font-body text-base">
        Completing sign in...
      </p>
      <p className="text-text-muted text-sm">
        Please wait while we verify your account.
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-signal animate-spin" />
          <p className="text-text-primary font-body text-base">
            Loading...
          </p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
