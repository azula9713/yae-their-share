import { Calculator, Users, Zap } from "lucide-react";

import Feature from "./feature";

export default function Features() {
  return (
    <div className="grid gap-8 mb-16">
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Stop the money stress</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No more awkward conversations, confusing spreadsheets, or math
            mistakes. Just fair, transparent expense splitting that everyone can
            trust.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Perk 1 */}
          <Feature
            icon={<Calculator className="text-foreground size-8" />}
            title="Perfect calculations"
            description="Automatic splitting that handles tips, taxes, and custom amounts. Never worry about math errors or unfair splits again."
            features={["Handles any split scenario", "Precise to the penny"]}
          />

          {/* Perk 2 */}
          <Feature
            icon={<Zap className="text-foreground size-8" />}
            title="Instant clarity"
            description="See who owes what at a glance. No more digging through receipts or spreadsheets. Everything is clear and transparent."
            features={[
              "Optimized settlement plans",
              "Visualize your expenses easily",
            ]}
          />

          {/* Perk 3 */}
          <Feature
            icon={<Users className="text-foreground size-8" />}
            title="Built for groups"
            description="Whether it's roommates, travel buddies, or project teams - designed for any group size with privacy and security first."
            features={[
              "Sync across all devices",
              "Set your own privacy levels",
            ]}
          />
        </div>

        {/* Social Proof */}
        {/* <div className="text-center mt-16">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Trusted by{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              10,000+ people
            </span>{" "}
            worldwide
          </p>
        </div> */}
      </div>
    </div>
  );
}
