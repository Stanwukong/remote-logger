import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Features } from "@/components/landing/Features";
import { StatsBar } from "@/components/landing/StatsBar";
import { Integrations } from "@/components/landing/Integrations";
import { Pricing } from "@/components/landing/Pricing";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
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
  );
}
