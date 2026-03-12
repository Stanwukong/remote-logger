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
    metric: "25,000 logs/month",
    features: [
      "2 projects",
      "7-day retention",
      "3 alert rules",
      "1 custom dashboard",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    popular: false,
    recommended: false,
  },
  {
    name: "Starter",
    subtitle: "For side projects",
    monthly: 9,
    annual: 7,
    metric: "250,000 logs/month",
    features: [
      "5 projects",
      "3 team members",
      "14-day retention",
      "15 alert rules",
      "Basic AI Insights",
      "Email support (48h)",
    ],
    cta: "Start Trial",
    ctaVariant: "outline" as const,
    popular: false,
    recommended: false,
  },
  {
    name: "Professional",
    subtitle: "For serious projects",
    monthly: 29,
    annual: 23,
    metric: "2M logs/month",
    features: [
      "15 projects",
      "10 team members",
      "30-day retention",
      "Unlimited alerts",
      "Full AI Insights",
      "Anomaly detection",
      "Email support (24h)",
    ],
    cta: "Start Trial",
    ctaVariant: "signal" as const,
    popular: false,
    recommended: true,
  },
  {
    name: "Team",
    subtitle: "For growing teams",
    monthly: 79,
    annual: 63,
    metric: "15M logs/month",
    features: [
      "Unlimited projects",
      "25 team members",
      "90-day retention",
      "Unlimited everything",
      "30-day audit log",
      "Enforced MFA",
      "Priority support (4h)",
    ],
    cta: "Start Trial",
    ctaVariant: "outline" as const,
    popular: true,
    recommended: false,
  },
  {
    name: "Enterprise",
    subtitle: "For organizations",
    monthly: -1,
    annual: -1,
    metric: "Unlimited logs",
    features: [
      "Everything in Team",
      "365-day retention",
      "365-day audit log",
      "SSO + enforced MFA",
      "Custom AI models",
      "Dedicated CSM",
      "Custom SLAs",
    ],
    cta: "Contact Sales",
    ctaVariant: "ghost" as const,
    popular: false,
    recommended: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const containerRef = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-bg-base" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionHeading
          eyebrow="PRICING"
          headline="Start free. Scale when you're ready."
          sub="No surprise bills. No per-seat traps. Transparent pricing at every tier."
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
                annual ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm ${annual ? "text-text-primary" : "text-text-muted"}`}
          >
            Annual{" "}
            <span className="text-signal text-xs font-semibold">Save up to 20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5" data-reveal>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border bg-bg-surface p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 relative ${
                plan.recommended
                  ? "border-t-2 border-t-signal border-signal/30 shadow-[var(--glow-signal)]"
                  : plan.popular
                  ? "border-t-2 border-t-data-info border-data-info/30"
                  : "border-border-subtle"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-signal text-bg-void text-[10px] font-display font-bold uppercase tracking-wider whitespace-nowrap">
                    Recommended
                  </span>
                </div>
              )}

              {plan.popular && !plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-data-info text-white text-[10px] font-display font-bold uppercase tracking-wider whitespace-nowrap">
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
                    {annual && plan.monthly > 0 && (
                      <p className="text-xs text-signal mt-0.5">
                        Save ${plan.monthly - plan.annual}/mo
                      </p>
                    )}
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
