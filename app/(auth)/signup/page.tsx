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
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

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

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);

    // Simulate social signup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast(`Creating account with ${provider}`);

    router.push("/dashboard");
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);

    try {
      // await signupUser(values);

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(`Something went wrong. Please try again. ${error}`);
    }

    console.log(values);
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
    if (strength < 25) return "#A61C3C";
    if (strength < 50) return "#F18805";
    if (strength < 75) return "#FFC145";
    return "#06D6A0";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <Badge variant={"secondary"} className="mb-4">
          Create Account
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Join LogHive</h1>
        <p className="text-muted-foreground">
          Start monitoring your applications in minutes. No credit card required
        </p>
      </div>

      {/* Signup Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Get started with your free LogHive account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Social Signup Buttons */}
          {/* <div className="space-y-3">
            <Button
              variant={"outline"}
              className="w-full bg-transparent"
              onClick={() => handleSocialSignup("github")}
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              variant={"outline"}
              className="w-full bg-transparent"
              onClick={() => handleSocialSignup("google")}
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
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Femi"
                          {...field}
                          disabled={isLoading}
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ajanaku"
                          {...field}
                          disabled={isLoading}
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

              {/* Company (Optional) */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Company{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <Building className="text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="LogHive Inc."
                          {...field}
                          disabled={isLoading}
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
                    <FormLabel>Password</FormLabel>
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Password Strength
                    </span>
                    <span className="text-xs font-medium">
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"sm"}
                          className="hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
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
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">
            What you get with LogHive:
          </h3>
          <div className="pl-10 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>10,000 free logs/month</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>Real-time monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>Advanced search & filtering</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>Email & Slack alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Enterprise Security
            </span>
            <br />
            SOC 2 compliant
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Quick Setup</span>
            <br />
            Start logging in 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
