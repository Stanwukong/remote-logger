"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useScrollReveal } from "@/hooks/useGsapAnimations";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Developer",
    subtitle: "For solo builders",
    monthly: 0,
    annual: 0,
    metric: "10,000 logs/month",
    features: [
      "1 project",
      "7-day retention",
      "Basic alerting",
      "Email support",
      "Community access",
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    subtitle: "For serious projects",
    monthly: 29,
    annual: 23,
    metric: "1M logs/month",
    features: [
      "Unlimited projects",
      "30-day retention",
      "Advanced alerting",
      "Priority support",
      "Team collaboration",
      "API access",
      "Custom dashboards",
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Team",
    subtitle: "For growing teams",
    monthly: 99,
    annual: 79,
    metric: "10M logs/month",
    features: [
      "Everything in Professional",
      "90-day retention",
      "Role-based access",
      "Advanced analytics",
      "Custom integrations",
      "Slack & webhook alerts",
      "Team management",
      "Audit trail",
    ],
    cta: "Start Free Trial",
    ctaVariant: "signal" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    subtitle: "For organizations",
    monthly: -1,
    annual: -1,
    metric: "Unlimited logs",
    features: [
      "Everything in Team",
      "Custom retention",
      "On-premise option",
      "24/7 dedicated support",
      "SLA guarantees",
      "Training & onboarding",
      "Custom SLAs",
      "Dedicated CSM",
    ],
    cta: "Talk to us",
    ctaVariant: "ghost" as const,
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const containerRef = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-bg-base" ref={containerRef}>
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="PRICING"
          headline="Start free. Scale when you're ready."
          sub="No surprise bills. No per-seat traps. No enterprise sales calls for the team tier."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-10 mb-12" data-reveal>
          <span
            className={`text-sm ${!annual ? "text-text-primary" : "text-text-muted"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              annual ? "bg-signal" : "bg-bg-elevated"
            }`}
            aria-label="Toggle annual pricing"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-bg-void transition-transform duration-200 ${
                annual ? "-translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm ${annual ? "text-text-primary" : "text-text-muted"}`}
          >
            Annual{" "}
            <span className="text-signal text-xs font-semibold">-20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-reveal>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border bg-bg-surface p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 relative ${
                plan.popular
                  ? "border-t-2 border-t-signal border-signal/30 shadow-[var(--glow-signal)]"
                  : "border-border-subtle"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-signal text-bg-void text-[10px] font-display font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="font-display font-bold text-base text-text-primary">
                {plan.name}
              </h3>
              <p className="text-sm text-text-muted mt-1">{plan.subtitle}</p>

              <div className="mt-4 mb-2">
                {plan.monthly === -1 ? (
                  <span className="font-display font-extrabold text-4xl text-text-primary">
                    Custom
                  </span>
                ) : plan.monthly === 0 ? (
                  <div>
                    <span className="font-display font-extrabold text-4xl text-text-primary">
                      $0
                    </span>
                    <span className="text-sm text-text-muted ml-1">
                      forever
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-display font-extrabold text-4xl text-text-primary">
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-sm text-text-muted ml-1">/mo</span>
                  </div>
                )}
              </div>

              <p className="text-sm font-semibold text-text-secondary mb-4">
                {plan.metric}
              </p>

              <div className="border-t border-border-faint pt-4 mb-6 flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.ctaVariant}
                className="w-full"
                asChild
              >
                <Link href={plan.monthly === -1 ? "/contact" : "/signup"}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
