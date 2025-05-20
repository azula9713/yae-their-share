"use client";

import ErrorMessage from "@/components/common/error-message";
import SplitsList from "@/components/home/splits-list";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Features from "@/components/home/features";

export default function HomePage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <ErrorMessage />
      <Hero />
      <SplitsList />
      <div className="grid gap-6 mt-8">
        <HowItWorks />
        <Features />
      </div>
    </div>
  );
}
