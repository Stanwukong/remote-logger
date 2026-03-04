"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/schemas/auth";
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
import Link from "next/link";
import { signinUser } from "@/services/auth.service";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);

    try {
      await signinUser(values.email, values.password);
      router.push("/dashboard");
      toast.success("Login successful.");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <Badge
          variant="outline"
          className="mb-4 bg-signal/10 text-signal border-signal/30"
        >
          Welcome Back
        </Badge>
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
          Welcome back
        </h1>
        <p className="text-text-secondary">
          Sign in to your Monita account to continue monitoring your
          applications.
        </p>
      </div>

      {/* Login Card */}
      <Card className="bg-bg-surface border-border-subtle shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-text-primary">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-text-secondary">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="text-text-secondary">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="font-semibold text-sm text-signal hover:text-signal-bright transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter your password"
                          {...field}
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

              <Button
                type="submit"
                variant="signal"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-text-muted">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-signal hover:text-signal-bright font-medium transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-signal/10 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-signal" />
          </div>
          <p className="text-xs text-text-muted">
            <span className="font-medium text-text-primary">
              Secure Login
            </span>
            <br />
            256-bit SSL encryption
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-data-info/10 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-data-info" />
          </div>
          <p className="text-xs text-text-muted">
            <span className="font-medium text-text-primary">Fast Access</span>
            <br />
            Single sign-on ready
          </p>
        </div>
      </div>
    </div>
  );
}
