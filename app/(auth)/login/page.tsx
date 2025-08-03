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
  Github,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);

    // Simulate social signup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast(`Creating account with ${provider}`);

    router.push("/dashboard");
  };

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);

    try {
      await signinUser(values.email, values.password);

      toast.success("You've been successfuly logged in.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(`Something went wrong. Please try again. ${error}`);
    }

    console.log(values);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <Badge variant={"secondary"} className="mb-4">
          Create Account
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your LogHive account to continue monitoring your
          applications.
        </p>
      </div>

      {/* Signup Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Signup Buttons */}
          {/* <div className="space-y-3">
            <Button
              variant={"outline"}
              className="w-full bg-transparent"
              onClick={() => handleSocialSignup("Github")}
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              variant={"outline"}
              className="w-full bg-transparent"
              onClick={() => handleSocialSignup("Google")}
              disabled={isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div> */}

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="femi@example.com"
                        {...field}
                        disabled={isLoading}
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
                      <FormLabel>Password</FormLabel>
                      <Link
                        href={"/forgot-password"}
                        className="font-semibold text-sm"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Create a strong password"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"sm"}
                          className="hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
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
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Secure Login
            </span>
            <br />
            256-bit SSL encryption
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Fast Access</span>
            <br />
            Single sign-on ready
          </p>
        </div>
      </div>
    </div>
  );
}
