import { Features } from "@/components/landing/Features";
import { CTA, Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Hospitals } from "@/components/landing/Hospitals";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Partners } from "@/components/landing/Partners";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Hospitals />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
