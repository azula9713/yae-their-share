import { Authenticated, Unauthenticated } from "convex/react";
import { LayoutDashboard, PlusCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/noBgColor.png";

import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="mb-16 max-w-2xl mx-auto text-center">
      <div className="inline-flex items-center justify-center mb-6">
        <Image src={Logo} alt="Split Expenses Logo" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Split expenses{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          effortlessly
        </span>
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
        Track shared expenses, calculate who owes what, and settle up with
        clarity and confidence.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/create-split">
          <Button
            size="lg"
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Start Splitting
          </Button>
        </Link>
        <Unauthenticated>
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-6 border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              See It in Action
            </Button>
          </Link>
        </Unauthenticated>
        <Authenticated>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-6 border-emerald-200 text-emerald-600 hover:bg-emerald-500 dark:border-emerald-800 dark:text-emerald-50"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          </Link>
        </Authenticated>
      </div>
    </div>
  );
}
