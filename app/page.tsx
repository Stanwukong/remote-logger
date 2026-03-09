import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Features } from "@/components/landing/Features";
import { StatsBar } from "@/components/landing/StatsBar";
import { Integrations } from "@/components/landing/Integrations";
import { Pricing } from "@/components/landing/Pricing";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { Footer } from "@/components/landing/Footer";
import { HeroCanvas } from "@/components/landing/HeroCanvas";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-base) 50%, var(--bg-void) 100%)",
      }}
    >
      {/* Observatory background — full page */}
      <div className="fixed inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <ProblemSection />
        <Features />
        <StatsBar />
        <Integrations />
        <Pricing />
        <ClosingCTA />
        <Footer />
      </div>
    </div>
  );
}
