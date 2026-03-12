"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { mfaService } from "@/services/mfa.service";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function MfaVerifyPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [useBackupCode]);

  // Check that we have an mfaToken, otherwise redirect back to login
  useEffect(() => {
    const mfaToken = sessionStorage.getItem("mfaToken");
    if (!mfaToken) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (submittedCode?: string) => {
    const codeToValidate = submittedCode || code;

    if (!codeToValidate.trim()) {
      setError(useBackupCode ? "Backup code is required" : "Code is required");
      return;
    }

    const mfaToken = sessionStorage.getItem("mfaToken");
    if (!mfaToken) {
      toast.error("MFA session expired. Please log in again.");
      router.replace("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await mfaService.validateMfa(mfaToken, codeToValidate.trim());

      // Store the full JWT and clean up
      if (result?.token) {
        Cookies.set("authToken", result.token, { expires: 7 });
      }
      sessionStorage.removeItem("mfaToken");

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    if (useBackupCode) {
      // Backup codes are 8 hex chars
      const sanitized = value.replace(/[^a-fA-F0-9]/g, "").slice(0, 8);
      setCode(sanitized);
      setError("");
    } else {
      // TOTP codes are 6 digits
      const sanitized = value.replace(/\D/g, "").slice(0, 6);
      setCode(sanitized);
      setError("");

      // Auto-submit when 6 digits entered
      if (sanitized.length === 6) {
        handleSubmit(sanitized);
      }
    }
  };

  const toggleMode = () => {
    setUseBackupCode(!useBackupCode);
    setCode("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #00d97e 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-signal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-signal tracking-tight">
              Apperio
            </h1>
          </Link>
          <p className="text-text-muted mt-2 text-sm">
            Two-factor authentication
          </p>
        </div>

        <Card className="bg-bg-surface border-border-subtle shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-signal/10 flex items-center justify-center mb-3">
              {useBackupCode ? (
                <KeyRound className="w-6 h-6 text-signal" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-signal" />
              )}
            </div>
            <CardTitle className="text-xl font-display text-text-primary">
              {useBackupCode
                ? "Enter backup code"
                : "Enter your authenticator code"}
            </CardTitle>
            <CardDescription className="text-text-muted">
              {useBackupCode
                ? "Enter one of your saved backup codes to sign in"
                : "Open your authenticator app and enter the 6-digit code"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  ref={inputRef}
                  type="text"
                  inputMode={useBackupCode ? "text" : "numeric"}
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={useBackupCode ? "e.g. a1b2c3d4" : "000000"}
                  className={`bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20 text-center font-mono text-2xl tracking-[0.3em] h-14 ${
                    error ? "border-status-danger" : ""
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-xs text-status-danger text-center">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="signal"
                className="w-full"
                disabled={isLoading || !code.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Verify
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-signal hover:text-signal-bright transition-colors"
              >
                {useBackupCode
                  ? "Use authenticator code instead"
                  : "Use a backup code"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Back to login */}
        <p className="text-center text-sm text-text-muted mt-6">
          <Link
            href="/login"
            className="text-signal hover:text-signal-bright font-medium transition-colors inline-flex items-center gap-1"
            onClick={() => sessionStorage.removeItem("mfaToken")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
