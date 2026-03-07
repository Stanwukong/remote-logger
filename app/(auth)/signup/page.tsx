"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  Github,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Must contain at least one special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.signUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      toast.success("Account created! Welcome to Monita.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "github" | "google") => {
    const callbackUrl = `${window.location.origin}/callback`;

    if (provider === "github") {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      if (!clientId) {
        toast.error("GitHub OAuth is not configured.");
        return;
      }
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email&state=github`;
    } else {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        toast.error("Google OAuth is not configured.");
        return;
      }
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=email%20profile&state=google`;
    }
  };

  const passwordStrength = (() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-status-danger" };
    if (score <= 4) return { label: "Fair", color: "bg-status-warn" };
    return { label: "Strong", color: "bg-signal" };
  })();

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
              Monita
            </h1>
          </Link>
          <p className="text-text-muted mt-2 text-sm">
            Create your observability account
          </p>
        </div>

        <Card className="bg-bg-surface border-border-subtle shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display text-text-primary text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-text-muted text-center">
              Start monitoring your applications in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("github")}
                className="border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-bg-surface text-text-muted">
                  or sign up with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-text-secondary text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName)
                        setErrors((p) => ({ ...p, firstName: "" }));
                    }}
                    placeholder="John"
                    autoComplete="given-name"
                    className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-status-danger">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-text-secondary text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName)
                        setErrors((p) => ({ ...p, lastName: "" }));
                    }}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-status-danger">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-secondary text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
                />
                {errors.email && (
                  <p className="text-xs text-status-danger">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-text-secondary text-sm flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Min 8 chars, mixed case, number, special"
                    autoComplete="new-password"
                    className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-status-danger">{errors.password}</p>
                )}
                {passwordStrength && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <=
                            (passwordStrength.label === "Weak"
                              ? 1
                              : passwordStrength.label === "Fair"
                              ? 2
                              : 3)
                              ? passwordStrength.color
                              : "bg-bg-elevated"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-muted">
                      Strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-text-secondary text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((p) => ({ ...p, confirmPassword: "" }));
                    }}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-status-danger">
                    {errors.confirmPassword}
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-signal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="signal"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign in link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-signal hover:text-signal-bright font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
