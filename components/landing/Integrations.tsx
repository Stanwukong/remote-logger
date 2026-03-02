"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollReveal } from "@/hooks/useGsapAnimations";

const integrationData: Record<
  string,
  { items: { name: string; soon?: boolean }[] }
> = {
  frameworks: {
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Vue", soon: true },
      { name: "Angular", soon: true },
      { name: "Svelte", soon: true },
      { name: "Express" },
      { name: "NestJS", soon: true },
      { name: "Nuxt", soon: true },
    ],
  },
  languages: {
    items: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python", soon: true },
      { name: "Go", soon: true },
    ],
  },
  notifications: {
    items: [
      { name: "Slack" },
      { name: "Email" },
      { name: "Webhook" },
      { name: "Discord", soon: true },
      { name: "PagerDuty", soon: true },
      { name: "Teams", soon: true },
    ],
  },
  cloud: {
    items: [
      { name: "Vercel" },
      { name: "AWS" },
      { name: "Railway" },
      { name: "Render" },
      { name: "Fly.io" },
      { name: "Google Cloud", soon: true },
      { name: "Azure", soon: true },
      { name: "DigitalOcean", soon: true },
    ],
  },
};

function IntegrationTile({
  name,
  soon,
}: {
  name: string;
  soon?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center h-20 rounded-lg border border-border-subtle bg-bg-surface text-sm font-medium text-text-primary transition-all duration-200 hover:border-border-accent hover:-translate-y-0.5 relative ${
        soon ? "opacity-50" : ""
      }`}
    >
      {name}
      {soon && (
        <span className="absolute -top-2 -right-2 text-[9px] font-display font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-bg-elevated border border-border-accent text-text-muted">
          soon
        </span>
      )}
    </div>
  );
}

export function Integrations() {
  const containerRef = useScrollReveal();

  return (
    <section
      id="integrations"
      className="py-24 bg-bg-surface/50"
      ref={containerRef}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading
          eyebrow="INTEGRATIONS"
          headline="Works with your stack."
          sub="Drop the SDK in any JavaScript environment. No lock-in, no rewrites, no migration pain."
        />

        <div className="mt-12" data-reveal>
          <Tabs defaultValue="frameworks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto mb-10 bg-bg-elevated">
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>

            {Object.entries(integrationData).map(([key, data]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {data.items.map((item) => (
                    <IntegrationTile key={item.name} {...item} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
