import Link from "next/link";
import Image from "next/image";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "../ui/button";
import { LayoutDashboard, PlusCircle, Sparkles } from "lucide-react";

import Logo from "@/assets/noBgColor.png";

export default function Hero() {
  return (
    <div className="text-center mb-16">
      <Image
        src={Logo}
        alt="Their Share Logo"
        className="h-16 md:h-24 w-auto mx-auto mb-4"
      />
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
        Share moments, split costs, stay friends. The warmest way to handle
        group expenses with the people you care about.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Link href="/create-split" className="inline-block">
          <Button
            size="lg"
            className="gap-2 w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-8 py-3 shadow-lg"
          >
            <PlusCircle className="h-5 w-5" />
            Start Sharing
          </Button>
        </Link>
        <Unauthenticated>
          <Link href="/demo" className="inline-block">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full px-8 py-3 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300"
            >
              <Sparkles className="size-5" />
              See It in Action
            </Button>
          </Link>
        </Unauthenticated>
        <Authenticated>
          <Link href="/dashboard" className="inline-block">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full px-8 py-3 border-orange-200 text-orange-700 hover:bg-orange-500 dark:border-orange-800 dark:text-orange-50"
            >
              <LayoutDashboard className="size-5" />
              View Dashboard
            </Button>
          </Link>
        </Authenticated>
      </div>
    </div>
  );
}
