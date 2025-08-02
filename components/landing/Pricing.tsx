import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Shield, Globe, Clock } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Developer",
    description: "Perfect for personal projects and small teams",
    price: "Free",
    period: "forever",
    features: [
      "Up to 10,000 logs/month",
      "7-day log retention",
      "Basic alerting",
      "Email support",
      "1 project",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing teams and production applications",
    price: "$29",
    period: "/month",
    features: [
      "Up to 1M logs/month",
      "30-day log retention",
      "Advanced alerting & notifications",
      "Priority support",
      "Unlimited projects",
      "Team collaboration",
      "API access",
      "Custom dashboards",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Team",
    description: "For large teams with advanced requirements",
    price: "$99",
    period: "/month",
    features: [
      "Up to 10M logs/month",
      "90-day log retention",
      "Advanced security & compliance",
      "Priority support",
      "Team management",
      "Custom integrations",
      "Advanced analytics",
      "Role-based access control",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: "Custom",
    period: "pricing",
    features: [
      "Unlimited logs",
      "Custom retention periods",
      "Enterprise security & compliance",
      "24/7 dedicated support",
      "On-premise deployment",
      "Custom integrations",
      "SLA guarantees",
      "Training & onboarding",
      "Multi-region deployment",
      "Dedicated customer success manager",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

const allPlanFeatures = [
  { icon: Shield, label: "SOC 2 Compliance", color: "text-green-500" },
  { icon: Globe, label: "Global CDN", color: "text-blue-500" },
  { icon: Clock, label: "99.9% Uptime SLA", color: "text-purple-500" },
];

export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Pricing
        </Badge>
        <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees or surprise charges.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[90rem] mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border-border/50 hover:shadow-lg transition-shadow ${
              plan.popular ? "border-primary/50 shadow-lg relative" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold mt-4">
                {plan.price}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  {plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.buttonVariant === "outline" ? "bg-transparent" : ""
                }`}
                variant={plan.buttonVariant}
                asChild
              >
                <Link href="/dashboard">{plan.buttonText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">All plans include:</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {allPlanFeatures.map((feature) => (
            <span key={feature.label} className="flex items-center space-x-2">
              <feature.icon className={`w-4 h-4 ${feature.color}`} />
              <span>{feature.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
