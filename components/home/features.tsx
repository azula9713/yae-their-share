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
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Stop the money stress
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            No more awkward conversations, confusing spreadsheets, or math
            mistakes. Just fair, transparent expense splitting that everyone can
            trust.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Perk 1 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <Calculator className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Perfect calculations
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Automatic splitting that handles tips, taxes, and custom amounts.
              Never worry about math errors or unfair splits again.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Handles any split scenario</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Precise to the penny</span>
              </div>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 mb-6">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Instant clarity
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              See who owes what at a glance. No more digging through receipts or
              spreadsheets. Everything is clear and transparent.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Optimized settlement plans</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Visualize your expenses easily</span>
              </div>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-6">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Built for groups
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Whether it's roommates, travel buddies, or project teams -
              designed for any group size with privacy and security first.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Sync across all devices</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="size-4 text-emerald-500" />
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
