"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/schemas/auth";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signupUser } from "@/services/auth.service";
import { apiClient } from "@/services/config";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-signal animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [inviteHint, setInviteHint] = useState("");

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      inviteCode: searchParams.get("code") || "",
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
    },
  });

  const inviteCode = form.watch("inviteCode");

  // Validate invite code when it looks complete (APER-XXXXXX)
  useEffect(() => {
    if (!inviteCode || inviteCode.length < 6) {
      setInviteStatus("idle");
      setInviteHint("");
      return;
    }

    const timer = setTimeout(async () => {
      setInviteStatus("validating");
      try {
        const res = await apiClient.get(
          `/waitlist/validate-invite/${encodeURIComponent(inviteCode)}`
        );
        if (res.data?.valid) {
          setInviteStatus("valid");
          setInviteHint(res.data.email || "");
        } else {
          setInviteStatus("invalid");
          setInviteHint(res.data?.reason || "Invalid code.");
        }
      } catch {
        setInviteStatus("invalid");
        setInviteHint("Could not validate code.");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inviteCode]);

  const onSubmit = async (values: SignUpForm) => {
    if (inviteStatus !== "valid") {
      toast.error("Please enter a valid invite code.");
      return;
    }

    setIsLoading(true);
    try {
      await signupUser(values);
      toast.success("Account created. Welcome to Apperio.");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Sign up failed. Please try again.";
      toast.error(message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
          Create your account
        </h1>
        <p className="text-text-secondary text-sm">
          Enter your invite code and set up your Apperio account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Invite Code */}
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-text-secondary">
                  Invite Code
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="APER-XXXXXX"
                      {...field}
                      disabled={isLoading}
                      className="bg-bg-base border-border-subtle font-mono uppercase tracking-wider"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {inviteStatus === "validating" && (
                        <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
                      )}
                      {inviteStatus === "valid" && (
                        <CheckCircle2 className="w-4 h-4 text-signal" />
                      )}
                    </div>
                  </div>
                </FormControl>
                {inviteStatus === "valid" && inviteHint && (
                  <p className="text-xs text-signal mt-1">
                    Invite for {inviteHint}
                  </p>
                )}
                {inviteStatus === "invalid" && (
                  <p className="text-xs text-status-danger mt-1">
                    {inviteHint}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ada"
                      {...field}
                      disabled={isLoading}
                      className="bg-bg-base border-border-subtle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lovelace"
                      {...field}
                      disabled={isLoading}
                      className="bg-bg-base border-border-subtle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-text-secondary">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ada@example.com"
                    {...field}
                    disabled={isLoading}
                    className="bg-bg-base border-border-subtle"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-text-secondary">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Min 8 chars, mixed case + number + symbol"
                    {...field}
                    disabled={isLoading}
                    className="bg-bg-base border-border-subtle"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-text-secondary">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter your password"
                    {...field}
                    disabled={isLoading}
                    className="bg-bg-base border-border-subtle"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="signal"
            className="w-full"
            disabled={isLoading || inviteStatus !== "valid"}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* OAuth divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg-base px-2 text-text-muted">
            or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-border-subtle text-text-secondary hover:text-text-primary"
        disabled={isLoading || inviteStatus !== "valid"}
        onClick={() => {
          if (inviteStatus !== "valid") {
            toast.error("Please enter a valid invite code first.");
            return;
          }
          const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
          if (githubClientId) {
            const redirectUri = `${window.location.origin}/callback`;
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email&state=github&redirect_uri=${encodeURIComponent(redirectUri)}`;
          } else {
            toast.error("GitHub OAuth is not configured.");
          }
        }}
      >
        <Github className="w-4 h-4 mr-2" />
        GitHub
      </Button>

      <div className="text-center space-y-3 text-sm text-text-muted">
        <div>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-signal hover:text-signal-bright font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
        <div>
          No invite code?{" "}
          <Link
            href="/#waitlist"
            className="text-signal hover:text-signal-bright font-medium transition-colors"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}
