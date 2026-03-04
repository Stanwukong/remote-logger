"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Building,
  Check,
  Eye,
  EyeOff,
  Shield,
  Zap,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { signupUser } from "@/services/auth.service";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState<string>("");

  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);

    try {
      await signupUser(values);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Account creation failed. Please try again.");
    }

    setIsLoading(false);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password)) strength += 17.5;
    if (/[a-z]/.test(password)) strength += 17.5;
    if (/[0-9]/.test(password)) strength += 17.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 17.5;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthLabel = (strength: number) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    if (strength < 100) return "Strong";
    return "Very Strong";
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 25) return "var(--status-danger)";
    if (strength < 50) return "var(--status-warn)";
    if (strength < 75) return "var(--status-warn)";
    return "var(--signal)";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <Badge
          variant="outline"
          className="mb-4 bg-signal/10 text-signal border-signal/30"
        >
          Create Account
        </Badge>
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
          Join Monita
        </h1>
        <p className="text-text-secondary">
          Start monitoring your applications in minutes. No credit card required
        </p>
      </div>

      {/* Signup Card */}
      <Card className="bg-bg-surface border-border-subtle shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-text-primary">
            Create your account
          </CardTitle>
          <CardDescription className="text-center text-text-secondary">
            Get started with your free Monita account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signup Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-secondary">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Femi"
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
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ajanaku"
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
                        placeholder="femi@example.com"
                        {...field}
                        disabled={isLoading}
                        className="bg-bg-base border-border-subtle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company (Optional) */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">
                      Company{" "}
                      <span className="text-text-muted">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <Building className="text-text-muted w-4 h-4" />
                        <Input
                          placeholder="Monita Inc."
                          {...field}
                          disabled={isLoading}
                          className="bg-bg-base border-border-subtle"
                        />
                      </div>
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
                      <div className="flex gap-2">
                        <Input
                          placeholder="Create a strong password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handlePasswordChange(e.target.value);
                          }}
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          className="bg-bg-base border-border-subtle"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-text-muted" />
                          ) : (
                            <Eye className="h-4 w-4 text-text-muted" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      Password Strength
                    </span>
                    <span className="text-xs font-medium text-text-secondary">
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <Progress
                    style={{
                      backgroundColor: getStrengthColor(passwordStrength),
                    }}
                    value={passwordStrength}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          disabled={isLoading}
                          className="bg-bg-base border-border-subtle"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-text-muted" />
                          ) : (
                            <Eye className="h-4 w-4 text-text-muted" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="signal"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-text-muted">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-signal hover:text-signal-bright font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-text-primary">
            What you get with Monita:
          </h3>
          <div className="pl-10 grid grid-cols-2 gap-4 text-xs text-text-muted">
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-signal" />
              <span>10,000 free logs/month</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-signal" />
              <span>Real-time monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-signal" />
              <span>Advanced search & filtering</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-signal" />
              <span>Email & Slack alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-signal/10 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-signal" />
          </div>
          <p className="text-xs text-text-muted">
            <span className="font-medium text-text-primary">
              Enterprise Security
            </span>
            <br />
            SOC 2 compliant
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-data-info/10 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-data-info" />
          </div>
          <p className="text-xs text-text-muted">
            <span className="font-medium text-text-primary">Quick Setup</span>
            <br />
            Start logging in 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
