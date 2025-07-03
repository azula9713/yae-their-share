"use client";
import { Authenticated, Unauthenticated } from "convex/react";

import ErrorMessage from "@/components/common/error-message";
import CTASection from "@/components/home/cta-section";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import SplitsList from "@/components/home/splits-list";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage />
        <Hero />
        <Authenticated>
          <SplitsList />
        </Authenticated>
        <Features />
        <HowItWorks />
        <Unauthenticated>
          <CTASection />
        </Unauthenticated>
      </div>
    </div>
  );
}
