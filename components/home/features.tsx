import {
  Calculator,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";


export default function Features() {
  return (
    <div className="grid gap-8 mb-16">
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Stop the money stress
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No more awkward conversations, confusing spreadsheets, or math
            mistakes. Just fair, transparent expense splitting that everyone can
            trust.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Perk 1 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 mb-6 size-16">
              <Calculator className="text-primary size-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Perfect calculations
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Automatic splitting that handles tips, taxes, and custom amounts.
              Never worry about math errors or unfair splits again.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Handles any split scenario</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Precise to the penny</span>
              </div>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-muted mb-6 size-16">
              <Zap className="text-foreground size-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Instant clarity
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              See who owes what at a glance. No more digging through receipts or
              spreadsheets. Everything is clear and transparent.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Optimized settlement plans</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Visualize your expenses easily</span>
              </div>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-muted mb-6 size-16">
              <Shield className="text-foreground size-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Built for groups
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Whether it's roommates, travel buddies, or project teams -
              designed for any group size with privacy and security first.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Sync across all devices</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                <span>Set your own privacy levels</span>
              </div>
            </div>
          </div>
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
