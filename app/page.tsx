"use client";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import CTASection from "@/components/home/cta-section";
import ErrorMessage from "@/components/common/error-message";
import SplitsList from "@/components/home/splits-list";
import { Authenticated, Unauthenticated } from "convex/react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-rose-50 to-pink-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-rose-900/20">
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
