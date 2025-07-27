import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { SDKSection } from "@/components/landing/SDKSection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <Hero />
      <Features />
      <SDKSection />
      <Footer />
    </div>
  )
}