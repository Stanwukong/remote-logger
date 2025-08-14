import { Hero } from "@/components/landing/Hero"
import { SocialProof } from "@/components/landing/SocialProof"
import { Features } from "@/components/landing/Features"
import { Integrations } from "@/components/landing/Integrations"
// import { Pricing } from "@/components/landing/Pricing"
// import { FAQ } from "@/components/landing/FAQ"
import { Newsletter } from "@/components/landing/Newsletter"
import { Footer } from "@/components/landing/Footer"
import { Header } from "@/components/landing/Header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <Hero />
      <SocialProof />
      <Features />
      <Integrations />
      {/* <Pricing /> */}
      {/* <FAQ /> */}
      <Newsletter />
      <Footer />
    </div>
  )
}