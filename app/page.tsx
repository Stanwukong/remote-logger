import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { HeroCanvas } from "@/components/landing/HeroCanvas";
import { WaitlistPage } from "@/components/waitlist/WaitlistPage";

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
        <WaitlistPage />
        <Footer />
      </div>
    </div>
  );
}
